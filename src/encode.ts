import { relativeJump } from "./binaryMapping.ts";


export const encode = (
    pc: number,
    mnemonic: string,
    operands: Array<number>
): GeneratedCode => {

    switch (mnemonic) {
        case "FMUL":
            return template("0000_0011_0ddd_1rrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });
        case "FMULS":
            return template("0000_0011_1ddd_0rrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });
        case "FMULSU":
            return template("0000_0011_1ddd_1rrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });
        case "MULSU":
            return template("0000_0011_0ddd_0rrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });


        case "MULS":
            return template("0000_0010_dddd_rrrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });
        case "MOVW":
            return template("0000_0001_dddd_rrrr", {
                "d": operands[0]! / 2,
                "r": operands[1]! / 2
            });



        case "LDS":
            return template("1001_000d_dddd_0000_kkkk_kkkk_kkkk_kkkk", {
                "d": operands[0],
                "k": operands[1]
            });
        case "STS":
            return template("1001_001d_dddd_0000_kkkk_kkkk_kkkk_kkkk", {
                "k": operands[0],
                "d": operands[1]
            });

        case "LDS.RC":
            return template("1010_0kkk_dddd_kkkk", {
                "d": operands[0]! - 16,
                "k":operands[1]
            });
        case "STS.RC":
            return template("1010_1kkk_dddd_kkkk", {
                "k": operands[0],
                "d": operands[1]! - 16
            });
    }
    throw `unknown instruction ${mnemonic}`;
}
