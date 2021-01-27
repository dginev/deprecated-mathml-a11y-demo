var a11y_arg_mark = '$';

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
    if (child.getAttribute('arg') == target_arg) {
      child.setAttribute('data-arg-path', path_sep + (1+child_idx));
      result = child; return false; }
    else if (!child.getAttribute('intent')) {
      let child_result = obtain_arg(target_arg, child, path_sep+(1+child_idx));
      if (child_result) {
        result = child_result; return false; } }
  });
  return result; }

// describe fixity based on descendent paths to each argument,
// as ordered in the semantic tree
function compute_fixity(args, top_node) {
  let cached = (typeof args[0] == "object") && $(args[0]).data("fixity");
  if (cached) {
    return cached; }
  let presentation_trace = [];
  let op_node;
  $.each(args, function (idx, arg) {
    if (Array.isArray(arg) || (typeof arg === 'string')) {
      presentation_trace.push('literal'); }
    else {
      presentation_trace.push($(arg).data('arg-path')); }
  });
  // remove common path prefixes
  if (presentation_trace.length > 0 && presentation_trace[0].toString().indexOf('/') != -1) {
    while (presentation_trace[0].length>0 && (new Set(presentation_trace.map(x => x.toString()[0]||''))).size == 1) {
      presentation_trace = presentation_trace.map(x => x && x.substring(1));
    }
  }

  let paths_str = presentation_trace.join(",");
  // console.log("args: ",args);
  // console.log("top node: ", top_node);
  // console.log("presentation string: ",paths_str);
  switch (paths_str) {
    case "":
    case "literal":
      return ""; // atomic case, no fixity to speak of
    case "1,2": // e.g. -1
    case "1,3": // e.g. \sin \pi with invisible apply
    case "1,3/2": // \sin (x) with invisible apply
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
      if (presentation_trace.length == 3) {
        // looser checks
        let op_int = parseInt(presentation_trace[0].toString().split("/").join(""));
        let arg1_int = parseInt(presentation_trace[1].toString().split("/").join(""));
        let arg2_int = parseInt(presentation_trace[2].toString().split("/").join(""));
        if (op_int > arg1_int && arg2_int > op_int) {
          return "infix";
        }
      }
      if (paths_str.startsWith("2,1,3,5")) {
        return "nary-infix"; }
      if (paths_str.startsWith("literal,1,3,5")) {
        return "nary-implied"; }
      if (paths_str.startsWith("literal,2,4,6")) {
        return "fenced"; }
      return "mixfix";
  }
}

function get_balanced_chunks(text) {
  let chunks = [];
  let chunk = '';
  let level = 0;
  for (const c of text) {
    switch (c) {
      case '(':
        if (level == 0) {
          if (chunk.length > 0) { chunks.push(chunk); }
          chunk = ''; }
        else {
          chunk += c; }
        level+=1;
        break;
      case ')':
        level-=1;
        if (level==0) {
          if (chunk.length > 0) { chunks.push(chunk); }
          chunk = ''; }
        else {
          chunk += c }
        break;
      default:
        chunk += c; } }
  if (chunk.length > 0) {
    chunks.push(chunk); }
  return chunks; }

function split_balanced_chunks(text) {
  let pieces = [];
  let piece = '';
  let level = 0;
  for (const c of text) {
    switch (c) {
      case ',':
        if (level == 0) {
          pieces.push(piece); piece = '';
        }
        else { piece += c; }
        break;
      case '(':
        level += 1;
        piece += c;
        break;
      case ')':
        level -= 1;
        piece += c;
        break;
      default:
        piece += c; } }
  if (piece && piece.length > 0) {
    pieces.push(piece); }
  return pieces; }


// We narrate to a "style"
function narrate(math, style) {
  if (!math) { return '';}
  if (typeof math === 'string') { return math;} // literal narrates as self (for now)
  if (math[0].nodeName === 'semantics') {
    return narrate_cmml(math, style); }
  let semantic = $(math).attr('intent');
  let narration = narrate_semantic(math, style, semantic);
  // special global tricks for mozilla/TTS pronunciations
  // const spaced_letter = /(?:^| )([a-z])\W/gi;
  const spaced_letter = /(?:^| )(a)([^-,\d\p{L}])/gui;
  // only replace aA for now, since internal errors in TTS can be hit with too many double-quotes
  return narration.replace(spaced_letter, " $1,$2"); }

function narrate_semantic(math, style, semantic) {
  let context = math[0];
  semantic = semantic && semantic.toString().trim();
  if (semantic && semantic.length>0) { // balanced parens need a context-free grammar here, but for the demo we regex and whistle.
    let args = [];
    let args_fixity = [];
    let arg_chunks = get_balanced_chunks(semantic);
    for (const arg_body of arg_chunks) {
      let pieces = [];
      // if we have multiple arg bodies, this is a
      // higher-order / curried operator and we need to nest further
      pieces = pieces.concat(split_balanced_chunks(arg_body).map(x => x.trim()));
      for (const arg of pieces) {
        if (!arg) { continue; }
        // if any of the args contains () they need to be expanded recursively, do so
        let open_paren = arg.indexOf('(');
        if (open_paren > -1) {
          // independent fragment, call a sandboxed narrate, and include the string directly
          let op_literal = arg.substring(0, open_paren);
          let arg_node = obtain_arg(op_literal.substr(1), context);
          if (arg_node) {
            args_fixity.push(arg_node); }
          args.push(narrate_semantic(math, style, arg)); }
        else if (!arg.startsWith(a11y_arg_mark)) { // literal
          args.push(arg); }
        else {
          arg_val = arg.substr(1);
          let arg_node = obtain_arg(arg_val, context);
          if (arg_node) {
            args_fixity.push(arg_node);
            args.push(arg_node); }
          else {
            args.push("missing_arg:" + arg_val); } }
      };
      if (args.length > 1) {
        args = [args];
        }
      }
    if (args.length == 1 && Array.isArray(args[0])) {
      args = args[0]; }
    // now that we have all arg nodes, figure out the fixity of the notation
    // then narrate constituents and dispatch to this notation handler:
    let fixity = compute_fixity(args_fixity, context);
    if (fixity.length > 0 && typeof args[0] == "object" ) {
        $(args[0]).data("fixity", fixity);
    }
    narration = narrate_by_structure(args, semantic, context, style);
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