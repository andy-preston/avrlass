import { Instruction, newInstruction } from "./instruction.ts";

export const instructionAlias = (instruction: Instruction): Instruction => {
    const operands = instruction.operands;
    switch (instruction.mnemonic) {
        case "BRSH": return newInstruction("BRBC", [0, operands[0]!]);
        case "BRCC": return newInstruction("BRBC", [0, operands[0]!]);
        case "BRNE": return newInstruction("BRBC", [1, operands[0]!]);
        case "BRPL": return newInstruction("BRBC", [2, operands[0]!]);
        case "BRVC": return newInstruction("BRBC", [3, operands[0]!]);
        case "BRGE": return newInstruction("BRBC", [4, operands[0]!]);
        case "BRHC": return newInstruction("BRBC", [5, operands[0]!]);
        case "BRTC": return newInstruction("BRBC", [6, operands[0]!]);
        case "BRID": return newInstruction("BRBC", [7, operands[0]!]);

        case "BRCS": return newInstruction("BRBS", [0, operands[0]!]);
        case "BRLO": return newInstruction("BRBS", [0, operands[0]!]);
        case "BREQ": return newInstruction("BRBS", [1, operands[0]!]);
        case "BRMI": return newInstruction("BRBS", [2, operands[0]!]);
        case "BRVS": return newInstruction("BRBS", [3, operands[0]!]);
        case "BRLT": return newInstruction("BRBS", [4, operands[0]!]);
        case "BRHS": return newInstruction("BRBS", [5, operands[0]!]);
        case "BRTS": return newInstruction("BRBS", [6, operands[0]!]);
        case "BRIE": return newInstruction("BRBS", [7, operands[0]!]);

        case "CLC": return newInstruction("BCLR", [0]);
        case "CLZ": return newInstruction("BCLR", [1]);
        case "CLN": return newInstruction("BCLR", [2]);
        case "CLV": return newInstruction("BCLR", [3]);
        case "CLS": return newInstruction("BCLR", [4]);
        case "CLH": return newInstruction("BCLR", [5]);
        case "CLT": return newInstruction("BCLR", [6]);
        case "CLI": return newInstruction("BCLR", [7]);

        case "SEC": return newInstruction("BSET", [0]);
        case "SEZ": return newInstruction("BSET", [1]);
        case "SEN": return newInstruction("BSET", [2]);
        case "SEV": return newInstruction("BSET", [3]);
        case "SES": return newInstruction("BSET", [4]);
        case "SEH": return newInstruction("BSET", [5]);
        case "SET": return newInstruction("BSET", [6]);
        case "SEI": return newInstruction("BSET", [7]);
    }
    return instruction;
};
