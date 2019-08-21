function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function rad(degrees) {
    return degrees * (Math.PI / 180);
}

function drawRotatedImage(context, image, x, y, angle) {

    x += image.width / 2
    y += image.height / 2
    angle = angle - 90
    // save the current co-ordinate system 
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    context.rotate(rad(angle));

    // draw it up and to the left by half the width
    // and height of the image 
    context.drawImage(image, -(image.width / 2), -(image.height / 2));

    // and restore the co-ords to how they were when we began
    context.restore();
}

function getNonTransparentPixels(image) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    try {
        var pixels = context.getImageData(0, 0, image.width, image.height);
        var nonTransparentPixels = [];
        for (var i = 0; i < pixels.data.length / 4; i++) {
            if (pixels.data[i * 4 + 3] !== 0) {
                var pixel = {
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