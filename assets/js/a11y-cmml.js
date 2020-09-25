function retouch_hljs_for_cmml() {
// make xml:id and xref attributes legible by fading them out
  $('span.hljs-attr:contains("id")').add('span.hljs-attr:contains("xref")').each(function(index) {
    let td = $(this).closest('td');
    td.css('min-width', td.width());
    let faded_class = 'custom-' + $(this).text() + '-faded';
    let value_node = $(this).next('span.hljs-string');
    let value_class =value_node.text().replaceAll(/[\."]/g,'');
    let full_class = faded_class + ' ' + value_class;
    value_node.addClass(full_class);
    $(this).addClass(full_class);
    let eq_node = $(this)[0].nextSibling;
    $(eq_node).replaceWith('<span class="'+full_class+'">'+eq_node.nodeValue+'</span>');
    let ws_node = $(this)[0].previousSibling;
    if (ws_node && ws_node.nodeValue == ' ') {
      $(ws_node).replaceWith('<span class="' + full_class + '">' + ws_node.nodeValue + '</span>');
    }
  });
  $('span.hljs-tag').hover(function() {
    let cross_highlights = new Set();
    let xref = $(this).find('> span.custom-xref-faded');
    let id = $(this).find('> span.custom-id-faded');
    id.add(xref).each(function(){
      for (const classitem of $(this).attr('class').split(' ')) {
        cross_highlights.add(classitem);
      } } );
    cross_highlights.delete('custom-xref-faded');
    cross_highlights.delete('custom-id-faded');
    cross_highlights.delete('hljs-attr');
    cross_highlights.delete('hljs-string');
    for (const classitem of cross_highlights) {
      if (classitem) {
        $('span.' + classitem).show(); }
    }
  }, function() {
    let cross_highlights = new Set();
    let xref = $(this).find('> span.custom-xref-faded');
    let id = $(this).find('> span.custom-id-faded');
    id.add(xref).each(function(){
      for (const classitem of $(this).attr('class').split(' ')) {
        cross_highlights.add(classitem);
      } } );
    cross_highlights.delete('custom-xref-faded');
    cross_highlights.delete('custom-id-faded');
    cross_highlights.delete('hljs-attr');
    cross_highlights.delete('hljs-string');
    for (const classitem of cross_highlights) {
      if (classitem) {
        $('.'+classitem).hide(); }
    }
  });
}
