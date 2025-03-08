import { equals, reverse } from "ramda";
import { shuffleN, replace, replaceEach, secureShuffle, securePickSet, securePickOne } from "../src/utils";
import { randomInt } from "node:crypto";

jest.mock("node:crypto", () => ({
    randomInt: jest.fn(),
}));

const mockRandomInt = randomInt as jest.Mock;

describe("utils", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("shuffleN", () => {
        describe("when pass the reverse method as a shuffle method", () => {
            it("should return as expected", () => {
                // Act
                const result = shuffleN(reverse, 2, [1, 2, 3]);

                // Assert
                expect(result).toStrictEqual([1, 2, 3]);
            });
        });
    });

    describe("replace", () => {
        describe("when called", () => {
            it("should return as expected", () => {
                // Act
                const result = replace(equals(1), 2, [1, 2, 3, 2, 1]);

                // Assert
                expect(result).toStrictEqual([2, 2, 3, 2, 2]);
            });
        });
    });

    describe("replaceEach", () => {
        describe("when length of replacement list equals to replacement items", () => {
            it("should replace all", () => {
                // Act
                const result = replaceEach(equals(1), [4, 5], [1, 2, 3, 2, 1]);

                // Assert
                expect(result).toStrictEqual([4, 2, 3, 2, 5]);
            });
        });

        describe("when length of replacement list is less than replacement items", () => {
            it("should replace a part of the list", () => {
                // Act
                const result = replaceEach(equals(1), [4], [1, 2, 3, 2, 1]);

                // Assert
                expect(result).toStrictEqual([4, 2, 3, 2, 1]);
            });
        });
    });

    describe("secureShuffle", () => {
        it("should shuffle array based on random indices", () => {
            // Arrange
            const input = [1, 2, 3, 4];
            // For input [1,2,3,4]:
            mockRandomInt
                .mockReturnValueOnce(2) // i=3: swap 4 and 3 -> [1,2,4,3]
                .mockReturnValueOnce(0) // i=2: swap 4 and 1 -> [4,2,1,3]
                .mockReturnValueOnce(1); // i=1: swap 2 and 2 -> [4,2,1,3]

            // Act
            const result = secureShuffle(input);

            // Assert
            expect(result).toEqual([4, 2, 1, 3]);
            expect(mockRandomInt).toHaveBeenCalledTimes(3);
        });

        it("should return empty array when input is empty", () => {
            const result = secureShuffle([]);
            expect(result).toEqual([]);
        });
    });

    describe("securePickSet", () => {
        it("should pick specified number of items", () => {
            // Arrange
            const input = [1, 2, 3, 4, 5];
            mockRandomInt
                .mockReturnValueOnce(2) // i=4: swap 5 and 3
                .mockReturnValueOnce(1) // i=3: swap 4 and 2
                .mockReturnValueOnce(0); // i=2: swap 3 and 1

            // Act
            const result = securePickSet(input, 3);

            // Assert
            expect(result).toEqual([3, 2, 1]);
            expect(mockRandomInt).toHaveBeenCalledTimes(3);
            expect(mockRandomInt).toHaveBeenNthCalledWith(1, 5);
            expect(mockRandomInt).toHaveBeenNthCalledWith(2, 4);
            expect(mockRandomInt).toHaveBeenNthCalledWith(3, 3);
        });

        it("should throw error when count exceeds array length", () => {
            expect(() => securePickSet([1, 2], 3)).toThrow("Array length must be greater than or equal to the count");
        });
    });

    describe("securePickOne", () => {
        it("should pick one random item from array", () => {
            // Arrange
            const input = [1, 2, 3, 4];
            mockRandomInt.mockReturnValueOnce(2);

            // Act
            const result = securePickOne(input);

            // Assert
            expect(result).toBe(3);
            expect(mockRandomInt).toHaveBeenCalledWith(4);
        });

        it("should throw error when array is empty", () => {
            expect(() => securePickOne([])).toThrow("Array must not be empty");
        });
    });
});
