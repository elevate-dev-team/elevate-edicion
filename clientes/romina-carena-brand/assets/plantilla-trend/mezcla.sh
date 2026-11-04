#!/bin/bash
# Mezcla ROC 04-11 (sin voz). Música Retro Funky Groove desde 3,971 s (beat en t=0), 13,267 s.
# Ping WA a 5,42 s (primera nota a 5,8 s = aparece la notificación); mientras lee, la música queda apagada (lowpass + −7 dB)
# y vuelve entera en el whip a la toma 2 (10,82 s). Whoosh en los cortes 1,475 / 2,951 y swipe en 10,82.
M="../MUSICA/Retro Funky Groove - BombinSound (Pixabay).mp3"; WA="../MUSICA/whatsapp-notification-sound.mp3"
D=13.267
ffmpeg -v error -y -ss 3.971 -t $D -i "$M" -i "$WA" -i "whoosh slide.mp3" -i "Swipe Swoosh Transition Sound Effect(MP3_70K).mp3" -i pop.mp3 -filter_complex "
[0:a]aresample=48000,asplit=2[m1][m2];
[m1]volume='if(between(t,5.75,10.82),0,1)':eval=frame[mc];
[m2]lowpass=f=650,volume='if(between(t,5.75,10.82),0.45,0)':eval=frame[mm];
[mc][mm]amix=inputs=2:normalize=0,volume=-10dB,afade=t=in:d=0.05,afade=t=out:st=12.75:d=0.5[mus];
[1:a]aresample=48000,adelay=5420|5420,volume=1dB[wa];
[2:a]aresample=48000,asplit=2[w1][w2];
[w1]adelay=1135|1135,volume=-14dB[x1];[w2]adelay=2611|2611,volume=-14dB[x2];
[3:a]aresample=48000,adelay=10500|10500,volume=-9dB[x3];
[4:a]aresample=48000,adelay=0|0,volume=-20dB[x4];
[mus][wa][x1][x2][x3][x4]amix=inputs=6:normalize=0,atrim=0:$D,volume=5.5dB,aresample=192000,alimiter=limit=0.84:attack=5:release=150:level=disabled,aresample=48000[out]" -map "[out]" -c:a pcm_f32le -ar 48000 mezcla.wav
