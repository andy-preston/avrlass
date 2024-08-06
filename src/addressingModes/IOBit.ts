import { Instruction } from "../instructions/instruction.ts";
import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import {
    checkPortOperand,
    checkBitIndexOperand
} from "../instructions/operands.ts";

const mappings: Record<string, string> = {
    "SBI":  "10",
    "SBIC": "01",
    "SBIS": "11",
    "CBI":  "00",
};

export const encode = (instruction: Instruction): GeneratedCode | null => {
    if (!(instruction.mnemonic in mappings)) {
        return null;
    }
    const operationBits = mappings[instruction.mnemonic]!;
    if (instruction.operands.length != 2) {
        throw new Error(
            `Incorrect operands - expecting 1 IO Port and 1 bit index`
        );
    }
    checkPortOperand(instruction.operands[0]!);
    checkBitIndexOperand(instruction.operands[1]!);

    return template(`1001_10${operationBits}_AAAA_Abbb`, {
        "A": instruction.operands[0],
        "b": instruction.operands[1]
    });
};
