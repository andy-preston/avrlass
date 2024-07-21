import { relativeJump, twosComplement } from "./binaryMapping.ts";

type GeneratedCode = [number, number] | [number, number, number, number];

interface AllTemplateOperands {
    "A": number;
    "b": number;
    "d": number;
    "k": number;
    "K": number;
    "r": number;
    "s": number;
    "q": number;
}

type TemplateOperands = Partial<AllTemplateOperands>;

type TemplateOperandKey = keyof AllTemplateOperands;

export const encode = (
    pc: number,
    mnemonic: string,
    operands: Array<number>
): GeneratedCode => {
    const template = (
        templateString: string,
        operands: TemplateOperands
    ): GeneratedCode => {
        const templateDigits = templateString.split('').reverse();
        for (const key in operands) {
            const operand = operands[key as TemplateOperandKey]!;
            const bin = operand.toString(2).split('').reverse().concat(
                new Array(32).fill(0)
            );
            for (let digit = 0; digit < templateDigits.length; digit++){
                if (templateDigits[digit] == key){
                    templateDigits[digit] = bin.shift()!;
                }
            }
            if (bin[0]) {
                throw `(${pc}) ${mnemonic} operand out of range: ${key} = ${operand} in ${templateString}`;
            }
        }
        const result = eval('0b' + templateDigits.reverse().join('')) as number;
        return result > 65535 ? [
            (result >> 16) & 0xff,
            (result >> 24) & 0xff,
            result & 0xff,
            (result >> 8) & 0xff
        ]: [
            result & 0xff,
            (result >> 8) & 0xff
        ];
    }

    switch (mnemonic) {
        case "ADC":
            return template("0001_11rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
        case "ADD":
            return template("0000_11rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
        case "ADIW":
            return template("1001_0110_KKdd_KKKK", {
                "d": (operands[0]! - 24) / 2,
                "K": operands[1]
            });
        case "AND":
            return template("0010_00rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
        case "ANDI":
            return template("0111_KKKK_dddd_KKKK", {
                "d": operands[0]! - 16,
                "K": operands[1]
            });
        case "ASR":
            return template("1001_010d_dddd_0101", {
                "d": operands[0]
            });
        case "BCLR":
            return template("1001_0100_1sss_1000", {
                "s": operands[0]
            });
        case "BLD":
            return template("1111_100d_dddd_0bbb", {
                "d": operands[0],
                "b": operands[1]
            });
        case "BRBC":
            return template("1111_01kk_kkkk_ksss", {
                "s": operands[0],
                "k": relativeJump(operands[1]!, 7, pc)
            });
        case "BRBS":
            return template("1111_00kk_kkkk_ksss", {
                "s": operands[0],
                "k": relativeJump(operands[1]!, 7, pc)
            });
        case "BRCC":
            return encode(pc, "BRBC", [0, operands[0]!]);
        case "BRCS":
            return encode(pc, "BRBS", [0, operands[0]!]);
        case "BREAK":
            return template("1001_0101_1001_1000", {});
        case "BREQ":
            return encode(pc, "BRBS", [1, operands[0]!]);
        case "BRGE":
            return encode(pc, "BRBC", [4, operands[0]!]);
        case "BRHC":
            return encode(pc, "BRBC", [5, operands[0]!]);
        case "BRHS":
            return encode(pc, "BRBS", [5, operands[0]!]);
        case "BRID":
            return encode(pc, "BRBC", [7, operands[0]!]);
        case "BRIE":
            return encode(pc, "BRBS", [7, operands[0]!]);
        case "BRLO":
            return encode(pc, "BRBS", [0, operands[0]!]);
        case "BRLT":
            return encode(pc, "BRBS", [4, operands[0]!]);
        case "BRMI":
            return encode(pc, "BRBS", [2, operands[0]!]);
        case "BRNE":
            return encode(pc, "BRBC", [1, operands[0]!]);
        case "BRPL":
            return encode(pc, "BRBC", [2, operands[0]!]);
        case "BRSH":
            return encode(pc, "BRCC", operands);
        case "BRTC":
            return encode(pc, "BRBC", [6, operands[0]!]);
        case "BRTS":
            return encode(pc,"BRBS", [6, operands[0]!]);
        case "BRVC":
            return encode(pc, "BRBC", [3, operands[0]!]);
        case "BRVS":
            return encode(pc, "BRBS", [3, operands[0]!]);
        case "BSET":
            return template("1001_0100_0sss_1000", {
                "s": operands[0]
            });
        case "BST":
            // In the original code in AVRLASS, this was given as
            // 1001_101d_dddd_0bbb this has been corrected after testing
            // against GAVRASM and
            // https://ww1.microchip.com/downloads/en/devicedoc/atmel-0856-avr-instruction-set-manual.pdf
            return template("1111_101d_dddd_0bbb", {
                "d": operands[0],
                "b": operands[1]
            });
        case "CALL":
            return template("1001_010k_kkkk_111k_kkkk_kkkk_kkkk_kkkk", {
                "k": operands[0]
            });
        case "CBI":
            return template("1001_1000_AAAA_Abbb", {
                "A": operands[0],
                "b":operands[1]
            });
        case "CBR":
            return encode(pc, "ANDI", [operands[0]!, 0xFF - operands[1]!]);
        case "CLC":
            return encode(pc, "BCLR", [0]);
        case "CLH":
            return encode(pc, "BCLR", [5]);
        case "CLI":
            return encode(pc, "BCLR", [7]);
        case "CLN":
            return encode(pc, "BCLR", [2]);
        case "CLR":
            return encode(pc, "EOR", [operands[0]!, operands[0]!]);
        case "CLS":
            return encode(pc, "BCLR", [4]);
        case "CLT":
            return encode(pc, "BCLR", [6]);
        case "CLV":
            return encode(pc, "BCLR", [3]);
        case "CLZ":
            return encode(pc, "BCLR", [1]);
        case "COM":
            return template("1001_010d_dddd_0000", {
                "d": operands[0]
            });
        case "CP":
            return template("0001_01rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
        case "CPC":
            return template("0000_01rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
        case "CPI":
            return template("0011_KKKK_dddd_KKKK", {
                "d": operands[0]! - 16,
                "K": twosComplement(operands[1]!, 8, false)
            });
        case "CPSE":
            return template("0001_00rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
        case "DEC":
            return template("1001_010d_dddd_1010", {
                "d": operands[0]
            });
        case "DES":
            return template("1001_0100_KKKK_1011", {
                "K": operands[0]
            });
        case "EICALL":
            return template("1001_0101_0001_1001", {});
        case "EIJMP":
            return template("1001_0100_0001_1001", {});
        case "ELPM":
            return template("1001_0101_1101_1000", {});
        case "ELPM.Z":
            return template("1001_000d_dddd_0110", {
                "d": operands[0]
            });
        case "ELPM.Z+":
            return template("1001_000d_dddd_0111", {
                "d": operands[0]
            });
        case "EOR":
            return template("0010_01rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
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
        case "ICALL":
            return template("1001_0101_0000_1001", {});
        case "IJMP":
            return template("1001_0100_0000_1001", {});
        case "IN":
            return template("1011_0AAd_dddd_AAAA", {
                "d": operands[0],
                "A": operands[1]
            });
        case "INC":
            return template("1001_010d_dddd_0011", {
                "d": operands[0]
            });
        case "JMP":
            return template("1001_010k_kkkk_110k_kkkk_kkkk_kkkk_kkkk", {
                "k":operands[0]
            });
        case "LAC":
            return template("1001_001r_rrrr_0110", {
                "r": operands[1]
            });
        case "LAS":
            return template("1001_001r_rrrr_0101", {
                "r": operands[1]
            });
        case "LAT":
            return template("1001_001r_rrrr_0111", {
                "r": operands[1]
            });
        case "LD.X":
            return template("1001_000d_dddd_1100", {
                "d": operands[0]
            });
        case "LD.X+":
            return template("1001_000d_dddd_1101", {
                "d": operands[0]
            });
        case "LD.-X":
            return template("1001_000d_dddd_1110", {
                "d": operands[0]
            });
        case "LD.Y":
            return template("1000_000d_dddd_1000", {
                "d": operands[0]
            });
        case "LD.Y+":
            return template("1001_000d_dddd_1001", {
                "d": operands[0]
            });
        case "LD.-Y":
            return template("1001_000d_dddd_1010", {
                "d": operands[0]
            });
        case "LDD.Y":
            return template("10q0_qq0d_dddd_1qqq", {
                "d": operands[0],
                "q": operands[1]
            });
        case "LD.Z":
            return template("1000_000d_dddd_0000", {
                "d": operands[0]
            });
        case "LD.Z+":
            return template("1001_000d_dddd_0001", {
                "d": operands[0]
            });
        case "LD.-Z":
            return template("1001_000d_dddd_0010", {
                "d": operands[0]
            });
        case "LDD.Z":
            return template("10q0_qq0d_dddd_0qqq", {
                "d": operands[0],
                "q": operands[1]
            });
        case "LDI":
            return template("1110_KKKK_dddd_KKKK", {
                "d": operands[0]! - 16,
                "K": twosComplement(operands[1]!, 8, false)
            });
        case "LDS":
            return template("1001_000d_dddd_0000_kkkk_kkkk_kkkk_kkkk", {
                "d": operands[0],
                "k": operands[1]
            });
        case "LDS.RC":
            return template("1010_0kkk_dddd_kkkk", {
                "d": operands[0]! - 16,
                "k":operands[1]
            });
        case "LPM":
            return template("1001_0101_1100_1000", {});
        case "LPM.Z":
            return template("1001_000d_dddd_0100", {
                "d": operands[0]
            });
        case "LPM.Z+":
            return template("1001_000d_dddd_0101", {
                "d": operands[0]
            });
        case "LSL":
            return encode(pc, "ADD", [operands[0]!, operands[0]!]);
        case "LSR":
            return template("1001_010d_dddd_0110", {
                "d": operands[0]
            });
        case "MOV":
            return template("0010_11rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
        case "MOVW":
            return template("0000_0001_dddd_rrrr", {
                "d": operands[0]! / 2,
                "r": operands[1]! / 2
            });
        case "MUL":
            return template("1001_11rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
        case "MULS":
            return template("0000_0010_dddd_rrrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });
        case "MULSU":
            return template("0000_0011_0ddd_0rrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });
        case "NEG":
            return template("1001_010d_dddd_0001", {
                "d": operands[0]
            });
        case "NOP":
            return template("0000_0000_0000_0000", {});
        case "OR":
            return template("0010_10rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
        case "ORI":
            return template("0110_KKKK_dddd_KKKK", {
                "d": operands[0]! - 16,
                "K": operands[1]
            });
        case "OUT":
            return template("1011_1AAr_rrrr_AAAA", {
                "A": operands[0],
                "r": operands[1]
            });
        case "POP":
            return template("1001_000d_dddd_1111", {
                "d": operands[0]
            });
        case "PUSH":
            return template("1001_001d_dddd_1111", {
                "d": operands[0]
            });
        case "RCALL":
            return template("1101_kkkk_kkkk_kkkk", {
                "k": relativeJump(operands[0]!, 12, pc)
            });
        case "RET":
            return template("1001_0101_0000_1000", {});
        case "RETI":
            return template("1001_0101_0001_1000", {});
        case "RJMP":
            return template("1100_kkkk_kkkk_kkkk", {
                "k": relativeJump(operands[0]!, 12, pc)
            });
        case "ROL":
            return encode(pc, "ADC", [operands[0]!, operands[0]!]);
        case "ROR":
            return template("1001_010d_dddd_0111", {
                "d": operands[0]
            });
        case "SBC":
            return template("0000_10rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
        case "SBCI":
            return template("0100_KKKK_dddd_KKKK", {
                "d": operands[0]! - 16,
                "K": operands[1]
            });
        case "SBI":
            return template("1001_1010_AAAA_Abbb", {
                "A": operands[0],
                "b": operands[1]
            });
        case "SBIC":
            return template("1001_1001_AAAA_Abbb", {
                "A": operands[0],
                "b": operands[1]
            });
        case "SBIS":
            return template("1001_1011_AAAA_Abbb", {
                "A": operands[0],
                "b": operands[1]
            });
        case "SBIW":
            return template("1001_0111_KKdd_KKKK", {
                "d": (operands[0]! - 24) / 2,
                "K": operands[1]
            });
        case "SBR":
            return encode(pc, "ORI", operands);
        case "SBRC":
            return template("1111_110r_rrrr_0bbb", {
                "r": operands[0],
                "b": operands[1]
            });
        case "SBRS":
            return template("1111_111r_rrrr_0bbb", {
                "r": operands[0],
                "b":operands[1]
            });
        case "SEC":
            return encode(pc, "BSET", [0]);
        case "SEH":
            return encode(pc, "BSET", [5]);
        case "SEI":
            return encode(pc, "BSET", [7]);
        case "SEN":
            return encode(pc, "BSET", [2]);
        case "SER":
            return encode(pc, "LDI", [operands[0]!, 0xFF]);
        case "SES":
            return encode(pc, "BSET", [4]);
        case "SET":
            return encode(pc, "BSET", [6]);
        case "SEV":
            return encode(pc, "BSET", [3]);
        case "SEZ":
            return encode(pc, "BSET", [1]);
        case "SLEEP":
            return template("1001_0101_1000_1000", {});
        case "SPM":
            return template("1001_0101_1110_1000", {});
        case "SPM.Z+":
            return template("1001_0101_1111_1000", {});
        case "ST.X":
            return template("1001_001r_rrrr_1100", {
                "r": operands[0]
            });
        case "ST.X+":
            return template("1001_001r_rrrr_1101", {
                "r": operands[0]
            });
        case "ST.-X":
            return template("1001_001r_rrrr_1110", {
                "r": operands[0]
            });
        case "ST.Y":
            return template("1000_001r_rrrr_1000", {
                "r": operands[0]
            });
        case "ST.Y+":
            return template("1001_001r_rrrr_1001", {
                "r": operands[0]
            });
        case "ST.-Y":
            return template("1001_001r_rrrr_1010", {
                "r": operands[0]
            });
        case "STD.Y":
            return template("10q0_qq1r_rrrr_1qqq", {
                "q": operands[0],
                "r": operands[1]
            });
        case "ST.Z":
            return template("1000_001r_rrrr_0000", {
                "r": operands[0]
            });
        case "ST.Z+":
            return template("1001_001r_rrrr_0001", {
                "r": operands[0]
            });
        case "ST.-Z":
            return template("1001_001r_rrrr_0010", {
                "r": operands[0]
            });
        case "STD.Z":
            return template("10q0_qq1r_rrrr_0qqq", {
                "q": operands[0],
                "r": operands[1]
            });
        case "STS":
            return template("1001_001d_dddd_0000_kkkk_kkkk_kkkk_kkkk", {
                "k": operands[0],
                "d": operands[1]
            });
        case "STS.RC":
            return template("1010_1kkk_dddd_kkkk", {
                "k": operands[0],
                "d": operands[1]! - 16
            });
        case "SUB":
            return template("0001_10rd_dddd_rrrr", {
                "d": operands[0],
                "r": operands[1]
            });
        case "SUBI":
            return template("0101_KKKK_dddd_KKKK", {
                "d": operands[0]! - 16,
                "K": twosComplement(operands[1]!, 8, false)
            });
        case "SWAP":
            return template("1001_010d_dddd_0010", {
                "d": operands[0]
            });
        case "TST":
            return encode(pc, "AND", [operands[0]!, operands[0]!]);
        case "WDR":
            return template("1001_0101_1010_1000", {});
        case "XCH.Z":
            return template("1001_001r_rrrr_0100", {
                "r": operands[0]
            });
    }
    throw `unknown instruction ${mnemonic}`;
}

