// Just a very simple DFS for now with Neil Soiffer's early stopping algorithm
function handle_input(tex) {
  $("body").css("cursor", "progress");
  $.post("https://latexml.mathweb.org/convert", { // minimal latexml preloads for somewhat usual latex math
    "tex": tex,
    "timeout": "10", "format": "html5", "whatsin": "math", "whatsout": "math", "pmml": "",
    "preload": ["LaTeX.pool", "article.cls", "latexml.sty", "amsmath.sty", "amsthm.sty", "amstext.sty", "amssymb.sty", "a11ymark.sty"]
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
  // Predefined examples for easy exploring:
  let tex_examples = [
    'x!y!', 'a+b+c+d+e',
    '\\frac{dy}{dx} = \\frac{d}{dx}[y]',
    '\\int \\frac{ dr } r = \\int \\frac{1}{r} dr',
    '1+1=2', '1+2+3=6', 'a+b-c+d',
    'x<y<z', '\\sqrt{x}',
    '|x|+\\lceil{y}\\rceil','\\{1,2,\\ldots\\}',
    'x \\in (a, \\infty)', '|\\psi\\rangle\\langle\\phi|',
    '\\iiint_{T} f(x, y, z) dx dy dz',
    'a_{0}+\\frac{1}{a_{1}+\\frac{1}{a_{2}+\\cdots}}',
    '\\binom{n}{m}',
    '\\binom{ \\binom{ a } { b } } { \\binom{ x } { y } }'
  ];
  let semantic_tex_examples = [
    "\\lxDeclare[role=FUNCTION]{$f$} \\integral{f(x)}{x}"
  ];

  let options = '<option disabled selected value> -- select TeX formula -- </option>';
  $.each(tex_examples, function (idx, example) {
    let escaped_example = dirty_escape_html(example);
    options += '<option value="'+escaped_example+'">'+escaped_example+'</option>'; });
  // now concat the semantic examples
  options += '<option disabled value> -- Semantic TeX macro examples -- </option>';
  $.each(semantic_tex_examples, function (idx, example) {
    let escaped_example = dirty_escape_html(example);
    options += '<option value="' + escaped_example + '">' + escaped_example + '</option>';
  });

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