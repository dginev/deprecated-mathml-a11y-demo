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
  let the_concept = concept;
  let end_concept = "end-" + concept;
  if (!concept.startsWith("the ")) {
    the_concept = "the " + concept; }
  else {
    end_concept = "end-" + concept.slice(4); }
  let space_idx = end_concept.indexOf(' ');
  if (space_idx > 0) {
    end_concept = end_concept.slice(0, space_idx); }
  return the_concept + " of " + arg + " "+end_concept; }
function the_np_from_to(op, args) {
  let concept = result_word_for_operation(op);
  let the_concept = concept;
  let end_concept = "end-" + concept;
  if (!concept.startsWith("the ")) {
    the_concept = "the " + concept; }
  else { // to confusing to double-close...
    end_concept = ""; }
  let space_idx = end_concept.indexOf(' ');
  if (space_idx > 0) {
    end_concept = end_concept.slice(0, space_idx); }
  return "the " + concept + " from " + args[0] + " to "+args[1]+" "+end_concept;
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
    case ')': return 'close parenthesis';
    default: { // leverage all the power of speech-rule-engine for the terminals
      var aural = sre.AuralRendering.getInstance();
      var descrs = [
        sre.AuditoryDescription.create({ text: textsymbol }, { adjust: true, translate: true })];
      var result = aural.finalize(aural.markup(descrs));
      return result;
    }
  }
}
function narrate_by_table(op, arg_narrations, style, fixity) {
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
      return phrase_narrate_switch(op, arg_narrations, fixity);
    default:
      if (op.startsWith('delimited-')) {
        return list_and(arg_narrations);
      }
      return default_narrate_switch(op, arg_narrations, fixity);
  }
}

function default_narrate_switch(op, arg_narrations, fixity) {
  switch (op) {
    case 'math':
    case 'mrow':
      return arg_narrations.join(" ");
    case 'msub':
      return infix("Subscript", arg_narrations);
    case 'msup':
      return infix("Superscript", arg_narrations);
    case 'msubsup':
      return [arg_narrations[0], "Subscript", arg_narrations[1], "Superscript", arg_narrations[2]].join(" ");
    case 'element-of':
      return infix('is an element of', arg_narrations);
    case 'index':
      return arg_narrations[0]+" at index "+arg_narrations[1];
    case 'equals':
      return infix('is equal to', arg_narrations);
    case 'functional-power':
      return arg_narrations[0]+' to the '+arg_narrations[1];
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
      switch (fixity) {
        case 'prefix': return np_of(op, arg_narrations[0]);
        case 'infix':
        case 'nary-infix':
          return the_np(op, list_and(arg_narrations));
        case 'postfix': return the_np(op, arg_narrations[0]);
        case 'subfix': return arg_narrations[0] + " " + op + " at " + arg_narrations[1];
        case 'superfix': return arg_narrations[0]+" to the "+op+" of "+arg_narrations[1];
        case 'fenced': return the_np(op, list_and(arg_narrations))
        default: return the_np(op, list_and(arg_narrations));
      }
  }
}

function phrase_narrate_switch(op, arg_narrations, fixity) {
  switch(op) {
    case 'math':
    case 'mrow':
    case 'functional-power':
    case 'multirelation':
    case 'index':
      return arg_narrations.join(" ");
    case 'msub':
      return infix("Subscript", arg_narrations);
    case 'msup':
      return infix("Superscript", arg_narrations);
    case 'msubsup':
      return [arg_narrations[0], "Subscript", arg_narrations[1], "Superscript", arg_narrations[2]].join(" ");
    case 'divide':
      return infix('divided by', arg_narrations);
    case 'binomial':
      return infix('choose', arg_narrations);
    case 'element-of':
      return infix('in', arg_narrations);
    case 'open-interval':
    case 'closed-interval':
    case 'open-closed-interval':
    case 'closed-open-interval':
      return infix('to', arg_narrations);
    case 'integral':
      return np_of(op,arg_narrations[0]+' d '+arg_narrations[1]);
    case 'derivative-implicit-variable':
      return infix(" derivative of ", [numeral(arg_narrations[1]), arg_narrations[0]]);
    default:
      switch (fixity) {
        case 'prefix': return np_of(op, arg_narrations[0]);
        case 'infix':
        case 'nary-infix':
          return infix(op, arg_narrations);
        case 'nary-implied':
          return np_of(op, list_and(arg_narrations));
        case 'postfix': return postfix(op, arg_narrations[0]);
        case 'subfix': return arg_narrations[0] + " at " + arg_narrations[1];
        case 'superfix': return arg_narrations[0] + " to the " + arg_narrations[1];
        case 'fenced': return np_of(op, list_and(arg_narrations));
        default: return np_of(op, list_and(arg_narrations));
      }
  }
}