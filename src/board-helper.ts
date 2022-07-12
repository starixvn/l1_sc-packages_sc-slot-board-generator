import { equals } from "ramda";
import defaultDefinition from "./default-definition";

export const NO_SYMBOL = -1;
export const SPECIAL_SYMBOL = -2;

export const isNoSymbol = equals(NO_SYMBOL);

export const isMultiplierSymbol = equals(defaultDefinition.multiplier.symbol);

export const isSpecialSymbol = equals(SPECIAL_SYMBOL);
