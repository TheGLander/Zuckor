export default class Img extends Sprite {
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
        image
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
        this.image = image || ""
        this.type = "image"
        this.renderer = (context) => {
            if (!(this.width && this.height)) {
                let spriteImage = imgNameSizes[this.image]
                if (!spriteImage) {
                    imgNameSizes[this.image] = new Image();
                    imgNameSizes[this.image].src = this.image
                    spriteImage = imgNameSizes[this.image]
                }
                if (this.autoSize) {
                    if (!this.width) this.width = spriteImage.width
                    if (!this.height) this.height = spriteImage.height
                } else {
                    if (!this.width) this.width = 1
                    if (!this.height) this.height = 1
                }

            }
            let imageName = `${this.image} ${this.height}x${this.width}`
            if (!(imgNames.includes(imageName)))
                loadImg(this.image, this.height, this.width, this, context)
            else
                if ((Object.keys(spriteImg).includes(imageName)))
                    drawRotatedImage(context, spriteImg[imageName].image, this)

        }
    }
}
