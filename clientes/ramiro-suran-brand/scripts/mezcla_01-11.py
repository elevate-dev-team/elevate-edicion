# RSU 01-11: voz (voz_cadena) + música (Dry Gin, Mixkit 868, −16 dB bajo la voz) + SFX → mix/master.wav
import json, subprocess, sys, os, numpy as np
SR=48000
D=json.load(open('data.json')); DUR=D['dur']; N=int(DUR*SR)
w=lambda i: D['w'][str(i)]; e=lambda i: D['e'][str(i)]
TIT,MOT=D['tit'],D['mot']
MUS_DB=float(sys.argv[1]) if len(sys.argv)>1 else 16.0
def rd(p,af=None,ss=None,t=None):
    cmd=['ffmpeg','-v','error']+(['-ss',str(ss)] if ss is not None else [])+(['-t',str(t)] if t else [])+['-i',p]+(['-af',af] if af else [])+['-ac','1','-ar',str(SR),'-f','f32le','-']
    return np.frombuffer(subprocess.run(cmd,capture_output=True).stdout,dtype=np.float32).copy()
def wr(p,x): subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-c:a','pcm_f32le',p],input=x.astype(np.float32).tobytes(),check=True)
def lufs(p,ss=None,t=None):
    cmd=['ffmpeg','-nostats']+(['-ss',str(ss),'-t',str(t)] if ss is not None else [])+['-i',p,'-af','ebur128','-f','null','-']
    o=subprocess.run(cmd,capture_output=True,text=True).stderr
    return float([l for l in o.splitlines() if l.strip().startswith('I:')][-1].split()[1])
voz=rd('aud/voz.wav')[:N]; voz=np.pad(voz,(0,N-len(voz)))
mus=rd('aud/musica.wav','equalizer=f=2200:t=o:w=1.6:g=-4,equalizer=f=350:t=o:w=1:g=-2',ss=0.0,t=DUR+0.1)[:N]; mus=np.pad(mus,(0,N-len(mus)))
wr('mix/_m.wav',mus); wr('mix/_v.wav',voz)
lv,lm=lufs('mix/_v.wav'),lufs('mix/_m.wav'); mus*=10**((lv-MUS_DB-lm)/20)
t=np.arange(N)/SR
env=np.clip(t/0.15,0,1)
fin=e(129)+0.1; env*=np.where(t>=fin,np.clip(1-(t-fin)/(DUR-fin+0.02),0,1)**1.5,1.0)
mus*=env
PK={'cash':0.24,'whoosh3':0.15,'whoosh6':0.31,'swipe':0.68,'wslide':0.34,'pop':0.15,'bpop':1.87,'check':0.38,'stamp':0.71,'wink':0.14,'riser':4.56,'ding':0.23,'notif':0.01}
RMS={'cash':-20.6,'whoosh3':-24.8,'whoosh6':-21.1,'swipe':-12.2,'wslide':-13.4,'pop':-3.7,'bpop':-5.2,'check':-14.9,'stamp':-13.5,'wink':-12.5,'riser':-22.6,'ding':-16.9,'notif':-15.0}
VREF=-16.0
WH=[7.82,12.93,16.69,22.33,30.60]; ZB=[3.95,5.75,9.72,18.10,19.24,24.18,25.75,27.60,29.10]
EV=[(['swipe','wslide','whoosh6'][i%3],c,-12) for i,c in enumerate(WH)]
EV+=[('whoosh3',c,-13) for c in ZB]
EV+=[('pop',0.12,-16),
     ('pop',3.97,-12),('pop',w(11)-0.02,-12),('pop',w(14)-0.02,-12),
     ('pop',TIT['precio'][0]+0.03,-15),('cash',w(16)+0.12,-8),
     ('pop',TIT['edificio'][0]+0.03,-14),('bpop',w(31)+0.04,-12),
     ('whoosh3',w(34)+0.05,-16),('whoosh3',w(37)+0.05,-16),('whoosh3',w(39)+0.05,-16),('bpop',w(40)+0.05,-11),
     ('pop',TIT['trio'][0]+0.03,-12),('pop',w(54)-0.02,-12),('pop',w(55)-0.02,-13),
     ('check',w(60)+0.12,-11),('check',w(62)+0.12,-11),('check',w(66)+0.12,-11),('ding',w(69)+0.05,-13),
     ('pop',w(84)-0.02,-13),('bpop',w(86)+0.02,-11),('stamp',w(86)+0.4,-10),
     ('bpop',TIT['centro'][0]+0.2,-12),('pop',w(91)-0.02,-12),
     ('bpop',TIT['cta'][0]+0.06,-11),('wink',TIT['cta'][0]+0.15,-9)]
sfx=np.zeros(N,np.float32); cache={}
for name,at,rel in EV:
    if name not in cache: cache[name]=rd(f'sfx/{name}.wav')
    x=cache[name]*10**((VREF+rel-RMS[name])/20)
    s0=int((at-PK[name])*SR); a,b=max(0,s0),min(N,s0+len(x))
    if b>a: sfx[a:b]+=x[a-s0:b-s0]
print(len(EV),'SFX')
mix=voz+mus+sfx; wr('mix/premaster.wav',mix)
gain=-11.0-lufs('mix/premaster.wav')
for _ in range(4):
    subprocess.run(['ffmpeg','-v','error','-y','-i','mix/premaster.wav','-af',
        f'volume={gain:.2f}dB,aresample=192000,alimiter=limit=0.84:attack=5:release=150:level=disabled,aresample=48000,pan=stereo|c0=c0|c1=c0',
        '-c:a','pcm_f32le','mix/master.wav'],check=True)
    lm2=lufs('mix/master.wav')
    if abs(lm2+11.0)<0.15: break
    gain+=-11.0-lm2
wr('mix/musica_sola.wav',mus)
for nm,a,b in [('hook',0,7.82),('cuerpo',7.82,30.6),('cta',30.6,DUR)]:
    print(f'{nm}: voz {lufs("mix/_v.wav",a,b-a):.1f} · música {lufs("mix/musica_sola.wav",a,b-a):.1f} LUFS')
print(f'master {lufs("mix/master.wav"):.1f} LUFS')
