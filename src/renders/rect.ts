import Sprite from "../classes/sprite";

export default class Rect extends Sprite {
  lineWidth: number;
  inColor: string;
  outColor: string;
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
      autoSize,
      hidden,
      nickname
    });
    this.lineWidth = lineWidth || 1;
    this.inColor = inColor || "#000000";
    this.outColor = outColor || "#ff0000";
    this.type = "rectangle";
  }
  renderer = (context: CanvasRenderingContext2D) => {
    context.fillStyle = this.inColor;
    context.strokeStyle = this.outColor;
    context.lineWidth = this.lineWidth;
    context.fillRect(this.x, this.y, this.width, this.height);
  };
}
