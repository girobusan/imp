[Русский](README.ru.md)
# IMP! (It's My Page!)

Like a markdown-based CMS for single file, fully client-side. When you need just drop one page somewhere on the web, and do not want (can not) use full-blown CMS or SSG, but still want to use GUI for content editing.

## How it works

When you load IMP! Locally, it opens up an editor, where you can enter or import your text, setup SEO tags and custom CSS. When the very same page is served over http, user gets a light, **static** HTML. Page does not require Java Script to be viewed, it's just plain HTML. 

![](docs/side-by-side.png)

## System requirements

Descent browser, Firefox or Chrome preferred (tested). If you've updated your browser within last 4 years, it should be fine.

## Features

- Fully local thing &mdash; no server required, no setup. It's YOUR page!
- Pages can be fully static, even text-based browser friendly (You'll need modern browser for editing)
- You can add any HTML to your page
- All you need is browser, that means it fully multiplatform
- EasyMDE as Markdown editor
- Customizable
- Lo-fi :)


## Step by step guide

1. Download and unpack. There are 3 files: `index.html`, `style.css` and `imp.js`
2. Open the `index.html` in your browser (Firefox or Chrome is recommended)
3. Edit it, import or enter your text, preview it. Click the big "Export HTML" ("Save" in newer version) button and save file to the same directory. If you didn't change file name, overwrite old file.
4. Upload files to server, you may skip `imp.js`, as it's not required for *viewing* file.
5. That's it.

## Customization

There is a field for custom CSS in each IMP! file for small adjustments. But you can replace the whole `style.css` with your own. There is nothing fancy about it.

## More files

You can have as many imps as you want. If they would live in one directory, they will share single `imp.js` file. 

## Known problems

- If you use NoScript extension, you'd need to disable it for IMP! page (*not* just set to TRUSTED mode, but disable all restrictions completely)

## License

- Mostly MIT, except:
- CC BY-CA - default theme based on Cutenberg  (which is licensed under CC BY-CA)


## Wouldn't be possible without awesome projects like:

- [Preact](https://preactjs.com/)
- [EasyMDE](https://github.com/Ionaru/easy-markdown-editor)
- [Gutenberg CSS](https://matejlatin.github.io/Gutenberg)
- [Milligram CSS framework](https://milligram.io/)
