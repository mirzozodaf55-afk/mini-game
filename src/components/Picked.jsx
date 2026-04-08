import FireWorks from 'react-canvas-confetti/dist/presets/fireworks'

export default function Picked(){
    const cardUrl = JSON.parse(sessionStorage.getItem('prize'))
   
        
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
                    <p className="font-['HemiHead'] text-white text-center leading-[15px]" style={{fontWeight: 100}}>Вы получили <span className='text-[orange]'>{cardUrl.name.toUpperCase()}</span> фрибетов.<br/>Для активации нажмите на кнопку</p>
                </div>
                <div className="scale w-[200px] h-[300px] rotate-[-15deg]">
                    <img src={cardUrl.image} className="pick-animate object-contain w-full
                     h-full" alt="Picked Card" />
                </div>

                <button onClick=
                {()=> window.location.replace('https://formula55.tj/sign-up')}
                 className="move-up bg-white text-black 
                 font-bold py-2 relative px-4 rounded">
                    Активировать фрибет
                </button>
            </div>
        </>
    )
}