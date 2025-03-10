# Board Generator Technical Documentation

## Overview

The board generator is a TypeScript implementation for generating slot game boards with secure random number generation. The system uses Node.js's cryptographically secure random number generator (`node:crypto`) which implements `/dev/urandom` on Unix-like systems and BCryptGenRandom on Windows.

## Random Number Generation

### Core Random Functions

1. **secureShuffle**

   - Purpose: Randomly shuffles an array of elements
   - Implementation: Fisher-Yates shuffle algorithm
   - Random Source: `node:crypto.randomInt`
   - Security: Cryptographically secure

   ```typescript
   export function secureShuffle<T>(array: T[]): T[] {
     const shuffledArray = [...array];
     for (let i = shuffledArray.length - 1; i > 0; i--) {
       const j = randomInt(i + 1);
       [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
     }
     return shuffledArray;
   }
   ```

2. **securePickOne**

   - Purpose: Selects one random element from an array
   - Implementation: Direct random index selection
   - Random Source: `node:crypto.randomInt`
   - Security: Cryptographically secure

   ```typescript
   export function securePickOne<T>(array: T[]): T {
     if (array.length === 0) {
       throw new Error("Array must not be empty");
     }
     const randomIndex = randomInt(array.length);
     return array[randomIndex];
   }
   ```

3. **securePickSet**
   - Purpose: Selects multiple random elements from an array
   - Implementation: Fisher-Yates shuffle with early termination
   - Random Source: `node:crypto.randomInt`
   - Security: Cryptographically secure
   ```typescript
   export function securePickSet<T>(array: T[], count: number): T[] {
     if (array.length < count) {
       throw new Error("Array length must be greater than or equal to the count");
     }
     const copiedArray = [...array];
     const result = [];
     for (let i = copiedArray.length - 1; i >= copiedArray.length - count; i--) {
       const j = randomInt(i + 1);
       [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
       result.push(copiedArray[i]);
     }
     return result;
   }
   ```

### Random Number Source

- **Platform**: Node.js built-in `crypto` module
- **Implementation**:
  - Unix/Linux/macOS: `/dev/urandom` with ChaCha20 algorithm
  - Windows: BCryptGenRandom from Windows CryptoAPI
- **Security Features**:
  - Cryptographically secure
  - Non-deterministic
  - High entropy
  - Resistant to prediction attacks

### Usage in Board Generation

1. **Symbol Generation**

   ```typescript
   randomSymbols(size: number): number[] {
       return securePickSet(this.board, size);
   }
   ```

2. **Multiplier Generation**
   ```typescript
   randomValue(multipliers: number) {
       const maximumValue = max(Math.round(this.config.max / max(multipliers, 1)), this.config.min);
       const values = this.generateSetOfValues(this.config.min, maximumValue);
       return securePickOne(values);
   }
   ```

## Testing and Verification

1. **Unit Tests**

   - Mocked random number generation for deterministic testing
   - Verifies correct behavior of random functions
   - Tests edge cases and error conditions

2. **Integration Tests**
   - Uses real random number generation
   - Verifies statistical properties
   - Ensures correct output sizes and distributions

## Security Considerations

1. **Random Number Generation**

   - Uses OS-level cryptographically secure random number generator
   - No custom random number generation algorithms
   - No seed-based generation
   - No predictable patterns

2. **Data Protection**
   - No exposure of internal random number generation
   - No way to influence or predict random outcomes
   - No state preservation between generations

## Compliance

- Uses industry-standard cryptographically secure random number generation
- Implements proper error handling and validation
- Maintains statistical fairness
- No deterministic patterns in output

## Dependencies

- Node.js built-in `crypto` module
- Ramda for functional programming utilities
- No external random number generation libraries

This implementation ensures fair and secure random number generation suitable for regulated gaming environments.
