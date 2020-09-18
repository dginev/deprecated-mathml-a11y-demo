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
  'awkward nesting (1, raw)': "x^\\prime_i",
  'awkward nesting (1)': '\\PostArgsCrosswise{x}{derivative-implicit-variable}{^}{\\derivemark{1}}{index}{_}{i}',
  'awkward nesting (2, raw)': "\\overline{x}_i",
  'awkward nesting (2)': '\\PrePostArgCrosswise{x}{median}{\\overline}{index}{_}{i}',
  'base-operator': 'C^n_m',
  'continued fraction': 'a_{0}+\\frac{1}{a_{1}+\\frac{1}{a_{2}+\\cdots}}',
  'derivative, n-th': "\\fnderive{f}{n}",
  'derivative, second': "\\fnderive{f}{2}",
  'differentials': '\\frac{d^2f}{dx^2}',
  'factorial': 'n!',
  'fenced-stacked, binomial': '\\binom{n}{m}',
  'fenced-stacked, Eulerian numbers': '\\left< n \\atop k \\right>',
  'fenced-stacked, multinomial': '\\binom{n}{m_1,m_2,m_3}',
  'fenced-sub, Pochhammer': '\\left(a \\right)_n',
  'fenced-table, 3j symbol': '\\left(\\begin{array}{ccc}j_1& j_2 &j_3 \\\\ m_1 &m_2 &m_3\\end{array}\\right)',
  'fenced, abs': '|x|',
  'fenced, Clebsch-Gordan': '(j_1 m_1 j_2 m_2 | j_1 j_2 j_3 m_3)|',
  'fenced, determinant': '\\determinant{X}',
  'fenced, inner product': '\\left<\\mathbf{a},\\mathbf{b}\\right>',
  'fenced, Legendre symbol': '\\left(n|p\\right)',
  'fenced, norm': '\\norm{x}',
  'fenced, open-interval (2)': ']a, b[',
  'fenced, open-interval': '(a,b)',
  'fenced, sequence': '\\lbrace a_n\\rbrace',
  'function (A)': 'A \\left( a,b;z|q \\right)',
  'function BesselJ': 'J_\\nu(z)',
  'indexing': 'a_i',
  'inner product': '\\mathbf{a}\\cdot\\mathbf{b}',
  'integrals': '\\int\\frac{dr}{r}',
  'inverse': '\\fninverse{\\sin}(x)',
  'Laplacian': '\\laplacian{f}',
  'n-ary? plus-minus chain': 'a+b-c+d',
  'power': '\\power{x}{n}',
  'repeated application': '\\fnpower{f}{n}',
  'sup-adjoint': '\\adjoint{A}',
  'sup-transpose': '\\transpose{A}',
  'unary minus': '-a',
}
let a11y_semantic_tex_examples = {
  'integral': "\\integral{f(x)}{x}",
};

var tts_url = "https://tts.deyan.us";
$.ajax({
  type: "HEAD",
  async: true,
  url: tts_url,
}).done(function (message, text, jqXHR) {
  console.log("tts.deyan.us is up, GPU tts is available.");
}).fail(function () {
  tts_url = "https://corpora.mathweb.org";
  console.log("tts.deyan.us is down, falling back to CPU tts (slower).");
});
// call mozilla/TTS with the content of the preceding span.speech
function ttsSpeak(btn) {
  let speech = $(btn).nextAll("span.speech:first").text() + " .";
  $("body").css("cursor", "progress");
  fetch(tts_url+'/api/tts?text=' + encodeURIComponent(speech), {})
    .then(function (res) {
      if (!res.ok) {
        alert("Server generating mozilla/TTS speech may be offline, as it is hosted on a personal machine. Please ask admin to enable.");
        return false; }
      else {
        return res.blob(); }
    }).then(function (blob) {
      let audio = $('<audio controls autoplay />');
      audio.insertAfter($(btn).nextAll("br:first"));
      audio.attr("src", window.URL.createObjectURL(blob));
      $(btn).attr('onClick', 'return false;');
      $("body").css("cursor", "auto");
    }).catch(function (err) {
      alert("Server generating mozilla/TTS speech may be offline, as it is hosted on a personal machine. Please ask admin to enable.");
      $("body").css("cursor", "auto");
    });
  return;
}

// some HTML boilerplate...
let speak_btn = "<span class='btn-speak' onClick='ttsSpeak(this); return false'>🔊</span>";
let sre_pre = "<span class='bold'><a href='https://github.com/zorkow/speech-rule-engine'>SRE</a>:&nbsp;</span>";

var latexml_convert_url = "https://latexml.mathweb.org/a11y/convert";

