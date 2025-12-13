import { preParse } from "./tools.ts";
function parse(inputStr:string){
    const parts = inputStr.split('\n\n')
    const areasStr = parts.pop()
    const shapes = parts.map(indexAndShape => {
        const [_, part] = indexAndShape.split(':')
        const map = part.trim().split('\n').map(x=> x.split(''))
        const allVersions: [[boolean, boolean, boolean],[boolean, boolean, boolean],[boolean, boolean, boolean]][] = [
            [[false,false,false],[false,false,false],[false,false,false]],
            [[false,false,false],[false,false,false],[false,false,false]],
            [[false,false,false],[false,false,false],[false,false,false]],
            [[false,false,false],[false,false,false],[false,false,false]],
            [[false,false,false],[false,false,false],[false,false,false]],
            [[false,false,false],[false,false,false],[false,false,false]],
            [[false,false,false],[false,false,false],[false,false,false]],
            [[false,false,false],[false,false,false],[false,false,false]]
        ]
        for(let y=0; y<3; y++){
            for(let x=0; x<3; x++){
                if(map[y][x] === '#'){
                    allVersions[0][y][x] = true
                    allVersions[1][x][y] = true
                    allVersions[2][2-y][x] = true
                    allVersions[3][x][2-y] = true
                    allVersions[4][y][2-x] = true
                    allVersions[5][2-x][y] = true
                    allVersions[6][2-y][2-x] = true
                    allVersions[7][2-x][2-y] = true
                }
            }
        }
        return allVersions.reduce<Map<string, [number, number, number]>>((set, version)=>{
            set.set(
                version.map(row=> row.map(x=>x?'#':'.').join('')).join(' '),
                version.map(row => row.reduce((n, cell, i) => n | (cell ? 1 << (2-i) : 0), 0)) as [number, number, number]
            )
            return set
        },new Map())
        
    })
   
    const areas:{size:[number, number], counts:number[]}[] = []
    for(const area of areasStr?.split('\n') || []){
        const [sizeStr, counts] = area.split(':')
        areas.push({size:sizeStr.split('x').map(Number) as [number, number], counts:counts.split(' ').map(Number)})
    }
    return {shapes, areas}
}

function quickFind([size, amounts]:string[]){
    return amounts.split(' ').map(Number).reduce((s,x)=>x+s)*9 <= size.split('x').map(Number).reduce((acc,x)=>acc*x)
}

export function part1(inp:string[][][]){
    return inp.pop()!.map(quickFind).filter(Boolean).length
}

export const exampleInput = preParse(`4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`, x=>x, '\n\n', '\n', ':')
export const parsedInput = preParse(Deno.readTextFileSync('day12.txt'), x=>x, '\n\n', '\n', ':')

if(import.meta.url === Deno.mainModule){
    console.log(part1(exampleInput))
    console.log(part1(parsedInput))
}