import BoardGenerator from "../src/board-generator";
import defaultDefinition from "../src/default-definition";
describe("BoardGenerator", () => {
    let boardGenerator;

    beforeEach(() => {
        jest.clearAllMocks();

        boardGenerator = new BoardGenerator(defaultDefinition);
    });

    describe("generate", () => {
        it("always return total items = reels", () => {
            // Arrange

            // Act
            const board = boardGenerator.generate();

            // Assert
            expect(board.length).toEqual(defaultDefinition.reels);
        });

        it("always return number symbol on reel as defined", () => {
            // Arrange

            // Act
            const board = boardGenerator.generate();

            // Assert
            expect(board.every((reel) => reel.length === defaultDefinition.symbolsOnReel)).toBeTrue();
        });
    });

    describe("explode", () => {
        it("return the same reel if no win symbols", () => {
            // Arrange
            const board = boardGenerator.generate();

            // Act
            const result = boardGenerator.explode(board[0], []);

            // Assert
            expect(result).toStrictEqual(board[0]);
        });

        it("return the reel with win symbols were replaced by NoSymbol", () => {
            // Arrange
            const reel = [8, 8, 8, 2, 2];
            const winSymbols = [2];

            // Act
            const result = boardGenerator.explode(reel, winSymbols);

            // Assert
            expect(result.filter((symbol) => symbol === boardGenerator.NoSymbol).length).toBe(2);
        });
    });

    describe("collapse", () => {
        describe("when there is no symbols to collapse", () => {
            it("return the same reel", () => {
                // Arrange
                const reel = [8, 8, 8, 2, 2];

                // Act
                const result = boardGenerator.collapse(reel);

                // Assert
                expect(result).toStrictEqual(reel);
            });
        });

        describe("when have symbols to collapse", () => {
            it("return the reel with collapsed items always on top", () => {
                // Arrange
                const reel = [8, 8, 8, boardGenerator.NoSymbol, boardGenerator.NoSymbol];
                const expected = [boardGenerator.NoSymbol, boardGenerator.NoSymbol, 8, 8, 8];

                // Act
                const result = boardGenerator.collapse(reel);

                // Assert
                expect(result).toStrictEqual(expected);
            });
        });
    });

    describe("refill", () => {
        it("return new reel without NoSymbol", () => {
            // Arrange
            const reel = [boardGenerator.NoSymbol, boardGenerator.NoSymbol, 8, 8, 8];

            // Act
            const result = boardGenerator.refill(reel);

            // Assert
            expect(result.every((symbol) => symbol !== boardGenerator.NoSymbol)).toBeTrue();
        });
    });
});
