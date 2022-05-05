import Reel from "../src/reel";
import { default as defaultDefinition } from "../src/default-definition";

describe("Reel", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("get", () => {
        it("return number symbol on reel as defined", () => {
            // Arrange

            // Act
            const reel = new Reel(defaultDefinition.symbolsOnReel);

            // Assert
            expect(reel.get().length).toEqual(defaultDefinition.symbolsOnReel);
        });
    });

    describe("explode", () => {
        it("return the same reel if no win symbols", () => {
            // Arrange
            const reel = new Reel(defaultDefinition.symbolsOnReel);

            // Act
            const newReel = reel.explode([]);

            // Assert
            expect(newReel.get()).toStrictEqual(reel.get());
        });

        it("return the reel with win symbols were replaced by NoSymbol", () => {
            // Arrange
            const winSymbols = [2];
            const reel = new Reel(5, [8, 8, 8, 2, 2]);

            // Act
            const newReel = reel.explode(winSymbols);

            // Assert
            expect(newReel.get().filter((symbol) => symbol === Reel.NoSymbol).length).toBe(2);
        });

        it("return the reel without win symbols inside", () => {
            // Arrange
            const winSymbol = 2;
            const reel = new Reel(defaultDefinition.symbolsOnReel, [8, 8, 8, 2, 2]);

            // Act
            const result = reel.explode([winSymbol]);

            // Assert
            expect(result.get().every((symbol) => symbol === winSymbol)).toBe(false);
        });
    });

    describe("collapse", () => {
        describe("when there is no symbols to collapse", () => {
            it("return the same reel", () => {
                // Arrange
                const reel = new Reel(5, [8, 8, 8, 2, 2]);

                // Act
                const result = reel.collapse();

                // Assert
                expect(result.get()).toStrictEqual(reel.get());
            });
        });

        describe("when have symbols to collapse", () => {
            it("return the reel with collapsed items always on top", () => {
                // Arrange
                const reel = new Reel(5, [8, 8, 8, Reel.NoSymbol, Reel.NoSymbol]);
                const expected = [Reel.NoSymbol, Reel.NoSymbol, 8, 8, 8];

                // Act
                const result = reel.collapse();

                // Assert
                expect(result.get()).toStrictEqual(expected);
            });
        });
    });

    describe("refill", () => {
        it("return new reel without NoSymbol", () => {
            // Arrange
            const reel = new Reel(5, [Reel.NoSymbol, Reel.NoSymbol, 8, 8, 8]);

            // Act
            const result = reel.refill();

            // Assert
            expect(result.get().every((symbol) => symbol !== Reel.NoSymbol)).toBe(true);
        });
    });

    describe("findOccurrences", () => {
        it("return count of symbols on reels", () => {
            // Arrange
            const reel = new Reel(5, [8, 8, 8, 2, 2]);
            const expected = { "8": 3, "2": 2 };

            // Act
            const result = reel.findOccurrences();

            // Assert
            expect(result).toStrictEqual(expected);
        });
    });
});
