import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import { checkRegisterOperand } from "../instructions/operands.ts";

const prefixAndSuffixes: Record<string, [string, string]> = {
    "LD.Z":    ["1000_000", "0000"],
    "LD.Z+":   ["1001_000", "0001"],
    "LD.-Z":   ["1001_000", "0010"],
    "LPM.Z":   ["1001_000", "0100"],
    "LPM.Z+":  ["1001_000", "0101"],
    "ELPM.Z":  ["1001_000", "0110"],
    "ELPM.Z+": ["1001_000", "0111"],
    "LD.Y":    ["1000_000", "1000"],
    "LD.Y+":   ["1001_000", "1001"],
    "LD.-Y":   ["1001_000", "1010"],
    "LD.X":    ["1001_000", "1100"],
    "LD.X+":   ["1001_000", "1101"],
    "LD.-X":   ["1001_000", "1110"],
    "POP":     ["1001_000", "1111"],
    "ST.Z":    ["1000_001", "0000"],
    "ST.Z+":   ["1001_001", "0001"],
    "ST.-Z":   ["1001_001", "0010"],
    "XCH.Z":   ["1001_001", "0100"],
    "LAC":     ["1001_001", "0110"],
    "LAS":     ["1001_001", "0101"],
    "LAT":     ["1001_001", "0111"],
    "ST.Y":    ["1000_001", "1000"],
    "ST.Y+":   ["1001_001", "1001"],
    "ST.-Y":   ["1001_001", "1010"],
    "ST.X":    ["1001_001", "1100"],
    "ST.X+":   ["1001_001", "1101"],
    "ST.-X":   ["1001_001", "1110"],
    "COM":     ["1001_010", "0000"],
    "NEG":     ["1001_010", "0001"],
    "SWAP":    ["1001_010", "0010"],
    "INC":     ["1001_010", "0011"],
    "ASR":     ["1001_010", "0101"],
    "LSR":     ["1001_010", "0110"],
    "ROR":     ["1001_010", "0111"],
    "DEC":     ["1001_010", "1010"],
    "PUSH":    ["1001_001", "1111"],
};

export const encode = (instruction: Instruction): GeneratedCode | null => {
    if (!(instruction.mnemonic in prefixAndSuffixes)) {
        return null;
    }
    if (instruction.operands.length != 1) {
        throw new Error('Incorrect operands - expecting 1 register');
    }
    checkRegisterOperand(instruction.operands[0]!);
    const [prefix, suffix] = prefixAndSuffixes[instruction.mnemonic]!;
    return template(`${prefix}r_rrrr_${suffix}`, {
        "r": instruction.operands[0]
    });
};
