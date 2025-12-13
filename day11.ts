
function parse(inp:string){
    return inp.split('\n').reduce<Record<string, Set<string>>>((acc, row)=>{
        const [key, values] = row.split(':')
        acc[key.trim()] = new Set(values.split(' ').filter(x=>x))
        return acc
    }, {})
}

const exampleInput = parse(`aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`)

const exampleInput2 = parse(`svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`)

export const parsedInput = parse(Deno.readTextFileSync('./day11.txt'))

function countPaths(graph: Record<string, Set<string>>, start: string, end: string): number {
    const memo:Record<string, number> = {}
    
    function dfs(node: string): number {
        if(node in memo){
            return memo[node]
        }
        if (node === end) {
            memo[node] = 1
            return 1;
        }
        
        let paths = 0;
        
        for (const neighbor of graph[node] ?? []) {
            paths += dfs(neighbor);
            
        }
        memo[node] = paths
        return paths;
    }
    
    return dfs(start);
}

export function part1(inp:Record<string, Set<string>>){
    return countPaths(inp, 'you', 'out')
}

export function part2(inp:Record<string, Set<string>>){
    return countPaths(inp, 'svr', 'fft') * countPaths(inp, 'fft', 'dac') * countPaths(inp, 'dac', 'out')+
           countPaths(inp, 'svr', 'dac') * countPaths(inp, 'dac', 'fft') * countPaths(inp, 'fft', 'out')
}


if(import.meta.url === Deno.mainModule){    
    console.log(part1(exampleInput))
    console.log(part1(parsedInput))
    
    console.log(part2(exampleInput2))
    console.log(part2(parsedInput))
}