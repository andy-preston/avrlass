import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import { check, registerPair } from "../instructions/operands.ts";
import { checkCount } from "../instructions/operands.ts";

const mapping: Record<string, string> = {
    "ADIW": "0",
    "SBIW": "1",
};

export const encode = (
    instruction: Instruction,
    _pc: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in mapping)) {
        return null;
    }
    checkCount(
        instruction.operands,
        ["registerPair", "sixBits"]
    );
    check("registerPair", 0, instruction.operands[0]!);
    check("sixBits", 1, instruction.operands[1]!);
    const operationBit = mapping[instruction.mnemonic]!;
    return template(`1001_011${operationBit}_KKdd_KKKK`, {
        "d": registerPair(instruction.operands[0]!, 24),
        "K": instruction.operands[1]
    });
};
