import { append, clone, curry, reduce, repeat } from "ramda";

export function shuffleN<T>(shuffle: (a: T[]) => T[], times: number, input: T[]) {
    return reduce((result, fn: (a: T[]) => T[]) => fn(result), input, repeat(shuffle, times));
}

type ReplaceFullType = <T>(truly: (a: T) => boolean, replacement: T, input: T[]) => T[];
type ReplaceHigherOrderType = <T>(truly: (a: T) => boolean, replacement: T) => (input: T[]) => T[];

function replaceInternal<T>(truly: (a: any) => boolean, replacement: any, input: any[]) {
    return reduce((result, element) => append(truly(element) ? replacement : element, result), [] as any[], input);
}

export const replace = curry(replaceInternal);

export const replaceEach = curry((truly: (a: any) => boolean, replacements: any[], input: any[]) => {
    const result = clone(input);
    let replacementIndex = 0;

    for (let i = 0; i < input.length; i++) {
        if (truly(input[i]) && replacements[replacementIndex] !== undefined) {
            result[i] = replacements[replacementIndex];
            replacementIndex++;
        }
    }

    return result;
});
