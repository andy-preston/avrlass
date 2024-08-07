import { Instruction } from "../instructions/instruction.ts";
import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { check, checkCount } from "../instructions/operands.ts";

const mappings: Record<string, string> = {
    "SBI":  "10",
    "SBIC": "01",
    "SBIS": "11",
    "CBI":  "00",
};

export const encode = (
    instruction: Instruction,
    _pc: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in mappings)) {
        return null;
    }
    checkCount(instruction.operands, ["port", "bitIndex"]);
    check("port", "first", instruction.operands[0]!);
    check("bitIndex", "second", instruction.operands[1]!);
    const operationBits = mappings[instruction.mnemonic]!;
    return template(`1001_10${operationBits}_AAAA_Abbb`, {
        "A": instruction.operands[0],
        "b": instruction.operands[1]
    });
};
