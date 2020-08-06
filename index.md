---
layout: default
---

# Examples of Accessible Formula Narration


Rendered | MathML [4?](https://www.w3.org/community/mathml4/), [semantics-mini](https://mathml-refresh.github.io/mathml/docs/semantics-mini) (via LaTeXML) | Narrations
-------- | -------- | ------
         |          |


<form spellcheck="false">
<textarea id='preamble' name='preamble' rows="10">
\pragma{FUNCTION}{f,g,h}
\pragma{ID}{a,b,c,d,n,m,x,y,z}
\pragma{index}{?_?}
% \pragma{power}{?^?}
\pragma{Pochhamer-symbol,ID}{\left(?\right)_?}
\pragma{Legendre-symbol,ID}{\left(?|?\right)}
\pragma{BesselJ,FUNCTION}{J_?}
\pragma*{inner-product,ID}{\left<\mathbf{?},\mathbf{?}\right>}
\pragma*{inner-product,ID}{\mathbf{?}\cdot\mathbf{?}}
\pragma*{pre:\@APPLYFUNCTION}{\left(?,?;?|?\right)}
</textarea>

<input id='freetex' name='formula' type='text'><input type="submit" value="convert...">
<button type="button" class='collapsible'>edit preamble</button>
</form>
<div class="latexml-log"></div>