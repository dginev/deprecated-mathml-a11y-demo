# Tiny demo for MathML Accessibility 

Very early pre-alpha stage.

Live demo at: https://dginev.github.io/tiny-mathml-a11y-demo

Method:
 - obtain presentation MathML with accessibility annotations from a TeX formula, via the experimental [LaTeXML accessibility branch](https://github.com/brucemiller/LaTeXML/pull/1305)
 - render the MathML (with help from MathJax if needed), to sample the browser behavior
 - also display the verbatim pMML syntax, made readable via [highlight.js](https://highlightjs.org/)
 - add a (naive so far) narration implementation that translates such pMML trees into plain-text English.
 - deploy on commit via gh-pages, making the project easy to fork and mod further. The latexml endpoint can be swapped with any other conversion service.
 
Known limitations: 
  - near-everything is at a "barely demoable" stage at time of writing, as this is a first draft of an implementation
  - LaTeXML's accessibility annotations are ongoing work
     - multirelations and complex duals are just a couple of the cases with fishy markup
     - we need a tiny dialect of TeX macros to demo adding accessibility annotations to e.g. scripts, embellished variables, others... 
  - the narration implementation is extremely limited:
     - we can't do XPath 3 "exclude" selectors in `document.evaluate`, currently arg selection is done very crutchy
     - lacks a coherent linguistic foundation, so readouts are bad
     - only covers a very small number of semantic primitives
     - it is yet to use the positional information of the arguments, e.g. to auto-infer fixity in reading. Standard forms as `@op(@1,@2)` can be auto-inferred with ease.
  - the showcase page is also limited
     - responsive tables are difficult in HTML, 
     - ended up patching the `minimal` theme too much, can be organized a lot better
     - jQuery is a bad foundation for a 2020 user interface, only works if this demo stays tiny.
     
     

  
