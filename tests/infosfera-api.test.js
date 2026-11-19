import {describe,it,expect} from 'vitest'
import {createHash} from 'node:crypto'
import {createHandler,validateLead} from '../server/infosfera.mjs'
const token='a'.repeat(64)
const hash=createHash('sha256').update(token).digest('hex')
const good={name:'  Maria Rossi  ',email:'MARIA@example.com',privacy:true,website:''}
function fixture({session=false,dbFail=false,limited=false,parts=[],missing=false}={}) {
  const writes=[];let signed=0
  const client={
    from(table){
      const filters={};const q={select(){return q},eq(k,v){filters[k]=v;return q},gt(){return q},
        async maybeSingle(){if(dbFail)return {error:{message:'secret backend detail'}};return {data:table==='infosfera_issues'?(missing?null:{id:'12',storage_path:'12/test.pdf',extra_paths:parts,page_count:100,sha256:'hash',byte_size:10}):session&&filters.token_hash===hash&&filters.issue_id==='12'?{token_hash:hash}:null}},
        async upsert(row){writes.push({table,row});return {}},async insert(row){writes.push({table,row});return {}}};return q
    },
    async rpc(){return {data:!limited}},storage:{from(){return {async createSignedUrl(path){signed++;return {data:{signedUrl:'https://storage.example/'+path+'?token=test'}}}}}}
  }
  const handler=createHandler({client,random:()=>token,rateSecret:'unit-test-secret',now:()=>1000})
  const run=async(patch={})=>{
    const res={code:200,headers:{},status(n){this.code=n;return this},setHeader(k,v){this.headers[k]=v},json(body){this.body=body;return this},redirect(code,url){this.code=code;this.location=url;return this}}
    const req={method:'GET',query:{issue:'12'},headers:{host:'website.example'},...patch}
    await handler(req,res);return res
  }
  return {run,writes,get signed(){return signed}}
}
describe('Infosfera gate',()=>{
  it('normalizes a real request and rejects invalid or bot submissions',()=>{
    expect(validateLead(good)).toEqual({first_name:'Maria Rossi',email:'maria@example.com',privacy_consent:true})
    for(const value of [null,[],{}, {...good,name:''},{...good,name:'a'.repeat(101)},{...good,email:'not-an-email'},{...good,privacy:false},{...good,website:'bot.example'},{...good,name:'<script>'}]) expect(validateLead(value)).toBeNull()
  })
  it('does not sign or expose a full PDF before the form',async()=>{const f=fixture();expect((await f.run()).code).toBe(401);expect(f.signed).toBe(0)})
  it('rejects forged cookies and cookies for other issues',async()=>{
    const f=fixture({session:true})
    expect((await f.run({headers:{cookie:'infosfera_12='+ 'b'.repeat(64)}})).code).toBe(401)
    expect((await f.run({headers:{cookie:'infosfera_9='+token}})).code).toBe(401)
  })
  it('saves the lead and returns an HttpOnly session and signed access',async()=>{
    const f=fixture();const r=await f.run({method:'POST',headers:{host:'website.example','content-type':'application/json',origin:'https://website.example'},body:good})
    expect(r.code).toBe(200);expect(f.writes.map(w=>w.table)).toEqual(['infosfera_leads','infosfera_sessions'])
    expect(f.writes[1].row.token_hash).toBe(hash);expect(r.headers['Set-Cookie']).toContain('HttpOnly; Secure; SameSite=Lax');expect(r.headers['Cache-Control']).toContain('no-store')
  })
  it('reuses a valid session without creating duplicate leads',async()=>{
    const f=fixture({session:true});expect((await f.run({headers:{cookie:'infosfera_12='+token}})).code).toBe(200);expect(f.writes).toHaveLength(0)
  })
  it('requires access for the direct download endpoint',async()=>{const f=fixture();expect((await f.run({query:{issue:'12',mode:'download'}})).code).toBe(401);expect(f.signed).toBe(0)})
  it('redirects an authorized direct download to temporary private storage',async()=>{
    const f=fixture({session:true});const r=await f.run({query:{issue:'12',mode:'download'},headers:{cookie:'infosfera_12='+token}});expect(r.code).toBe(302);expect(r.location).toContain('?token=')
  })
  it('returns all ordered parts only after authorization',async()=>{
    const f=fixture({session:true,parts:['12/part2.bin']});const r=await f.run({headers:{cookie:'infosfera_12='+token}});expect(r.body.parts).toHaveLength(2)
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
