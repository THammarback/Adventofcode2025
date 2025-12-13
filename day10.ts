import { preParse } from "./tools.ts";

type Machine = {
    indicatorLights: boolean[];
    buttonWiring: number[][];
    joltageRequirements: number[];
};


function parse(line: string): Machine {
    const indicatorLights = line
            .match(/\[([.#]+)\]/)?.[1]
            ?.split("")
            .map((item) => item === "#") ?? [];
    const buttonWiring = line
        .matchAll(/\(([0-9,]+)\)/g)
        .map((item) => item[1] ?? "")
        .map((item) => item.split(",").map((element) => parseInt(element, 10)))
        .toArray();
    const joltageRequirements =
        line
            .match(/\{([0-9,]+)\}/)?.[1]
            ?.split(",")
            .map((item) => parseInt(item, 10)) ?? [];

    return {
        indicatorLights,
        buttonWiring,
        joltageRequirements,
    };
}

export const exampleInput = preParse(`[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`, parse, '\n')
export const parsedInput = preParse(Deno.readTextFileSync('day10.txt'), parse, '\n')

function solveMinimumHammingWeight(matrix: number[][], target: number[]){
    const M = matrix.length
    const N = matrix[0].length
    const aug = matrix.map((row, i) => [...row, target[i]!]);

    let pivotRow = 0;
    const pivotColumns: number[] = [];
    const columnsWhichArePivots = new Array(N).fill(false);
    const pivotRowForColumnsMap = new Map<number, number>();

    for (let j = 0; j < N && pivotRow < M; j++) {
        let candidate = pivotRow;
        while (candidate < M && aug[candidate]![j] === 0) {
            candidate++;
        }
        if (candidate === M) {
            continue;
        }
        [aug[pivotRow], aug[candidate]] = [aug[candidate], aug[pivotRow]];

        for (let i = 0; i < M; i++) {
            if (i !== pivotRow && aug[i]![j] === 1) {
                for (let k = j; k <= N; k++) {
                    aug[i]![k]! ^= aug[pivotRow]![k] ?? 0;
                }
            }
        }

        pivotColumns.push(j);
        columnsWhichArePivots[j] = true;
        pivotRowForColumnsMap.set(j, pivotRow);
        pivotRow++;
    }

    for (let i = pivotRow; i < M; i++) {
        if (aug[i]![N] === 1) {
            return -1;
        }
    }

    const freeColumns: number[] = [];
    for (let j = 0; j < N; j++) {
        if (!columnsWhichArePivots[j]) {
            freeColumns.push(j);
        }
    }

    const numberOfFreeColumns = freeColumns.length;

    let minimumNumberOfPresses = Infinity;
    const totalIterations = 1 << numberOfFreeColumns;
    const solution = new Array(N).fill(0);

    for (let i = 0; i < totalIterations; i++) {
        let currentPresses = 0;

        for (let k = 0; k < numberOfFreeColumns; k++) {
            const value = (i >> k) & 1;
            const freeColumnCandidate = freeColumns[k]!;
            solution[freeColumnCandidate] = value;

            if (value) {
                currentPresses++;
            }
        }

        for (let index = pivotColumns.length - 1; index >= 0; index--) {
            const pivotColumnCandidate = pivotColumns[index]!;
            const row = pivotRowForColumnsMap.get(pivotColumnCandidate)!;
            let value = aug[row]![N]!;

            for (const freeColumnCandidate of freeColumns) {
                if (aug[row]![freeColumnCandidate] === 1) {
                    value ^= solution[freeColumnCandidate]!;
                }
            }

            solution[pivotColumnCandidate] = value;
            if (value) {
                currentPresses++;
            }
        }

        if (currentPresses < minimumNumberOfPresses) {
            minimumNumberOfPresses = currentPresses;
        }
    }

    return minimumNumberOfPresses;
}


function solveRestrictedSystem( matrix: number[][], target: number[], bounds: number[]) {
    const matrixCopy = matrix.map((row) => [...row]);
    const rhs = [...target];

    const pivotColumnIndices: number[] = [];

    let pivotRow = 0;
    const columnToPivotRow = new Map<number, number>();

    for (let columnIndex = 0; columnIndex < matrix[0].length && pivotRow < matrix.length; columnIndex++) {
        let rowSelection = pivotRow;
        while (rowSelection < matrix.length && Math.abs(matrixCopy[rowSelection]![columnIndex]!) < 1e-9) {
            rowSelection++;
        }

        if (rowSelection === matrix.length) {
            continue;
        }

        [matrixCopy[pivotRow], matrixCopy[rowSelection]] = [matrixCopy[rowSelection]!, matrixCopy[pivotRow]!];
        [rhs[pivotRow], rhs[rowSelection]] = [rhs[rowSelection]!, rhs[pivotRow]!];

        const pivotVal = matrixCopy[pivotRow]![columnIndex]!;
        for (let j = columnIndex; j < matrix[0].length; j++) {
            matrixCopy[pivotRow]![j]! /= pivotVal;
        }
        rhs[pivotRow]! /= pivotVal;

        for (let i = 0; i < matrix.length; i++) {
            if (i !== pivotRow) {
                const factor = matrixCopy[i]![columnIndex]!;
                if (Math.abs(factor) > 1e-9) {
                    for (let j = columnIndex; j < matrix[0].length; j++) {
                        matrixCopy[i]![j]! -= factor * matrixCopy[pivotRow]![j]!;
                    }

                    rhs[i]! -= factor * rhs[pivotRow]!;
                }
            }
        }

        pivotColumnIndices.push(columnIndex);
        columnToPivotRow.set(columnIndex, pivotRow);
        pivotRow++;
    }

    const freeVariables: number[] = [];
    const isPivot = new Set(pivotColumnIndices);

    for (let j = 0; j < matrix[0].length; j++) {
        if (!isPivot.has(j)) {
            freeVariables.push(j);
        }
    }

    for (let i = pivotRow; i < matrix.length; i++) {
        if (Math.abs(rhs[i]!) > 1e-4) {
            return 0;
        }
    }

    let minimumPresses = Infinity;
    const currentSolution = new Array(matrix[0].length).fill(0);

    function search(freeVarListIdx: number, currentCost: number){
        if (currentCost >= minimumPresses) {
            return;
        }

        if (freeVarListIdx === freeVariables.length) {
            let derivedCost = currentCost;
            let possible = true;

            for (let i = pivotColumnIndices.length - 1; i >= 0; i--) {
                const pivotColumnIndex = pivotColumnIndices[i]!;
                const pivotRowIndex = columnToPivotRow.get(pivotColumnIndex)!;

                let derivedValue = rhs[pivotRowIndex]!;

                for (let j = pivotColumnIndex + 1; j < matrix[0].length; j++) {
                    if (Math.abs(matrixCopy[pivotRowIndex]![j]!) > 1e-9) {
                        derivedValue -= matrixCopy[pivotRowIndex]![j]! * currentSolution[j]!;
                    }
                }

                if (Math.abs(derivedValue - Math.round(derivedValue)) > 1e-4) {
                    possible = false;
                    break;
                }
                derivedValue = Math.round(derivedValue);

                if (derivedValue < 0) {
                    possible = false;
                    break;
                }

                if (derivedValue > bounds[pivotColumnIndex]!) {
                    possible = false;
                    break;
                }

                currentSolution[pivotColumnIndex] = derivedValue;
                derivedCost += derivedValue;
                if (derivedCost >= minimumPresses) {
                    possible = false;
                    break;
                }
            }

            if (possible) {
                minimumPresses = derivedCost;
            }

            return;
        }

        const freeVariableIndex = freeVariables[freeVarListIdx]!;
        const freeVariableBound = bounds[freeVariableIndex]!;

        for (let val = 0; val <= freeVariableBound; val++) {
            currentSolution[freeVariableIndex] = val;
            search(freeVarListIdx + 1, currentCost + val);
        }
    };

    search(0, 0);
    return minimumPresses === Infinity ? 0 : minimumPresses;
}



export function part1(inp: Machine[]) {
    let sum = 0
    for(const machine of inp){
        const matrix: number[][] = Array(machine.indicatorLights.length).fill(0)
            .map(() => Array(machine.buttonWiring.length).fill(0));

        for (let j = 0; j < machine.buttonWiring.length; j++) {
            const wiring = machine.buttonWiring[j];
            if (wiring === undefined) {
                continue;
            }

            for (const lightIndex of wiring) {
                if (lightIndex < machine.indicatorLights.length) {
                    matrix[lightIndex]![j] = 1;
                }
            }
        }

        const target = machine.indicatorLights.map((item) => (item ? 1 : 0));
        sum += solveMinimumHammingWeight(matrix, target);
    }
    return sum
}

export function part2(inp: Machine[]) {
    let sum = 0
    for(const machine of inp){
        const matrix: number[][] = Array(machine.joltageRequirements.length).fill(0)
            .map(() => Array(machine.buttonWiring.length).fill(0));

        const strictBounds = new Array(machine.buttonWiring.length).fill(Infinity);

        for (let j = 0; j < machine.buttonWiring.length; j++) {
            const wiring = machine.buttonWiring[j];
            if (wiring !== undefined && wiring.length > 0) {
                for (const item of wiring) {
                    if (item < machine.joltageRequirements.length) {
                        matrix[item]![j] = 1;
                        if (machine.joltageRequirements[item]! < strictBounds[j]!) {
                            strictBounds[j] = machine.joltageRequirements[item]!;
                        }
                    }
                }
            } else {
                strictBounds[j] = 0;
            }
        }

        for (let j = 0; j < machine.buttonWiring.length; j++) {
            if (strictBounds[j] === Infinity) {
                strictBounds[j] = 0;
            }
        }
        const target = [...machine.joltageRequirements];
        sum += solveRestrictedSystem(matrix, target, strictBounds);
    }
    return sum
}

if(import.meta.url === Deno.mainModule){
    console.log(part1(exampleInput))
    console.log(part1(parsedInput))
    console.log(part2(exampleInput))
    console.log(part2(parsedInput))
}