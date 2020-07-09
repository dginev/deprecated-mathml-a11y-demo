// Just a very simple DFS for now with Neil Soiffer's early stopping algorithm
function handle_input(tex) {
  $("body").css("cursor", "progress");
  $.post("https://latexml.mathweb.org/convert", { // minimal latexml preloads for somewhat usual latex math
    "tex": tex,
    "timeout": "10", "format": "html5", "whatsin": "math", "whatsout": "math", "pmml": "",
    "preload": ["LaTeX.pool", "article.cls", "amsmath.sty", "amsthm.sty", "amstext.sty", "amssymb.sty"]
  }, function (data) {
    let mathml = $(data.result);
    mathml.removeAttr('alttext'); // table is too wide if kept
    let pretty = $('<code/>', { 'class': "xml" });
    pretty.text(mathml.html());
    let narration_phrase = narrate(mathml, 'phrase');
    let narration_sentence = narrate(mathml, 'sentence');
    let annotation_tree = narrate(mathml, 'annotation');
    let narration_html = '';
    if (narration_phrase != narration_sentence) {
      narration_html =
      "<td><span style='font-weight:bold;'>brief:&nbsp;</span>" + narration_phrase +
        "<br><br><span style='font-weight:bold;'>full:&nbsp;</span>" + narration_sentence +
        "<br><br><span style='font-weight:bold;'>annotation:&nbsp;</span>" + annotation_tree +
      "</td>"
    } else {
      narration_html =
        "<td>"+narration_phrase+
        "<br><br><span style='font-weight:bold;'>annotation:&nbsp;</span>" + annotation_tree +
        "</td>";
    }
    $("table tr:last").before(
      '<tr><td style="font-size: x-large;">' + mathml[0].outerHTML +
      "</td><td>" + '<pre>' + pretty[0].outerHTML + "</pre></td>" +
      narration_html +
      "</tr>");
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
    if (typeof MathJax != "undefined") { // retypeset doc if we have MathJax loaded
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
    $("body").css("cursor", "auto");
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  }, "json");
}

function dirty_escape_html(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;"); }

$(document).ready(function () {
  let tex_examples = [
    'x!y!', 'a+b+c+d+e', '\\frac{\\partial^{3}}{\\partial x^{1} \\partial y^{2}} f(x, y)',
    'l =\\iiint_{T} f(x, y, z) dx dy dz',
    '1+1=2', '1+2+3=6', 'a+b-c+d',
    'x<y<z', '\\sqrt{x}','\\binom{n}{m}',
    '|x|+\\lceil{y}\\rceil','\\{1,2,\\ldots\\}',
    'x \\in (a, \\infty)', '|\\psi\\rangle\\langle\\phi|',
    '\\int \\frac{ dr } r', 'a_{0}+\\frac{1}{a_{1}+\\frac{1}{a_{2}+\\cdots}}'
  ];
  let options = '<option disabled selected value> -- select TeX formula -- </option>';
  for (index in tex_examples) {
    let escaped_example = dirty_escape_html(tex_examples[index]);
    options += '<option value="'+escaped_example+'">'+escaped_example+'</option>'; }
  let select_element = '<select id="example_select" name="example">'+options+'</select>';
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