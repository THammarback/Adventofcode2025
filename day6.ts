import { preParse, transpose } from "./tools.ts"
const exampleInputString = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `

const inputString = Deno.readTextFileSync('./day6.txt') 

function part1(inp: string){
    const parsedInput = preParse(inp, x => x, '\n', ' ')

    let sum = 0
    const numberlists = parsedInput.slice(0, -1).map(row => row.map(Number))
    const operators = parsedInput.at(-1)!

    for(const [rowIndex, operator] of operators.entries()){
        let partialSum = operator==='*' ? 1 : 0
        for(let columnIndex = 0; columnIndex<numberlists.length; columnIndex++){
            switch(operator){
                case '+':
                    partialSum += numberlists[columnIndex][rowIndex]
                    break
                case '*':
                    partialSum *= numberlists[columnIndex][rowIndex]
                    break
            }
        }
        sum += partialSum
    }

    return sum
}

function part2(inp:string){
    const transposedInput = transpose(preParse(inp, x=>x, '\n', ''))
    const operators = ['+', '*'] as const
    function isOperator(x:unknown): x is typeof operators[number]{
        return operators?.includes(x as typeof operators[number])
    }
    let operator: typeof operators[number] | undefined = undefined

    let partialSum = 0
    let sum = 0
    for(const row of transposedInput){
        const rowValue = row.slice(0, -1).join('').trim()
        if(rowValue === ""){
            continue
        }
        const rowNumber = Number(rowValue)
        const newOperator = row.at(-1)
        if(isOperator(newOperator)){
            operator = newOperator
            sum += partialSum
            partialSum = operator==='*'?1:0
        }

        switch(operator){
            case '*':
                partialSum *= rowNumber
                break
            case '+':
                partialSum += rowNumber
                break
            case undefined:
            default:
                throw Error()
        }
    }
    return sum+partialSum
}


console.log(part1(exampleInputString))
console.log(part1(inputString))

console.log(part2(exampleInputString))
console.log(part2(inputString))

