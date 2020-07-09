function obtain_arg(index, context) {
  if (index[0] == '@') {
    index = index.replace('@','');
    let xpathResult = document.evaluate(
      '*[@data-arg="' + index + '"] | *[not(@data-semantic)]/*[@data-arg="' + index + '"]',
      context);
    let found = xpathResult.iterateNext();
    return found ; }
  else { // literal was passed in, nothing to do
    return index; }
}

function action_concept(op) {
  switch(op) {
    case 'plus': return 'sum';
    case 'minus': return 'difference';
    case 'times': return 'product';
    case 'divide': return 'continued fraction';
    case 'equals': return 'equality';
    default: // default as-is
      return op; } }
function np_of(op, arg) {
  return op + " of " + arg; }
function the_np(op,arg) {
  let concept = action_concept(op);
  return "the " + concept + " of " + arg + " end-" + concept; }
function modified_n(op, arg) { // for things like transpose maybe?
  return arg+" "+op+"-ed"; }
function infix(op, args) {
  return args.join(" "+op+" "); }
function postfix(op, arg) {
  return arg+" "+op; }
function prefix(op, arg) {
  return op + " " +arg; }
function wrapped(op, arg) {
  if (op && op.length>0) {
    return op+"-start "+arg+" "+op+"-end"; }
  else {
    return arg; } }

function narrate_by_table(op, arg_narrations, style) {
  switch(style) {
    case 'annotation':
      if (!op || op.length == 0 || op == 'math' || op =='mrow') {
        return arg_narrations.join(", ");
      } else {
        return op+"("+arg_narrations.join(", ")+")";
      }
    case 'phrase':
      return phrase_narrate_switch(op, arg_narrations);
    default:
      return default_narrate_switch(op, arg_narrations);
  }
}

function default_narrate_switch(op, arg_narrations) {
  switch (op) {
    case 'math':
    case 'mrow':
      return arg_narrations.join(" ");
    case 'msub':
    case 'msup':
      return wrapped(op, arg_narrations.join(" "));
    case 'msqrt':
    case 'square-root':
      return wrapped(op, arg_narrations.join(" "));
    case 'plus':
    case 'minus':
    case 'times':
    case 'divide':
      switch (arg_narrations.length) {
        case 0: return op;
        case 1: return prefix(op, arg_narrations[0]);
        default: return the_np(op, arg_narrations.join(" and ")); //n-ary
      }
    case 'factorial':
      return the_np(op, arg_narrations[0]);
    case 'equals':
      infix('is equal to', arg_narrations);
    default:
      return wrapped(op, arg_narrations.join(" "));
  }
}

function phrase_narrate_switch(op, arg_narrations) {
  switch(op) {
    case 'math':
    case 'mrow':
      return arg_narrations.join(" ");
    case 'msub':
    case 'msup':
      return infix(op, arg_narrations);
    case 'msqrt':
    case 'square-root':
      return np_of(op, arg_narrations.join(" "));
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
    default:
      return wrapped(op, arg_narrations.join(" "));
  }
}

// Just a very simple DFS for now with Neil Soiffer's early stopping algorithm
function narrate(math, style) {
  if (!math) { return '';}
  if (typeof math === 'string') { return math;} // literal narrates as self (for now)
  let narration = '';
  let semantic = $(math).data('semantic');
  if (semantic && semantic.length>0) { // balanced parens need a context-free grammar here, but for the demo we regex and whistle.
    let operator_call = /^([^(]+)\((.*)\)$/;
    let op_arg;
    semantic = semantic.replace(operator_call, function (m0, m1, m2) { op_arg=m1; return m2;});
    let args = semantic.split(',');
    let arg_narrations = [];
    let context = math[0];
    $.each(args, function (idx, arg) {
      let arg_node = obtain_arg(arg, context);
      if (typeof arg_node === 'string') {
        arg_narrations.push(arg_node);
      } else {
        arg_narrations.push(narrate($(arg_node),style));
      }
    });
    // TODO: We need a great XPath here to avoid descending into data-semantic nodes. "exclude" requires XPath 3 which we don't have access to.
    // crutch for now, to go 1 or 2 levels down only.
    if (op_arg && op_arg.length > 0) {
      let op_node = obtain_arg(op_arg, context);
      let key = narrate(op_node, style);
      narration = narrate_by_table(key, arg_narrations, style);
    } else {
      narration = arg_narrations.join(" ");
    }
  } else {
    // descend in children, assuming independence
    let children = $(math).children();
    if (children.length > 0) {
      var arg_narrations = [];
      $(children).each(function (index, value) {
        arg_narrations.push(narrate($(value), style));
      });
      narration = narrate_by_table(math.prop("tagName"), arg_narrations, style);
    } else {
      narration = $(math).text();
    }
  }
  narration = narration.replace(/\s\s+/g, ' '); // sloppy spacing work, just clean up at the end
  return narration;
}
