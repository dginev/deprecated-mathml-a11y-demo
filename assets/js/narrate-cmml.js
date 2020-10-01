function narrate_cmml(math, style) {
  let cmml = math.find("annotation-xml[encoding='MathML-Content'] > *").first();
  return narrate_cmml_element($(cmml), style);
}

function narrate_cmml_element(el, style) {
  let el_name = el.prop("tagName");
  switch (el_name) {
    case 'apply': {
      let children = el.children();
      let op = narrate_cmml_element($(children.first()), style);
      children = children.slice(1);
      let child_narrations = [];
      for (const child of children) {
        child_narrations.push(narrate_cmml_element($(child), style));  }
      return narrate_by_table(op,child_narrations, style); }
    case 'ci':
    case 'cn':
    case 'csymbol':
      return narrate_symbol(el.text());
    case 'abs': return 'absolute-value'
    case 'eq': return 'equal'
    case 'neq': return 'not-equal'
    case 'lt': return 'less-than'
    case 'gt': return 'greater-than'
    case 'leq': return 'less-than-or-equal'
    case 'geq': return 'greater-than-or-equal'
    default:
      return el_name;
  }
}
