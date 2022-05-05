import BoardGenerator from "../src/board-generator";
import defaultDefinition from "../src/default-definition";
import Reel from "../src/reel";
describe("BoardGenerator", () => {
    let boardGenerator: BoardGenerator;

    beforeEach(() => {
        jest.clearAllMocks();

        boardGenerator = new BoardGenerator(defaultDefinition);
    });

    describe("generate", () => {
        it("return total symbols as defined", () => {
            // Arrange

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
    });

    // describe("StressTest", () => {
    //     it("run 1M board", () => {
    //         // Arrange
    //         const generated = boardGenerator.generate();

    //         // Act
    //         const result = boardGenerator.explodeAndRefill(generated.newBoard, [8]);

    //         // Assert
    //         expect(result.newBoard.indexOf(boardGenerator.NoSymbol) === -1).toBe(true);
    //     });
    // })
});
