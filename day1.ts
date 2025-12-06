export function part1(inp:string[]){
    let zeros = 0
    let sum = 50
    for(const text of inp){
        if(text.startsWith('R')){
            sum = (sum+Number(text.substring(1)))%100
        }else{
            sum = (sum-Number(text.substring(1))+100)%100
        }
        if(sum === 0){
            zeros += 1
        }
    }
    return zeros
}

export function part2(inp:string[]){
    let zeros = 0
    let sum = 50
    for(const text of inp){
        const dir = text.startsWith('R')
        const amount = Number(text.substring(1))
        for (let i = 0; i < amount; i++) {
            if(dir){
                sum = (sum+1)%100
            }else{
                sum = (sum-1+100)%100 
            }
            if(sum === 0){
                zeros += 1
            }
        }
    }
    return zeros
}
export const exampleInput = ['L68', 'L30', 'R48', 'L5', 'R60', 'L55', 'L1', 'L99', 'R14', 'L82']
export const parsedInput = Deno.readTextFileSync('./day1.txt').split('\n').filter(x => x)


if (import.meta.url === Deno.mainModule) {
    console.log(part1(exampleInput))
    console.log(part1(parsedInput))

    console.log(part2(exampleInput))
    console.log(part2(parsedInput))
}