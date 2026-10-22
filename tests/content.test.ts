// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { safeHtml } from '../src/lib/content'
import { resolveDateTime, toInstant, toLocalDateTime } from '../src/lib/dates'
describe('Article content and exact dates', () => {
  it('blocks active content while retaining editorial markup', () => {
    const html = safeHtml('<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">bad</a><table><tbody><tr><td>Dato</td></tr></tbody></table><figure class="wp-block-gallery"><img src="https://example.com/image.jpg"><figcaption>Foto</figcaption></figure><a href="https://example.com/file.pdf" target="_blank">PDF</a>')
    expect(html).not.toMatch(/<script|onerror|javascript:/)
    expect(html).toContain('<table>'); expect(html).toContain('wp-block-gallery'); expect(html).toContain('file.pdf'); expect(html).toContain('noopener noreferrer')
  })
  it('accepts trusted video embeds and rejects arbitrary frames', () => {
    const html = safeHtml('<iframe src="https://www.youtube.com/embed/abc"></iframe><iframe src="https://evil.test"></iframe><iframe src="https://www.youtube.com.evil.test"></iframe>')
    expect(html).toContain('youtube.com/embed/abc'); expect(html).not.toContain('evil.test'); expect(html).toContain('sandbox=')
  })
  it('preserves seconds and correctly converts winter and summer dates', () => {
    expect(toInstant('2017-12-10T10:20:31')).toBe('2017-12-10T09:20:31Z')
    expect(toInstant('2026-07-10T10:20:31')).toBe('2026-07-10T08:20:31Z')
    expect(toLocalDateTime('2026-07-10T08:20:31Z')).toBe('2026-07-10T10:20:31')
  })
  it('rejects nonexistent and ambiguous Italian clock times; UTC remains precise', () => {
    expect(() => toInstant('2026-03-29T02:30:00')).toThrow()
    expect(() => toInstant('2026-10-25T02:30:00')).toThrow()
    expect(toInstant('2026-10-25T01:30:12', 'UTC')).toBe('2026-10-25T01:30:12Z')
    expect(resolveDateTime('2026-10-25T02:30:12', '2026-10-25T01:30:12Z')).toBe('2026-10-25T01:30:12Z')
  })
})
