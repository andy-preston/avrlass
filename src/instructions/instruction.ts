export type Instruction = {
    "mnemonic": string,
    "operands": Array<number>
};

export const newInstruction = (
    mnemonic: string,
    operands: Array<number>
): Instruction => ({ "mnemonic": mnemonic, "operands": operands});