const leading_newline = /^\n+/;
// convert a chosen 'tex' input to MathML+annotations via latexml
function handle_input(tex) {
  $("body").css("cursor", "progress");
  let log_container = $("div.latexml-log");
  log_container.hide();
  log_container.html('');
  $.post(latexml_convert_url, { // minimal latexml preloads for somewhat usual latex math
    "tex": '\\('+tex+'\\)',
    "timeout": "10", "format": "html5", "whatsin": "fragment", "whatsout": "math", "pmml": "",
    "cache_key": "a11y_showcase",
    "preload": ["LaTeX.pool", "article.cls", "amsmath.sty", "amsthm.sty", "amstext.sty", "amssymb.sty",'array.sty', "a11ymark.sty"],
    "preamble": "literal:" + $("#preamble").val()+"\n\\begin{document}\n",
    "postamble": "literal:\n\\end{document}",
  }, function (data) {
    if (data.status_code == 3) {
      log_container.html("<span>"+data.log.trim().replaceAll("\n","<br>")+"</span>");
      log_container.show();
      return; }
    let mathml = $(data.result);
    mathml.removeAttr('alttext'); // table is too wide if kept

    let narration_phrase = narrate(mathml, 'phrase');
    let narration_sentence = narrate(mathml, 'sentence');
    let annotation_tree = narrate(mathml, 'annotation');
    let sre_narration = SRE.toSpeech(mathml[0].outerHTML);
    let narration_html = sre_pre + "<br>" + speak_btn+"<span class='speech'>" + sre_narration + "</span>" + "<br><br>";
    if (narration_phrase == narration_sentence) {
      narration_html += "<span class='bold'>semantic:&nbsp;</span><br>" + speak_btn +
        "<span class='speech'>"+narration_phrase+"</span>"; }
    else {
      narration_html +=
        "<span class='bold'>semantic brief:&nbsp;</span><br>" + speak_btn +
        "<span class='speech'>" + narration_phrase + "</span>" + "<br><br>"+
        "<span class='bold'>semantic full:&nbsp;</span><br>" + speak_btn +
        "<span class='speech'>" + narration_sentence +"</span>" + "<br><br>"; }
    narration_html += "<br><br><span class='bold'>annotation:&nbsp;</span>" + annotation_tree +
      "<br>" + $("span#raw-tex").html() +'<span class="remove-tr">🗑</span>';
    // we won't need to render the data-arg-path attributes, and any other runtime attributes we end up with.
    mathml.find("[data-arg-path]").each(function (idx,el) {
      el.removeAttribute('data-arg-path'); });
    let pretty = $('<code/>', { 'class': "xml" });
    pretty.text(mathml.html().replace(leading_newline, ''));
    $("tbody tr:last").before(
      '<tr><td class="xlarge">' + mathml[0].outerHTML +
      "</td><td>" + '<pre>' + pretty[0].outerHTML + "</pre></td><td class='narration'>" +
      narration_html + '</td></tr>');

    let code_tr = $("tbody tr:last").prev();
    block = $(code_tr).find("pre code");
    hljs.highlightBlock(block[0]);

    if (typeof MathJax != "undefined") { // retypeset doc if we have MathJax loaded
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
    $('tbody tr:not(:last)').hover(function () {
      $(this).find('span.remove-tr').css('display','inline-block');
    }, function () {
      $(this).find('span.remove-tr').css('display', 'none');
    });
    $('table').on('click', 'span.remove-tr', function () {
      $(this).closest('tr').remove();
    });
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  }, "json")
    .fail(function () {
      alert("failed to convert.");
    })
    .always(function() {
      $("body").css("cursor", "auto");
    });
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
  $("tbody tr:last").replaceWith('<tr class="choice"><td>Examples:</td><td>' +select_element+'</td><td><span id="raw-tex"></span>'+
  '<input type="submit" id="reset_table" value="clear all"></td></tr>');

  $("#example_select").change(function() {
    // convert and grab MathML
    let tex = $(this).val();
    $("span#raw-tex").html("<span class='tex-source'><span class='bold'>tex: </span>" +dirty_escape_html(tex)+'</span>');
    handle_input(tex);
  });

  $("form").submit(function (e) {
    e.preventDefault();
    $("span#raw-tex").html("<span class='tex-source'><span class='bold'>tex: </span>" + dirty_escape_html($("input#freetex").val())+'</span>');
    handle_input($("input#freetex").val());
    return false;
  });
  // cleanup UI
  $("input#reset_table").click(function (e) {
    e.preventDefault();
    $("tbody tr:not(:last)").remove();
  });
});