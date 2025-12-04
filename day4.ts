import { preParse } from "./tools.ts";
const exampleInp = preParse(`..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`, x=>x==='@'?1:0, '\n', '')

const inp = preParse(Deno.readTextFileSync('./day4.txt'), x=>x==='@'?1:0, '\n', '')

function convolve<T>(matrix:number[][], kernel:number[][], map:(old:number, acc:number) => T){
    const offsetX = Math.floor(kernel[0].length/2)
    const offsetY = Math.floor(kernel.length/2)
    const result:T[][] = []
    for(let y=0; y<matrix.length; y++){
        result[y] = []
        for(let x=0; x<matrix[y].length; x++){
            let acc = 0 
            for(let yy=0; yy<kernel.length; yy++){
                for(let xx=0; xx<kernel[yy].length; xx++){
                    acc += (matrix?.[y+yy-offsetY]?.[x+xx-offsetX] ?? 0)*kernel[yy][xx]
                }
            }
            result[y][x] = map(matrix[y][x], acc)
        }
    }
    return result
}

function sum(inp:number[][]){
    let acc = 0 
    for(let y=0; y<inp.length; y++){
        for(let x=0; x<inp[y].length; x++){
            acc += inp[y][x]
        }
    }
    return acc
}
function display(inp:number[][], map:(old:number) => string){
    let acc = ""
    for(let y=0; y<inp.length; y++){
        for(let x=0; x<inp[y].length; x++){
            acc += map(inp[y][x])
        }
        acc += '\n'
    }
    return acc
}

function part1(inp:number[][]){
    const countBefore = sum(inp)
    const matrix = convolve(inp, [[1,1,1],[1,0,1],[1,1,1]], (old, acc)=>old*acc>3?1:0)
    const countAfter = sum(matrix)
    return countBefore-countAfter
}

function part2(inp:number[][]){
    let lastCount = -1
    let count = sum(inp)
    let change = lastCount-count
    let matrix = inp
    let totalRemoved = 0
    while(change !== 0){
        lastCount = count
        matrix = convolve(matrix, [[1,1,1],[1,0,1],[1,1,1]], (old, acc)=> old*acc>3?1:0)
        count = sum(matrix)
        change = lastCount-count
        totalRemoved += change
    }
    return totalRemoved
}

console.log(part1(inp))
console.log(part2(inp))