let example_gallery = [
  { value: 'abs, ceil, floor', data: {tex: '|x|+\\lceil{y}\\rceil\\lfloor{z}\\rfloor', category: 'other'}},
  { value: 'binomial (nested)', data: {tex: '\\binom{\\binom{a}{b}}{\\binom{x}{y}}', category: 'other'}},
  { value: 'factorials', data: {tex: 'x!y!', category: 'other'}},
  { value: 'integral notations', data: {tex: '\\int \\frac{dr}r = \\int\\frac{1}{r} dr', category: 'other'}},
  { value: 'integral, triple', data: {tex: '\\iiint_{T} f(x, y, z) dx dy dz', category: 'other'}},
  { value: 'interval membership', data: {tex: 'x \\in (a, \\infty)', category: 'other'}},
  { value: 'Leibniz notation', data: {tex: '\\frac{dy}{dx} = \\frac{d}{dx}[y]', category: 'other'}},
  { value: 'multi-relation', data: {tex: 'x<y<z', category: 'other'}},
  { value: 'n-ary addition in equation', data: {tex: '1+2+3=6', category: 'other'}},
  { value: 'n-ary addition', data: {tex: 'a+b+c+d+e', category: 'other'}},
  { value: 'quantum physics', data: {tex: '|\\psi\\rangle\\langle\\phi|', category: 'other'}},
  { value: 'set of elements', data: {tex: '\\{1,2,\\ldots\\}', category: 'other'}},
  { value: 'simple addition', data: {tex: '1+1=2', category: 'other'}},
  { value: 'square root', data: {tex: '\\sqrt{x}', category: 'other'}},
  { value: 'awkward nesting (1)', data: {tex: '\\PostArgsCrosswise{x}{derivative-implicit-variable}{^}{\\derivemark{1}}{index}{_}{i}', category:'mini-spec'}},
  { value: 'awkward nesting (2)', data: {tex: '\\PrePostArgCrosswise{x}{median}{\\overline}{index}{_}{i}', category:'mini-spec'}},
  { value: 'base-operator', data: {tex: 'C^n_m', category:'mini-spec'}},
  { value: 'continued fraction', data: {tex: 'a_{0}+\\frac{1}{a_{1}+\\frac{1}{a_{2}+\\cdots}}', category:'mini-spec'}},
  { value: 'derivative, n-th', data: { tex: "\\fnderive{f}{n}", category: 'mini-spec'}},
  { value: 'derivative, second', data: { tex: "\\fnderive{f}{2}", category: 'mini-spec'}},
  { value: 'differentials', data: {tex: '\\frac{d^2f}{dx^2}', category:'mini-spec'}},
  { value: 'factorial', data: {tex: 'n!', category:'mini-spec'}},
  { value: 'fenced-stacked, binomial', data: {tex: '\\binom{n}{m}', category:'mini-spec'}},
  { value: 'fenced-stacked, Eulerian numbers', data: {tex: '\\left< n \\atop k \\right>', category:'mini-spec'}},
  { value: 'fenced-stacked, multinomial', data: {tex: '\\binom{n}{m_1,m_2,m_3}', category:'mini-spec'}},
  { value: 'fenced-sub, Pochhammer', data: {tex: '\\left(a \\right)_n', category:'mini-spec'}},
  { value: 'fenced-table, 3j symbol', data: {tex: '\\left(\\begin{array}{ccc}j_1& j_2 &j_3 \\\\ m_1 &m_2 &m_3\\end{array}\\right)', category:'mini-spec'}},
  { value: 'fenced, abs', data: {tex: '|x|', category:'mini-spec'}},
  { value: 'fenced, Clebsch-Gordan', data: {tex: '(j_1 m_1 j_2 m_2 | j_1 j_2 j_3 m_3)|', category:'mini-spec'}},
  { value: 'fenced, determinant', data: {tex: '\\determinant{X}', category:'mini-spec'}},
  { value: 'fenced, inner product', data: {tex: '\\left<\\mathbf{a}},\\mathbf{b}\\right>', category:'mini-spec'}},
  { value: 'fenced, Legendre symbol', data: {tex: '\\left(n|p\\right)', category:'mini-spec'}},
  { value: 'fenced, norm', data: {tex: '\\norm{x}', category:'mini-spec'}},
  { value: 'fenced, open-interval (2)', data: {tex: ']a, b[', category:'mini-spec'}},
  { value: 'fenced, open-interval', data: {tex: '(a,b)', category:'mini-spec'}},
  { value: 'fenced, sequence', data: {tex: '\\lbrace a_n\\rbrace', category:'mini-spec'}},
  { value: 'function (A)', data: {tex: 'A \\left( a,b;z|q \\right)', category:'mini-spec'}},
  { value: 'function BesselJ', data: {tex: 'J_\\nu(z)', category:'mini-spec'}},
  { value: 'indexing', data: {tex: 'a_i', category:'mini-spec'}},
  { value: 'inner product', data: {tex: '\\mathbf{a}\\cdot\\mathbf{b}', category:'mini-spec'}},
  { value: 'integrals', data: {tex: '\\int\\frac{dr}{r}', category:'mini-spec'}},
  { value: 'inverse', data: {tex: '\\fninverse{\\sin}(x)', category:'mini-spec'}},
  { value: 'Laplacian', data: {tex: '\\laplacian{f}', category:'mini-spec'}},
  { value: 'n-ary? plus-minus chain', data: {tex: 'a+b-c+d', category:'mini-spec'}},
  { value: 'power', data: {tex: '\\power{x}{n}', category:'mini-spec'}},
  { value: 'repeated application', data: {tex: '\\fnpower{f}{n}', category:'mini-spec'}},
  { value: 'sup-adjoint', data: {tex: '\\adjoint{A}', category:'mini-spec'}},
  { value: 'sup-transpose', data: {tex: '\\transpose{A}', category:'mini-spec'}},
  { value: 'unary minus', data: {tex: '-a', category:'mini-spec'}},
  { value: 'integral', data: {tex: "\\integral{f(x)}{x}", category:'semantic macro'}},
  { value: 'piecewise raw', data: {tex: "\\defeq{|x|}{\\begin{cases}-x & \\text{ if }x<0 \\\\ x & \\text{ otherwise} \\end{cases}}",
    category:'alignments'}},
  // { value: 'piecewise semantic', data: {
  //   tex: "\\defeq{|x|}{\\piecewisedemo{-x}{\\text{ if }{x<0}}{x}{\\text{ otherwise}}",
  //     category: 'alignments'
  // }},
  {
    value: 'equation, split at operator', data: {
      tex: ["\\begin{eqndemo}", "a &=& b + c - d\\\\", " & & {} + e - f\\\\", "\\end{eqndemo}"].join("\n"),
      category: 'alignments'
    }
  },
  {
    value: 'equations, tabulated list', data: {
      tex: ["\\begin{eqndemo}", "2x &=& 1\\\\", " y &>& x-3\\\\", "\\end{eqndemo}"].join("\n"),
      category: 'alignments'
    }
  },
  {value: 'equations, mixed alignments', data: {
    tex:["\\begin{eqndemo}","a &=& b + c - d\\\\"," & & {} + e - f\\\\","A &=& B + C","\\end{eqndemo}"].join("\n"),
    category: 'alignments' }}
];