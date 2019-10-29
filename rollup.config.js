import minify from 'rollup-plugin-babel-minify';
import inject from 'rollup-plugin-inject';
import analyze from 'rollup-plugin-analyzer'
import banner from 'rollup-plugin-banner'
import path from 'path';
minify
export default {
    input: ['./src/index.js'],
    output: {
        name: 'Zuckor',
        file: "./dist/zuckor-min.js",
        format: 'umd',
        sourcemap: true

    },
    treeshake: {
        moduleSideEffects: ""
    },
    plugins: [
        /*minify({
            comments: false
        }),*/
        inject({
            exclude: 'node_modules/*.js',
            modules: {
                //Classes
                "Sprite": path.resolve("./src/classes/sprite.js"),
                "Stage": path.resolve("./src/classes/stage.js"),
                //Renders
                "Img": path.resolve("./src/renders/image.js"),
                "Rect": path.resolve("./src/renders/rect.js"),
                "Circle": path.resolve("./src/renders/circle.js"),
                //Functions
                "rad": path.resolve("./src/functions/rad.js"),
                "loadImg": path.resolve("./src/functions/loadImg.js"),
                "drawRotatedImage": path.resolve("./src/functions/drawRotatedImage.js"),
                "doPolygonsIntersect": path.resolve("./src/functions/old/doPolygonsIntersect.js"),
                "extend": path.resolve("./src/functions/old/extension-manager.js"),
                "getNonTransparentPixels": path.resolve("./src/functions/old/getNonTransparentPixels.js"),
                "getPoints": path.resolve("./src/functions/old/getPoints.js"),
                "calcRotatedPoints": path.resolve("./src/functions/old/calcRotatedPoints.js"),
                //Zuckor-wise variables
                "sprites": [path.resolve("./src/index.js"), 'sprites'],
                "stages": [path.resolve("./src/index.js"), 'stages'],
                "spriteImg": [path.resolve("./src/index.js"), 'spriteImg'],
                "imgNames": [path.resolve("./src/index.js"), 'imgNames'],
                "imgNameSizes": [path.resolve("./src/index.js"), 'imgNameSizes'],

            }


        }),
        analyze({
            summaryOnly: true
        }),
        //banner('Zuckor <%= pkg.version %> - <%= pkg.author %>')
    ]
};