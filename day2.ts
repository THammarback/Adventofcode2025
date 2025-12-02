const ranges = Deno.readTextFileSync('./day2.txt').split(',')

function part1(ranges:string[]){
    let sum = 0
    for(const range of ranges){
        const [start, stop] = range.split('-').map(Number)
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
console.log(part1(ranges))

function part2(ranges:string[]){
    let sum = 0
    for(const range of ranges){
        const [start, stop] = range.split('-').map(Number)
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

console.log(part2(ranges))
