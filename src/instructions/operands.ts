export const checkRegisterOperand = (operand: number) => {
    if (operand < 0 || operand > 31) {
        throw new RangeError(
            "Operand out of range - expecting a register: R0 - R31"
        );
    }
}

export const checkImmediateRegisterOperand = (operand: number) => {
    if (operand < 16 || operand > 31) {
        throw new RangeError(
            "Operand out of range - expecting a register: R16 - R31"
        );
    }
}

export const checkBitIndexOperand = (operand: number) => {
    if (operand < 0 || operand > 7) {
        throw new Error(
            `Invalid operand - expecting a bit index 0-7 not ${operand}`
        );
    }
}

export const checkByteOperand = (operand: number) => {
    if (operand < -128 || operand > 255) {
        throw new RangeError(
            "Operand out of range - expecting a byte: -128 - 127 or 0 - 255"
        );
    }
}