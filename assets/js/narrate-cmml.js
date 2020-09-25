function narrate_cmml(math, style) {
  let cmml = math.find("annotation-xml[encoding='MathML-Content']");
  return narrate($(math[0].lastElementChild), style);
}