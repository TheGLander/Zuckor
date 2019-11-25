import Sprite from "../classes/sprite";
import { imgNameSizes, imgNames, spriteImg } from "../vars";
import loadImg from "../functions/loadImg";
import drawRotatedImage from "../functions/drawRotatedImage";
export default class Img extends Sprite {
  image: string;
  constructor({
    x,
    y,
    degree,
    layer,
    width,
    height,
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
      autoSize,
      hidden,
      nickname
    });
    this.image = image || "";
    this.type = "image";
  }
  renderer = (context: CanvasRenderingContext2D) => {
    if (!(this.width && this.height)) {
      let spriteImage = imgNameSizes[this.image];
      if (!spriteImage) {
        imgNameSizes[this.image] = new Image();
        imgNameSizes[this.image].src = this.image;
        spriteImage = imgNameSizes[this.image];
      }
      if (this.autoSize) {
        if (!this.width) this.width = spriteImage.width;
        if (!this.height) this.height = spriteImage.height;
      } else {
        if (!this.width) this.width = 1;
        if (!this.height) this.height = 1;
      }
    }
    let imageName = `${this.image} ${this.height}x${this.width}`;
    if (!imgNames.includes(imageName))
      loadImg(this.image, this.height, this.width);
    else if (Object.keys(spriteImg).includes(imageName))
      drawRotatedImage(context, spriteImg[imageName].image, this);
  };
}
