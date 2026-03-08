# 🚀 Markdown Full Format & LaTeX Math Formula Test

> This is a sample article for testing full Markdown formatting.  
> Includes: headings, lists, code blocks, tables, blockquotes, horizontal rules, **LaTeX math formulas**, and all other common formats.

---

## 📚 Table of Contents

1. Heading levels (h1–h6)
2. Text formatting (bold, italic, inline code)
3. Unordered and ordered lists
4. Code blocks
5. Tables
6. Blockquotes
7. LaTeX math formulas
8. Callout / tips blocks
9. Images and video
10. Links and horizontal rules

---

## 1. Heading Levels

# H1 Heading Level 1

## H2 Heading Level 2

### H3 Heading Level 3

#### H4 Heading Level 4

##### H5 Heading Level 5

###### H6 Heading Level 6

---

## 2. Text Formatting

This is **bold text**, this is *italic text*, and this is ***bold italic***.

Inline code: `const x = 42` and `console.log('hello')`.

Strikethrough requires extended syntax; plain text is used here.

---

## 3. Unordered and Ordered Lists

### Unordered List

- First item
- Second item
  - Nested item A
  - Nested item B
- Third item

### Ordered List

1. First step
2. Second step
   1. Sub-step 2.1
   2. Sub-step 2.2
3. Third step

### Mixed List

1. First do this
   - Detail A
   - Detail B
2. Then do that
   - More details

---

## 4. Code Blocks

### JavaScript Code

Inline code: `const x = 42` and `console.log('hello')`.


```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10)); // 55
```

### Python Code

```python
def quadratic_formula(a, b, c):
    discriminant = b**2 - 4*a*c
    x1 = (-b + discriminant**0.5) / (2*a)
    x2 = (-b - discriminant**0.5) / (2*a)
    return x1, x2
```

### Bash Commands

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install && npm run dev
```

---

## 5. Tables

| Formula           | Equation              | Description              |
| ----------------- | --------------------- | ------------------------ |
| Euler's identity  | $e^{i\\pi} + 1 = 0$   | The most beautiful formula |
| Pythagorean theorem | $a^2 + b^2 = c^2$  | Right triangles          |
| Mass–energy equivalence | $E = mc^2$ | Special relativity       |

| Left align |  Center  | Right align |
| :--------- | :------: | ----------: |
| left       | center   | right       |
| text       |  text    |       text  |

---

## 6. Blockquotes

> First-level blockquote: This is quoted text.
> It can span multiple lines.

> > Second-level nested blockquote: A quote within a quote.

> Blockquotes can contain **bold**, `code`, and $x^2$ formulas.

---

## 7. LaTeX Math Formulas

### Inline Formulas

Mass–energy equivalence $E = mc^2$ was proposed by Einstein. The Pythagorean theorem $a^2 + b^2 = c^2$ holds for right triangles. Euler's identity $e^{i\\pi} + 1 = 0$ is known as the most beautiful formula. The fraction $\\frac{n(n+1)}{2}$ gives the sum of the first $n$ natural numbers.

### Block Formulas

**Quadratic formula:**

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

**Arithmetic series sum:**

$$
S_n = \\sum_{i=1}^{n} a_i = \\frac{n(a_1 + a_n)}{2}
$$

**Gaussian integral:**

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

**Matrix representation:**

$$
A = \\begin{pmatrix}
a_{11} & a_{12} & a_{13} \\\\
a_{21} & a_{22} & a_{23} \\\\
a_{31} & a_{32} & a_{33}
\\end{pmatrix}
$$

**Limit and derivative:**

$$
\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\frac{d}{dx}e^x = e^x
$$

**Taylor expansion:**

$$
e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots
$$

---

## 8. Callout / Tips Blocks

### Obsidian-style `> [!type]`

> [!tip] This is a tip written using Obsidian-style syntax.

> [!note]
> This is a note-style callout block.

> [!warning]
> This is a warning. Please pay attention!

---

## 9. Images and Video

### Images (Markdown syntax)

![Project preview](/home/image_project.png)

Local images use the `![alt](path)` syntax and support relative paths.

### Video (HTML tag)

<video src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" controls></video>

*Use the HTML `<video>` tag to embed video. Requires rehype-raw.*

### YouTube embed

<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%; border-radius: 8px;"></iframe>

---

## 10. Links and Horizontal Rules

[React docs](https://react.dev) | [Next.js docs](https://nextjs.org) | [KaTeX](https://katex.org)

---

This concludes the full Markdown and LaTeX format test content.
