// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest'
import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react'
import FullIssueReader from '../src/pages/infosfera/FullIssueReader'
import {LATEST_ISSUE} from '../src/pages/infosfera/infosferaData'
vi.mock('pdfjs-dist',()=>({GlobalWorkerOptions:{},getDocument:()=>({destroy:vi.fn(),promise:Promise.resolve({numPages:100,getPage:async()=>({getViewport:({scale}:{scale:number})=>({width:600*scale,height:800*scale}),render:()=>({promise:Promise.resolve(),cancel:vi.fn()}),getTextContent:async()=>({items:[{str:'Contenuto della rivista'}]})})})})}))
afterEach(()=>{cleanup();vi.unstubAllGlobals()})
it('fits the PDF after the dialog portal mounts and responds to resizing and zoom',async()=>{
  let resize:(width:number)=>void=()=>{}
  vi.stubGlobal('ResizeObserver',class {
    constructor(private callback:ResizeObserverCallback){}
    observe(element:Element){resize=(width)=>this.callback([{target:element,contentRect:{width}} as ResizeObserverEntry],this as unknown as ResizeObserver);resize(350)}
    disconnect(){}
  })
  render(<FullIssueReader issue={LATEST_ISSUE} access={{url:'https://example.invalid/test.pdf',pages:100,bytes:100,sha256:'test',expiresAt:Date.now()+3600000}} onClose={vi.fn()} onExpired={vi.fn()}/> )
  const page=await screen.findByRole('img',{name:'Pagina 1 di 100'})
  await waitFor(()=>expect(page.style.width).toBe('326px'))
  await act(async()=>resize(800))
  await waitFor(()=>expect(page.style.width).toBe('776px'))
  fireEvent.click(screen.getByRole('button',{name:'Aumenta zoom'}))
  await waitFor(()=>expect(page.style.width).toBe('1164px'))
})
