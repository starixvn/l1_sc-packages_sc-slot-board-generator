import SymbolsGenerator from "../src/symbols-generator";
import defaultDefinition from "../src/default-definition";

describe("Symbols", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("load", () => {
        it("return total symbols as defined", () => {
            // Arrange
            const symbols = new SymbolsGenerator(defaultDefinition.normalSymbols, defaultDefinition.freeSpins, defaultDefinition.multiplier);

            // Act
            symbols.load();

            // Assert
            expect(symbols.getBoard().length).toEqual(SymbolsGenerator.DefaultNormalSymbols);
        });
    });

    describe("getReel", () => {
        it("return total symbols as defined TotalItemPerReel", () => {
            // Arrange
            const symbols = new SymbolsGenerator(defaultDefinition.normalSymbols, defaultDefinition.freeSpins, defaultDefinition.multiplier);

            // Act
            symbols.load();

            // Assert
            expect(symbols.getReel(0).length).toEqual(SymbolsGenerator.TotalItemPerReel);
        });
    });

    describe("getSymbol", () => {
        it("return one symbol", () => {
            // Arrange
            const symbols = new SymbolsGenerator(defaultDefinition.normalSymbols, defaultDefinition.freeSpins, defaultDefinition.multiplier);

            // Act
            symbols.load();

            // Assert
            expect(symbols.randomSymbol()).toBeGreaterThan(-1);
        });
    });
});
