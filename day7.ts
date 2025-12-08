import { preParse } from "./tools.ts"

const exampleInput = preParse(`.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`, x=>x, '\n','')
export const parsedInput = preParse(Deno.readTextFileSync('./day7.txt'), x=>x, '\n', '')


function display(rows:Map<number, number>[] | Set<number>[], grid:string[][]){
    let str = ""
    for(const [y, row] of rows.entries()){
        for(let x=0; x<grid[0].length; x++){
            if(row.has(x) && grid[y][x] === '^'){
                throw Error("Overlap!")
            }else if(row.has(x)){
                if("get" in row){
                    str += row.get(x)!.toString(16)
                }else{
                    str += '|'
                }
            }else if(grid[y][x] === '^'){
                str += '^'
            }else{
                str += '.'
            }
        }
        str += '\n'
    }
    return str
}

export function part1(grid:string[][]){
    const height = grid.length
    const start = grid[0].indexOf('S')
    const rows: Set<number>[] = []
    let splits = 0
    for (let i = 0; i < height; i++) {
        rows.push(new Set());
    }
    rows[0].add(start)
    for(let y=1; y<height; y++){
        for(const x of rows[y-1].values()){
            if(grid[y][x] === '^'){
                splits += 1
                rows[y].add(x+1)
                rows[y].add(x-1)
            }else{
                rows[y].add(x)
            }
        }
    }
    // console.log(display(rows, grid))
    return splits
}



export function part2(grid:string[][]){
    const height = grid.length
    const start = grid[0].indexOf('S')
    const rows: Map<number, number>[] = []

    for (let i = 0; i < height; i++) {
        rows.push(new Map());
    }

    rows[0].set(start, 1)
    for(let y=1; y<height; y++){
        for(const [x, parentValue] of rows[y-1].entries()){
            if(grid[y][x] === '^'){
                rows[y].set(x+1, (rows[y].get(x+1) ?? 0) + parentValue)
                rows[y].set(x-1, (rows[y].get(x-1) ?? 0) + parentValue)
            }else{
                rows[y].set(x, (rows[y].get(x)??0) + parentValue)
            }
        }
    }
    // console.log(display(rows, grid))
    return rows.at(-1)?.values().reduce((acc, curr) => acc+curr)!
}

if (import.meta.url === Deno.mainModule) {
    console.log(part1(exampleInput))
    console.log(part1(parsedInput))

    console.log(part2(exampleInput))
    console.log(part2(parsedInput))
}