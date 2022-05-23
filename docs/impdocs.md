
[←Girobusan](https://girobusan.github.io)
# IMP! 

<big>A bit more docs</big>

## Force *view* or *edit* mode

By default, when you open IMP! page locally, it loads in edit mode, and when you load it over http, in view mode. But you can force mode by adding special hash to filename. Like this for view mode:

```
....filename.html#view
```

And for edit mode:

```
....filename.html#edit
```
There is also button in editor, which will switch to view mode. Use "back" button of your browser to return to editor.

## Change location of editor.js file and/or main style file

This is done in *Advanced settings* section. You can enter alternative path to both files. For example, you can link editor script from CDN, in order to keep it always up-to-date:

```
https://cdn.jsdelivr.net/gh/girobusan/imp/dist/editor.js
```

The same for `style.css`:

```
https://cdn.jsdelivr.net/gh/girobusan/imp/dist/style.css
```

## Update your IMP! page to new version

You have to update only `editor.js` file. On the next save the html will be updated too.

