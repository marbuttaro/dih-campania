// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ArticleForm } from '../src/cms/ArticleForm'
import { saveArticle, type Article } from '../src/lib/articles'
vi.mock('../src/lib/articles', async importOriginal => ({ ...await importOriginal<typeof import('../src/lib/articles')>(), saveArticle: vi.fn() }))
afterEach(() => { cleanup(); vi.clearAllMocks() })
const originalHtml = '<figure class="wp-block-gallery"><img src="https://example.org/image.jpg"><figcaption>Didascalia</figcaption></figure><table><tr><td>Dato</td></tr></table><iframe src="https://www.youtube.com/embed/abc"></iframe>'
const article: Article = { id: 'article-1', wp_id: 42, slug: 'storico', title: 'Articolo storico', excerpt: '<p>Introduzione</p>', content_html: originalHtml, featured_image: '', featured_image_alt: '', author_name: 'Campania DIH', category_slugs: ['news'], tags: [], status: 'published', published_at: '2021-07-10T08:20:31Z', created_at: '2021-07-10T08:20:31Z', updated_at: '2026-10-01T10:00:00Z', deleted_at: null, original_url: 'https://www.campaniadih.it/2021/07/10/storico/', is_featured: false, event_at: null, event_location: '', seo_description: '' }
describe('Editor workflow', () => {
  it('opens the visual editor for a new article', async () => {
    render(<ArticleForm article={null} categories={[]} onClose={vi.fn()} onSaved={vi.fn()} />)
    expect(await screen.findByLabelText('Testo dell’articolo')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Video YouTube/Vimeo' })).toBeTruthy()
  })
  it('preserves imported rich HTML and exact time when changing the title', async () => {
    vi.mocked(saveArticle).mockResolvedValue({ ...article, title: 'Titolo aggiornato' })
    const saved = vi.fn()
    render(<ArticleForm article={article} categories={[{ slug:'news',name:'News',wp_id:1,parent_slug:null }]} onClose={vi.fn()} onSaved={saved} />)
    fireEvent.change(screen.getByLabelText('Titolo'), { target: { value: 'Titolo aggiornato' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salva articolo' }))
    await waitFor(() => expect(saved).toHaveBeenCalledOnce())
    expect(saveArticle).toHaveBeenCalledWith(expect.objectContaining({ title: 'Titolo aggiornato', content_html: originalHtml, published_at: article.published_at, original_url: article.original_url }), article.id, article.updated_at)
    expect(vi.mocked(saveArticle).mock.calls[0][0]).not.toHaveProperty('id')
    expect(vi.mocked(saveArticle).mock.calls[0][0]).not.toHaveProperty('updated_at')
  })
  it('saves a backdated second-accurate date in Rome as UTC', async () => {
    vi.mocked(saveArticle).mockResolvedValue(article)
    render(<ArticleForm article={article} categories={[]} onClose={vi.fn()} onSaved={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Data e ora esatte'), { target: { value: '2017-12-10T10:20:31' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salva articolo' }))
    await waitFor(() => expect(saveArticle).toHaveBeenCalledOnce())
    expect(vi.mocked(saveArticle).mock.calls[0][0].published_at).toBe('2017-12-10T09:20:31Z')
  })
  it('retains the form on a concurrent edit error', async () => {
    vi.mocked(saveArticle).mockRejectedValue(new Error('Modificato da un’altra sessione'))
    const saved = vi.fn()
    render(<ArticleForm article={article} categories={[]} onClose={vi.fn()} onSaved={saved} />)
    fireEvent.click(screen.getByRole('button', { name: 'Salva articolo' }))
    await screen.findByRole('alert')
    expect(screen.getByRole('alert').textContent).toContain('un’altra sessione')
    expect(saved).not.toHaveBeenCalled()
    expect((screen.getByLabelText('Contenuto HTML') as HTMLTextAreaElement).value).toBe(originalHtml)
  })
})
