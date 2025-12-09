import { preParse } from "./tools.ts";

const exampleInput = [
    {x:7,y:1},
    {x:11,y:1},
    {x:11,y:7},
    {x:9,y:7},
    {x:9,y:5},
    {x:2,y:5},
    {x:2,y:3},
    {x:7,y:3},
]

export const parsedInput = preParse(Deno.readTextFileSync('./day9.txt'), (row)=>{
    const [x, y] = row.split(',').map(Number)
    return {x,y}
}, '\n')


export function part1(coords:{x:number, y:number}[]){
    let max = 0
    for (let i = 0; i < coords.length; i++) {
        for (let j = i+1; j < coords.length; j++) {
            max = Math.max(max, Math.abs(
                (coords[i].x-coords[j].x+1)*
                (coords[i].y-coords[j].y+1)
            ))
        }
    }
    return max
}

/*
     (x,y)    (X, y)
      #---------*----------# (x,y)     
      |                    |
(x,Y0)*---------# (X,Y0)   * (x,Y0)
                |          |
(x,Y1)*---------# (X,Y1)   * (x,Y1)
      |                    |
      #---------*----------#(x,y)     
     (x,y)    (X, y)
*/

export function part2(coords: {x:number, y:number}[], X:number=94808, Y0:number=48629, Y1:number=50147){
    let minY = -1
    let maxY = -1

    for(let i=0, j=coords.length-1; i<coords.length; j=i++){
        if(coords[i].y === coords[j].y){ // only horizontal lines
            if( coords[i].x <= X && X <= coords[j].x ||
                coords[j].x <= X && X <= coords[i].x ){
                if(coords[i].y < Y0){
                    minY = coords[i].y
                }
                if(coords[i].y > Y1){
                    maxY = coords[i].y
                }
            }
        }
    }

    let max = -1
    for(const {x,y} of coords){
        if(minY <= y && y <= maxY && x < X){
            if(y<Y0){
                max = Math.max(max, (X-x+1)*(Y0-y+1))
            }else{
                max = Math.max(max, (X-x+1)*(y-Y1+1))
            }
        }
    }
    return max
}

if(import.meta.url === Deno.mainModule){
    console.log(part1(exampleInput))
    console.log(part1(parsedInput))
    console.log("Part 2 does not work with example input")
    console.log(part2(parsedInput))
}
