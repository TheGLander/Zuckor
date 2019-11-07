
/**
 * Draws a rotated image on canvas using the 2d context.
 *
 * @param context the canvases 2d context.
 * @param image the sprite's image
 * @param sprite the sprite to draw
 */
export default function drawRotatedImage(context, image, sprite) {


    let x = sprite.x + image.width / 2
    let y = sprite.y + image.height / 2
    let degree = sprite.degree - 90
    // save the current co-ordinate system 
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    context.rotate(rad(degree));

    // draw it up and to the left by half the width
    // and height of the image 
    context.drawImage(image, -(image.width / 2), -(image.height / 2));

    // and restore the co-ords to how they were when we began
    context.restore();
}