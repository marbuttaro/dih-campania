import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { ArrowUpRight } from 'lucide-react'
import { NEWS, newsUrl, type NewsArticle } from './newsData'

// Archive years shown under "Altre News" (not linked yet)
const ARCHIVE_YEARS = ['2026', '2025', '2024']

// Typography for the article body: headings, paragraphs, links and lists
const articleText =
  'text-base sm:text-[17px] leading-[1.6] text-[#1B2B3F] space-y-6 ' +
  '[&_section]:space-y-0.5 [&_h2]:text-lg sm:[&_h2]:text-[19px] [&_h2]:font-semibold [&_h2]:text-[#1B3550] ' +
  '[&_strong]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-1 hover:[&_a]:text-brand-navy ' +
  '[&_ul.links]:space-y-0.5 [&_ul.bullets]:list-disc [&_ul.bullets]:pl-6 [&_ul.bullets]:my-2 [&_ul.bullets]:space-y-1 ' +
  '[&_ol.steps]:list-decimal [&_ol.steps]:pl-6 [&_ol.steps]:my-2 [&_ol.steps]:space-y-1'

function ArticleTitle({ article }: { article: NewsArticle }) {
  const { title, titleHighlight, breakBeforeHighlight } = article
  const at = titleHighlight ? title.indexOf(titleHighlight) : -1
  if (!titleHighlight || at < 0) return <>{title}</>
  return (
    <>
      {title.slice(0, at)}
      {breakBeforeHighlight && <br className="hidden sm:block" />}
      <strong className="font-semibold">{titleHighlight}</strong>
      {title.slice(at + titleHighlight.length)}
    </>
  )
}

export function NewsPage({ slug }: { slug: string }) {
  const article = NEWS.find((item) => item.slug === slug) ?? NEWS[0]
  const others = NEWS.filter((item) => item.slug !== article.slug)

  return (
    <>
      <Navbar />

      <main
        className="flex-grow pt-32 sm:pt-40 relative bg-cover bg-top bg-no-repeat bg-brand-surface"
        style={{ backgroundImage: "url('/assets/sfondo.svg')" }}
      >
        <div className="absolute inset-0 bg-white/20 pointer-events-none" />

        <div className="container-page relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-14 lg:gap-16 xl:gap-24 items-start pb-24 lg:pb-32">
            <article className="max-w-[810px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <header className="mb-10">
                <h1 className="text-[30px] sm:text-[40px] lg:text-[46px] font-light text-[#013167] leading-[1.15] tracking-tight">
                  <ArticleTitle article={article} />
                </h1>
                <p className="mt-4 text-[15px] sm:text-base text-[#1B3550]/80">{article.date}</p>
              </header>

              <div className={articleText}>{article.intro}</div>

              <img
                src={article.image}
                alt=""
                className="w-full aspect-[811/523] object-cover rounded-[20px] my-12"
              />

              <div className={articleText}>{article.body}</div>
            </article>

            <aside>
              <div className="rounded-[20px] bg-[#E3EAEC] shadow-neumorphic p-8 sm:p-10" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <h2 className="text-[24px] sm:text-[28px] font-normal text-[#013167] mb-6">Altre News</h2>
                <ul className="divide-y divide-white/80">
                  {others.map((item) => (
                    <li key={item.slug} className="py-6 first:pt-0 last:pb-0">
                      <a href={newsUrl(item.slug)} className="group block">
                        <span className="block text-[15px] sm:text-base font-medium text-[#013167] leading-snug group-hover:underline underline-offset-2">
                          {item.title}
                        </span>
                        <span className="block mt-3 text-xs text-[#013167]/80">{item.date}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 px-2 sm:px-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <ul>
                  {ARCHIVE_YEARS.map((year) => (
                    <li
                      key={year}
                      className="relative flex items-center gap-2 px-6 py-5 text-[26px] font-light text-[#013167] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-[#013167] after:to-[#8EBEF7]/40 first:before:absolute first:before:inset-x-0 first:before:top-0 first:before:h-px first:before:bg-gradient-to-r first:before:from-[#013167] first:before:to-[#8EBEF7]/40"
                    >
                      {year}
                      <ArrowUpRight className="size-5 self-start mt-1 text-[#8EBEF7]" strokeWidth={1.75} />
                    </li>
                  ))}
                </ul>
                <span className="inline-block mt-14 rounded-[8px] bg-[#E3EAEC] px-4 py-2.5 text-lg font-semibold text-[#001933] shadow-[-5px_-5px_12px_rgba(255,255,255,0.9),6px_6px_16px_rgba(164,177,188,0.6)]">
                  Visita l’archivio completo
                </span>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
