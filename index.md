---
layout: default
---

# A Showcase for Formula Narrations

<form id='spec-explorer'>
<table class='mini-form'>
<thead><tr><th>Tweak</th><th>Spec</th></tr></thead>
<tbody>
<tr>
  <td>
    <label for="a11y-main-attribute">main attr.</label></td>
  <td>
    <input id='a11y-main-attribute' name='main-attribute' data-default="alt" value="alt" type='text'>
  </td>
</tr><tr>
  <td>
    <label for="a11y-secondary-attribute">arg attr.</label>
  </td>
  <td>
    <input id='a11y-secondary-attribute' name='secondary-attribute' data-default="arg" value="arg" type='text'>
  </td>
</tr><tr>
  <td>
    <label for="a11y-main-attribute">arg sigil</label>
  </td>
  <td>
    <input id='a11y-arg-sigil' name='sigil' data-default="$" value="$" type='text'>
  </td>
</tr>
</tbody>
</table>
</form>

Rendered | MathML [4?](https://www.w3.org/community/mathml4/) [tweak?](javascript:tweak_spec()), (via LaTeXML)| Narrations
-------- | -------- | ------
         |          |


<form id='conversion-form' spellcheck="false">
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

---

<button id="authorize_button">Fetch MathML Intent List</button>
