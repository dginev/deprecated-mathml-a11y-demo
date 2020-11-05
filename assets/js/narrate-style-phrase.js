
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
    case 'mover':
      return arg_narrations[0]+" over"+arg_narrations[1];
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
    case 'formulae':
      return list_conj(". Next, ",arg_narrations);
    case 'if':
      return 'if ' + list_and(arg_narrations);
    case 'cases':
      // for now assume they always mean piecewise, and that the arguments are unstructured in groups of 2 columns per row
      let pieces = [];
      for (var i = 0; i < arg_narrations.length - 1; i += 2) {
        let case_id = numeral(1 + i / 2);
        pieces.push(
          arg_narrations[i] + ' ' + arg_narrations[i + 1]
        );  }
      return "piece-wise . " + pieces.join(" or ") + " . end piece-wise ";

    default: switch (fixity) {
      case 'prefix': return prefix(op, arg_narrations[0]);
      case 'infix':
      case 'nary-infix':
        return infix(op, arg_narrations);
      case 'nary-implied':
        return np_of(op, list_and(arg_narrations));
      case 'postfix': return postfix(op, arg_narrations[0]);
      case 'subfix': return arg_narrations[0] + " at " + arg_narrations[1];
      case 'superfix': return arg_narrations[0] + " to the " + arg_narrations[1];
      case 'fenced': return np_of(op, list_and(arg_narrations));
      default:
        switch (op) { // only needed if fixity is wrong, which for now happens in deep tabular/aligned setups
          case 'times':
          case 'plus':
          case 'equals':
            return infix(op, arg_narrations);
          default:
            return np_of(op, list_and(arg_narrations));
        }
    }
  }
}