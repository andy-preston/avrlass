export type Operands = Array<number>;

type CheckFunction = (operand: number) => boolean;

type Operand = [CheckFunction, string];

const types = {
    "register": [
        (operand: number) => operand >= 0 && operand <= 31,
        "register (R0 - R31)"
    ],
    "immediateRegister": [
        (operand: number) => operand >=16 && operand <= 31,
        "register (R16 - R31)"
    ],
    "registerPair": [
        (operand: number) => [24, 26, 28, 30].includes(operand),
        "register pair (R24, R26, R28, R30)"
    ],
    "port": [
        (operand: number) => operand >= 0 && operand <= 0x3f,
        "GPIO port (0 - 0x3F)"
    ],
    // These two have the same rule but their context is different
    "sixBits": [
        (operand: number) => operand >= 0 && operand <= 0x3f,
        "six bit number (0 - 0x3F)"
    ],
    "bitIndex": [
        (operand: number) => operand >= 0 && operand <= 7,
        "bit index (0 - 7)"
    ],
    "byte": [
        (operand: number) => operand >= -128 && operand <= 0xFF,
        "byte (-128 - 127) or (0 - 0xFF)"
    ],
    "nybble": [
        (operand: number) => operand >= 0 && operand <= 0x0F,
        "nybble (0 - 0x0F)"
    ],
    "address": [
        (operand: number) => operand >= 0 && operand <= 0x3FFFFF,
        "branch to 22 bit address (0 - 0x3FFFFF) (4 Meg)"
    ],
    "relativeAddress": [
        (operand: number) => operand >= 0 || operand <= 0x1000,
        "branch to 12 bit address (0 - 0x1000) (4 K)"
    ]
} satisfies Record<string, Operand>;

type TypeName = keyof typeof types;

const description = (typeName: TypeName): string => types[typeName][1];

export const check = (
    typeName: TypeName,
    position: "first" | "second",
    value: number
) => {
    const theType = types[typeName];
    if (!theType[0](value)) {
        const displayValue = `${value} / 0x${value.toString(16)}`;
        const expectation = `expecting ${theType[1]} not`
        throw new RangeError(
            `${position} operand out of range - ${expectation} ${displayValue}`
        );
    }
};

export const checkCount = (list: Operands, expected: Array<TypeName>) => {
    if (list.length != expected.length) {
        const descriptions = expected.length == 0 ?
            "none" :
            expected.map(description).join(" and ");
        throw new Error(`Incorrect operands - expecting ${descriptions}`);
    }
};
