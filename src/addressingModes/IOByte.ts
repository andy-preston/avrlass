import { Instruction } from "../instruction.ts";
import { GeneratedCode, template } from "../binaryTemplate.ts";
import { check, checkCount, OperandIndex } from "../operands.ts";

const mappings: Record<string, [string, OperandIndex, OperandIndex]> = {
    "IN":  ["0", 0, 1],
    "OUT": ["1", 1, 0]
};

export const encode = (
    instruction: Instruction,
    _pc: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in mappings)) {
        return null;
    }
    const [operationBit, registerIndex, portIndex] =
        mappings[instruction.mnemonic]!;
    checkCount(
        instruction.operands,
        registerIndex < portIndex ? ["register", "port"] : ["port", "register"]
    );
    const register = instruction.operands[registerIndex]!;
    const port = instruction.operands[portIndex]!;
    check("register", registerIndex, register);
    check("port", portIndex, port);
    return template(`1011_${operationBit}AAd_dddd_AAAA`, {
        "d": register,
        "A": port
    });
};
