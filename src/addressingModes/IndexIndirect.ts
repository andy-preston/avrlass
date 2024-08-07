import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import { check, checkCount } from "../instructions/operands.ts";

// These are only valid for `LD` and `ST`
const bit4AndSuffixes: Record<string, [string, string]> = {
    "Z":  ["0", "0000"],
    "Z+": ["1", "0001"],
    "-Z": ["1", "0010"],
    "Y":  ["0", "1000"],
    "Y+": ["1", "1001"],
    "-Y": ["1", "1010"],
    "X":  ["1", "1100"],
    "X+": ["1", "1101"],
    "-X": ["1", "1110"]
};

const prefixAndMiddles: Record<string, [string, string]> = {
    "LD":   ["100", "_000"],
    "ST":   ["100", "_001"]
};

/*

case "LDD.Y":
    return template("10q0_qq0d_dddd_1qqq", {
        "d": operands[0],
        "q": operands[1]
    });
case "LDD.Z":
    return template("10q0_qq0d_dddd_0qqq", {
        "d": operands[0],
        "q": operands[1]
    });

--------------------------------------------

case "STD.Y":
    return template("10q0_qq1r_rrrr_1qqq", {
        "q": operands[0],
        "r": operands[1]
    });
case "STD.Z":
    return template("10q0_qq1r_rrrr_0qqq", {
        "q": operands[0],
        "r": operands[1]
    });


"LPM.Z":   ["1001_000", "0100"], //         _ = 00
"LPM.Z+":  ["1001_000", "0101"], //         + = 01
"ELPM.Z":  ["1001_000", "0110"], //         _ = 10
"ELPM.Z+": ["1001_000", "0111"], //         + = 11 inconsistent

"XCH.Z":   ["1001_001", "0100"], // z = 01  _ = 00




*/

export const encode = (
    instruction: Instruction,
    _pc: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in prefixAndMiddles)) {
        return null;
    }
    checkCount(instruction.operands, ["register", "indexOperation"]);
    check("register", "first", instruction.operands[0]!);
    const [prefix, middle] = prefixAndMiddles[instruction.mnemonic]!;
    const [bit4, suffix] = bit4AndSuffixes[indexOp]!;
    // In the official documentation, the store operations have
    // "XXXX XXXr rrrr XXXX" as their template rather than "d dddd".
    return template(`${prefix}${bit4}${middle}d_dddd_${suffix}`, {
        "d": instruction.operands[0]
    });
};
