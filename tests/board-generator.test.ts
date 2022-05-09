import { clone } from "ramda";
import BoardGenerator from "../src/board-generator";
import defaultDefinition from "../src/default-definition";
import { Difficulty } from "../src/difficulties";

describe("BoardGenerator", () => {
    let boardGenerator: BoardGenerator;

    beforeEach(() => {
        jest.clearAllMocks();

        const definition = clone(defaultDefinition) as any;

        definition.numberOfSymbolsByDifficulty[Difficulty.Medium] = {
            0: 30,
        };

        boardGenerator = new BoardGenerator(definition);
    });

    describe("constructor", () => {
        describe("when call without parameter", () => {
            it("should create an instance with default configs", () => {
                // Act
                const generator = new BoardGenerator();

                // Assert
                expect(generator).toBeDefined();
            });
        });
    });

    describe("getDifficulty", () => {
        it("should return value as expected", () => {
            // Act
            const actual = boardGenerator.getDifficulty();

            // Assert
            expect(actual).toBe(Difficulty.Medium);
        });
    });

    describe("setDifficulty", () => {
        it("should change the difficulty of this board", () => {
            // Act
            boardGenerator.setDifficulty(Difficulty.Easy);

            // Assert
            expect(boardGenerator.getDifficulty()).toBe(Difficulty.Easy);
        });
    });

    describe("generate", () => {
        it("return total symbols as defined", () => {
            // Act
            const result = boardGenerator.generate();

            // Assert
            expect(result.newBoard.length).toEqual(defaultDefinition.reels * defaultDefinition.symbolsOnReel);
        });
    });

    describe("explodeAndRefill", () => {
        it("return new board with the same total of symbols", () => {
            // Arrange
            const board = boardGenerator.generate();

            // Act
            const result = boardGenerator.explodeAndRefill(board.newBoard, [2]);

            // Assert
            expect(result.newBoard.length).toEqual(defaultDefinition.reels * defaultDefinition.symbolsOnReel);
        });

        it("return new board without NoSymbol", () => {
            // Arrange
            const board = boardGenerator.generate();

            // Act
            const result = boardGenerator.explodeAndRefill(board.newBoard, [2]);

            // Assert
            expect(result.newBoard.indexOf(boardGenerator.NoSymbol) === -1).toBe(true);
        });

        it("return exploded symbols corresponding with board", () => {
            // Arrange
            const board = [8, 8, 8, 2, 2, 1, 8, 8, 4, 3, 1, 10, 8, 8, 10, 2, 1, 5, 3, 9, 9, 5, 6, 4, 9, 5, 7, 8, 1, 2];
            const expected = [8, 8, 8, -1, -1, -1, 8, 8, -1, -1, -1, -1, 8, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, -1, -1];

            // Act
            const result = boardGenerator.explodeAndRefill(board, [8]);

            // Assert
            expect(result.explodedSymbols?.join(",")).toBe(expected.join(","));
        });

        it("return new symbols corresponding with board", () => {
            // Arrange
            const board = [8, 8, 8, 2, 2, 1, 8, 8, 4, 3, 1, 10, 8, 8, 10, 2, 1, 5, 3, 9, 9, 5, 6, 4, 9, 5, 7, 8, 1, 2];
            const expected = [-1, -1, -1, 0, 0, 0, -1, -1, -1, -1, 0, 0, -1, -1, -1, -1, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0];

            // Act
            const result = boardGenerator.explodeAndRefill(board, [8]);

            // Assert
            expect(result.newSymbols).toStrictEqual(expected);
        });
    });

    describe("collapse", () => {
        it("return new board with the same total of symbols", () => {
            // Arrange
            const board = [-1, 8, 8, 2, 2, 1, 8, 8, 4, 3, 1, 10, 8, 8, 10, 2, 1, 5, 3, 9, 9, 5, 6, 4, 9, 5, 7, 8, 1, 2];

            // Act
            const result = boardGenerator.collapse(board);

            // Assert
            expect(result.length).toEqual(board.length);
        });

        it("return result corresponding with board", () => {
            // Arrange
            const board = [-1, 8, 8, 2, 2, 1, 8, 8, 4, 3, 1, 10, 8, 8, 10, 2, 1, 5, 3, 9, 9, 5, 6, 4, 9, 5, 7, 8, 1, 2];
            const expected = [8, 8, 2, 2, 1, -1, 8, 8, 4, 3, 1, 10, 8, 8, 10, 2, 1, 5, 3, 9, 9, 5, 6, 4, 9, 5, 7, 8, 1, 2];

            // Act
            const result = boardGenerator.collapse(board);

            // Assert
            expect(result).toStrictEqual(expected);
        });
    });
});
