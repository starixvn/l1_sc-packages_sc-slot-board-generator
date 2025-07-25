import { MultiplierGenerator } from "../src/multiplier-generator";

describe("MultiplierGenerator", () => {
    let multiplierGenerator: MultiplierGenerator;

    beforeEach(() => {
        jest.clearAllMocks();
        multiplierGenerator = new MultiplierGenerator({ min: 2, max: 21 });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        describe("when config is valid", () => {
            it("should initialize with provided config", () => {
                // Arrange
                const config = { min: 3, max: 15 };

                // Act
                const generator = new MultiplierGenerator(config);

                // Assert
                expect(generator.getConfig()).toStrictEqual(config);
            });
        });

        describe("when config is invalid", () => {
            it("should handle invalid config where min > max", () => {
                // Arrange
                const config = { min: 100, max: 50 };

                // Act
                const generator = new MultiplierGenerator(config);

                // Assert
                expect(generator.getConfig().min).toBe(100);
                expect(generator.getConfig().max).toBe(50);
            });
        });
    });

    describe("randomValue", () => {
        describe("when using default config", () => {
            it("should return a number", () => {
                // Act
                const value = multiplierGenerator.randomValue();

                // Assert
                expect(typeof value).toBe("number");
            });

            it("should return value within configured range", () => {
                // Act
                const value = multiplierGenerator.randomValue();

                // Assert
                expect(value).toBeGreaterThanOrEqual(2);
                expect(value).toBeLessThanOrEqual(21);
            });

            it("should return valid multiplier value", () => {
                // Arrange
                const validMultipliers = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 21];

                // Act
                const value = multiplierGenerator.randomValue();

                // Assert
                expect(validMultipliers).toContain(value);
            });
        });

        describe("when using custom config", () => {
            it("should filter multipliers based on min/max config", () => {
                // Arrange
                const generator = new MultiplierGenerator({ min: 50, max: 100 });

                // Act
                const value = generator.randomValue();

                // Assert
                expect(value).toBeGreaterThanOrEqual(50);
                expect(value).toBeLessThanOrEqual(100);
            });
        });

        describe("when config has edge cases", () => {
            it("should handle edge case when min equals max", () => {
                // Arrange
                const generator = new MultiplierGenerator({ min: 10, max: 10 });

                // Act
                const value = generator.randomValue();

                // Assert
                expect(value).toBe(10);
            });

            it("should handle config with same min and max values", () => {
                // Arrange
                const generator = new MultiplierGenerator({ min: 10, max: 10 });

                // Act
                const value = generator.randomValue();

                // Assert
                expect(value).toBe(10);
            });
        });
    });

    describe("generate", () => {
        describe("when board contains no multiplier symbols", () => {
            it("should return empty array when no multiplier symbols", () => {
                // Arrange
                const board = [0, 1, 2, 3, 4, 5];

                // Act
                const multipliers = multiplierGenerator.generate(board);

                // Assert
                expect(multipliers).toHaveLength(0);
            });

            it("should handle empty board", () => {
                // Arrange
                const board: number[] = [];

                // Act
                const multipliers = multiplierGenerator.generate(board);

                // Assert
                expect(multipliers).toHaveLength(0);
            });
        });

        describe("when board contains multiplier symbols", () => {
            it("should return array with length matching multiplier symbols", () => {
                // Arrange
                const board = [0, 10, 1, 10, 2, 10]; // 3 multiplier symbols (10)

                // Act
                const multipliers = multiplierGenerator.generate(board);

                // Assert
                expect(multipliers).toHaveLength(3);
            });

            it("should return array of numbers", () => {
                // Arrange
                const board = [0, 10, 1, 10];

                // Act
                const multipliers = multiplierGenerator.generate(board);

                // Assert
                expect(multipliers.every((multiplier) => typeof multiplier === "number")).toBe(true);
            });

            it("should return multipliers within configured range", () => {
                // Arrange
                const board = [10, 10, 10];

                // Act
                const multipliers = multiplierGenerator.generate(board);

                // Assert
                expect(multipliers.every((multiplier) => multiplier >= 2 && multiplier <= 21)).toBe(true);
            });
        });

        describe("when board has edge cases", () => {
            it("should handle board with only multiplier symbols", () => {
                // Arrange
                const board = [10, 10, 10, 10];

                // Act
                const multipliers = multiplierGenerator.generate(board);

                // Assert
                expect(multipliers).toHaveLength(4);
                expect(multipliers.every((m) => typeof m === "number")).toBe(true);
            });

            it("should handle board with mixed symbol types", () => {
                // Arrange
                const board = [0, 10, 1, 10, 2, 10, 3, 4, 5, 10];

                // Act
                const multipliers = multiplierGenerator.generate(board);

                // Assert
                expect(multipliers).toHaveLength(4);
            });
        });
    });

    describe("update", () => {
        describe("when parameters are valid", () => {
            it("should update min value", () => {
                // Act
                multiplierGenerator.update(5, 15);

                // Assert
                expect(multiplierGenerator.getConfig().min).toBe(5);
            });

            it("should update max value", () => {
                // Act
                multiplierGenerator.update(5, 15);

                // Assert
                expect(multiplierGenerator.getConfig().max).toBe(15);
            });

            it("should affect randomValue range", () => {
                // Arrange
                multiplierGenerator.update(50, 500);

                // Act
                const value = multiplierGenerator.randomValue();

                // Assert
                expect(value).toBeGreaterThanOrEqual(50);
                expect(value).toBeLessThanOrEqual(500);
            });
        });

        describe("when parameters are edge cases", () => {
            it("should handle negative values", () => {
                // Act
                multiplierGenerator.update(-10, 5);

                // Assert
                expect(multiplierGenerator.getConfig().min).toBe(-10);
                expect(multiplierGenerator.getConfig().max).toBe(5);
            });

            it("should handle zero values", () => {
                // Act
                multiplierGenerator.update(0, 0);

                // Assert
                expect(multiplierGenerator.getConfig().min).toBe(0);
                expect(multiplierGenerator.getConfig().max).toBe(0);
            });

            it("should handle large values", () => {
                // Act
                multiplierGenerator.update(1000, 10000);

                // Assert
                expect(multiplierGenerator.getConfig().min).toBe(1000);
                expect(multiplierGenerator.getConfig().max).toBe(10000);
            });
        });
    });

    describe("getConfig", () => {
        describe("when using default config", () => {
            it("should return current min value", () => {
                // Act
                const result = multiplierGenerator.getConfig();

                // Assert
                expect(result.min).toBe(2);
            });

            it("should return current max value", () => {
                // Act
                const result = multiplierGenerator.getConfig();

                // Assert
                expect(result.max).toBe(21);
            });

            it("should return complete config object", () => {
                // Act
                const result = multiplierGenerator.getConfig();

                // Assert
                expect(result).toStrictEqual({ min: 2, max: 21 });
            });
        });

        describe("when config has been updated", () => {
            it("should return updated config after update", () => {
                // Arrange
                multiplierGenerator.update(10, 50);

                // Act
                const result = multiplierGenerator.getConfig();

                // Assert
                expect(result).toStrictEqual({ min: 10, max: 50 });
            });
        });
    });
});
