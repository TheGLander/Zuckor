export default function getNonTransparentPixels(image) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    try {
        let pixels = context.getImageData(0, 0, image.width, image.height);
        let nonTransparentPixels = [];
        for (let i = 0; i < pixels.data.length / 4; i++) {
            if (pixels.data[i * 4 + 3] !== 0) {
                let pixel = {
                    x: i - Math.trunc(i / image.width) * image.width,
                    y: Math.trunc(i / image.width)
                }
                nonTransparentPixels.push(pixel)
            }
        }
        return nonTransparentPixels
    } catch (e) {
        throw e;
    }
}