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
    case 'mover':
      return "ModifyingAbove " + arg_narrations[0] + " With " + arg_narrations[1];
    case 'element-of':
      return infix('is an element of', arg_narrations);
    case 'index':
      return arg_narrations[0]+" at index "+arg_narrations[1];
    case 'equals':
      return infix('is equal to', arg_narrations);
    case 'defined-as':
      return infix('is defined as', arg_narrations);
    case 'less-than': // standard enough to always do as infix
    case 'greater-than':
      return infix(op, arg_narrations);
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
    case 'if':
      return 'if ' + list_and(arg_narrations);
    case 'formulae':
      let enumerated_formulae = '';
      $.each(arg_narrations, function (index, value) {
        let numword = numeral(index+1);
        enumerated_formulae += 'start-'+numword+'-formula . '+value+' . end-'+numword+"-formula . ";
      });
      return enumerated_formulae;
    case 'cases':
      // for now assume they always mean piecewise, and that the arguments are unstructured in groups of 2 columns per row
      let pieces = [];
      for (var i = 0; i < arg_narrations.length - 1; i+=2) {
        let case_id = numeral(1 + i / 2);
        pieces.push(
          "start-"+case_id+"-case . "+arg_narrations[i] + ' ' + arg_narrations[i + 1] +
          " . end-" + case_id + "-case . "
        ); }
      return "a-piece-wise function . " + pieces.join(" ");
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