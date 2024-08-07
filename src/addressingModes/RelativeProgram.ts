import { relativeJump } from "../binaryMapping.ts";
import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import { check, checkCount } from "../instructions/operands.ts";

const mapping: Record<string, string> = {
    "RCALL": "1",
    "RJMP":  "0",
};

export const encode = (
    instruction: Instruction,
    pc: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in mapping)) {
        return null;
    }
    checkCount(instruction.operands, ["relativeAddress"]);
    check("relativeAddress", "first", instruction.operands[0]!);
    const operationBit = mapping[instruction.mnemonic]!;
    return template(
        `110${operationBit}_kkkk_kkkk_kkkk`,
        { "k": relativeJump(instruction.operands[0]!, 12, pc) }
    );
};
