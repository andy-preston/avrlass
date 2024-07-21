import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import { checkRegisterOperand } from "../instructions/operands.ts";

const prefixes: Record<string, string> = {
    "ADC":  "0001_11",
    "ADD":  "0000_11",
    "AND":  "0010_00",
    "CP":   "0001_01",
    "CPC":  "0000_01",
    "CPSE": "0001_00",
    "EOR":  "0010_01",
    "MOV":  "0010_11",
    "MUL":  "1001_11",
    "OR":   "0010_10",
    "SBC":  "0000_10",
    "SUB":  "0001_10"
};

export const encode = (instruction: Instruction): GeneratedCode | null => {
    if (!(instruction.mnemonic in prefixes)) {
        return null;
    }
    if (instruction.operands.length != 2) {
        throw new Error('Incorrect operands - expecting 2 registers');
    }
    checkRegisterOperand(instruction.operands[0]!);
    checkRegisterOperand(instruction.operands[1]!);
    const prefix = prefixes[instruction.mnemonic];
    return template(`${prefix}rd_dddd_rrrr`, {
        "d": instruction.operands[0],
        "r": instruction.operands[1]
    });
};