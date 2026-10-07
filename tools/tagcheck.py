import sys, os
from html.parser import HTMLParser
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class P(HTMLParser):
    def __init__(s): super().__init__(); s.stack=[]; s.errs=[]
    def handle_starttag(s,t,a):
        if t not in VOID: s.stack.append((t,s.getpos()[0]))
    def handle_endtag(s,t):
        if t in VOID: return
        if s.stack and s.stack[-1][0]==t: s.stack.pop(); return
        # find in stack
        for i in range(len(s.stack)-1,-1,-1):
            if s.stack[i][0]==t:
                s.errs.append('line %d: </%s> closes but %s left open'%(s.getpos()[0],t,[x for x in s.stack[i+1:]])); del s.stack[i:]; return
        s.errs.append('line %d: stray </%s>'%(s.getpos()[0],t))
site=os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
files = sys.argv[1:] or sorted(x for x in os.listdir(site) if x.endswith('.html'))
bad = 0
for f in files:
    p=P(); p.feed(open(os.path.join(site,f),encoding='utf-8').read())
    ok = not p.errs and not p.stack
    bad += 0 if ok else 1
    print(f, 'OK' if ok else ('ERRORS: '+'; '.join(p.errs[:5])+(' unclosed: %s'%p.stack[:5] if p.stack else '')))
sys.exit(1 if bad else 0)
