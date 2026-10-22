"""Check referenced WordPress assets, preserving a resumable local audit.
Run with --download to retain the available original files as well.
"""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import sys
import urllib.error
import urllib.parse
import urllib.request

directory = Path(sys.argv[1])
download = '--download' in sys.argv
urls = json.loads((directory / 'media-urls.json').read_text())
report_file = directory / 'media-audit.json'
old = {x['source_url']: x for x in json.loads(report_file.read_text())} if report_file.exists() else {}

def check(source):
    prior = old.get(source)
    if prior and prior.get('status') == 200 and (not download or prior.get('sha256')):
        return prior
    parts = urllib.parse.urlsplit(source)
    path = urllib.parse.unquote(parts.path)
    if not path.startswith('/wp-content/uploads/') or '..' in Path(path).parts:
        return {'source_url': source, 'error': 'Unsafe asset path'}
    url = urllib.parse.urlunsplit(('https', 'www.campaniadih.it', urllib.parse.quote(path, safe='/@-._~'), '', ''))
    result = {'source_url': source, 'url': url, 'path': path.lstrip('/')}
    try:
        request = urllib.request.Request(url, method='GET' if download else 'HEAD', headers={'User-Agent': 'CampaniaDIH-Migration/1.0'})
        with urllib.request.urlopen(request, timeout=30) as response:
            result.update(status=response.status, content_type=response.headers.get_content_type(), bytes=int(response.headers.get('Content-Length', 0)))
            if download:
                data = response.read(52_428_801)
                if len(data) > 52_428_800:
                    result['error'] = 'File exceeds 50MB upload limit'; return result
                if response.headers.get_content_type() == 'text/html':
                    result['error'] = 'Unexpected HTML instead of asset'; return result
                target = directory / 'media' / path.lstrip('/')
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(data)
                result.update(bytes=len(data), sha256=hashlib.sha256(data).hexdigest())
    except urllib.error.HTTPError as error:
        result.update(status=error.code, error=str(error))
    except Exception as error:
        result['error'] = str(error)
    return result

results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for result in pool.map(check, urls):
        results.append(result)
        if len(results) % 50 == 0:
            report_file.write_text(json.dumps(results, ensure_ascii=False, indent=2))
            print(f'{len(results)}/{len(urls)} checked', flush=True)
report_file.write_text(json.dumps(results, ensure_ascii=False, indent=2))
good = [r for r in results if r.get('status') == 200 and not r.get('error')]
print(json.dumps({'available': len(good), 'failed': len(results)-len(good), 'bytes': sum(r.get('bytes',0) for r in good), 'downloaded': sum('sha256' in r for r in results)}, indent=2))
