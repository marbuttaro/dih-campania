import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { NEWS } from '../src/pages/news/newsData'
const directory = process.argv[2]
if (!directory) throw new Error('Specify the private backup directory')
const rows = NEWS.map(item => ({ wp_id: null, slug: item.slug, title: item.title, excerpt: renderToStaticMarkup(<>{item.intro}</>), content_html: renderToStaticMarkup(<>{item.intro}{item.body}</>), featured_image: item.image, featured_image_alt: '', author_name: 'Campania DIH', category_slugs: ['bandi'], tags: [], status: 'published', published_at: '2026-10-19T10:00:00+02:00', deleted_at: null, original_url: null, is_featured: true, event_at: null, event_location: '', seo_description: '' }))
writeFileSync(join(directory, 'current-news.json'), JSON.stringify(rows, null, 2))
console.log(`Preserved ${rows.length} articles from the new website. Original pages specify day only; publication time normalized to 10:00 Europe/Rome.`)
