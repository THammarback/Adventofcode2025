import { part1 as part1Day1, part2 as part2Day1, parsedInput as parsedInputDay1 } from "./day1.ts";
import { part1 as part1Day2, part2 as part2Day2, parsedInput as parsedInputDay2 } from "./day2.ts";
import { part1 as part1Day3, part2 as part2Day3, parsedInput as parsedInputDay3 } from "./day3.ts";
import { part1 as part1Day4, part2 as part2Day4, parsedInput as parsedInputDay4 } from "./day4.ts";
import { part1 as part1Day5, part2 as part2Day5, parsedInput as parsedInputDay5 } from "./day5.ts";
import { part1 as part1Day6, part2 as part2Day6, inputString as inputStringDay6 } from "./day6.ts";

function log<T extends (...args:any[])=>number >(day: number, part: number, func: T, ...args: Parameters<T>):string{
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    const time = (end - start).toFixed(3); // Time in milliseconds, fixed to 3 decimal places
    return `Day ${day} - part ${part}: (${time} ms) ${result}`
};

console.log(log(1, 1, part1Day1, parsedInputDay1))
console.log(log(1, 2, part2Day1, parsedInputDay1))
console.log(log(2, 1, part1Day2, parsedInputDay2))
console.log(log(2, 2, part2Day2, parsedInputDay2))
console.log(log(3, 1, part1Day3, parsedInputDay3[0]))
console.log(log(3, 2, part2Day3, ...parsedInputDay3))
console.log(log(4, 1, part1Day4, parsedInputDay4))
console.log(log(4, 2, part2Day4, parsedInputDay4))
console.log(log(5, 1, part1Day5, ...parsedInputDay5))
console.log(log(5, 2, part2Day5, parsedInputDay5[0]))
console.log(log(6, 1, part1Day6, inputStringDay6))
console.log(log(6, 2, part2Day6, inputStringDay6))

