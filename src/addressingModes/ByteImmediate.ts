import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import { checkByteOperand, checkImmediateRegisterOperand } from "../instructions/operands.ts";

const prefixes: Record<string, string> = {
    "ANDI": "0111",
    "CPI":  "0011",
    "LDI":  "1110",
    "ORI":  "0110",
    "SBCI": "0100",
    "SUBI": "0101",
};

export const encode = (instruction: Instruction): GeneratedCode | null => {
    if (!(instruction.mnemonic in prefixes)) {
        return null;
    }
    if (instruction.operands.length != 2) {
        throw new Error('Incorrect operands - expecting a register R16 - R31 and a byte');
    }
    checkImmediateRegisterOperand(instruction.operands[0]!);
    checkByteOperand(instruction.operands[1]!);
    const prefix = prefixes[instruction.mnemonic]!;
    return template(`${prefix}_KKKK_dddd_KKKK`, {
        "d": instruction.operands[0]! - 16,
        "K": instruction.operands[1]
    });
};
