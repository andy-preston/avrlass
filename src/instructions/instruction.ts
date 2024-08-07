import { Operands } from "./operands.ts";

export type Instruction = {
    "mnemonic": string,
    "operands": Operands
};
