import { Instruction } from "../instructions/instruction.ts";
import { GeneratedCode, template } from "../instructions/binaryTemplate.ts";
import {
    checkRegisterOperand,
    checkPortOperand
} from "../instructions/operands.ts";

const mappings: Record<string, [string, number, number]> = {
    "IN":  ["0", 0, 1],
    "OUT": ["1", 1, 0]
};

const expected = (registerIndex: number, portIndex: number) =>
    registerIndex < portIndex ?
        '1 register and 1 port' : '1 port and 1 register';

export const encode = (instruction: Instruction): GeneratedCode | null => {
    if (!(instruction.mnemonic in mappings)) {
        return null;
    }
    const [operationBit, registerIndex, portIndex] =
        mappings[instruction.mnemonic]!;
    if (instruction.operands.length != 2) {
        throw new Error(
            `Incorrect operands - expecting ${expected(registerIndex, portIndex)}`
        );
    }
    const register = instruction.operands[registerIndex]!;
    const port = instruction.operands[portIndex]!;
    checkRegisterOperand(register);
    checkPortOperand(port);
    return template(`1011_${operationBit}AAd_dddd_AAAA`, {
        "d": register,
        "A": port
    });
};
