// depends on "mini-language.js"
//
// -- Walking the tree
// Just a very simple DFS for now with Neil Soiffer's early stopping algorithm
// browsers support only covers XPath 1, so doing the tree walk procedurally feels
// more obvious for now...
function obtain_arg(target_arg, context, path) {
  let result;
  let path_sep = path||'';
  if (path_sep.length > 0) {
    path_sep += '/'; }
  $.each(context.children, function(child_idx, child) {
    if (child.getAttribute('data-arg') == target_arg) {
      child.setAttribute('data-arg-path', path_sep + (1+child_idx));
      result = child; return false; }
    else if (!child.getAttribute('data-semantic')) {
      let child_result = obtain_arg(target_arg, child, path_sep+(1+child_idx));
      if (child_result) {
        result = child_result; return false; } }
  });
  return result; }

// describe fixity based on descendent paths to each argument,
// as ordered in the semantic tree
function compute_fixity(args, top_node) {
  let cached = top_node.getAttribute("data-fixity");
  if (cached) {
    return cached; }
  let presentation_trace = [];
  let op_node;
  $.each(args, function (idx, arg) {
    if (typeof arg === 'string') {
      presentation_trace.push('literal'); }
    else {
      presentation_trace.push($(arg).data('arg-path')); }
  });
  let paths_str = presentation_trace.join(",");
  switch (paths_str) {
    case "":
    case "literal":
      return ""; // atomic case, no fixity to speak of
    case "1,2": // e.g. -1
      return "prefix";
    case "2,1": // e.g. factorial
      return "postfix";
    case "literal,1,3":
    case "2,1,3": // e.g. a+b
      return "infix";
    case "literal,1,2": //e.g. x^2
      switch (top_node.nodeName) {
        case 'msup': return "superfix";
        case 'msub': return "subfix";
        default: return 'mixfix';
      }
    case "1":
    case "literal,2": // e.g. intervals |x|
    case "literal,2,4": // e.g. intervals (a,b)
      return "fenced";
    default:
      if (paths_str.startsWith("2,1,3,5")) {
        return "nary-infix"; }
      if (paths_str.startsWith("literal,1,3,5")) {
        return "nary-implied"; }
      if (paths_str.startsWith("literal,2,4,6")) {
        return "fenced"; }
      return "mixfix";
  }
}

// We narrate to a "style"
function narrate(math, style) {
  if (!math) { return '';}
  if (typeof math === 'string') { return math;} // literal narrates as self (for now)
  let semantic = $(math).data('semantic');
  let narration = narrate_semantic(math, style, semantic);
  // special global tricks for mozilla/TTS pronunciations
  // const spaced_letter = /(?:^| )([a-z])\W/gi;
  const spaced_letter = /(?:^| )(a)(\W)/gi;
  // only replace aA for now, since internal errors in TTS can be hit with too many double-quotes
  return narration.replace(spaced_letter, ' "$1"$2'); }

function narrate_semantic(math, style, semantic) {
  semantic = semantic && semantic.toString();
  if (semantic && semantic.length>0) { // balanced parens need a context-free grammar here, but for the demo we regex and whistle.
    let operator_call = /^([^(]+)\((.*)\)$/;
    let op_arg;
    let arg_body = semantic.replace(operator_call, function (m0, m1, m2) { op_arg=m1; return m2;});
    // we can't just split by coma, we need to balance any possible parens...
    let pieces = [op_arg];
    let piece='';
    let open_stack = 0;
    for (const c of arg_body) {
      switch (c) {
      case ',':
        if (open_stack == 0) {
          pieces.push(piece); piece = ''; }
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
      pieces.push(piece); }
    let args = [];
    let context = math[0];
    $.each(pieces, function (idx, arg) {
      if (!arg) { return true; } // continue on undefined arguments
      // if any of the args contains () they need to be expanded recursively, do so
      if (arg.indexOf('(') > -1 || arg.indexOf(')') > -1) {
        // independent fragment, call a sandboxed narrate, and include the string directly
        args.push(narrate_semantic(math, style, arg)); }
      else if (!arg.startsWith('#')) { // literal
        args.push(arg); }
      else {
        arg = arg.substr(1);
        let arg_node = obtain_arg(arg, context);
        if (arg_node) {
          args.push(arg_node); }
        else {
          args.push("missing_arg:"+arg); } }
    });

    // now that we have all arg nodes, figure out the fixity of the notation
    // then narrate constituents and dispatch to this notation handler:
    let arg_narrations = [];
    let fixity = compute_fixity(args, context);
    if (fixity.length > 0) {
      math.attr("data-fixity", fixity); }

    $.each(args, function (idx, arg) {
      if (typeof arg === 'string') {
        arg_narrations.push(arg); }
      else {
        arg_narrations.push(narrate($(arg), style)); }
    });

    // TODO: We need a great XPath here to avoid descending into data-semantic nodes. "exclude" requires XPath 3 which we don't have access to.
    // crutch for now, to go 1 or 2 levels down only.
    op_key = arg_narrations.shift();
    if (op_key && op_key.length>0) {
      if (arg_narrations.length == 0) {
        narration = narrate_symbol(op_key); }
      else {
        narration = narrate_by_table(op_key, arg_narrations, style, fixity); } }
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