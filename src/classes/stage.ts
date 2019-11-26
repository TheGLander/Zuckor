import { stages, sprites } from "../vars";
import Sprite from "./sprite";
import IRenderable from "../interfaces/renderable";

export default class Stage {
  canvas: HTMLCanvasElement;
  id: number;
  sprites: Array<IRenderable>;
  color: string;
  height: number;
  width: number;
  context: CanvasRenderingContext2D;
  renderHandle: number;
  constructor({
    height = 500,
    width = 500,
    color,
    canvas
  } = {}) {
    canvas.height = height || 500;
    canvas.width = width;
    this.id = (function() {
      if (Object.keys(stages) == []) {
        return 0;
      }
      for (let x in Object.keys(stages)) {
        if (x != (stages[x] === undefined ? undefined : stages[x].id)) {
          return parseInt(x);
        }
      }
      return Object.keys(stages).length;
    })();
    stages[this.id] = this;
    this.sprites = [];
    canvas.addEventListener("click", (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      console.log("x: " + x + " y: " + y);
      for (let i in this.sprites) {
        if (
          x > this.sprites[i].x &&
          this.sprites[i].x + this.sprites[i].width > x &&
          this.sprites[i].y < y &&
          this.sprites[i].y + this.sprites[i].height > y
        ) {
          if (this.sprites[i].onClick instanceof Function)
            this.sprites[i].onClick(e);

          break;
        }
      }
    });
    canvas.onmousemove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let i in this.sprites) {
        if (
          x > this.sprites[i].x &&
          this.sprites[i].x + this.sprites[i].width > x &&
          this.sprites[i].y < y &&
          this.sprites[i].y + this.sprites[i].height > y
        ) {
          if (this.sprites[i].onHover instanceof Function)
            this.sprites[i].onHover(e);

          break;
        }
      }
    };
    this.color = color;
    this.height = height;
    this.width = width;
    canvas.width = this.width;
    canvas.height = this.height;
    let context = canvas.getContext("2d");
    this.context = context;
    //Render process
    let renderer = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (this.color != undefined) {
        context.fillStyle = this.color;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      let orderedSprites = Object.values(this.sprites).sort(function(a, b) {
        let x = a["layer"];
        let y = b["layer"];
        return x < y ? -1 : x > y ? 1 : 0;
      });
      for (let i in orderedSprites) {
        let currentSprite = orderedSprites[i];
        currentSprite.x = Math.trunc(currentSprite.x);
        currentSprite.y = Math.trunc(currentSprite.y);
        currentSprite.height = Math.trunc(currentSprite.height);
        currentSprite.width = Math.trunc(currentSprite.width);
        if (
          currentSprite.renderer === undefined &&
          currentSprite.renderer !== null
        )
          throw new Error("All Sprites must have renderers.");
        //if (currentSprite.renderer.getPrototype() !== Function)
        //    throw new Error("Sprite renderers must be functions.")
        if (!currentSprite.hidden) currentSprite.renderer(context);
      }
      this.renderHandle = requestAnimationFrame(renderer);
    };
    this.renderHandle = requestAnimationFrame(renderer);
  }
  //get sprites() {
  //    return clone(sprites)
  //}
  assign(sprite) {
    this.sprites[sprite.id] = sprite;
    sprites[sprite.id].stage = this;
  }
  delete() {
    cancelAnimationFrame(this.renderHandle);
    delete stages[this.id];
  }
}
