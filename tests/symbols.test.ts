import SymbolsGenerator from "../src/symbols-generator";

describe("SymbolsGenerator", () => {
    const symbolWeights = {
        0: 0.25,
        1: 0.25,
        2: 0.25,
        3: 0.25,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should initialize with provided symbol weights", () => {
            // Act
            const symbols = new SymbolsGenerator(symbolWeights);

            // Assert
            expect(symbols).toBeInstanceOf(SymbolsGenerator);
        });
    });

    describe("randomSymbols", () => {
        it("should return array with correct length", () => {
            // Arrange
            const symbols = new SymbolsGenerator(symbolWeights);
            const requestedSize = 5;

            // Act
            const randomSymbols = symbols.randomSymbols(requestedSize);

            // Assert
            expect(randomSymbols).toHaveLength(requestedSize);
        });

        it("should return array of numbers", () => {
            // Arrange
            const symbols = new SymbolsGenerator(symbolWeights);

            // Act
            const randomSymbols = symbols.randomSymbols(3);

            // Assert
            expect(randomSymbols.every((symbol) => typeof symbol === "number")).toBe(true);
        });

        it("should return symbols within valid range", () => {
            // Arrange
            const symbols = new SymbolsGenerator(symbolWeights);
            const validSymbols = Object.keys(symbolWeights).map(Number);

            // Act
            const randomSymbols = symbols.randomSymbols(10);

            // Assert
            expect(randomSymbols.every((symbol) => validSymbols.includes(symbol))).toBe(true);
        });

        it("should return empty array when size is 0", () => {
            // Arrange
            const symbols = new SymbolsGenerator(symbolWeights);

            // Act
            const randomSymbols = symbols.randomSymbols(0);

            // Assert
            expect(randomSymbols).toHaveLength(0);
        });
    });
});
