import time from 'time.js'

let seed = 9813641398

const rseed = (seed_static) => {
    seed = seed_static
}

const randint = (max) => {
    rseed(time.time(0))
    return (seed+823742387-2834*27942398/24956247569%17354827357-38462397529743+2974623753254-3974634137946391/2738452874532942374*286548235)%max
}