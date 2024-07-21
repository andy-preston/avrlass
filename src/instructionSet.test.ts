import { assert, assertFalse } from "assert";
import { isMissing } from "./instructionSet.ts";

Deno.test("The MUL instruction is not available in the AVR instruction set", () => {
    assert(isMissing("MUL", "AVR"));
});

Deno.test("The JMP instruction is available in the AVRe instruction set", () => {
    assertFalse(isMissing("JMP", "AVRe"));
});
