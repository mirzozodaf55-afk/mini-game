import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FireWorks from 'react-canvas-confetti/dist/presets/fireworks'
import stadium from '../assets/стадион.png'
import goalkeeper from "../assets/Вратарь2.png"
import goalkeeperUP from "../assets/upKeeper.png"
import goalkeeperRight from "../assets/rightKeeper.png"
import goalkeeperLeft from "../assets/leftKeeper.png"
import gates from "../assets/Ворота.png"
import Ball from "../assets/Ball.png"
import NotifyModal from './NotifyModal'
import text from '../assets/text.jpg'
import ballSound from '../assets/sound/ball.mp3'
import keep from '../assets/sound/keep.mp3'
import HumenVoice from '../assets/sound/human-voice-goal.mp3'

export default function Game() {
    const navigate = useNavigate()
    function playAudio(url) {
        const audio = new Audio(url)
        audio.play()
    }


    const goalKeeperPosition = useRef('center')
    const goalKeeperPosArr = [
    {namePos:"top", picture: goalkeeperUP, pos:'translateX(-50%) translateY(-45px)'},
    {namePos:"topLeft", picture: goalkeeperLeft, pos:'translateX(-130%) translateY(-75px)'},
    {namePos:"topRight", picture: goalkeeperRight, pos:'translateX(30%) translateY(-75px)'},
    {namePos:"bottomLeft", picture: goalkeeperLeft, pos:'translateX(-140%) translateY(0px) rotate(-85deg)'},
    {namePos:"bottomRight", picture: goalkeeperRight, pos:'translateX(40%) translateY(0px) rotate(85deg)'},
]

    let [getScore, setScore] = useState(() => JSON.parse(sessionStorage.getItem('score')) || 0) 

    const texts = [text, text, text, text, text, text, text, text]
    
    const ballButtons = [
        { position: { bottom: '34%', left: '10%' }, name: 'bottomLeft' },
        { position: { top: '9%', left: '10%' }, name: 'topLeft' },
        { position: { top: '9%', left: '50%', transform: 'translateX(-50%)' }, name: 'top' },
        { position: { top: '9%', right: '10%' }, name: 'topRight' },
        { position: { bottom: '34%', right: '10%' }, name: 'bottomRight' },
    ]

    
    useEffect(() => {
        
        const images = [goalkeeperUP, goalkeeperLeft, goalkeeperRight, goalkeeper]
        images.forEach(src => {
            const img = new Image()
            img.src = src
        })

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

        return () => {
            window.removeEventListener('orientationchange', handleOrientation)
            window.removeEventListener('resize', handleOrientation)
            document.getElementById('orientation-overlay')?.remove()
            document.getElementById('orientation-style')?.remove()
        }
    }, [])



    const saved = useRef(true)
    const countDown = useRef(3)

    const [isFinished, setIsFinished] = useState(
    JSON.parse(sessionStorage.getItem('is-finished')) || 'start'
)

    function resetGame() {
        setTimeout(()=>{
            if (getScore > 3) {
                setScore(0)
                sessionStorage.setItem('score', JSON.stringify(getScore))
            } else {
                setScore(getScore)
                sessionStorage.setItem('score', JSON.stringify(getScore))
            }

            setIsFinished('end')
            sessionStorage.setItem('is-finished', JSON.stringify(isFinished))
        }, 300)
    }

    function goal({ target }) {
        target.parentElement.disabled = true
        playAudio(ballSound)
        setTimeout(() => {
            const ball = document.querySelector('img[alt="ball"]')
            ball.setAttribute('type-position', target.id)
            
            const ballWidth = ball.style.width
            const ballHeight = ball.style.height
            const buttonContainer = target.parentElement

            const buttonRect = buttonContainer.getBoundingClientRect()
            const ballRect = ball.getBoundingClientRect()

            const originalWidth = ballRect.width
            const originalHeight = ballRect.height
            const targetSize = originalWidth * 0.5

            const sizeOffsetX = (originalWidth - targetSize) / 2
            const sizeOffsetY = (originalHeight - targetSize) / 2

            const deltaX = buttonRect.left + buttonRect.width / 2 - (ballRect.left + ballRect.width / 2) - sizeOffsetX
            const deltaY = buttonRect.top + buttonRect.height / 2 - (ballRect.top + ballRect.height / 2) - sizeOffsetY

            const duration = 200
            const totalRotation = 270
            const startTime = performance.now()
            if (getScore < 3) {
                getScore++
            }
            countDown.current = countDown.current - getScore
            

            resetGame()
            
            const gkp = document.querySelector('img[alt="goalkeeper"]')
                gkp.style.transition = 'transform 0.3s ease-out'
                

                if (getScore === 3 || getScore > 3) {
                    goalKeeperPosition.current = target.id
                    let gKP = goalKeeperPosArr.filter(g => g.namePos !== goalKeeperPosition.current)
                    gKP = gKP[Math.floor(Math.random() * gKP.length)]
                    gkp.src = gKP.picture
                    gkp.style.transform = gKP.pos
                    saved.current = false
                    resetGame()
                    playAudio(HumenVoice)  
                } 
                
                goalKeeperPosArr.forEach(g => {
                        goalKeeperPosition.current = g.namePos
                        if (getScore < 3 && target.id === g.namePos) {
                            gkp.src = g.picture
                            gkp.style.transform = g.pos
                            saved.current = true
                            resetGame()
                            playAudio(keep)
                        }
                })                

                document.querySelectorAll('.balls').forEach(b => b.style.display = 'none')
            function animate(currentTime) {
                const elapsed = currentTime - startTime
                const progress = Math.min(elapsed / duration, 1)
                
                const currentX = deltaX * progress
                const currentY = deltaY * progress
                const currentWidth = originalWidth + (targetSize - originalWidth) * progress
                const currentHeight = originalHeight + (targetSize - originalHeight) * progress
                const currentRotation = totalRotation * progress
                
                ball.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`
                ball.style.width = `${currentWidth}px`
                ball.style.height = `${currentHeight}px`
                
                if (progress < 1) requestAnimationFrame(animate)
            }

            requestAnimationFrame(animate)
            ball.style.width = ballWidth
            ball.style.height = ballHeight
        }, 300)
    }
    
    function resetPositions() {
    // сбрасываем вратаря
        const gkp = document.querySelector('img[alt="goalkeeper"]')
        if (gkp) {
            gkp.src = goalkeeper
            gkp.style.transform = 'translateX(-50%)'
            gkp.style.transition = 'none'
        }

        // сбрасываем мяч
        const ball = document.querySelector('img[alt="ball"]')
        if (ball) {
            ball.style.transform = 'translateX(-50%)'
            ball.style.height = ''
            ball.style.width = ''
        }

        // показываем кнопки мячей
        document.querySelectorAll('.balls').forEach(b => b.style.display = 'block')

        // сбрасываем флаги
        saved.current = true
        goalKeeperPosition.current = 'center'
        setIsFinished('start')
        sessionStorage.setItem('is-finished', JSON.stringify(isFinished))
    }


    
    return (
        <>
        {getScore === 3 && isFinished === 'end' ?
        <FireWorks style={{position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            pointerEvents: 'none',
        }} 


        autorun={{speed:1, duration: 3000}}/>
        : null }
        { getScore === 1 && isFinished === 'end' ? 
        <>
            <h1 className='motivation-text text-center w-[max-content] 
            text-[rgba(255,255,255,0.8)] absolute top-[20px]
            left-[50%] text-[1.3rem] translate-x-[-50%]
            mx-[auto] font-["HemiHead"]'>    
            почти получилось!<br /> Вратарь сегодня в <br/> ударе, но ты хитрее.
            </h1>
            <NotifyModal title='Почти получилось' 
            text={`у тебя осталась 2 попытка`}
            buttonText="Попробовать еще раз" status='continue' onContinue={resetPositions}
            setScore={setScore}          
            setIsFinished={(val) => { setIsFinished(val) }}
            /> 
        </>
        : 
        getScore === 2 && isFinished === 'end' ? 
        <>
        <h1 className='motivation-text text-center w-[max-content] 
            text-[rgba(255,255,255,0.8)] absolute top-[20px]
            left-[50%] text-[1.3rem] translate-x-[-50%]
            mx-[auto] font-["HemiHead"]'>    
            Сделай это! Отправь <br/> мяч прямо в сетку!
            </h1>
            <NotifyModal title='Все не так просто!' 
            text={`у тебя осталась 1 попытка`}
            buttonText="Решающий удар!" status='continue' 
            onContinue={resetPositions}
            setScore={setScore}          
            setIsFinished={(val) => { setIsFinished(val) }}
            /> 
        </>
        : 
        getScore === 3 && isFinished === 'end' ?
        <NotifyModal title='Поздравляем!' 
        text={`получи свой долгожданный бонус`}
        buttonText="Выбрать свой бонус" status='end' onContinue={resetPositions}
        setIsFinished={(val) => { setIsFinished(val) }}
        setScore={setScore}
        /> : null}

        
        <div
            style={{
                backgroundImage: `url(${ stadium })`,
                aspectRatio: '16 / 9',
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
        {getScore === 0 && isFinished === 'start' ? 
        <h1 className='motivation-text text-center w-[max-content] 
        text-[rgba(255,255,255,0.8)] absolute top-[20px]
        left-[50%] text-[1.3rem] translate-x-[-50%]
        mx-[auto] font-["HemiHead"]'>    
        выбери точку удара <br /> и покажи, на что ты <br/> способен
        </h1>: null }

        {getScore === 1 && isFinished === 'start' ?
        <h1 className='motivation-text text-center w-[max-content] 
        text-[rgba(255,255,255,0.8)] absolute top-[20px]
        left-[50%] text-[1.3rem] translate-x-[-50%]
        mx-[auto] font-["HemiHead"]'>
        Смени тактику! <br/> Целься в девятку </h1> 
        :null} 
        {getScore === 2 && isFinished === 'start' ?
        <h1 className='motivation-text text-center w-[max-content] 
        text-[rgba(255,255,255,0.8)] absolute top-[20px]
        left-[50%] text-[1.3rem] translate-x-[-50%]
        mx-[auto] font-["HemiHead"]'>
            Один точный удар отделяет <br /> тебя от награды. Не <br/> подведи трибуны!
        </h1>:null}

        {getScore === 3 && isFinished === 'end' ?
        <h1 className='motivation-text text-center w-[max-content] 
        text-[rgba(255,255,255,0.8)] absolute top-[50px]
        left-[50%] text-[2rem] translate-x-[-50%]
        mx-[auto] font-["HemiHead"]'>
            ГООООЛ!
        </h1>
        :null}
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
                <div className='absolute flex overflow-hidden w-[100vw]'  style={{
                    bottom: 'clamp(45%, 7vh, 20%)', height: 'clamp(25px,5vh,40px)'}}>
                    {texts.map((t, textKey) => (
                        <img key={textKey} className='moveLeft' src={t} alt="text" />
                    ))}
                </div>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img src={ gates } alt="gates" style={{ width: '100%', height: '100%', display: 'block' }} />

                    {ballButtons.map((ball, x) => (
                        <button
                            onClick={goal}
                            key={x}
                            id={ball.name}
                            className='balls'
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
                    src={ goalkeeper }
                    alt="goalkeeper"
                    style = {{
                        position: 'absolute',
                        bottom: 'clamp(100px, 5vw, 120px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        height: 'clamp(150px, 28vw, 280px)',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                    }}
                />

                <img
                    src = { Ball }
                    alt = "ball"
                    style = {{
                        position: 'absolute',
                        bottom: 'clamp(-80px, -18vh, -190px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        height: 'clamp(60px, 12vw, 115px)',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                    }}
                />
            </div>
        </div>
        </>
    )
}
