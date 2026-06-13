import { useNavigate,  } from "react-router-dom";
export default function NotifyModal(props){
        const navigateTo = useNavigate()
        
        function Continue() {
            sessionStorage.setItem('score', 0)
            sessionStorage.setItem('is-finished', JSON.stringify('start'))
            let isStarted = JSON.parse(localStorage.getItem('isStarted') || false),
            getPrize = JSON.parse(localStorage.getItem('gotPrize') || false)    
            props.setScore(0)
            props.setIsFinished('start') 
                   
            if (!isStarted && !getPrize) {
                navigateTo('/cards')
            } else navigateTo('/pick')
        }

       function handleClick({target}) {
            setTimeout(() => {
                if (props.status !== 'continue') {
                    Continue()
                } else  {
                    sessionStorage.setItem('is-finished', JSON.stringify('start'))
                    props.setIsFinished('start')
                    props.onContinue()
                    target.closest('[data-id="notify-modal"]').style.display = 'none'
                }
            }, 500)
        }

        return (
            <>
            <div data-id="notify-modal" className="my-[auto] fixed 
            left-0 right-0 top-0 bottom-0 bg-[rgba(0,0,0,0.2)] z-[10]
            flex justify-center
            ">
                <div className="absolute bottom-0
                flex flex-col items-center bg-[#2C2C2C] text-[white]
                " style={{height: 'clamp(200px,10vh,300px)', width: '100%', borderTopLeftRadius: '14px', borderTopRightRadius:'14px'}}>
                    <div className="m-[auto] w-full mb-[10px]
                     justify-around h-[80%] items-center
                     flex flex-col" style={{textAlign:'center'}}>
                    <h3 className="text-[25px] font-bold">{props.title}</h3>
                    <p className="text-[80%]">{props.text}</p>
                    <button className="font-bold py-[10px]
                    text-[black] bg-[white]
                    px-[35px] rounded" onClick={handleClick}>{props.buttonText}</button>
                    </div>
                </div>
            </div>
            </>
        )   
    }
