import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { Instruction } from "../instructions/instruction.ts";
import { registerFrom16 } from "../instructions/operands.ts";
import { check, checkCount, TypeName } from "../instructions/operands.ts";

const mapping: Record<string, [string, string]> = {
    "FMUL":   ["1_0", "1"],
    "FMULS":  ["1_1", "0"],
    "FMULSU": ["1_1", "1"],
    "MULSU":  ["1_0", "0"],
    "MULS":   ["0_d", "r"]
};

export const encode = (
    instruction: Instruction,
    _pc: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in mapping)) {
        return null;
    }
    const registerType: TypeName = instruction.mnemonic == "MULS" ?
        "immediateRegister" : "multiplyRegister";

    checkCount(instruction.operands, [registerType, registerType]);
    check(registerType, 0, instruction.operands[0]!);
    check(registerType, 1, instruction.operands[1]!);
    const [firstOperation, secondOperation] = mapping[instruction.mnemonic]!;
    return template(`0000_001${firstOperation}ddd_${secondOperation}rrr`, {
        "d": registerFrom16(instruction.operands[0]!),
        "r": registerFrom16(instruction.operands[1]!)
    });
};
