import { preParse } from "./tools.ts"
const [example_str_ranges, example_str_ids] = preParse(`3-5
10-14
16-20
12-18

1
5
8
11
17
32`, x=>x, "\n\n", "\n")
const example_ranges = example_str_ranges.map(x => x.split('-').map(Number)) as [number, number][]
const example_ids = example_str_ids.map(Number)

const [str_ranges, str_ids] = preParse(Deno.readTextFileSync('./day5.txt'), x=>x, "\n\n", "\n")
const ranges = str_ranges.map(x => x.split('-').map(Number)) as [number, number][]
const ids = str_ids.map(Number)

export const exampleParsedInput = [example_ranges, example_ids]
export const parsedInput = [ranges, ids] as [[number, number][], number[]]

export function part1(ranges:[number,number][], ids:number[]){
    let sum = 0
    for(const id of ids){
        if(ranges.find(([low, high])=> id >= low && id <= high)){
            sum += 1
        }
    }
    return sum
}


export function part2(ranges:[number, number][]){
    ranges.sort(([a,_],[b,__])=> a-b)
    
    let [lastLow, lastHigh] = ranges[0]
    let sum = 0
    for(const [low, high] of ranges){
        if(lastHigh < low){ // case 1
            sum += lastHigh-lastLow+1
            lastLow = low
            lastHigh = high
        }else if(lastHigh < high){ // case 2
            lastHigh = high
            //lastLow = lastLow
        } // case 3
        //lastHigh = lastHigh
        //lastLow = lastLow
    }
    return sum + lastHigh - lastLow +  1
}

if (import.meta.url === Deno.mainModule) {
    console.log(part1(example_ranges, example_ids))
    console.log(part1(ranges, ids))
    console.log(part2(ranges))
}