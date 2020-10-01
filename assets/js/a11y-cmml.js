function cross_highlights(tag_node, mode) {
  let xref_set = new Set();
  let xref = tag_node.find('> span.custom-xref');
  let id = tag_node.find('> span.custom-id');
  id.add(xref).each(function (index, span) {
    for (const classitem of $(span).attr('class').split(' ')) {
      xref_set.add(classitem);
    }
  });

  xref_set.delete('custom-xref');
  xref_set.delete('custom-id');
  xref_set.delete('faded');
  xref_set.delete('hljs-tag');
  xref_set.delete('hljs-attr');
  xref_set.delete('hljs-string');
  let pre_tag = tag_node.closest('pre');
  for (const classitem of xref_set) {
    if (classitem) {
      if (mode == 'show') {
        pre_tag.find('span.' + classitem).show(); }
      else {
        pre_tag.find('span.' + classitem).hide();
      }
    }
  }
}

function retouch_hljs_for_cmml() {
// make xml:id and xref attributes legible by fading them out
  $('span.hljs-attr:contains("id")').add('span.hljs-attr:contains("xref")').each(function(index) {
    let this_attr = $(this);
    let td = this_attr.closest('td');
    td.css('min-width', td.width());
    let custom_class = 'custom-' + this_attr.text();
    let faded_class = custom_class + ' faded';
    let value_node = this_attr.next('span.hljs-string');
    let droppable_chars = /[\."]/g;
    let value_class = value_node.text().toString().replace(droppable_chars,'');
    let full_class_faded = faded_class + ' ' + value_class;
    let full_class = custom_class + ' ' + value_class;
    value_node.addClass(full_class);
    this_attr.addClass(full_class_faded);
    let eq_node = this_attr[0].nextSibling;
    $(eq_node).replaceWith('<span class="'+full_class_faded+'">'+eq_node.nodeValue+'</span>');
    let ws_node = this_attr[0].previousSibling;
    if (ws_node && ws_node.nodeValue == ' ') {
      $(ws_node).replaceWith('<span class="' + full_class_faded + '">' + ws_node.nodeValue + '</span>');
    }
  });

  $('span.hljs-tag').hover(
    function() {
      cross_highlights($(this), 'show'); },
    function() {
      cross_highlights($(this), 'hide'); });
}
