import { Howl } from 'howler'

const bgMusic = new Howl({
    src: ['/sounds/music.mp3'],
    loop: true,
    volume: 0.5,
})

const ballHit = new Howl({
    src: ['/sounds/ball-hit.mp3'],
    volume: 1,
})

export const clips = {
    bgMusic,
    ballHit,
}