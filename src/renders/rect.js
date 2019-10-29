export default class Rect extends Sprite {
    constructor({
        x,
        y,
        degree,
        layer,
        width,
        height,
        points,
        autoSize = true,
        hidden,
        nickname,
        inColor,
        outColor,
        lineWidth
    }) {
        super({
            x,
            y,
            degree,
            layer,
            width,
            height,
            points,
            autoSize,
            hidden,
            nickname
        })
        this.lineWidth = lineWidth || 1
        this.inColor = inColor || "#000000"
        this.outColor = outColor || "#ff0000"
        this.type = "rectangle"
        this.renderer = (context) => {
            context.fillStyle = sprite.color;
            context.lineWidth = sprite.lineWidth;
            context.fillRect(sprite.x, sprite.y, sprite.width, sprite.height)
        }
    }
}
