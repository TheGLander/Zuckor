export default class Circle extends Sprite {
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
        radius,
        outColor,
        inColor,
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
        this.radius = radius || 0
        this.outColor = outColor || "#ffffff"
        this.inColor = inColor || "#ffffff"
        this.lineWidth = lineWidth || 1
        this.type = "circle"
        this.renderer = (context) => {
            context.lineWidth = sprite.lineWidth;
            sprite.width = sprite.radius * 2
            sprite.height = sprite.radius * 2
            sprites[sprite.id].width = sprite.radius * 2
            sprites[sprite.id].height = sprite.radius * 2
            context.beginPath();
            context.arc(sprite.x + sprite.radius, sprite.y + sprite.radius, sprite.radius, Math.PI, 3 * Math.PI);
            context.strokeStyle = sprite.outColor;
            context.fillStyle = sprite.inColor;
            context.stroke();
            context.fill();
        }
    }
}
