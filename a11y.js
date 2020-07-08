function narrate(math) {
  return 'todo.';
}

function handle_input(tex) {
  $("body").css("cursor", "progress");
  $.post("https://latexml.mathweb.org/convert", { // minimal latexml preloads for somewhat usual latex math
    "tex": tex,
    "timeout": "10", "format": "html5", "whatsin": "math", "whatsout": "math", "pmml": "",
    "preload": ["LaTeX.pool", "article.cls", "amsmath.sty", "amsthm.sty", "amstext.sty", "amssymb.sty"]
  }, function (data) {
    var mathml = data.result;
    var pretty = $('<code/>', { 'class': "xml" });
    pretty.text(mathml);
    var narration = narrate($(mathml));
    $("table tr:last").before(
      '<tr><td style="font-size: large;">' + mathml +
      "</td><td>" + '<pre>' + pretty[0].outerHTML + "</pre>" +
      "</td><td>" + narration + "</td></tr>");
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
    $("body").css("cursor", "auto");
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  }, "json");
}

$(document).ready(function () {
  var tex_examples = [
    '1+1=2', '\\sqrt{x}','\\binom{n}{m}','a+b-c+d',
    '|x|+\\lceil{y}\\rceil','\\{1,2,\\ldots\\}',
    'x \\in (a, \\infty)', '|\\psi\\rangle\\langle\\phi|',
    '\\int \\frac{ dr } r', 'a_{0}+\\frac{1}{a_{1}+\\frac{1}{a_{2}+\\cdots}}'
  ];
  var options = '';
  for (index in tex_examples) {
    options += '<option value="'+tex_examples[index]+'">'+tex_examples[index]+'</option>'; }
  var select_element = '<select id="example_select" name="example">'+options+'</select>';
  $("table tr:last").after('<tr class="choice"><td>Examples:</td><td>'+select_element+'</td></tr>');

  $("#example_select").change(function() {
    // convert and grab MathML
    handle_input($(this).val());
  });

  $("form").submit(function (e) {
    e.preventDefault();
    handle_input($("input#freetex").val());
    return false;
  });
});