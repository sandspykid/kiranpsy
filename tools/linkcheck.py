import re, os, sys, html
site = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
pages = sorted(f for f in os.listdir(site) if f.endswith('.html'))
ids = {}
for p in pages:
    s = open(os.path.join(site, p), encoding='utf-8').read()
    ids[p] = set(re.findall(r'\sid="([^"]+)"', s))
# ids injected by site.js (header/footer) don't matter for anchors; anchors used in site.js nav:
js = open(os.path.join(site, 'assets/site.js'), encoding='utf-8').read()
problems = []
def check(src, href):
    href = html.unescape(href)
    if href.startswith(('http', 'mailto:', 'tel:', 'data:', 'javascript:')) or href == '#' or href.startswith('#saathi-open') or "' +" in href:
        return
    if href.startswith('#'):
        if href[1:] not in ids[src]: problems.append((src, href, 'missing anchor on same page'))
        return
    path, _, frag = href.partition('#')
    if path.endswith('.css') or path.endswith('.js'): 
        if not os.path.exists(os.path.join(site, path)): problems.append((src, href, 'missing asset'))
        return
    if path not in ids: problems.append((src, href, 'missing page')); return
    if frag and frag not in ids[path]: problems.append((src, href, 'missing anchor'))
for p in pages:
    s = open(os.path.join(site, p), encoding='utf-8').read()
    for href in re.findall(r'href="([^"]+)"', s): check(p, href)
for href in re.findall(r'href="([^"\']+)"', js) + re.findall(r'"([a-z-]+\.html)"', js):
    check('site.js', href if href.endswith('.html') or href.startswith(('http','tel','mailto')) else href)
print('pages:', ', '.join(pages))
if problems:
    for pr in problems: print('BROKEN', pr)
    sys.exit(1)
else: print('all internal links and anchors resolve')
