// const banks = ["987654321111111","811111111111119","234234234234278","818181911112111"].map(x => x.split('').map(Number))
const banks = Deno.readTextFileSync("./day3.txt").split('\n').map(x => x.split('').map(Number))

function part1(banks:number[][]){
    let sum = 0
    for(const bank of banks){
        let max1 = bank[0]
        let max2 = bank[1]
        for(let i=1; i<bank.length-1; i++){
            if(bank[i] > max1){
                max1 = bank[i]
                max2 = bank[i+1] 
            }
            if(bank[i+1] > max2){
                max2 = bank[i+1]
            }
        }
        sum += 10*max1+max2
    }
    return sum
}
console.log(part1(banks))

function indexOfMax(arr:number[]){
    let max = -Infinity
    let index = -1
    for(const [i, n] of arr.entries()){
        if(n > max){
            max = n
            index = i
        }
    }
    return index
}

function part2(banks:number[][], amount:number){
    let sum = 0
    for(const bank of banks){
        let joltage = ""
        let index = 0
        for(let j=0; j<amount; j++){
            index += indexOfMax(bank.slice(index, bank.length-amount+j+1))
            joltage += bank[index++]
        }
        sum += Number(joltage)
    }
    return sum
}
console.log(part2(banks, 2))
console.log(part2(banks, 12))