# RSU 01-11: arma data.json para Remotion (tomas, B-roll, tracking, subtítulos con posición, tiempos de palabras)
import json, numpy as np
FPS=30; DUR=37.143
W=json.load(open('al/final.json'))
w=[x['s'] for x in W]; e=[x['e'] for x in W]
# tomas a cámara: [proxy, srcIn(dentro del proxy), T a, T b, zoom keys, speaker]
TOMAS=[['h1263',0.0,0.0,7.82,[[0,1.85],[0.8,1.85],[1.0,2.1],[3.9,2.2],[5.75,2.4],[7.82,2.45]],True],
       ['c1260',0.0,30.60,DUR,[[30.6,1.9],[34.6,2.05],[34.72,2.3],[DUR,2.35]],True]]
# B-roll: [nombre, T a, T b, src desde, rate]
BROLL=[['1264',3.95,5.75,9.0,1],['1239',7.82,9.72,2.30,1],['1264',12.93,16.69,0.0,1],['1264',16.69,18.10,22.0,1],
       ['1264',18.10,19.24,7.2,1],['1264',19.24,22.33,14.5,1],['1264',22.33,24.18,28.0,1],['1264',25.75,27.60,18.4,1],
       ['1264',27.60,29.10,24.0,1],['1264',29.10,30.60,11.0,1]]
MOT={'mapa':[9.72,12.93],'placa':[24.18,25.75]}
TIT={'pills':[3.95,5.75],'precio':[5.57,6.95],'edificio':[w[30]-0.04,9.72],'trio':[w[53]-0.04,16.95],'lista':[16.95,22.33],
     'centro':[w[90]-0.04,27.33],'cta':[w[121]-0.04,DUR+0.1]}
HIDE=[TIT['pills'],TIT['precio'],TIT['edificio'],TIT['trio'],TIT['lista'],MOT['placa'],TIT['centro']]
# ---- tracking (4K src -> coords del elemento 1080: /2), suavizado, a 30 fps en tiempo del proxy ----
def track(fn,src0,dur):
    a=np.loadtxt(fn); t=a[:,0]-src0
    cols={'ex':a[:,5]/2,'ey':a[:,6]/2,'top':a[:,2]/2,'bot':a[:,3]/2}
    tt=np.arange(0,dur,1/FPS); out={'t0':0,'dt':1/FPS}
    for k,v in cols.items():
        v=np.convolve(np.pad(v,1,mode='edge'),np.ones(3)/3,'valid')
        out[k]=[round(float(x),1) for x in np.interp(tt,t,v)]
    return out
TR={'h1263':track('al/cara1263.txt',0.30,7.6),'c1260':track('al/cara1260.txt',0.12,6.6)}
def zoomAt(keys,t):
    for (a,sa),(b,sb) in zip(keys,keys[1:]):
        if a<=t<=b and b>a: return sa+(sb-sa)*(0.5-0.5*np.cos(np.pi*(t-a)/(b-a)))
    return keys[-1][1] if t>=keys[-1][0] else keys[0][1]
def chin_y(t):
    for name,si,a,b,keys,_ in TOMAS:
        if a<=t<b:
            tr=TR[name]; i=min(len(tr['ey'])-1,int((si+t-a)*FPS)); s=zoomAt(keys,t)
            return tr['ey'][i]+(tr['bot'][i]+12-tr['ey'][i])*s
    return None
# ---- subtítulos ----
PROP={'neuquén','capital','santa','maría','roca','carlos','h','whatsapp'}
NOBRK={'santa','carlos','un','una','el','la','de','en','a','y','que','lo','te','por','para'}
CONN={'y','a','en','de','que','un','una','el','la','lo','por','para','con'}
words=[]
i=0
while i<len(W):
    if W[i]['w'].lower()=='un' and i+1<len(W) and W[i+1]['w'].lower()=='millón':
        words.append(('$1.200.000.',w[i],e[i+4],True)); i+=5; continue
    words.append((W[i]['w'],w[i],e[i],False)); i+=1
groups=[];cur=[]
for k,(t,s,en,_) in enumerate(words):
    cur.append(words[k]); txt=' '.join(x[0] for x in cur)
    end_p=t[-1] in '.,'; nxt=words[k+1] if k+1<len(words) else None
    gap=(nxt[1]-en) if nxt else 9
    if (t.lower() in NOBRK and not end_p and len(cur)<5 and nxt is not None and gap<0.3): continue
    if end_p or len(cur)>=3 or len(txt)>16 or gap>0.3 or nxt is None or (nxt and nxt[0].lower() in CONN and len(cur)>=2):
        groups.append(cur); cur=[]
TB=[0,7.82,30.60]
subs=[]
for gi,g in enumerate(groups):
    s=g[0][1]-0.04; en=(groups[gi+1][0][1]-0.04) if gi+1<len(groups) else DUR
    en=min(en,g[-1][2]+0.6)
    for a,b in HIDE:
        if a<=s<b:
            s = b if en>b+0.15 else None
            if s is None: break
            continue
        if s<a<en: en=a
    if s is None or en-s<0.25: continue
    ts=np.arange(s,en,1/FPS)
    cy=[chin_y(t) for t in ts]
    cc=[c for c in cy if c is not None]
    if len(cc)>len(cy)/2: y=max(cc)+22; modo='cam'
    elif MOT['mapa'][0]<=s<MOT['mapa'][1]: y=1110; modo='mapa'
    else: y=915; modo='broll'
    y=min(y,1160)
    ws=[]
    for j,(t,_,_,anton) in enumerate(g):
        clean=t.strip('.,')
        low=clean if clean.lower() in PROP or anton else clean.lower()
        if clean=='H': low='H.'
        if clean.lower()=='whatsapp': low='WhatsApp'
        isA = anton or (j==0 and not (len(g)==1 and clean.lower() in CONN))
        ws.append([clean.upper() if isA else low, bool(isA), round(W and 0,2)])
    # tiempo de entrada palabra por palabra
    for j,x in enumerate(g): ws[j][2]=round(x[1]-0.04,3)
    subs.append({'start':round(s,3),'end':round(en,3),'y':int(y),'modo':modo,'words':ws})
data={'dur':DUR,'tomas':TOMAS,'broll':BROLL,'mot':MOT,'tit':TIT,'track':TR,'subs':subs,
      'w':{str(i):round(x,3) for i,x in enumerate(w)},'e':{str(i):round(x,3) for i,x in enumerate(e)}}
json.dump(data,open('data.json','w'))
for s in subs: print(f"{s['start']:6.2f}-{s['end']:6.2f} y{s['y']:5d} {s['modo']:5s} "+' '.join(x[0] for x in s['words']))
