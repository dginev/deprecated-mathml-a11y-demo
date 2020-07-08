function narrate(math) {
  return "narrated.";
}

$(document).ready(function () {
  var tex_examples = ['1+1=2','\\sqrt{x}'];
  var options = '';
  for (index in tex_examples) {
    options += '<option value="'+tex_examples[index]+'">'+tex_examples[index]+'</option>'; }
  var select_element = '<select id="example_select" name="example">'+options+'</select>';
  $("table tr:last").after('<tr class="choice"><td>Examples:</td><td>'+select_element+'</td></tr>');

  $("#example_select").change(function() {
    // convert and grab MathML
    var tex = $(this).val();
    $("body").css("cursor", "progress");
    $.post("https://latexml.mathweb.org/convert", { // excplicitly unroll the fragment-html profile, as we want to add the math lexemes output on top
      "tex": tex,
      "timeout": "10",
      "format": "html5",
      "whatsin": "math",
      "whatsout": "math",
      "pmml": "",
      "preload": ["LaTeX.pool", "article.cls", "amsmath.sty", "amsthm.sty", "amstext.sty", "amssymb.sty"]
    }, function (data) {
      var mathml = data.result;
      var pretty = $('<code/>',{'class': "xml"});
      pretty.text(mathml);
      var narration = narrate($(mathml));
        $("table tr:last").before(
          "<tr><td>" + tex +
          "</td><td>" + mathml +
          "</td><td>" + '<pre>' + pretty[0].outerHTML + "</pre>" +
          "</td><td>"+narration + "</td></tr>");
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
      $("body").css("cursor", "auto");
    }, "json");
  });
});