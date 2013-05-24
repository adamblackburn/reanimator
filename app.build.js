({
    baseUrl: 'lib',
    out: './dist/reanimator.js',
    name: '../node_modules/almond/almond',

    include: ['reanimator'],
    wrap: {
        start: '(function (global) {',
        end: 'require("reanimator");\n}(this));'
    },

    optimize: 'none',

    cjsTranslate: true
})
