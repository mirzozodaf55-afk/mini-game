import {useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import returnCards from "../assets/icons/return-cards.svg";
import prizeData from "../data/icons";

export default function Pick() {

  useEffect(() => {

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

  const navigateTo = useNavigate();
  const cardRefs = useRef([]);
  const containerRef = useRef(null);

  const [prizes, setPrizes] = useState(
    shuffleArray(prizeData).map((item, index) => ({ id: index + 1, image: item.img, name: item.name }))
  );

  const [isStarted, setIsStarted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [offsets, setOffsets] = useState([]);

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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
    setIsStarted(true);
    setIsReady(false);
    setIsShuffling(true);

    // 1. Собираем в центр
    setPhase("gather");

    setTimeout(() => {
      // 2. Перемешиваем в центре несколько раз (невидимо для юзера)
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setPrizes((prev) => shuffleArray(prev));

        if (count >= 5) {
          clearInterval(interval);

          // 3. Разлетаются по новым позициям
          setTimeout(() => {
            setPhase("spread");

            setTimeout(() => {
              setPhase("idle");
              setIsShuffling(false);
              setIsReady(true);
            }, 500);
          }, 100);
        }
      }, 120); // каждые 120мс перемешиваем
    }, 550); // ждём пока соберутся
  }

  function pickPrize(prize) {
    if (!isReady || isShuffling) return;
    sessionStorage.setItem("prize", JSON.stringify(prize));
    navigateTo("/pick");
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
        <h1
          style={{ fontFamily: "HemiHead", textAlign: "center" }}
          className="inline leading-[35px] text-[white] text-[1.8rem] mx-[auto] w-[max-content]"
        >
          Выберите свой
          <br />
          счастливый билет
        </h1>
      </div>

      <div className="container overflow-hidden" ref={containerRef}>
        <div className="tickets-grid">
          {prizes.map((prize, index) => (
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
                src={prize.image}
                alt={`Prize ${index + 1}`}
                className="ticket-image"
              />

              <div
                className="cover absolute inset-0 w-full h-full"
                style={{
                  top: isStarted ? "0%" : "100%",
                  transition: "top 0.35s ease",
                }}
              >
                <img
                  src={returnCards}
                  alt="Return Cards"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {!isStarted && (
          <button className="get-freebet" onClick={startShuffle}>
            Получить фрибет
          </button>
        )}
      </div>
    </>
  );
}