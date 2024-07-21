const instructionSets = [
    "AVR",
    "AVRe",
    "AVRe+",
    "AVRrc",
    "AVRxm",
    "AVRxt"
] as const;

type InstructionSet = typeof instructionSets[number];

const short = (instructionSet: InstructionSet): string =>
    instructionSet.slice(-1).toLowerCase();

const missing = {
    "ADIW": "c",
    "BREAK": "r",
    "DES": "rc",
    "EICALL": "rec",
    "EIJMP": "rec",
    "ELPM": "rec",
    "ELPM.Z": "rec",
    "ELPM.Z+": "rec",
    "FMUL": "rec",
    "FMULS": "rec",
    "FMULSU": "rec",
    "JMP": "rc",
    "LAC": "re+tc",
    "LAS": "re+tc",
    "LAT": "re+tc",
    "LDD.Y": "c",
    "LDD.Z": "c",
    "LPM": "c",
    "LPM.Z": "rc",
    "LPM.Z+": "rc",
    "MOVW": "rc",
    "MUL": "rec",
    "MULS": "rec",
    "MULSU": "rec",
    "SBIW": "c",
    "SPM": "rc",
    // TODO: there was a duplicate key here.
    // we need to work out what to do about it!
    "SPM.Z+": "re+c"
    // "x" isn't a valid option????
    //"SPM.Z+": "re+xc"
};

type MissingOpCode = keyof typeof missing;

export const isMissing = (
    opCode: string,
    instructionSet: InstructionSet
): boolean =>
    opCode in missing &&
    missing[opCode as MissingOpCode].includes(short(instructionSet));
