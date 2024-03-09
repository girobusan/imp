# Building IMP!

Please, note: git version may have undocumented features.

## Prerequisites

```
npm install -g shx
npm install -g sass
```


## Clone & build

```
git clone git@github.com:girobusan/imp.git
cd imp
rm dist/*.*
npm install
npm run build
npm run cssbuild
```

Output files are in `dist` directory.
