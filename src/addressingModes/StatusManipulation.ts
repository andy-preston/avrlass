import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import { check, checkCount } from "../instructions/operands.ts";

const mappings: Record<string, [string, number?]> = {
    "BCLR": ["1", undefined],
    "CLC":  ["1", 0],
    "CLZ":  ["1", 1],
    "CLN":  ["1", 2],
    "CLV":  ["1", 3],
    "CLS":  ["1", 4],
    "CLH":  ["1", 5],
    "CLT":  ["1", 6],
    "CLI":  ["1", 7],
    "BSET": ["0", undefined],
    "SEC":  ["0", 0],
    "SEZ":  ["0", 1],
    "SEN":  ["0", 2],
    "SEV":  ["0", 3],
    "SES":  ["0", 4],
    "SEH":  ["0", 5],
    "SET":  ["0", 6],
    "SEI":  ["0", 7]
};

export const encode = (instruction: Instruction): GeneratedCode | null => {
    if (!(instruction.mnemonic in mappings)) {
        return null;
    }
    const [operationBit, impliedOperand] = mappings[instruction.mnemonic]!;
    checkCount(
        instruction.operands,
        impliedOperand == undefined ? ["bitIndex"] : []
    );
    const operand = impliedOperand == undefined ?
        instruction.operands[0]! : impliedOperand;
    check("bitIndex", "first", operand);
    return template(`1001_0100_${operationBit}sss_1000`, { "s": operand });
};
