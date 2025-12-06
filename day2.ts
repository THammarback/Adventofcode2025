import { preParse } from "./tools.ts"
const ranges = preParse(Deno.readTextFileSync('./day2.txt'), Number, ',', '-') as [number, number][]

export function part1(ranges:[number, number][]){
    let sum = 0
    for(const [start, stop] of ranges){
        for(let id=start; id<=stop; id++){
            const idStr = id.toString()
            if(idStr.length % 2 !== 0){
                continue
            }
            const half = idStr.length/2
            let double = true
            for(let j=0; j<half; j++){
                if(idStr[j] !== idStr[half+j]){
                    double = false
                    break
                }
            }
            if(double){
                sum += id
            }
        }
    }
    return sum
}

export function part2(ranges:[number, number][]){
    let sum = 0
    for(const [start, stop] of ranges){
        for(let id=Math.max(start, 10); id<=stop; id++){ // skip single digit numbers with math.max
            const idStr = id.toString()
            const half = Math.ceil(idStr.length/2)
            for(let j=1; j<=half; j++){
                const needle = idStr.substring(0,j)
                if(idStr.split(needle).every(x => x === "")){
                    sum += id
                    break
                }
            }
        }
    }
    return sum
}

export const parsedInput = ranges

if (import.meta.url === Deno.mainModule) {
    const result1 = part1(ranges)
    const result2 = part2(ranges)
    console.log(result1, result1 === 34826702005)
    console.log(result2, result2 === 43287141963)
}

