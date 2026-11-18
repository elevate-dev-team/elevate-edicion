# RSU 01-11 portada: degradé lavanda desde arriba, título Bootzy MAYÚSCULA blanco sobre la cabeza, pastilla de precio desde el borde izq.
#   ~/venvs/align/bin/python portada.py A|B [guias|solotexto]
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
V=sys.argv[1]; MODE=sys.argv[2] if len(sys.argv)>2 else ''
BZ='/Users/tomisepul25/.claude/skills/ramiro-suran-brand/assets/fonts/bootzy/BootzyTM.ttf'
W,H=1080,1920; LAV=(175,164,207); WHITE=(255,255,255); LAVD=(70,58,110)
HEADTOP={'A':0,'B':0}
A=lambda im: np.asarray(im,np.float32)
base=Image.open(f'base{V}.png').convert('RGB')
mk_img=Image.open(f'mask{V}.png').convert('L').resize((W,H)).filter(ImageFilter.GaussianBlur(1.2)); mk=A(mk_img)/255
ys=np.where(mk.max(1)>0.5)[0]; head=int(ys.min())
yy,xx=np.mgrid[0:H,0:W]
fondo=Image.open(f'fondo{V}.jpg').convert('RGB').filter(ImageFilter.GaussianBlur(4))
fondo=ImageEnhance.Color(ImageEnhance.Brightness(fondo).enhance(0.82)).enhance(0.92)
near=A(Image.fromarray((mk*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10)))/255
bg=A(fondo)*(1-near[...,None])+A(ImageEnhance.Brightness(base).enhance(0.82))*near[...,None]
# degradé lavanda desde arriba: 0.72 arriba -> 0 a la altura del pecho
chest=head+330
lav=np.clip(1-yy/chest,0,1)**1.15*0.72
bg=bg*(1-lav[...,None])+np.array(LAV,np.float32)*lav[...,None]
bot=np.clip((yy-1480)/440,0,1)**1.3*0.55
bg=bg*(1-bot[...,None])+np.array((30,24,48),np.float32)*bot[...,None]
gam=0.78 if V=='A' else 0.85; br=1.22 if V=='A' else 1.10
sub=Image.fromarray(np.clip(255*(A(base)/255)**gam,0,255).astype(np.uint8))
sub=ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(sub).enhance(br)).enhance(1.06)).enhance(1.05)
sa=A(sub); sa[...,0]*=1.02; sa[...,2]*=0.98
blg=np.clip((yy-1500)/420,0,1)[...,None]*0.45; sa=sa*(1-blg)+np.array((30,24,48),np.float32)*blg
mk_in=A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5)))/255
mid=A(ImageEnhance.Brightness(base).enhance(0.95))
img=bg*(1-mk[...,None])+mid*(mk-mk_in)[...,None].clip(0,1)+sa*mk_in[...,None]
img=Image.fromarray(np.clip(img,0,255).astype(np.uint8)).convert('RGBA')
def line(txt,sz,tr=-0.025):
    f=ImageFont.truetype(BZ,sz); tw=sum(f.getlength(c) for c in txt)+tr*sz*(len(txt)-1)
    im=Image.new('RGBA',(int(tw)+40,int(sz*2)),(0,0,0,0)); d=ImageDraw.Draw(im); x=20; base_y=int(sz*1.3)
    for c in txt: d.text((x,base_y),c,font=f,fill=WHITE,anchor='ls'); x+=f.getlength(c)+tr*sz
    bb=im.getbbox(); cap=f.getbbox('H',anchor='ls')[1]+base_y
    return im.crop(bb), base_y-bb[1], cap-bb[1]
L=[line('ALQUILER DPTO',92),line('A ESTRENAR',138),line('EN EL CENTRO DE NEUQUÉN',54)]
# por línea de base, muy apretado
GAPS=[12,14]
ys_=[0]; cur_base=L[0][1]
bases=[L[0][1]]
for i in (1,2):
    capH=L[i][1]-L[i][2]
    b=bases[-1]+GAPS[i-1]+capH; bases.append(b)
top=[bases[i]-L[i][1] for i in range(3)]; bot_=max(top[i]+L[i][0].height for i in range(3))
shift=(head-28)-bot_
block=Image.new('RGBA',(W,H),(0,0,0,0))
for i in range(3):
    s=L[i][0]; block.alpha_composite(s,(int(540-s.width/2),int(top[i]+shift)))
# pastilla de precio
PZ=96; pf=ImageFont.truetype(BZ,PZ); ptxt='$1.200.000'
tw=sum(pf.getlength(c)+(0.06*PZ if c in '1.' else -0.02*PZ) for c in ptxt)
py=head+300 if V=='A' else head+250; ph=128; px1=int(110+tw+60)
pill=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(pill)
d.rounded_rectangle((-80,py,px1,py+ph),radius=ph//2,fill=LAV+(240,))
ps=Image.new('RGBA',(W,H),(0,0,0,0)); ps.putalpha(pill.split()[3].point(lambda v:int(v*0.35))); ps=ps.filter(ImageFilter.GaussianBlur(14))
d2=ImageDraw.Draw(block); x=120
for c in ptxt: d2.text((x,py+ph/2+PZ*0.36),c,font=pf,fill=WHITE,anchor='ls'); x+=pf.getlength(c)+(0.06*PZ if c in '1.' else -0.02*PZ)
# sombra del texto
a=block.split()[3].point(lambda v:int(v*0.45)); sh=Image.new('RGBA',(W,H),(LAVD[0],LAVD[1],LAVD[2],0)); sh.putalpha(a); sh=sh.filter(ImageFilter.GaussianBlur(10))
if MODE=='solotexto':
    out=Image.new('RGBA',(W,H),(0,0,0,255)); out.alpha_composite(block); out.convert('RGB').save(f'solo_texto{V}.png'); sys.exit()
img.alpha_composite(ps,(0,8)); img.alpha_composite(pill); img.alpha_composite(sh,(0,5)); img.alpha_composite(block)
if MODE=='guias':
    d=ImageDraw.Draw(img); d.rectangle((0,420,1079,1500),outline=(0,255,0,255),width=4); d.rectangle((100,520,980,1400),outline=(255,220,0,255),width=3)
    img.convert('RGB').save(f'guias{V}.jpg',quality=92); sys.exit()
img.convert('RGB').save(f'portada{V}.jpg',quality=95); print('head',head,'texto',int(top[0]+shift),'-',int(bot_+shift),'pill',py)
