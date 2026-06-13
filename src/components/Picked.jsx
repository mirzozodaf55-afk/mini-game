import FireWorks from 'react-canvas-confetti/dist/presets/fireworks'
import prizeData from "../data/icons";
import { useNavigate } from 'react-router-dom';


export default function Picked(){
    let navigateTo = useNavigate()
    let cardUrl = null
    try { cardUrl = JSON.parse(localStorage.getItem('data')) } catch (_) {}
    let image = cardUrl ? prizeData.find(p => p.name.includes(cardUrl.sum)) : null
    
    if (!cardUrl || !image) {
        localStorage.removeItem('isStarted')
        localStorage.removeItem('gotPrize')
        setTimeout(() => navigateTo('/') , 2000)
        return (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center">
            <p className="font-['HemiHead'] text-white text-center text-[1.2rem]">
                Нет данных. Попробуйте снова.
            </p>
        </div>
        )
    }

function reset() {
    localStorage.removeItem('data')
    localStorage.removeItem('isStarted')
    localStorage.removeItem('gotPrize')
}
    return (
        <>
        <FireWorks style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            pointerEvents: 'none',
        }}
            autorun={{speed:1, duration: 3000}}
        />
            <div className = "w-[100vw] h-[100vh] flex items-center flex-col justify-around">

                <div className="fade-in relative top-[0px]">
                    <h1 className=" font-['HemiHead'] text-center text-white text-[1.8rem]">Поздравляем!</h1>
                    <p className="font-['HemiHead'] text-white text-center leading-[15px]" style={{fontWeight: 100}}>Вы получили <span className='text-[orange]'>{image.name.toUpperCase()}</span> фрибетов.<br/>Для активации нажмите на кнопку</p>
                </div>
                <div className="scale w-[200px] h-[300px] rotate-[-15deg]" style={{color:"white"}}>
                    <img src={image.img} className="pick-animate object-contain w-full
                     h-full" alt="Picked Card" />

                </div>
                <a onClick={reset}
                href={`https://formula55.tj/sign-up${cardUrl.redirect_url}`}
                    className="move-up bg-white text-black font-bold py-2 relative px-4 rounded"
                >
                Активировать фрибет
                </a>
            </div>
        </>
    )
}
