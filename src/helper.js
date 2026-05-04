// Константы для идентификаторов и стилей
const ORIENTATION_IDS = {
    STYLE: 'orientation-style',
    OVERLAY: 'orientation-overlay',
}

const ORIENTATION_STYLES = {
    overlay: `
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
    `,
    icon: 'font-size: 58px; animation: rotateHint 2s infinite;',
    title: 'font-size: 20px; font-weight: bold;',
    subtitle: 'font-size: 14px; opacity: 0.6;',
}

const KEYFRAME_CSS = `
    @keyframes rotateHint {
        0%   { transform: rotate(0deg); }
        25%  { transform: rotate(90deg); }
        50%  { transform: rotate(90deg); }
        75%  { transform: rotate(0deg); }
        100% { transform: rotate(0deg); }
    }
`

// Создание элемента overlay
function createOverlay() {
    const overlay = document.createElement('div')
    overlay.id = ORIENTATION_IDS.OVERLAY
    overlay.style.cssText = ORIENTATION_STYLES.overlay
    overlay.innerHTML = `
        <div style="${ORIENTATION_STYLES.icon}">📱</div>
        <div style="${ORIENTATION_STYLES.title}">Переверните телефон</div>
        <div style="${ORIENTATION_STYLES.subtitle}">Игра доступна только в портретном режиме</div>
    `
    return overlay
}

// Основная функция управления ориентацией
const orientationChange = () => {
    // Добавляем keyframe стиль (проверяем, чтобы не дублировать)
    if (!document.getElementById(ORIENTATION_IDS.STYLE)) {
        const style = document.createElement('style')
        style.id = ORIENTATION_IDS.STYLE
        style.textContent = KEYFRAME_CSS
        document.head.appendChild(style)
    }

    function handleOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight
        const existingOverlay = document.getElementById(ORIENTATION_IDS.OVERLAY)

        if (isLandscape && !existingOverlay) {
            document.body.appendChild(createOverlay())
        } else if (!isLandscape && existingOverlay) {
            existingOverlay.remove()
        }
    }

    // Инициализация и подписка на события
    handleOrientation()
    window.addEventListener('orientationchange', handleOrientation)
    window.addEventListener('resize', handleOrientation)

    // Функция очистки (для использования в useEffect)
    return () => {
        window.removeEventListener('orientationchange', handleOrientation)
        window.removeEventListener('resize', handleOrientation)
        document.getElementById(ORIENTATION_IDS.OVERLAY)?.remove()
    }
}

export default orientationChange


// const orientationChange = () => {
            
    
//             const style = document.createElement('style')
//             style.id = 'orientation-style'
//             style.textContent = `
//                 @keyframes rotateHint {
//                     0%   { transform: rotate(0deg); }
//                     25%  { transform: rotate(90deg); }
//                     50%  { transform: rotate(90deg); }
//                     75%  { transform: rotate(0deg); }
//                     100% { transform: rotate(0deg); }
//                 }
//             `
//             document.head.appendChild(style)
    
//             function handleOrientation() {
//                 const isLandscape = window.innerWidth > window.innerHeight
//                 let overlay = document.getElementById('orientation-overlay')
    
//                 if (isLandscape) {
//                     if (!overlay) {
//                         overlay = document.createElement('div')
//                         overlay.id = 'orientation-overlay'
//                         overlay.style.cssText = `
//                             position: fixed;
//                             top: 0; left: 0;
//                             width: 100%; height: 100%;
//                             background: rgba(0, 0, 0, 0.95);
//                             z-index: 99999;
//                             display: flex;
//                             flex-direction: column;
//                             align-items: center;
//                             justify-content: center;
//                             color: white;
//                             font-family: Arial, sans-serif;
//                             text-align: center;
//                             gap: 12px;
//                         `
//                         overlay.innerHTML = `
//                             <div style="font-size: 58px; animation: rotateHint 2s infinite;">📱</div>
//                             <div style="font-size: 20px; font-weight: bold;">Переверните телефон</div>
//                             <div style="font-size: 14px; opacity: 0.6;">Игра доступна только в портретном режиме</div>
//                         `
//                         document.body.appendChild(overlay)
//                     }
//                 } else {
//                     overlay?.remove()
//                 }
//             }
    
//             handleOrientation()
//             window.addEventListener('orientationchange', handleOrientation)
//             window.addEventListener('resize', handleOrientation)
    
//             return () => {
//                 window.removeEventListener('orientationchange', handleOrientation)
//                 window.removeEventListener('resize', handleOrientation)
//                 document.getElementById('orientation-overlay')?.remove()
//                 document.getElementById('orientation-style')?.remove()
//             }
// }


// export default orientationChange