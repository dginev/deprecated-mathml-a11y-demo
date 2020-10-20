---
layout: default
---

# A Showcase for Formula Narrations


Rendered | MathML [4?](https://www.w3.org/community/mathml4/), (via LaTeXML) | Narrations
-------- | -------- | ------
         |          |


<form spellcheck="false">
<textarea id='preamble' name='preamble' rows="10">
\pragma{FUNCTION}{f,g,h}
\pragma{ID}{a,b,c,d,n,m,x,y,z}
%\pragma{index}{?_?}
% \pragma{power}{?^?}
\pragma{Pochhamer-symbol,ID}{\left(?\right)_?}
\pragma{Legendre-symbol,ID}{\left(?|?\right)}
\pragma{BesselJ,FUNCTION}{J_?}
\pragma*{inner-product,ID}{\left<\mathbf{?},\mathbf{?}\right>}
\pragma*{inner-product,ID}{\mathbf{?}\cdot\mathbf{?}}
\pragma*{pre:\@APPLYFUNCTION}{\left(?,?;?|?\right)}
</textarea>

<input id='freetex' name='formula' placeholder="type any TeX math" type='text'><input type="submit" value="convert...">
<button type="button" class='collapsible'>edit preamble</button>
<span id="a11y-mode-label"><label for="a11y-mode">math format</label>
  <select id="a11y-mode" name="a11y-mode">
    <option value="a11y">pMML+a11y</option>
    <option value="pmml">pMML</option>
    <option value="cmml">pMML+cMML</option>
  </select>
</span>
</form>

<div class="latexml-log"></div>