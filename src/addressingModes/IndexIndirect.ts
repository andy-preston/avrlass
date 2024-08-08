import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import { check, checkCount } from "../instructions/operands.ts";

const mapping: Record<string, [string, string, string]> = {
    "LD.Z":    ["0", "0", "0000"],
    "LD.Z+":   ["1", "0", "0001"],
    "LD.-Z":   ["1", "0", "0010"],
    "LD.Y":    ["0", "0", "1000"],
    "LD.Y+":   ["1", "0", "1001"],
    "LD.-Y":   ["1", "0", "1010"],
    "LD.X":    ["1", "0", "1100"],
    "LD.X+":   ["1", "0", "1101"],
    "LD.-X":   ["1", "0", "1110"],
    "ST.Z":    ["0", "1", "0000"],
    "ST.Z+":   ["1", "1", "0001"],
    "ST.-Z":   ["1", "1", "0010"],
    "ST.Y":    ["0", "1", "1000"],
    "ST.Y+":   ["1", "1", "1001"],
    "ST.-Y":   ["1", "1", "1010"],
    "ST.X":    ["1", "1", "1100"],
    "ST.X+":   ["1", "1", "1101"],
    "ST.-X":   ["1", "1", "1110"],
    "XCH.Z":   ["1", "1", "0100"],
    "ELPM.Z":  ["1", "0", "0110"],
    "ELPM.Z+": ["1", "0", "0111"],
    "LPM.Z":   ["1", "0", "0100"],
    "LPM.Z+":  ["1", "0", "0101"],
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
*/

export const encode = (
    instruction: Instruction,
    _pc: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in mapping)) {
        return null;
    }
    checkCount(instruction.operands, ["register"]);
    check("register", 0, instruction.operands[0]!);
    const [firstOperationBit, secondOperationBit, suffix] =
        mapping[instruction.mnemonic]!;
    // In the official documentation, the store operations have
    // "XXXX XXXr rrrr XXXX" as their template rather than "d dddd".
    return template(
        `100${firstOperationBit}_00${secondOperationBit}d_dddd_${suffix}`,
        { "d": instruction.operands[0] }
    );
};
