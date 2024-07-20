import {
    device,
    new_context,
    parse,
    compile,
    assemble,
    to_ihex,
    print_summary
} from "./avrlass.js";
import { hex_to_asm } from "./avrdass.js";

function print_help(){
  console.log(`\
avrlass - AVR Lightweight ASSembler
usage:
  avrlass [options] src.asm 
options:
  -D <macro>=<value> Define macro
  -I <dir>           Add directory to search path
  -o <file>          Write output to file, extensions: .hex/.bin/.json
  -t <arg>           Instruction Set: AVR/AVRe/AVRe+/AVRrc/AVRxm/AVRxt
  -d                 Disassemble instead of assemble
  -h                 Print this message
`)
}

for (let i = 0; i < Deno.args.length; i++){
  if (Deno.args[i][0] == '-' && Deno.args[i][1] != '-' && Deno.args[i].length > 2){
    if (Deno.args[i][1].toLowerCase() == Deno.args[i][1]){
      Deno.args.push('-'+Deno.args[i].slice(2));
    }else{
      Deno.args.push(Deno.args[i].slice(2));
    }
    Deno.args[i] = Deno.args[i].slice(0,2);
  }
}

let src = "";
let inp_pth = null;
let out_pth = 'stdout';
let inc_pths = ['./'];
let is_dis = false;

for (let i = 1; i < Deno.args.length; i++){
  if (Deno.args[i] == '-t'){
    device.instr_set=Deno.args[i+1];
    i++;
  }else if (Deno.args[i] == '-D'){
    src += '.DEF '+Deno.args[i+1]+'\n';
    i++;
  }else if (Deno.args[i] == '-o'){
    out_pth = Deno.args[i+1];
    i++;
  }else if (Deno.args[i] == '-I'){
    inc_pths.push(Deno.args[i+1]);
    i++;
  }else if (Deno.args[i] == '-d'){
    is_dis = true;
  }else if (Deno.args[i] == '-h' || Deno.args[i] == '--help'){
    print_help();
  }else if (Deno.args[i][0] == '-'){
    console.error('[error] unknow option: '+Deno.args[i]);
    Deno.exit(1);
  }else{
    inp_pth = Deno.args[i];
  }
}
function reader(pth){
  for (let i = 0; i < inc_pths.length; i++){
    try{
      return Deno.readFileSync(inc_pths[i]+'/'+pth).toString();
    }catch(e){
    }
  }
  console.error('[error] cannot find file: '+pth);
  Deno.exit(1);
}


if (inp_pth == null){
  print_help();
  Deno.exit(0);
}

try{
  src += reader(inp_pth);
  let hex = "";

  if (!is_dis){
    let context = new_context({});

    let lst = parse(src,reader,context);

    let ins = compile(lst,context);

    console.log(print_summary());

    if (out_pth.endsWith('.json')){
      Deno.writeFileSync(out_pth,'[\n'+ins.map(x=>JSON.stringify(x,(k,v)=>(v[2] instanceof Uint16Array)?[v[0],v[1],Array.from(v[2])]:v)).join(',\n')+'\n]\n');
      Deno.exit(0);
    }

    let code = assemble(ins);

    if (out_pth.endsWith('.bin')){
      Deno.writeFileSync(out_pth,Buffer.from(code));
      Deno.exit(0);
    }

    hex = to_ihex(code);
  }else{
    hex = hex_to_asm(src);
  }

  if (out_pth == 'stdout'){
    console.log(hex);
  }else{
    Deno.writeFileSync(out_pth,hex);
  }

}catch(e){
  console.error('[error] '+e);
  Deno.exit(1);
}

Deno.exit(0);