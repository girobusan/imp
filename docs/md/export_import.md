---
title: Markdown export and Import
description: Export IMP! as clean markdown or import existing markdown file to IMP!
filename: export_import.html
footer: >-
  <small>Powered by <a href='https://github.com/girobusan/imp'>IMP!</a> and <a
  href='https://matejlatin.github.io/Gutenberg/'>Gutenberg CSS</a></small>

---
[Girobusan](https://girobusan.github.io) | [IMP!](/imp)

Markdown export and Import
==========================

You can export IMP! content as markdown file. All it's properties, like 
custom HTML, title, description will be exported as YAML frontmatter (see below).

You also can import markdown to IMP!, and if some IMP! settings where specified
in frontmatter, they will be added to resulting IMP! page.

Export and Import buttons are located at editor toolbar here:

![ Export and Import buttons ]( imp_export_import.png )


## Supported metadata:

- `title`  
- `description`  
- `image`  
- `icon`  
- `filename`
- `footer`
- `css`
- `headHTML`
- `viewCSS`
- `author`
- `keywords`

**Note:** Field `editor` with custom path to editor script won't be imported!







