import { relativeJump } from "../binaryMapping.ts";
import { Instruction } from "../instructions/instruction.ts";
import { GeneratedCode } from "../instructions/binaryTemplate.ts";
import { template } from "../instructions/binaryTemplate.ts";
import { checkBitIndexOperand } from "../instructions/operands.ts";

const mappings: Record<string, [string, number?]> = {
    "BRBC": ["1", undefined],
    "BRSH": ["1", 0],
    "BRCC": ["1", 0],
    "BRNE": ["1", 1],
    "BRPL": ["1", 2],
    "BRVC": ["1", 3],
    "BRGE": ["1", 4],
    "BRHC": ["1", 5],
    "BRTC": ["1", 6],
    "BRID": ["1", 7],
    "BRBS": ["0", undefined],
    "BRCS": ["0", 0],
    "BRLO": ["0", 0],
    "BREQ": ["0", 1],
    "BRMI": ["0", 2],
    "BRVS": ["0", 3],
    "BRLT": ["0", 4],
    "BRHS": ["0", 5],
    "BRTS": ["0", 6],
    "BRIE": ["0", 7]
};

export const encode = (instruction: Instruction): GeneratedCode | null => {
    if (!(instruction.mnemonic in mappings)) {
        return null;
    }
    const [operationBit, impliedOperand] = mappings[instruction.mnemonic]!;
    const operandCount = impliedOperand == undefined ? 2 : 1;
    if (instruction.operands.length != operandCount) {
        throw new Error(`Incorrect operands - expecting ${operandCount}`);
    }
    const bit = impliedOperand == undefined ?
        instruction.operands[0] : impliedOperand;
    const jumpAddress = impliedOperand == undefined ?
        instruction.operands[1] : instruction.operands[0];
    checkBitIndexOperand(bit!);
    return template(`1111_0${operationBit}kk_kkkk_ksss`, {
        "s": bit,
        "k": relativeJump(jumpAddress!, 7, pc)
    });
};
