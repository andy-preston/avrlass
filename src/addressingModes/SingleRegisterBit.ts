
import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import {
    checkRegisterOperand,
    checkBitIndexOperand
} from "../instructions/operands.ts";

const mapping: Record<string, string> = {
    "BLD":  "00",
    "BST":  "01",
    "SBRC": "10",
    "SBRS": "11"
};

export const encode = (instruction: Instruction): GeneratedCode | null => {
    if (!(instruction.mnemonic in mapping)) {
        return null;
    }
    if (instruction.operands.length != 2) {
        throw new Error(
            'Incorrect operands - expecting 1 register and 1 bit index'
        );
    }
    checkRegisterOperand(instruction.operands[0]!);
    checkBitIndexOperand(instruction.operands[1]!);
    const operationBits = mapping[instruction.mnemonic]!;
    // In the official documentation, some of these have
    // "XXXX XXXr rrrr Xbbb" as their template rather than "d dddd".
    // e.g. `BLD Rd, b` has "d dddd" but `SBRS Rd, b` has "r rrrr".
    return template(`1111_1${operationBits}d_dddd_0bbb`, {
        "d": instruction.operands[0]!,
        "b": instruction.operands[1]!
    });
};
