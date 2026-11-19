import {describe,it,expect} from 'vitest'
import {readdirSync,existsSync,readFileSync} from 'node:fs'
import {LATEST_ISSUE,PAST_ISSUES} from '../src/pages/infosfera/infosferaData'
import manifest from '../src/pages/infosfera/infosferaManifest.json'
describe('Infosfera public archive integrity',()=>{
  it('has all 12 unique verified editions with complete editorial previews',()=>{
    const issues=[LATEST_ISSUE,...PAST_ISSUES]
    expect(issues).toHaveLength(12);expect(new Set(issues.map(i=>i.id)).size).toBe(12)
    for(const issue of issues){
      expect(issue.pageCount).toBeGreaterThan(issue.previewPages.length)
      expect(issue.previewPages.length).toBe(manifest[issue.id as keyof typeof manifest].preview)
      for(const image of [issue.cover,...issue.previewPages]) expect(existsSync('public'+image),image).toBe(true)
      const files=readdirSync(`public/assets/infosfera/numeri/${issue.id}/anteprima`).filter(f=>f.endsWith('.webp'))
      expect(files.length,issue.id).toBe(issue.previewPages.length)
    }
  })
  it('does not publish full PDFs or source links in frontend magazine data',()=>{
    expect(readdirSync('public/assets/infosfera',{recursive:true}).filter(f=>String(f).endsWith('.pdf'))).toEqual([])
    const source=readFileSync('src/pages/infosfera/infosferaData.ts','utf8')
    expect(source).not.toMatch(/edih-pride\.eu|drive\.google\.com|url:/)
  })
})
