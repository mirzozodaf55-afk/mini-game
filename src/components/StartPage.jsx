import stadium from '../assets/стадион.png'
import goalkeeper from "../assets/Вратарь2.png"
import Ball from "../assets/Ball.png"
import gates from "../assets/Ворота.png"
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Music from "../assets/music.mp3"
import text from "../assets/text.jpg"
import { clips } from '../managers/audio'

export default function StartPage() {
    const  getScore = JSON.parse(sessionStorage.getItem('score')) || 0
    const navigateTo = useNavigate();
    const texts = [text, text, text, text, text, text, text, text]
    const ballButtons = [
        { position: { bottom: '34%', left: '10%' }, name: 'bottomLeft' },
        { position: { top: '9%', left: '10%' }, name: 'topLeft' },
        { position: { top: '9%', left: '50%', transform: 'translateX(-50%)' }, name: 'top' },
        { position: { top: '9%', right: '10%' }, name: 'topRight' },
        { position: { bottom: '34%', right: '10%' }, name: 'bottomRight' },
    ]

    

    useEffect(() => {

        clips.bgMusic.play();
        clips.bgMusic.on('playerror', (id, error) => {
            console.log("Autoplay was prevented:", error.message);
        });

        document.body.style.overflow = 'hidden'
        const style = document.createElement('style')
        style.id = 'orientation-style'
        style.textContent = `
            @keyframes rotateHint {
                0%   { transform: rotate(0deg); }
                25%  { transform: rotate(90deg); }
                50%  { transform: rotate(90deg); }
                75%  { transform: rotate(0deg); }
                100% { transform: rotate(0deg); }
            }
        `
        document.head.appendChild(style)

        function handleOrientation() {
            const isLandscape = window.innerWidth > window.innerHeight
            let overlay = document.getElementById('orientation-overlay')

            if (isLandscape) {
                if (!overlay) {
                    overlay = document.createElement('div')
                    overlay.id = 'orientation-overlay'
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0; left: 0;
                        width: 100%; height: 100%;
                        background: rgba(0, 0, 0, 0.95);
                        z-index: 99999;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-family: Arial, sans-serif;
                        text-align: center;
                        gap: 12px;
                    `
                    overlay.innerHTML = `
                        <div style="font-size: 58px; animation: rotateHint 2s infinite;">📱</div>
                        <div style="font-size: 20px; font-weight: bold;">Переверните телефон</div>
                        <div style="font-size: 14px; opacity: 0.6;">Игра доступна только в портретном режиме</div>
                    `
                    document.body.appendChild(overlay)
                }
            } else {
                overlay?.remove()
            }
        }

        handleOrientation()
        window.addEventListener('orientationchange', handleOrientation)
        window.addEventListener('resize', handleOrientation)
        console.log('mounted')
        return () => {
            window.removeEventListener('orientationchange', handleOrientation)
            window.removeEventListener('resize', handleOrientation)
            document.getElementById('orientation-overlay')?.remove()
            document.getElementById('orientation-style')?.remove()
        }
    }, [])

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
                    Пробей&nbsp;пинальти
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
                        bottom: 'clamp(45%, 7vh, 20%)', height: 'clamp(25px,5vh,40px)'}}>
                        {texts.map((t, textKey) => (
                            <img key={textKey} className='moveLeft' src={t} alt="text" />
                        ))}
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img src={gates} alt="gates" style={{ width: '100%', height: '100%', display: 'block' }} />

                        {ballButtons.map((ball, x) => (
                        <button
                            key={x}
                            id={ball.name}
                            className='ballsAnimate'
                            style={{
                                position: 'absolute',
                                ...ball.position,
                                width: 'clamp(35px, 6vw, 72px)',
                                height: 'clamp(35px, 6vw, 72px)',
                                padding: 0,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <img id={ball.name} src={Ball} alt="ballsImg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </button>
                    ))}
                    </div>

                    <img
                        src={goalkeeper}
                        alt="goalkeeper"
                        style={{
                            position: 'absolute',
                            bottom: 'clamp(100px, 5vw, 120px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            height: 'clamp(150px, 28vw, 280px)',
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
                            width: getScore === 0 ? 'clamp(130px, 12vw, 115px)' : 'clamp(180px, 12vw, 115px)',
                            transform: 'translateX(-50%)',
                            height: 'clamp(60px, 12vw, 115px)',
                            background: 'rgba(30,30,40,0.95)',
                            objectFit: 'contain',
                            borderRadius: '40px',
                            border: '10px solid transparent',
                        }}

                        onClick={() => navigateTo('/game')}
                    ><span className='absolute left-[15px] text-[white] uppercase'>{getScore === 0 ? 'начать' : "продолжить"}</span><svg className='right-[5px] absolute' width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></button>


                </div>
            </div>
            {/* {<audio src={Music} autoPlay loop style={{ display: 'none' }} /> } */}
        </>
    )

}