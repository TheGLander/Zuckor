import { stages, sprites } from "../vars";
import IRenderable from "../interfaces/renderable";

const defaultHeight = 500;
const defaultWidth = 500;
export default class Stage {
  canvas: HTMLCanvasElement;
  sprites: Array<IRenderable>;
  color: string;
  height: number;
  width: number;
  context: CanvasRenderingContext2D;
  private id: number;
  private renderHandle: number;
  constructor({
    height = defaultHeight,
    width = defaultWidth,
    color = "rgb(0, 0 ,0)",
    canvas = null
  } = {}) {
    canvas.height = height;
    canvas.width = width;
    this.id = (function(): number {
      if (Object.keys(stages) == []) {
        return 0;
      }
      for (let x in Object.keys(stages)) {
        if (x != (stages[x] === undefined ? undefined : stages[x].id)) {
          return parseInt(x, 10);
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

      for (let i in this.sprites) {
        let currentSprite = this.sprites[i];
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
  assign(sprite: IRenderable): void {
    this.sprites.push(sprite);
    this.sprites = Object.values(this.sprites).sort((a, b) => {
      let x = a["layer"];
      let y = b["layer"];
      return x < y ? -1 : x > y ? 1 : 0;
    });

    sprites[sprite.id].stage = this;
  }
  delete() {
    cancelAnimationFrame(this.renderHandle);
    delete stages[this.id];
  }
}
