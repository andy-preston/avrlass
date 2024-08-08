import { GeneratedCode, template } from "../binaryTemplate.ts";
import { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands.ts";

const mapping: Record<string, string> = {
    "CALL": "1",
    "JMP":  "0",
};

export const encode = (
    instruction: Instruction,
    _pc: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in mapping)) {
        return null;
    }
    checkCount(instruction.operands, ["address"]);
    check("address", 0, instruction.operands[0]!);
    const operationBit = mapping[instruction.mnemonic]!;
    return template(
        `1001_010k_kkkk_11${operationBit}k_kkkk_kkkk_kkkk_kkkk`,
        { "k": instruction.operands[0]! }
    );
};
