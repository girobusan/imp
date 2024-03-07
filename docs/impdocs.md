---
title: 'IMP! :: More options'
description: IMP! advanced topics.
filename: impdocs.html
footer: >-
  <small>Powered by <a href='https://github.com/girobusan/imp'>IMP!</a> and <a
  href='https://matejlatin.github.io/Gutenberg/'>Gutenberg CSS</a></small>
headHTML: >-
  <link rel="icon" href="data:image/svg+xml,<svg
  xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text
  y=%22.9em%22 font-size=%2290%22>😈</text></svg>">
editor: https://cdn.jsdelivr.net/gh/girobusan/imp/dist/imp.js
viewCSS: https://cdn.jsdelivr.net/gh/girobusan/imp@latest/dist/style.css

---

[Girobusan](https://girobusan.github.io) | [IMP!](/imp)
# IMP! 

<big>Advanced usage</big>

## Force *view* or *edit* mode

By default, when you open IMP! page locally, it loads in edit mode, and when you load it over http, in view mode. But you can force mode by adding special hash to filename. Like this for view mode:

```
....filename.html#view
```

In the next versions this will be changed to:

```
...filename/html?mode=view
```

And for edit mode:

```
....filename.html#edit
```

In the next versions this will be changed to:

```
...filename/html?mode=edit
```

There is also button in editor, which will switch to view mode. Use "back" button of your browser to return to editor.

## Change location of imp.js file and/or main style file

This is done in *Advanced settings* section. You can enter alternative path to both files. For example, you can link editor script from CDN, in order to keep it always up-to-date:

```
https://cdn.jsdelivr.net/gh/girobusan/imp@latest/dist/imp.js
```

The same for `style.css` (not recommended):

```
https://cdn.jsdelivr.net/gh/girobusan/imp@latest/dist/style.css
```

## Update your IMP! page to new version

You have to update only editor file. On the next save the html will be updated too.
