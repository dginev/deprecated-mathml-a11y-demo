# Deprecated: Tiny demo for MathML Accessibility

**Obsolete**: This demo accompanied brainstorming work buy the MathML Refresh CG in 2020-2021 and the Math WG in 2021-2022. It is now obsolete and remains online solely for archival purposes.

Demo is now defunct, was at: https://dginev.github.io/tiny-mathml-a11y-demo

Method:
 - obtain presentation MathML with accessibility annotations from a TeX formula, via the experimental [LaTeXML accessibility branch](https://github.com/brucemiller/LaTeXML/pull/1305)
 - render the MathML (with help from MathJax if needed), to sample the browser behavior
 - also display the verbatim pMML syntax, made readable via [highlight.js](https://highlightjs.org/)
 - minimal javascript implementation of narrating a11y-enriched pMML trees into plain-text English.
 - using [speech-rule-engine](https://github.com/zorkow/speech-rule-engine) as a baseline in narration text
 - sample text-to-speech audio via a baseline neural engine by [mozilla/TTS](https://github.com/mozilla/TTS)
 - deploy on commit via gh-pages, making the project easy to fork and mod further.
 - the latexml endpoint can be easily swapped with any other conversion service.

Known limitations:
  - near-everything is at a "barely demoable" stage at time of writing, as this is a first draft of an implementation
  - LaTeXML's accessibility annotations are ongoing work
     - multirelations and complex duals are just a couple of the cases with fishy markup
     - we need a tiny dialect of TeX macros to demo adding accessibility annotations to e.g. scripts, embellished variables, others...
  - the baked-in narration implementation is kept simple:
     - lacks a coherent linguistic foundation, so readouts are bad
     - only covers a small number of semantic primitives
     - needs targeting, so that a narration is done in context and per-use.
  - the showcase page is also limited
     - more of the examples need annotating, and we generally need even more examples, maybe a gallery?
     - responsive tables are difficult in HTML,
     - ended up patching the `minimal` theme too much, can be organized better
     - jQuery is a bad foundation for a 2020 user interface, only works if this demo stays tiny.
