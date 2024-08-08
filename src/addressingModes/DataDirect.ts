import { GeneratedCode, template } from "../binaryTemplate.ts";
import { Instruction } from "../instruction.ts";
import { registerFrom16 } from "../operands.ts";
import { check, checkCount, OperandIndex, TypeName } from "../operands.ts";

// I am not completely sure at this point how these instructions work
// there appear to be two versions, and I'm assuming that one operates on
// low SRAM devices and the other operates on devices with more SRAM
// in avrlass, he refers to the "big one" as LDS and the "little one" as LDS.RC

const bigMode = true;

const mapping: Record<string, [string, OperandIndex, OperandIndex]> = {
    "LDS": ["0", 0, 1],
    "STS": ["1", 1, 0]
};

export const encode = (
    instruction: Instruction,
    _pc: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in mapping)) {
        return null;
    }
    const [operationBit, registerIndex, addressIndex] =
        mapping[instruction.mnemonic]!;
    const registerType: TypeName = bigMode ? "register" : "immediateRegister";
    checkCount(
        instruction.operands,
        registerIndex == 0 ?
            [registerType, "ramAddress"] :
            ["ramAddress", registerType]
    );
    check(registerType, registerIndex, instruction.operands[registerIndex]!);
    check("ramAddress", addressIndex, instruction.operands[addressIndex]!);
    const prefix = bigMode ? "1001_00" : "1010_";
    const suffix = bigMode ? "d_dddd_0000_kkkk_kkkk_kkkk_kkkk" : "kkk_dddd_kkkk";
    const register = instruction.operands[registerIndex]!;
    return template(`${prefix}${operationBit}${suffix}`, {
        "d": bigMode ? register : registerFrom16(register),
        "k": instruction.operands[addressIndex]!
    });
};
