import { GeneratedCode } from "./instructions/binaryTemplate.ts";
import { Operands } from "./instructions/operands.ts";

export const encode = (
    pc: number,
    mnemonic: string,
    operands: Operands
): GeneratedCode => {
    throw `unknown instruction ${mnemonic}`;
};
