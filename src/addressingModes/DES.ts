import { GeneratedCode, template } from "../binaryTemplate.ts";
import { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands.ts";

export const encode = (
    instruction: Instruction,
    _pc: number
): GeneratedCode | null => {
    if (instruction.mnemonic != "DES") {
        return null;
    }
    checkCount(instruction.operands, ["nybble"]);
    check("nybble", 0, instruction.operands[0]!);
    return template("1001_0100_KKKK_1011", {
        "K": instruction.operands[0]!
    });
};
