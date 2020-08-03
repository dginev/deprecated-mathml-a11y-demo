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
