import {describe,it,expect} from 'vitest'
import {createHash} from 'node:crypto'
import {createHandler,validateLead} from '../server/infosfera.mjs'
const token='a'.repeat(64)
const hash=createHash('sha256').update(token).digest('hex')
const newToken='b'.repeat(64)
const newHash=createHash('sha256').update(newToken).digest('hex')
const days=n=>n*24*3600*1000
const good={name:'  Maria Rossi  ',email:'MARIA@example.com',privacy:true,website:''}
function fixture({session=false,expired=false,dbFail=false,limited=false,parts=[],missing=false}={}) {
  const writes=[];let signed=0;let clock=1000
  const sessions=session?[{token_hash:hash,issue_id:'12',expires_at:new Date(expired?0:clock+days(30)).toISOString()}]:[]
  const client={
    from(table){
      const filters=[]
      const result=()=>dbFail?{error:{message:'secret backend detail'}}:{data:(table==='infosfera_issues'?(missing?[]:['12','9'].map(id=>({id,active:true,storage_path:`${id}/test.pdf`,extra_paths:parts,page_count:100,sha256:'hash',byte_size:10}))):sessions).filter(row=>filters.every(test=>test(row)))}
      const q={select(){return q},eq(k,v){filters.push(row=>row[k]===v);return q},in(k,values){filters.push(row=>values.includes(row[k]));return q},gt(k,v){filters.push(row=>row[k]>v);return q},
        async maybeSingle(){const value=result();return value.error?value:{data:value.data[0]||null}},
        then(resolve,reject){return Promise.resolve(result()).then(resolve,reject)},
        async upsert(row){writes.push({table,row});return {}},async insert(row){writes.push({table,row});if(table==='infosfera_sessions')sessions.push(row);return {}}};return q
    },
    async rpc(){return {data:!limited}},storage:{from(){return {async createSignedUrl(path){signed++;return {data:{signedUrl:'https://storage.example/'+path+'?token=test'}}}}}}
  }
  const handler=createHandler({client,random:()=>newToken,rateSecret:'unit-test-secret',now:()=>clock})
  const run=async(patch={})=>{
    const res={code:200,headers:{},status(n){this.code=n;return this},setHeader(k,v){this.headers[k]=v},json(body){this.body=body;return this},redirect(code,url){this.code=code;this.location=url;return this}}
    const req={method:'GET',query:{issue:'12'},headers:{host:'website.example'},...patch}
    await handler(req,res);return res
  }
  return {run,writes,advance(ms){clock+=ms},get signed(){return signed}}
}
describe('Infosfera gate',()=>{
  it('normalizes a real request and rejects invalid or bot submissions',()=>{
    expect(validateLead(good)).toEqual({first_name:'Maria Rossi',email:'maria@example.com',privacy_consent:true})
    for(const value of [null,[],{}, {...good,name:''},{...good,name:'a'.repeat(101)},{...good,email:'not-an-email'},{...good,privacy:false},{...good,website:'bot.example'},{...good,name:'<script>'}]) expect(validateLead(value)).toBeNull()
  })
  it('does not sign or expose a full PDF before the form',async()=>{const f=fixture();expect((await f.run()).code).toBe(401);expect(f.signed).toBe(0)})
  it('rejects forged cookies and legacy cookies with a mismatched issue',async()=>{
    const f=fixture({session:true})
    expect((await f.run({headers:{cookie:'infosfera_access='+ 'c'.repeat(64)}})).code).toBe(401)
    expect((await f.run({headers:{cookie:'infosfera_9='+token}})).code).toBe(401)
  })
  it('saves the lead and returns an HttpOnly session and signed access',async()=>{
    const f=fixture();const r=await f.run({method:'POST',headers:{host:'website.example','content-type':'application/json',origin:'https://website.example'},body:good})
    expect(r.code).toBe(200);expect(f.writes.map(w=>w.table)).toEqual(['infosfera_leads','infosfera_sessions'])
    expect(f.writes[1].row.token_hash).toBe(newHash);expect(r.headers['Set-Cookie']).toContain('HttpOnly; Secure; SameSite=Lax');expect(r.headers['Cache-Control']).toContain('no-store')
    expect(r.headers['Set-Cookie']).toContain('infosfera_access=');expect(r.headers['Set-Cookie']).toContain('Max-Age=15552000')
    expect(f.writes[1].row.expires_at).toBe(new Date(1000+days(180)).toISOString())
    expect(r.headers['Set-Cookie']).not.toContain('MARIA');expect(r.headers['Set-Cookie']).not.toContain('example.com')
  })
  it('reuses a valid session without creating duplicate leads',async()=>{
    const f=fixture({session:true});expect((await f.run({headers:{cookie:'infosfera_access='+token}})).code).toBe(200);expect(f.writes).toHaveLength(0)
  })
  it('recognizes the same browser across issues and does not renew the 180-day expiry',async()=>{
    const f=fixture();const first=await f.run({method:'POST',headers:{'content-type':'application/json'},body:good})
    const cookie=first.headers['Set-Cookie'].split(';')[0]
    f.advance(days(90))
    const later=await f.run({query:{issue:'9'},headers:{cookie}})
    expect(later.code).toBe(200);expect(later.headers['Set-Cookie']).toBeUndefined();expect(f.writes).toHaveLength(2)
    f.advance(days(90))
    expect((await f.run({query:{issue:'9'},headers:{cookie}})).code).toBe(401)
  })
  it('asks for the form again if the cookie is removed or the stored session has expired',async()=>{
    const f=fixture({session:true,expired:true})
    expect((await f.run()).code).toBe(401)
    expect((await f.run({headers:{cookie:'infosfera_access='+token}})).code).toBe(401)
    expect(f.signed).toBe(0)
  })
  it('upgrades an existing reader from another issue without requesting or duplicating their email',async()=>{
    const f=fixture({session:true})
    const r=await f.run({query:{issue:'9'},headers:{cookie:'infosfera_12='+token}})
    expect(r.code).toBe(200);expect(f.writes).toHaveLength(1)
    expect(f.writes[0]).toMatchObject({table:'infosfera_sessions',row:{issue_id:'12',token_hash:newHash}})
    expect(r.headers['Set-Cookie'][0]).toContain('infosfera_access='+newToken)
    expect(r.headers['Set-Cookie'][1]).toContain('infosfera_12=; Max-Age=0')
    expect((await f.run({headers:{cookie:'infosfera_access='+newToken}})).code).toBe(200)
    expect(f.writes).toHaveLength(1)
  })
  it('does not upgrade expired legacy cookies',async()=>{
    const f=fixture({session:true,expired:true})
    expect((await f.run({headers:{cookie:'infosfera_12='+token}})).code).toBe(401)
    expect(f.writes).toHaveLength(0)
  })
  it('requires access for the direct download endpoint',async()=>{const f=fixture();expect((await f.run({query:{issue:'12',mode:'download'}})).code).toBe(401);expect(f.signed).toBe(0)})
  it('redirects an authorized direct download to temporary private storage',async()=>{
    const f=fixture({session:true});const r=await f.run({query:{issue:'9',mode:'download'},headers:{cookie:'infosfera_access='+token}});expect(r.code).toBe(302);expect(r.location).toContain('?token=')
  })
  it('returns all ordered parts only after authorization',async()=>{
    const f=fixture({session:true,parts:['12/part2.bin']});const r=await f.run({headers:{cookie:'infosfera_access='+token}});expect(r.body.parts).toHaveLength(2)
  })
  it('rate limits before writing any lead',async()=>{
    const f=fixture({limited:true});const r=await f.run({method:'POST',headers:{'content-type':'application/json'},body:good});expect(r.code).toBe(429);expect(f.writes).toHaveLength(0)
  })
  it('rejects cross-origin, wrong content type, oversized bodies and unsupported methods',async()=>{
    const f=fixture()
    for(const [request,status] of [[{method:'DELETE'},405],[{query:{issue:'../12'}},400],[{query:{issue:'12',mode:'bad'}},400],[{method:'POST',headers:{'content-type':'text/plain'}},415],[{method:'POST',headers:{'content-type':'application/json','sec-fetch-site':'cross-site'}},403],[{method:'POST',headers:{'content-type':'application/json',origin:'https://evil.example',host:'website.example'}},403],[{method:'POST',headers:{'content-type':'application/json'},body:{name:'a'.repeat(5000)}},413]]) expect((await f.run(request)).code).toBe(status)
    expect(f.signed).toBe(0);expect(f.writes).toHaveLength(0)
  })
  it('fails closed and never exposes database details',async()=>{const r=await fixture({dbFail:true}).run();expect(r.code).toBe(503);expect(JSON.stringify(r.body)).not.toContain('secret')})
  it('returns 404 for an inactive or missing issue',async()=>{expect((await fixture({missing:true}).run()).code).toBe(404)})
})
