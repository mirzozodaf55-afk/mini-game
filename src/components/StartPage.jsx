import stadium from '../assets/stadion.png'
import goalkeeper from "../assets/Вратарь.webp"
import Ball from "../assets/Ball.png"
import gates from "../assets/Ворота.svg"
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import text from "../assets/text.jpg"
import { clips } from '../managers/audio'
import loaded from '../assets/loaded.webp'
import orientationChange from '../helper';
import { useState } from 'react';
import ballSound from '../assets/sound/ball.mp3'
import keep from '../assets/sound/keep.mp3'
import HumenVoice from '../assets/sound/human-voice-goal.mp3'

export default function StartPage() {
    const  getScore = JSON.parse(sessionStorage.getItem('score')) || 0
    const navigateTo = useNavigate();
    const texts = [text, text, text, text, text, text, text, text]
    const ballButtons = [
        { position: { bottom: '34%', left: '7%' }, name: 'bottomLeft' },
        { position: { top: '-3%', left: '7%' }, name: 'topLeft' },
        { position: { top: '-3%', left: '50%', transform: 'translateX(-50%)' }, name: 'top' },
        { position: { top: '-3%', right: '7%' }, name: 'topRight' },
        { position: { bottom: '34%', right: '7%' }, name: 'bottomRight' },
    ]

    
    
    useEffect(() => {
        clips.bgMusic.play();
        clips.bgMusic.on('playerror', (id, error) => {
            console.log("Autoplay was prevented:", error.message);
        });
    },[])

    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);
    useEffect(() => {
  const images = [goalkeeper, gates, Ball, text, stadium];
  const audioSrc = [HumenVoice, keep, ballSound];
  const allFiles = [
    ...images.map(src => ({ type: 'image', src })),
    ...audioSrc.map(src => ({ type: 'audio', src }))
  ];

  let loaded = 0;
  const total = allFiles.length;

  allFiles.forEach(({ type, src }) => {
    const onDone = () => {
      loaded++;
      setProgress(Math.round((loaded / total) * 100));
      if (loaded === total) {
        setReady(true);
        setTimeout(() => {
          orientationChange();
        }, 1000);
      }
    };

    if (type === 'image') {
      const img = new Image();
      img.onload = img.onerror = onDone;
      img.src = src;
    } else {
      const audio = new Audio();
      audio.addEventListener('canplaythrough', onDone, { once: true });
      audio.addEventListener('error', onDone, { once: true });
      audio.src = src;
      audio.load();
    }
  });
}, []);

    if (!ready) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                background: '#000000',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 0 48px',
                overflow: 'hidden',
            }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-40px' }}>
                    <img
                        src={loaded}
                        alt="loading"
                        style={{
                            width: 'clamp(260px, 80vw, 400px)',
                            objectFit: 'contain',
                        }}
                    />
                </div>

                <div style={{ width: '100%', padding: '0 32px', boxSizing: 'border-box', textAlign: 'center', marginBottom: '25vh' }}>
                    <p style={{
                        fontFamily: 'HemiHead',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
                        marginBottom: '8px',
                    }}>
                        Загрузка... {progress}%
                    </p>
                    <div style={{
                        width: '100%',
                        height: '10px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '999px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.15)',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            borderRadius: '999px',
                            background: 'linear-gradient(to right, #a6c918, #d4f53c)',
                            boxShadow: '0 0 8px rgba(166,201,24,0.7)',
                            transition: 'width 0.2s ease',
                        }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{
                textAlign: 'center',
                padding: '24px 20px 0',
                zIndex: 10,
                top: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
            }} className='fixed'>
                <h1 style={{
                    fontFamily: 'HemiHead',
                    color: 'white',
                    display:"inline",
                    fontSize: 'clamp(1.8rem, 5vw, 1.8rem)',
                    lineHeight: '1.3',
                    textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                    margin: 0,
                }}>
                    Пробей&nbsp;пенальти
                </h1>
                <p style={{
                    color: 'white',
                    fontFamily: 'HemiHead',
                    fontSize: 'clamp(1rem, 3vw, 1rem)',
                    margin: '4px 0 0',
                    textShadow: '0 2px 6px rgba(0,0,0,0.7)',
                }}>
                    и выиграй фрибет
                </p>
            </div>
            <div
                style={{
                    backgroundImage: `url(${stadium})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: '100vw',
                    minHeight: '100vh',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                <div
                    style={{
                        position: 'relative',
                        width: 'clamp(95%, 90vw, 100vw)',
                        height: 'clamp(330px, 55vw, 100vh)',
                        marginBottom: 'clamp(-45%, -5vh, -45%)',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <div className='absolute flex overflow-hidden w-[100vw]' style={{
                        bottom: 'clamp(45%, 7vh, 20%)', height: 'clamp(25px,5vh,40px)'
                    }}>

                    </div>

                    <div className='absolute flex overflow-hidden w-[100vw]'  style={{
                        bottom: 'clamp(87%, 7vh, 30%)', height: 'clamp(20px,4vh,40px)'}}>
                        {texts.map((t, textKey) => (
                            <img key={textKey} className='moveLeft' src={t} alt="text" />
                        ))}
                    </div>
                    <div style={{ position: 'relative', bottom: '90px', width: '100%', height: '100%' }}>
                        <img src={gates} alt="gates" style={{ width: '100%', height: '100%', display: 'block', transform: 'scale(1.35)' }} />
                    </div>
                    <img
                        src={goalkeeper}
                        alt="goalkeeper"
                        style={{
                            position: 'absolute',
                            bottom: 'clamp(300px, 5vw, 220px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            height: 'clamp(50px, 28vw, 50px)',
                            objectFit: 'contain',
                            pointerEvents: 'none',
                        }}
                    />

                    <button
                        src={Ball}
                        alt="ball"
                        className='flex items-center justify-center z-[11]'
                        
                        style={{
                            position: 'absolute',
                            bottom: 'clamp(-40px, -18vh, -150px)',
                            left: '50%',
                            padding: '0 20px',
                            width: getScore === 0
                                ? 'clamp(130px, 12vw, 115px)'
                                : 'clamp(180px, 12vw, 115px)',
                            transform: 'translateX(-50%)',
                            height: 'clamp(40px, 8vw, 90px)',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            color: '#fff',
                            border: '1px solid #7fa30a',
                            background: 'linear-gradient(to bottom, #a6c91877 0%, #99ba1586 50%, #87a50f9d 100%)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25), 0 2px 4px rgba(0,0,0,.25)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                        }}

                        onClick={() => navigateTo('/game')}
                    ><span style={{textAlign:'center'}} className='absolute text-[white] uppercase'>{getScore === 0 ? 'начать' : "продолжить"}</span>
                            {/* <svg className='right-[5px] absolute' width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg> */}
                        </button>


                </div>
            </div>
            {/* {<audio src={Music} autoPlay loop style={{ display: 'none' }} /> } */}
        </>
    )

}