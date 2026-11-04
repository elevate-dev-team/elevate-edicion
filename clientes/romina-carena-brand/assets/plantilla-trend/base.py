"""Base de imagen ROC 04-11 (trend máscara → WhatsApp → sale con la carpeta).
Cortes en la grilla de Retro Funky Groove (122,01 BPM, P=0,4918 s). Rampa con curva en el tramo 3.
Uso: python base.py <carpeta proyecto> <salida.mp4>"""
import sys, subprocess, numpy as np, cv2, json
D=sys.argv[1]; OUT=sys.argv[2]; FPS=30; W,H=1080,1920; P=0.4918
A=f"{D}/VIDEOS/IMG_6046.MOV"; B=f"{D}/VIDEOS/IMG_6058.MOV"
def fr(t): return int(round(t*FPS))
# (fuente, duración de salida en s, función u∈[0,1) -> segundo de fuente)
L3=93.4-84.5; D3=5*P; c=D3/L3
segs=[
 (A, 3*P, lambda u: 1.0+u*3*P*4),
 (A, 3*P, lambda u: 18.0+u*3*P*6),
 (A, D3,  lambda u: 84.5+L3*(c*u+(1-c)*(1-(1-u)**2))),
 (A, 11*P, lambda u: 93.4+u*11*P),
 (B, 5*P, lambda u: 5.0+u*5*P),
]
# frames de salida en bordes de beat
plan=[]; t0=0
for src,d,f in segs:
    a,b=fr(t0),fr(t0+d); n=b-a
    plan.append((src,[f(i/n) for i in range(n)],a)); t0+=d
total=fr(t0)
def frames(src,times):
    lo,hi=min(times),max(times)+0.1
    p=subprocess.Popen(['ffmpeg','-v','error','-ss',f'{lo:.3f}','-i',src,'-t',f'{hi-lo:.3f}','-vf',f'fps={FPS},scale={W}:{H}','-pix_fmt','bgr24','-f','rawvideo','-'],stdout=subprocess.PIPE)
    idx=[min(int(round((t-lo)*FPS)),int((hi-lo)*FPS)-2) for t in times]
    cur=-1; buf=None
    for k in idx:
        while cur<k:
            raw=p.stdout.read(W*H*3)
            if not raw: break
            buf=np.frombuffer(raw,np.uint8).reshape(H,W,3); cur+=1
        yield buf.copy()
    p.stdout.close(); p.wait()
allf=[]
for src,times,a in plan:
    allf.append(list(frames(src,times)))
cuts=[plan[i][2] for i in range(1,len(plan))]
def zoomblur(img,e):
    acc=np.zeros(img.shape,np.float32)
    for k in range(11):
        s=1+0.3*e*k/10; M=cv2.getRotationMatrix2D((W/2,H/2),0,s)
        acc+=cv2.warpAffine(img,M,(W,H),borderMode=cv2.BORDER_REFLECT)
    return (acc/11).astype(np.uint8)
def whip(img,e,d):
    s=1+0.5*e; M=cv2.getRotationMatrix2D((W/2,H/2),0,s); im=cv2.warpAffine(img,M,(W,H),borderMode=cv2.BORDER_REFLECT)
    acc=np.zeros(img.shape,np.float32); sh=260*e*d
    for k in range(16):
        acc+=np.roll(im,int(sh*k/15),axis=1)
    return (acc/16).astype(np.uint8)
flat=[f for seg in allf for f in seg]
assert len(flat)==total,(len(flat),total)
# transiciones: zoom-blur en corte 1 y 2 (montaje), whip en el corte a la toma 2
ev=[0.35,0.7,1.0]
for ci,cf in enumerate(cuts):
    if ci==2: continue   # corte 3 = mensaje recién termina (seg3→seg4 es continuo)
    for j,e in enumerate(ev):
        for fi in (cf-1-j, cf+j):
            if 0<=fi<total:
                eff=ev[::-1][j] if True else e
                flat[fi]=zoomblur(flat[fi],eff) if ci<2 else whip(flat[fi],eff,-1 if fi<cf else -1)
enc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-crf','14','-preset','medium','-pix_fmt','yuv420p',OUT],stdin=subprocess.PIPE)
for f in flat: enc.stdin.write(f.tobytes())
enc.stdin.close(); enc.wait()
json.dump({'total':total,'cuts':cuts,'fps':FPS},open(OUT+'.json','w'))
print(total,cuts)
