import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import { check, checkCount } from "../instructions/operands.ts";

const prefixAndSuffixes: Record<string, [string, string]> = {
    "POP":     ["1001_000", "1111"],
    "LAC":     ["1001_001", "0110"],
    "LAS":     ["1001_001", "0101"],
    "LAT":     ["1001_001", "0111"],
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

export const encode = (
    instruction: Instruction,
    _pc: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in prefixAndSuffixes)) {
        return null;
    }
    checkCount(instruction.operands, ["register"]);
    check("register", "first", instruction.operands[0]!);
    const [prefix, suffix] = prefixAndSuffixes[instruction.mnemonic]!;
    // In the official documentation, some of these have
    // "#### ###r rrrr ####" as their template rather than "d dddd".
    // e.g. `SWAP Rd` has "d dddd" but `LAC Rd` has "r rrrr".
    return template(`${prefix}d_dddd_${suffix}`, {
        "d": instruction.operands[0]
    });
};
