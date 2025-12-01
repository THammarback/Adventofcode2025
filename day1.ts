function sumZeros(inp:string[], sum:number){
    let zeros = 0
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

console.log(sumZeros(['L68', 'L30', 'R48', 'L5', 'R60', 'L55', 'L1', 'L99', 'R14', 'L82'], 50))
console.log(sumZeros(Deno.readTextFileSync('./day1.txt').split('\r\n').filter(x => x), 50))

function sumZeros2(inp:string[], sum:number){
    let zeros = 0
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

console.log(sumZeros2(['L68', 'L30', 'R48', 'L5', 'R60', 'L55', 'L1', 'L99', 'R14', 'L82'], 50))
console.log(sumZeros2(Deno.readTextFileSync('./day1.txt').split('\r\n').filter(x => x), 50))
