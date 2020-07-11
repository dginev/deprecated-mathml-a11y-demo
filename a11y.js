// Predefined TeX examples for easy exploring:
let a11y_other_examples = {
  'abs, ceil, floor': '|x|+\\lceil{y}\\rceil\\lfloor{z}\\rfloor',
  'binomial (nested)': '\\binom{\\binom{a}{b}}{\\binom{x}{y}}',
  'factorials': 'x!y!',
  'integral notations': '\\int \\frac{dr}r = \\int\\frac{1}{r} dr',
  'integral, triple': '\\iiint_{T} f(x, y, z) dx dy dz',
  'interval membership': 'x \\in (a, \\infty)',
  'Leibniz notation': '\\frac{dy}{dx} = \\frac{d}{dx}[y]',
  'multi-relation': 'x<y<z',
  'n-ary addition in equation': '1+2+3=6',
  'n-ary addition': 'a+b+c+d+e',
  'quantum physics': '|\\psi\\rangle\\langle\\phi|',
  'set of elements': '\\{1,2,\\ldots\\}',
  'simple addition': '1+1=2',
  'square root': '\\sqrt{x}',
};
let a11y_mini_spec_examples = {
  'awkward nesting (1)': "x'_i",
  'awkward nesting (2)': "\\overline{x}_i",
  'base-operator': 'C^n_m',
  'continued fraction': 'a_{0}+\\frac{1}{a_{1}+\\frac{1}{a_{2}+\\cdots}}',
  'derivatives': '\\frac{d^2f}{dx^2}',
  'factorial': 'n!',
  'fenced-stacked, binomial': '\\binom{n}{m}',
  'fenced-stacked, Eulerian numbers': '\\left< n \\atop k \\right>',
  'fenced-stacked, multinomial': '\\binom{n}{m_1,m_2,m_3}',
  'fenced-sub, Pochhammer': '\\left(a\\right)_n',
  'fenced-table, 3j symbol': '\\left(\\begin{array}{ccc}j_1& j_2 &j_3 \\\\ m_1 &m_2 &m_3\\end{array}\\right)',
  'fenced, abs': '|x|',
  'fenced, Clebsch-Gordan': '(j_1 m_1 j_2 m_2 | j_1 j_2 j_3 m_3)|',
  'fenced, determinant': '|\\mathbf{X}|',
  'fenced, inner product': '\\left<\\mathbf{a},\\mathbf{b}\\right>',
  'fenced, Legendre symbol': '(n|p)',
  'fenced, norm': '|\\mathbf{x}|',
  'fenced, open-interval (2)': ']a, b[',
  'fenced, open-interval': '(a,b)',
  'fenced, sequence': '\\lbrace a_n\\rbrace',
  'function (A)': 'A(a,b;z|q)',
  'function BesselJ': 'J_\\nu(z)',
  'function curried BesselJ': 'J_\\nu(z)',
  'indexing': 'a_i',
  'inner product': '\\mathbf{a}\\cdot\\mathbf{b}',
  'integrals': '\\int\\frac{dr}{r}',
  'inverse': '\\sin^-1 (x)',
  'Laplacian': '\\nabla ^ 2 f',
  'n-ary? plus-minus chain': 'a+b-c+d',
  'n-th derivative': 'f^{(n)}',
  'power': '\\power{x}{n}',
  'repeated application': 'f^n',
  'second derivative': "\\derivenum{f}{2}",
  'sup-adjoint': '\\adjoint{A}',
  'sup-transpose': '\\transpose{A}',
  'unary minus': '-a',
}
let a11y_semantic_tex_examples = {
  'integral': "\\lxDeclare[role=FUNCTION]{$f$} \\integral{f(x)}{x}",
};

// convert a chosen 'tex' input to MathML+annotations via latexml\
function handle_input(tex) {
  $("body").css("cursor", "progress");
  $.post("https://latexml.mathweb.org/convert", { // minimal latexml preloads for somewhat usual latex math
    "tex": tex,
    "timeout": "10", "format": "html5", "whatsin": "math", "whatsout": "math", "pmml": "",
    "cache_key": "a11y_showcase",
    "preload": ["LaTeX.pool", "article.cls", "latexml.sty", "amsmath.sty", "amsthm.sty", "amstext.sty", "amssymb.sty", "a11ymark.sty", 'array.sty']
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

// quick auxiliary for escaping the tex source strings...
function dirty_escape_html(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;"); }

// set up the UI bits, dashboard, form events...
$(document).ready(function () {
  let options = '<option disabled selected value> -- select TeX formula -- </option>';
  options += '<option disabled value> -- semantic-mini spec examples -- </option>';
  $.each(a11y_mini_spec_examples, function (name, tex) {
    let escaped_tex = dirty_escape_html(tex);
    options += '<option value="'+escaped_tex+'">'+name+'</option>'; });
  // now concat the semantic examples
  options += '<option disabled value> -- semantic macro examples -- </option>';
  $.each(a11y_semantic_tex_examples, function (name, tex) {
    let escaped_tex = dirty_escape_html(tex);
    options += '<option value="' + escaped_tex + '">' + name + '</option>';
  });
  // curiosities near the end
  options += '<option disabled value> -- other examples -- </option>';
  $.each(a11y_other_examples, function (name, tex) {
    let escaped_tex = dirty_escape_html(tex);
    options += '<option value="' + escaped_tex + '">' + name + '</option>';
  });

  let select_element = '<select id="example_select" name="example">'+options+'</select>';
  $("table tr:last").after('<tr class="choice"><td>Examples:</td><td>' +select_element+'</td><td><span id="raw-tex"></span></td></tr>');

  $("#example_select").change(function() {
    // convert and grab MathML
    let tex = $(this).val();
    $("span#raw-tex").html("<span style='font-weight:bold;'>TeX: </span>"+tex);
    handle_input(tex);
  });

  $("form").submit(function (e) {
    e.preventDefault();
    handle_input($("input#freetex").val());
    return false;
  });
});