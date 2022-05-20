[Русский](README.ru.md)
# IMP! (It's My Page!)

Like a markdown-based CMS for single file, fully client-side. When you need just drop one page somewhere on the web, and do not want (can not) use full-blown CMS or SSG, but still want to use GUI for content editing.

## How it works

When you load IMP! Locally, it opens up an editor, where you can enter or import your text, setup SEO tags and custom CSS. When the very same page is served over http, user gets a light, **static** HTML. 

## Step by step guide

1. Download and unpack. There are 3 files: `index.html`, `style.css` and `editor.js`
2. Open the `index.html` in your browser (Firefox or Chrome is recommended)
3. Edit it, import or enter your text, preview it. Click the big "Export HTML" button and save file to the same directory. If you didn't change file name, overwrite old file.
4. Upload files to server, you may skip `editor.js`, as it's not required for *viewing* file.
5. That's it.

## Customization

There is a field for custom CSS in each IMP! file for small adjustments. But you can replace the whole `style.css` with your own. There is nothing fancy about it.

## More files

You can have as many imps as you want. If they would live in one directory, they will share single `editor.js` file. 

## Known problems

- If you use NoScript extension, you'd need to disable it for IMP! page (*not* set to TRUSTED mode, but disable all restrictions completely)

## License

- Mostly MIT, except:
- CC BY-CA - default theme based on Cutenberg  (which is licensed under CC BY-CA)


## Wouldn't be possible without awesome projects like:

- [EasyMDE](https://github.com/Ionaru/easy-markdown-editor)
- [Gutenberg CSS](https://matejlatin.github.io/Gutenberg/)
- [Milligram CSS framework](https://milligram.io/)
