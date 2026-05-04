import {useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import rotateCards from "../assets/icons/rotate-cards.svg";
import prizeData from "../data/icons";
import orientationChange from "../helper";

export default function Pick() {
  const navigateTo = useNavigate();
  const [isStarted, setIsStarted] = useState(localStorage.getItem('isStarted') || false);

  const cardRefs = useRef([]);
  const containerRef = useRef(null);
  const [prizes, setPrizes] = useState(
    shuffleArray(prizeData).map((item, index) => ({ id: index + 1, image: item.img, name: item.name }))
  );
  const [getPrize, setGetPrize] = useState(localStorage.getItem('gotPrize') || false)
  const [isShuffling, setIsShuffling] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [offsets, setOffsets] = useState([]);

  useEffect(() => {
    setTimeout(() => {
            orientationChange()
        }, 1000)
  },[])



  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  async function getTicket(url){
    let result;
    try {
      const responce = await fetch(url, {method: 'POST',
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({type: 'freebet', game: 'penalty'})
      })

      if (!responce.ok) {
        throw new Error("error " + responce.status);
      } else {
        result = await responce.json()
      }
    } catch(err) {
      console.error(err)
    }
    return result
  }

  function startShuffle() {
    if (isShuffling || isStarted) return;
    
    
    const container = containerRef.current.getBoundingClientRect();
    const centerX = container.left + container.width / 2;
    const centerY = container.top + container.height / 2;

    const newOffsets = cardRefs.current.map((card) => {
      if (!card) return { x: 0, y: 0 };
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      return {
        x: centerX - cardCenterX,
        y: centerY - cardCenterY,
      };
    });

    setOffsets(newOffsets);
    setIsReady(true);
    setIsShuffling(true);

    setPhase("gather");

    setTimeout(async () => {
      
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setPrizes((prev) => shuffleArray(prev));

        if (count >= 5) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase("spread");

            setTimeout(() => {
              setPhase("idle");
              setIsShuffling(false);
              setIsStarted(true);
              
            }, 500);
          }, 100);
        }
      }, 120);
    }, 550); 
  }
  async function pickPrize(prize) {
    if (!isReady || isShuffling) return;
    const ticket = await getTicket('/api/games/win')
    localStorage.setItem("data", JSON.stringify(ticket));
    localStorage.setItem('isStarted', isStarted)
    setGetPrize(true)
    localStorage.setItem('gotPrize', getPrize)
    if (typeof ticket !== undefined && ticket) {
      navigateTo("/pick");
    } else {
      setGetPrize(false)
      setIsReady(false)
      setIsStarted(false)
    }
  }

  function getAnimate(index) {
    if (phase === "gather" && offsets[index]) {
      return {
        x: offsets[index].x,
        y: offsets[index].y,
        scale: 0.75,
      };
    }
    return {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
    };
  }

  function getTransition() {
    if (phase === "gather") {
      return { duration: 0.5, type: "tween", ease: "easeInOut" };
    }
    if (phase === "spread") {
      return { duration: 0.5, type: "spring", stiffness: 160, damping: 18 };
    }
    return {
      layout: { duration: 0.45, type: "spring", stiffness: 160, damping: 18 },
      duration: 0.3,
    };
  }

  return (
    <>
       <div className="flex w-full justify-center mb-[20px]">
         {isStarted && !getPrize ? <h1
          style={{ fontFamily: "HemiHead", textAlign: "center" }}
          className="inline leading-[35px] text-[white] text-[1.8rem] mx-[auto] w-[max-content]"
        >
          Выберите свой
          <br />
          счастливый билет
        </h1>:
        <h1
          style={{ fontFamily: "HemiHead", textAlign: "center" }}
          className="inline leading-[35px] text-[white] text-[1.8rem] mx-[auto] w-[max-content]"
        >
          Вы уже получили
          <br />
          свой приз!
        </h1>
        }
      </div>

      <div className="container overflow-hidden" ref={containerRef}>
        <div className="tickets-grid">
          {getPrize || prizes.map((prize, index) => (
            <motion.div
              key={prize.id}
              layout
              ref={(el) => (cardRefs.current[index] = el)}
              className={`ticket ${isReady ? "ticket-ready" : ""}`}
              onClick={() => pickPrize(prize)}
              animate={getAnimate(index)}
              transition={getTransition()}
              whileHover={isReady ? { scale: 1.04, y: -4 } : {}}
              whileTap={isReady ? { scale: 0.97 } : {}}
            >
              <img
                src={!isReady && !isStarted ? prize.image: rotateCards}
                alt={`Prize ${index + 1}`}
                className="ticket-image"
              />

              
            </motion.div>
          ))}
        </div>

        {!isStarted ? (
          <button className="get-freebet" onClick={startShuffle}>
            Получить фрибет
          </button>
        ):null}
      </div>
    </>
  );
}