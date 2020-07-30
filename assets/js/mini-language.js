// -- translating to English, the lingustics-near bits
// if we have an "operator" word, we often use a generalized form when
// building a noun phrase for the "result" of that operator.
function result_word_for_operation(op) {
  switch(op) {
    case 'plus': return 'sum';
    case 'minus': return 'difference';
    case 'times': return 'product';
    case 'divide': return 'division';
    case 'equals': return 'equality';
    default: // default as-is
      return op; } }
function list_conj(conj, args) {
  if (!Array.isArray(args)) {
    return args; }
  switch (args.length) {
    case 0: return '';
    case 1: return args[0];
    default:
      let last_arg = args.pop().trim();
      if (last_arg.startsWith(conj)) { // some flexibility for '...'
        return args.join(", ") + " " + last_arg; }
      else {
        return args.join(", ")+" "+conj+" "+last_arg; }
  }
}
function list_and(args) {return list_conj("and", args);}
function list_or(args) { return list_conj("or", args); }
function numeral(s) {
  s = s.toString();
  switch (s) {
    case '1': return 'first';
    case '21': return 'twenty-first';
    case '2': return 'second';
    case '22': return 'twenty-second';
    case '3': return 'third';
    case '23': return 'twenty-third';
    case '4': return 'fourth';
    case '5': return 'fifth';
    case '6': return 'sixth';
    case '7': return 'seventh';
    case '8': return 'eighth';
    case '9': return 'nineth';
    case '10': return 'tenth';
    default: return s+"-th";
  }
}

// np = noun phrase
function np_of(op, arg) {
  return op + " of " + arg; }
function the_np(op,arg) {
  let concept = result_word_for_operation(op);
  return "the " + concept + " of " + arg + " end-" + concept; }
function the_np_from_to(op, args) {
  let concept = result_word_for_operation(op);
  return "the " + concept + " from " + args[0] + " to "+args[1]+" end-" + concept;
}
function modified_n(op, arg) { // for things like transpose maybe?
  return arg+" "+op+"-ed"; }
function infix(op, args) {
  return args.join(" "+op+" "); }
function infix_dashed(op, args) {
  return args.join("-" + op + "-");
}
function postfix(op, arg) {
  return arg+" "+op; }
function prefix(op, arg) {
  return op + " " +arg; }
function wrapped(op, arg) {
  if (op && op.length>0) {
    return op+"-start "+arg+" "+op+"-end"; }
  else {
    return arg; } }

function narrate_symbol(textsymbol) {
  switch(textsymbol) {
    case '…': return 'and so on';
    case '′': return 'prime';
    case '(': return 'open parenthesis';
    case '(': return 'close parenthesis';
    default: {
      if (textsymbol.length == 1 && textsymbol != textsymbol.toLowerCase()) {
        return 'upper '+textsymbol;
      } else {
        return textsymbol;
      }
    }
  }
}
function narrate_by_table(op, arg_narrations, style) {
  switch(style) {
    case 'annotation':
      if (!op || op.length == 0 || op == 'math' || op =='mrow') {
        return arg_narrations.join(", ");
      } else {
        return op+"("+arg_narrations.join(", ")+")";
      }
    case 'phrase':
      if (op.startsWith('delimited-')) {
        return list_and(arg_narrations);
      }
      return phrase_narrate_switch(op, arg_narrations);
    default:
      if (op.startsWith('delimited-')) {
        return list_and(arg_narrations);
      }
      return default_narrate_switch(op, arg_narrations);
  }
}

function default_narrate_switch(op, arg_narrations) {
  switch (op) {
    case 'math':
    case 'mrow':
      return arg_narrations.join(" ");
    case 'msubsup':
      return [arg_narrations[0], "Subscript", arg_narrations[1], "Superscript", arg_narrations[2]].join(" ");
    case 'plus':
    case 'minus':
    case 'times':
    case 'divide':
      switch (arg_narrations.length) {
        case 0: return op;
        case 1: return prefix(op, arg_narrations[0]);
        default: return the_np(op, list_and(arg_narrations)); //n-ary
      }
    case 'square-root':
    case 'factorial':
      return the_np(op, arg_narrations[0]);
    case 'binomial':
    case 'set':
    case 'absolute-value':
    case 'ceiling':
    case 'floor':
      return the_np(op, list_and(arg_narrations));
    case 'element-of':
      return infix('is an element of', arg_narrations);
    case 'equals':
      return infix('is equal to', arg_narrations);
    case 'multirelation':
      let relations = [];
      let max_index = arg_narrations.length-3;
      let index = 0;
      while(index<=max_index) {
        relations.push(
          infix(arg_narrations[index+1],
            [arg_narrations[index], arg_narrations[index+2]]));
        index+=2; }
      return infix('and', relations);
    case 'open-interval':
    case 'closed-interval':
    case 'open-closed-interval':
    case 'closed-open-interval':
      return the_np_from_to(op, arg_narrations);
    case 'integral':
      return the_np(op, arg_narrations[0] + ' d ' + arg_narrations[1]);
    case 'derivative-implicit-variable':
      return infix(" derivative of ", [numeral(arg_narrations[1]), arg_narrations[0]]);
    default:
      // considered as default:
      // case 'msub':
      // case 'msup':
      // case 'msqrt':
      return wrapped(op, arg_narrations.join(", "));
  }
}

function phrase_narrate_switch(op, arg_narrations) {
  switch(op) {
    case 'math':
    case 'mrow':
      return arg_narrations.join(" ");
    case 'msub':
    case 'msup':
      return infix_dashed(op, arg_narrations);
    case 'msubsup':
      return [arg_narrations[0], "Subscript", arg_narrations[1], "Superscript", arg_narrations[2]].join(" ");
    case 'msqrt':
    case 'square-root':
      return prefix('square root', arg_narrations[0]);
    case 'plus': // multiple fixities, determine by arg count
    case 'minus':
    case 'times':
    case 'equals':
      switch(arg_narrations.length) {
        case 0: return op;
        // the 1-argument case is obviously incorrect, A- for effort
        // we need a special way to mark a postfix op, from the presentation
        // it's too late to try here
        case 1: return prefix(op, arg_narrations[0]);
        default: return infix(op, arg_narrations); //n-ary infix
      }
    case 'divide':
      return infix('divided by', arg_narrations);
    case 'factorial':
      return postfix(op, arg_narrations[0]);
    case 'binomial':
      return infix('choose', arg_narrations);
    case 'set':
      return the_np(op, list_and(arg_narrations));
    case 'element-of':
      return infix('in', arg_narrations);
    case 'multirelation':
    case 'index':
      return arg_narrations.join(" ");
    case 'open-interval':
    case 'closed-interval':
    case 'open-closed-interval':
    case 'closed-open-interval':
      return infix('to', arg_narrations);
    case 'absolute-value':
      return np_of('modulus', arg_narrations[0]);
    case 'ceiling':
    case 'floor':
      return np_of(op,arg_narrations[0]);
    case 'integral':
      return np_of(op,arg_narrations[0]+' d '+arg_narrations[1]);
    case 'derivative-implicit-variable':
      return infix(" derivative of ", [numeral(arg_narrations[1]), arg_narrations[0]]);
    default:
      return np_of(op, arg_narrations.join(", "));
  }
}