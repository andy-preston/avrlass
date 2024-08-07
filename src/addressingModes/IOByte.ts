import { Instruction } from "../instructions/instruction.ts";
import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import { check, checkCount } from "../instructions/operands.ts";

const mappings: Record<string, [string, number, number]> = {
    "IN":  ["0", 0, 1],
    "OUT": ["1", 1, 0]
};

export const encode = (instruction: Instruction): GeneratedCode | null => {
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
    check("register", registerIndex == 0 ? "first" : "second", register);
    check("port", portIndex == 0 ? "first" : "second", port);
    return template(`1011_${operationBit}AAd_dddd_AAAA`, {
        "d": register,
        "A": port
    });
};
