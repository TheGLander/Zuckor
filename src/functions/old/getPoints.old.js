
/**
 * Gets the sprite's points
 *
 * @param sprite the sprite to get the point to.
 * @return the sprites points.
 */
export default function getPoints(sprite) {
    function getRotatedX(x, y, degree) {
        degree = degree * (Math.PI / 180)
        return (x * Math.cos(degree)) - (y * Math.sin(degree))
    }

    function getRotatedY(x, y, degree) {
        degree = degree * (Math.PI / 180)
        return (y * Math.cos(degree)) + (x * Math.sin(degree))
    }
    let points = []
    //X,Y
    points[0] = {
        x: getRotatedX(-sprite.width / 2, -sprite.height / 2, sprite.degree) + sprite.width / 2,
        y: getRotatedY(-sprite.width / 2, -sprite.height / 2, sprite.degree) + sprite.height / 2
    }
    //X, Y + Height
    points[1] = {
        x: getRotatedX(-sprite.width / 2, sprite.height / 2, sprite.degree) + sprite.width / 2,
        y: getRotatedY(-sprite.width / 2, sprite.height / 2, sprite.degree) + sprite.height / 2
    }
    //X + Width, Y + Height
    points[2] = {
        x: getRotatedX(sprite.width / 2, sprite.height / 2, sprite.degree) + sprite.width / 2,
        y: getRotatedY(sprite.width / 2, sprite.height / 2, sprite.degree) + sprite.height / 2
    }
    //X + Width, Y
    points[3] = {
        x: getRotatedX(sprite.width / 2, -sprite.height / 2, sprite.degree) + sprite.width / 2,
        y: getRotatedY(sprite.width / 2, -sprite.height / 2, sprite.degree) + sprite.height / 2
    }
    return points
}