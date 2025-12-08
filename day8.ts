import { preParse } from "./tools.ts";

export const exampleInput: [number, number, number][] = [
[162,817,812],
[57,618,57],
[906,360,560],
[592,479,940],
[352,342,300],
[466,668,158],
[542,29,236],
[431,825,988],
[739,650,466],
[52,470,668],
[216,146,977],
[819,987,18],
[117,168,530],
[805,96,715],
[346,949,466],
[970,615,88],
[941,993,340],
[862,61,35],
[984,92,344],
[425,690,689]]

export const parsedInput = preParse(Deno.readTextFileSync('./day8.txt'), Number, '\n', ',')

export function solve(ps:number[][], amount:number = Infinity){
    const distanceMap: {dist:number, id:[number, number]}[] = []
    const connectionGraphs: Set<number>[] = []
    for (let i = 0; i < ps.length; i++) {
        for (let j = i+1; j < ps.length; j++) {
            let dist = 0
            for(let k = 0; k< ps[i].length; k++){
                dist += (ps[i][k]-ps[j][k])*(ps[i][k]-ps[j][k]) // squared distance
            }
            distanceMap.push({dist, id:[i,j]})
        }
    }
    distanceMap.sort(({dist:a}, {dist:b}) => a-b)
    for (let i=0; i<amount && distanceMap[i]; i++){
        const {id:[id1, id2]} = distanceMap[i]

        let found1: number|undefined = undefined
        let found2: number|undefined = undefined
        for(const [i, connectionGraph] of connectionGraphs.entries()){
            if(connectionGraph.has(id1)){
                found1 = i
            }
            if(connectionGraph.has(id2)){
                found2 = i
            }
        }
        if(found1 !== undefined && found1 === found2){
            continue
        }else if(found1 !== undefined && found2 !== undefined){
            for(const id of connectionGraphs[found2]){
                connectionGraphs[found1].add(id)
            }
            connectionGraphs.splice(found2, 1)
        }else if(found1 !== undefined){ //&& found2 === undefined
            connectionGraphs[found1].add(id2)
        }else if(found2 !== undefined){ //&& found1 === undefined
            connectionGraphs[found2].add(id1)
        }else{ //(found1 === undefined && found2 === undefined)
            connectionGraphs.push(new Set([id1, id2]))
        }

        if(connectionGraphs.length === 1 && connectionGraphs[0].size === ps.length){
            return ps[id1][0]*ps[id2][0]
        }
    }
    const lengths = connectionGraphs.map(x => x.size).sort((a,b)=>b-a)
    return lengths[0]*lengths[1]*lengths[2]
}

if (import.meta.url === Deno.mainModule) {
    console.log('part 1 example:', solve(exampleInput, 10))
    console.log('part 1:', solve(parsedInput, 1000))

    console.log('part 2 example:', solve(exampleInput))
    console.log('part 2:', solve(parsedInput))
}