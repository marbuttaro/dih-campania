"""Build an auditable import from the official WXR and matching public REST export.
Usage: python3 scripts/prepare-wordpress.py /path/to/private/backup
Outputs stay outside the repository. Never changes WordPress.
"""
import collections
import hashlib
import html
import json
from pathlib import Path
import re
import sys
import uuid
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

NS = {'wp': 'http://wordpress.org/export/1.2/', 'content': 'http://purl.org/rss/1.0/modules/content/', 'excerpt': 'http://wordpress.org/export/1.2/excerpt/', 'dc': 'http://purl.org/dc/elements/1.1/'}
NAMESPACE = uuid.UUID('1f91f626-bae5-5e64-ad29-82747edeb807')

def text(node, name):
    return node.findtext(name, default='', namespaces=NS) or ''

def metadata(node):
    return {text(m, 'wp:meta_key'): text(m, 'wp:meta_value') for m in node.findall('wp:postmeta', NS)}

def timestamp(node, field='post_date'):
    value = text(node, f'wp:{field}_gmt')
    if value and not value.startswith('0000'):
        return value.replace(' ', 'T') + 'Z'
    local = text(node, f'wp:{field}')
    if not local or local.startswith('0000'):
        raise ValueError(f'Missing date for post {text(node, "wp:post_id")}')
    return datetime.fromisoformat(local).replace(tzinfo=ZoneInfo('Europe/Rome')).astimezone(timezone.utc).isoformat().replace('+00:00', 'Z')

def prepare(directory):
    directory = Path(directory)
    root = ET.parse(directory / 'wordpress.xml').getroot().find('channel')
    items = root.findall('item')
    rest = {p['id']: p for p in json.loads((directory / 'posts.json').read_text())}
    media = {int(text(x, 'wp:post_id')): x for x in items if text(x, 'wp:post_type') == 'attachment'}
    authors = {text(x, 'wp:author_login'): text(x, 'wp:author_display_name') for x in root.findall('wp:author', NS)}
    categories = [{'slug': text(x, 'wp:category_nicename'), 'name': text(x, 'wp:cat_name'), 'wp_id': int(text(x, 'wp:term_id')), 'parent_slug': text(x, 'wp:category_parent') or None} for x in root.findall('wp:category', NS)]
    articles, sources, missing_images, protected = [], [], [], []
    used_media = set()
    statuses = {'publish': 'published', 'draft': 'draft', 'private': 'private', 'future': 'published', 'pending': 'draft'}
    for x in items:
        if text(x, 'wp:post_type') != 'post':
            continue
        wp_id = int(text(x, 'wp:post_id'))
        status = text(x, 'wp:status')
        if status not in statuses:
            raise ValueError(f'Unhandled status {status}: {wp_id}')
        public = rest.get(wp_id)
        if status == 'publish' and not public:
            raise ValueError(f'Public post missing from REST: {wp_id}')
        meta = metadata(x)
        thumb_id = int(meta.get('_thumbnail_id') or 0)
        thumb = media.get(thumb_id)
        cover = text(thumb, 'wp:attachment_url') if thumb is not None else ''
        if thumb_id and thumb is None:
            missing_images.append({'wp_id': wp_id, 'missing_attachment_id': thumb_id, 'original_url': text(x, 'link')})
        if cover:
            used_media.add(cover)
        content = public['content']['rendered'] if public else text(x, 'content:encoded')
        excerpt = public['excerpt']['rendered'] if public else text(x, 'excerpt:encoded')
        for url in re.findall(r'https?://(?:www\.)?campaniadih\.it/wp-content/uploads/[^\s<>"\x27]+', content + excerpt):
            used_media.add(html.unescape(url).rstrip('),;'))
        article_id = str(uuid.uuid5(NAMESPACE, f'wordpress:{wp_id}'))
        is_protected = bool(text(x, 'wp:post_password'))
        if is_protected:
            protected.append(wp_id)
        article = {
            'id': article_id, 'wp_id': wp_id,
            'slug': text(x, 'wp:post_name') or f'bozza-wordpress-{wp_id}',
            'title': html.unescape(text(x, 'title')),
            'excerpt': excerpt, 'content_html': content,
            'featured_image': cover,
            'featured_image_alt': metadata(thumb).get('_wp_attachment_image_alt', '') if thumb is not None else '',
            'author_name': authors.get(text(x, 'dc:creator'), 'Campania DIH'),
            'category_slugs': sorted({c.attrib['nicename'] for c in x.findall('category') if c.attrib.get('domain') == 'category'}),
            'tags': sorted({c.text for c in x.findall('category') if c.attrib.get('domain') == 'post_tag' and c.text}),
            'status': 'private' if is_protected else statuses[status],
            'published_at': timestamp(x), 'created_at': timestamp(x), 'updated_at': timestamp(x, 'post_modified'),
            'deleted_at': None, 'original_url': text(x, 'link'),
            'is_featured': text(x, 'wp:is_sticky') == '1' or any(c.attrib.get('nicename') == 'in-evidenza' for c in x.findall('category')),
            'event_at': None, 'event_location': '',
            'seo_description': meta.get('_yoast_wpseo_metadesc', ''),
        }
        articles.append(article)
        sources.append({'article_id': article_id, 'source': {'wp_id': wp_id, 'raw_title': text(x, 'title'), 'raw_slug': text(x, 'wp:post_name'), 'raw_content': text(x, 'content:encoded'), 'raw_excerpt': text(x, 'excerpt:encoded'), 'metadata': meta, 'all_metadata': [{'key': text(m, 'wp:meta_key'), 'value': text(m, 'wp:meta_value')} for m in x.findall('wp:postmeta', NS)], 'local_date': text(x, 'wp:post_date'), 'gmt_date': text(x, 'wp:post_date_gmt'), 'status': status, 'protected': is_protected, 'content_sha256': hashlib.sha256(content.encode()).hexdigest()}})
    assert len(articles) == len({a['id'] for a in articles}) == len({a['slug'] for a in articles})
    assert {a['wp_id'] for a in articles if a['wp_id'] in rest} == set(rest)
    category_slugs = {c['slug'] for c in categories}
    assert all(set(a['category_slugs']) <= category_slugs for a in articles)
    report = {'articles': len(articles), 'public_rest': len(rest), 'states': dict(collections.Counter(a['status'] for a in articles)), 'categories': len(categories), 'attachments_in_wxr': len(media), 'referenced_media_urls': len(used_media), 'missing_original_featured_images': missing_images, 'password_protected_made_private': protected, 'source_xml_sha256': hashlib.sha256((directory / 'wordpress.xml').read_bytes()).hexdigest(), 'years_utc': dict(collections.Counter(a['published_at'][:4] for a in articles))}
    for filename, data in [('articles.json', articles), ('article-sources.json', sources), ('import-categories.json', categories), ('media-urls.json', sorted(used_media)), ('preparation-report.json', report)]:
        (directory / filename).write_text(json.dumps(data, ensure_ascii=False, indent=2))
    print(json.dumps({k: v for k, v in report.items() if k != 'missing_original_featured_images'}, ensure_ascii=False, indent=2))
    print('Pre-existing missing featured-image references:', len(missing_images))

if __name__ == '__main__':
    prepare(sys.argv[1])
