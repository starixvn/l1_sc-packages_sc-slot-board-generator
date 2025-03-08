import { append, clone, curry, reduce, repeat } from "ramda";
import { randomInt } from "node:crypto";

export function shuffleN<T>(shuffle: (a: T[]) => T[], times: number, input: T[]) {
    return reduce((result, fn: (a: T[]) => T[]) => fn(result), input, repeat(shuffle, times));
}

function replaceInternal(truly: (a: any) => boolean, replacement: any, input: any[]): any[] {
    return reduce((result, element) => append(truly(element) ? replacement : element, result), [] as any[], input);
}

function replaceEachInternal(truly: (a: any) => boolean, replacements: any[], input: any[]): any[] {
    const result = clone(input);
    let replacementIndex = 0;

    for (let i = 0; i < input.length; i++) {
        if (truly(input[i]) && replacements[replacementIndex] !== undefined) {
            result[i] = replacements[replacementIndex];
            replacementIndex++;
        }
    }

    return result;
}

export function secureShuffle<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}

export function securePickSet<T>(array: T[], count: number): T[] {
    if (array.length < count) {
        throw new Error("Array length must be greater than or equal to the count");
    }

    const copiedArray = [...array];
    const result = [];

    for (let i = copiedArray.length - 1; i >= copiedArray.length - count; i--) {
        const j = randomInt(i + 1);
        [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
        result.push(copiedArray[i]);
    }

    return result;
}

export function securePickOne<T>(array: T[]): T {
    if (array.length === 0) {
        throw new Error("Array must not be empty");
    }
    const randomIndex = randomInt(array.length);

    return array[randomIndex];
}

export const replace = curry(replaceInternal);
export const replaceEach = curry(replaceEachInternal);
