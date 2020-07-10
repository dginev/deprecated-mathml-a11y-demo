function obtain_arg(target_arg, context) {
  // Simple DFS descent
  let result;
  $.each(context.children, function(child_idx, child) {
    if (child.getAttribute('data-arg') == target_arg) {
      result = child; return false; }
    else if (!child.getAttribute('data-semantic')) {
      let child_result = obtain_arg(target_arg, child);
      if (child_result) {
        result = child_result; return false; } }
  });
  return result; }

function action_concept(op) {
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

// np = noun phrase
function np_of(op, arg) {
  return op + " of " + arg; }
function the_np(op,arg) {
  let concept = action_concept(op);
  return "the " + concept + " of " + arg + " end-" + concept; }
function the_np_from_to(op, args) {
  let concept = action_concept(op);
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
    default: return textsymbol;
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
    default:
      return wrapped(op, arg_narrations.join(", "));
  }
}

// Just a very simple DFS for now with Neil Soiffer's early stopping algorithm
function narrate(math, style) {
  if (!math) { return '';}
  if (typeof math === 'string') { return math;} // literal narrates as self (for now)
  let narration = '';
  let semantic = $(math).data('semantic');
  return narrate_semantic(math, style, semantic); }
// narrate_semantic($('body'),'phrase','equals(plus(1,2),times(3,minus(5)))')

function narrate_semantic(math, style, semantic) {
  if (semantic && semantic.length>0) { // balanced parens need a context-free grammar here, but for the demo we regex and whistle.
    let operator_call = /^([^(]+)\((.*)\)$/;
    let op_arg;
    let arg_body = semantic.replace(operator_call, function (m0, m1, m2) { op_arg=m1; return m2;});
    // we can't just split by coma, we need to balance any possible parens...
    let args = [op_arg];
    let piece='';
    let open_stack = 0;
    for (const c of arg_body) {
      switch (c) {
      case ',':
        if (open_stack == 0) {
          args.push(piece); piece = ''; }
        else { piece+=c;}
        break;
      case '(':
        open_stack+=1;
        piece+=c;
        break;
      case ')':
        open_stack-=1;
        piece += c;
        break;
      default:
        piece += c; } }
    if (piece && piece.length>0) { // wrap up
      args.push(piece); }
    let arg_narrations = [];
    let context = math[0];
    $.each(args, function (idx, arg) {
      if (!arg) { return true; } // continue on undefined arguments
      // if any of the args contains () they need to be expanded recursively, do so
      if (arg.indexOf('(') > -1 || arg.indexOf(')') > -1) {
        arg_narrations.push(narrate_semantic(math, style, arg)); }
      else if (!arg.startsWith('#')) { // literal
        arg_narrations.push(arg); }
      else {
        arg = arg.substr(1);
        let arg_node = obtain_arg(arg, context);
        if (arg_node) {
          arg_narrations.push(narrate($(arg_node), style)); }
        else {
          arg_narrations.push("missing_arg:"+arg); } }
    });
    // TODO: We need a great XPath here to avoid descending into data-semantic nodes. "exclude" requires XPath 3 which we don't have access to.
    // crutch for now, to go 1 or 2 levels down only.
    op_key = arg_narrations.shift();
    if (op_key && op_key.length>0) {
      if (arg_narrations.length == 0) {
        narration = narrate_symbol(op_key); }
      else {
        narration = narrate_by_table(op_key, arg_narrations, style); } }
    else {
      narration = 'failed_to_narrate:(' + semantic+')'; }
  } else {
    // descend in children, assuming independence
    let children = $(math).children();
    if (children.length > 0) {
      var arg_narrations = [];
      $(children).each(function (index, value) {
        arg_narrations.push(narrate($(value), style));
      });
      narration = narrate_by_table($(math).prop("tagName"), arg_narrations, style);
    } else {
      narration = $(math).text();
      if (style != 'annotation') {
        narration = narrate_symbol(narration);
      }
    }
  }
  narration = narration.replace(/\s\s+/g, ' '); // sloppy spacing work, just clean up at the end
  return narration;
}
