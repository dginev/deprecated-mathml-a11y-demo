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

function np_of(op, arg) {
  return op + " of " + arg; }
function the_np(op,arg) {
  return "the " + op + " of " + arg; }
function modified_n(op, arg) {
  return arg+" "+op+"-ed"; }
function infix(op, args) {
  return args.join(" "+op+" "); }
function asis(op,arg) {
  return op+" "+arg; }
function wrapped(op, arg) {
  return op+"-start "+arg+" "+op+"-end"; }

function narrate_by_table(op, arg_narrations, style) {
  switch(op) {
    case 'math':
      return arg_narrations.join(" ");
    case 'msub':
    case 'msup':
      if (style == 'phrase') {
        return infix(op, arg_narrations); }
      else {
        return wrapped(op, arg_narrations.join(" ")); }
    case 'square-root':
      if (style == 'phrase') {
        return np_of(op, arg_narrations.join(" ")); }
      else {
        return wrapped(op, arg_narrations.join(" ")); }
    case 'plus':
      if (style == 'phrase') { return infix(op,arg_narrations) }
      else { return the_np('sum', arg_narrations.join(" and "))};
    case 'times':
      if (style == 'phrase') { return infix(op, arg_narrations) }
      else { return the_np('product', arg_narrations.join(" and ")) };
    case 'divide':
      if (style == 'phrase') {
        return infix('divided by', arg_narrations); }
      else {
        return wrapped('fraction', wrapped('numerator', arg_narrations[0]) + " " + wrapped('denominator', arg_narrations[1]));
      }
    case 'equals':
      if (style == 'phrase') {
        return infix(op, arg_narrations);  }
      else {
        return infix('is equal to', arg_narrations); }
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
