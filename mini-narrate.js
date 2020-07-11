// depends on "mini-language.js"
//
// -- Walking the tree
// Just a very simple DFS for now with Neil Soiffer's early stopping algorithm
// browsers support only covers XPath 1, so doing the tree walk procedurally feels
// more obvious for now...
function obtain_arg(target_arg, context) {
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

// We narrate to a "style"
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
  return narration; }