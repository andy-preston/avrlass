import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import { checkByteOperand, checkImmediateRegisterOperand } from "../instructions/operands.ts";

const prefixes: Record<string, string> = {
    "CPI":  "0011",
    "SBCI": "0100",
    "SUBI": "0101",
    "ORI":  "0110", // SBR and
    "SBR":  "0110", // ORI are the same instruction
    "ANDI": "0111", // CBR and
    "CBR":  "0111", // ANDI are ALMOST the same instruction
    "LDI":  "1110", // SER and
    "SER":  "1110"  // LDI are ALMOST the same instruction
};

const immediate = (mnemonic: string, operand1: number) => {
    switch (mnemonic) {
        // Clear bits in register is an AND with the inverse of the operand
        case "CBR": return 0xff - operand1;
        // Set all bits is basically an LDI with FF
        case "SER": return 0xff;
        // All the other instructions have "sensible" operands
        default: return operand1;
    }
}

export const encode = (instruction: Instruction): GeneratedCode | null => {
    if (!(instruction.mnemonic in prefixes)) {
        return null;
    }
    if (instruction.mnemonic == "SER") {
        if (instruction.operands.length != 1) {
            throw new Error("Incorrect operands - expecting a register R16 - R31");
        }
    } else if (instruction.operands.length != 2) {
        throw new Error('Incorrect operands - expecting a register R16 - R31 and a byte');
    }
    checkImmediateRegisterOperand(instruction.operands[0]!);
    checkByteOperand(instruction.operands[1]!);
    const prefix = prefixes[instruction.mnemonic]!;
    return template(`${prefix}_KKKK_dddd_KKKK`, {
        // Immediate instructions only operate on R16 - R31
        "d": instruction.operands[0]! - 16,
        "K": immediate(instruction.mnemonic, instruction.operands[1]!)
    });
};
