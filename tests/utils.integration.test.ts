import { securePickOne, securePickSet, secureShuffle } from "sc-core-rng";

describe("Random functions integration", () => {
    describe("secureShuffle", () => {
        it("should maintain array length and elements", () => {
            const input = [1, 2, 3, 4, 5];
            const result = secureShuffle(input);
            expect(result.length).toBe(input.length);
            expect(result.sort((a, b) => a - b)).toEqual(input.sort((a, b) => a - b));
        });
    });

    describe("securePickOne", () => {
        it("should always return exactly one element from the array", () => {
            const input = [1, 2, 3, 4, 5];
            const result = securePickOne(input);
            expect(input).toContain(result);
        });
    });

    describe("securePickSet", () => {
        it("should return exactly the requested number of elements", () => {
            const input = [1, 2, 3, 4, 5];
            const count = 3;
            const result = securePickSet(input, count);
            expect(result.length).toBe(count);
            result.forEach((item) => {
                expect(input).toContain(item);
            });
            expect(new Set(result).size).toBe(count);
        });
    });
});
