import { sprites } from "../vars";
import Stage from "./stage";
import rad from "../functions/rad";
import IPhysics from "../interfaces/physics";
import IPlayer from "../interfaces/player";
//import Img from "../renders/image";
//import Rect from "../renders/rect";
//import Circle from "../renders/circle";
import IRenderable from "../interfaces/renderable";
export default class Sprite implements IRenderable {
  x = 0;
  y = 0;
  degree = 90;
  layer = 0;
  nickname: string;
  width = 0;
  height = 0;
  points: any;
  autoSize = true;
  hidden = false;
  physics: IPhysics = {};
  player: IPlayer;
  type = null;
  id: number;
  stage: Stage;
  deleted = false;
  onClick: Function;
  onHover: Function;
  renderer: Function;
  static Img: any;
  static Rect: any;
  static Circle: any;
  constructor({
    x,
    y,
    degree,
    layer,
    nickname,
    width,
    height,
    autoSize = true,
    hidden
  }) {
    this.x = x || 0;
    this.y = y || 0;
    this.degree = degree == undefined ? 90 : degree;
    this.nickname = nickname || "";
    this.layer = layer || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.autoSize = autoSize;
    this.hidden = hidden || false;
    this.id = (function() {
      if (Object.keys(sprites) == []) {
        return 0;
      }
      for (let x in Object.keys(sprites)) {
        if (x != (sprites[x] === undefined ? undefined : sprites[x].id)) {
          return parseInt(x);
        }
      }
      return Object.keys(sprites).length;
    })();
    //this.points = points || getPoints(this);

    this.stage = null;
    sprites[this.id] = this;
  }
  collisionWithSolid() {
    for (let i in sprites) {
      if (sprites[i].physics.solid && sprites[i].id !== this.id) {
        let sprite = sprites[i];
        if (this.collisionWith(sprite)) {
          return sprite;
        }
      }
    }
    return null;
  }
  collisionWith(sprite: Sprite) {
    //TODO: Add rotated collision check
    return (
      Math.abs(this.x + this.width / 2 - (sprite.x + sprite.width / 2)) <=
        this.width / 2 + sprite.width / 2 &&
      Math.abs(this.y + this.height / 2 - (sprite.y + sprite.height / 2)) <=
        this.height / 2 + sprite.height / 2
    );
  }
  delete() {
    if (this.deleted) return;
    if (this.physics.calcHandle !== undefined) {
      cancelAnimationFrame(this.physics.calcHandle);
    }
    delete sprites[this.id];
    if (this.stage) delete this.stage.sprites[this.id];
    this.deleted = true;
  }
  togglePhysics({
    velocity = 0,
    acceleration = 0,
    velocityLoss = 0,
    accelerationLoss = 0,
    degree = 0,
    maxVelocity = undefined,
    gravityVelocity = 0,
    gravityAcceleration = 0,
    gravityDegree = 90,
    gravityMaxVelocity = undefined,
    solid = false
  } = {}) {
    this.physics = {
      velocity, // Starting velocity
      acceleration, // Starting acceleration
      velocityLoss, // Velocity Loss
      accelerationLoss, // Acceleration Loss
      degree, // Degree to move to
      maxVelocity, //The maximum velocity
      gravityVelocity, // Gravity acceleration
      gravityAcceleration, // Gravity velocity
      gravityDegree, // Degree to move to
      gravityMaxVelocity, //The maximum gravity velocity
      solid, //If the object is solid
      calcHandle: 0
    };
    const physicsCalc = () => {
      //Gravity movement calculation(No loss)
      this.physics.gravityVelocity += this.physics.gravityAcceleration / 60;
      if (!this.collisionWithSolid()) {
        this.x +=
          (this.physics.gravityVelocity / 60) *
          Math.cos(rad(this.physics.gravityDegree));
      } else {
        this.physics.gravityVelocity = 0;
      }
      if (!this.collisionWithSolid()) {
        this.y +=
          (this.physics.gravityVelocity / 60) *
          Math.sin(rad(this.physics.gravityDegree));
      } else {
        this.physics.gravityVelocity = 0;
      }
      if (this.physics.gravityVelocity > this.physics.gravityMaxVelocity) {
        this.physics.gravityVelocity = this.physics.gravityMaxVelocity;
      }
      //Normal movement calculation(With loss)
      this.physics.velocity += this.physics.acceleration / 60;
      this.physics.velocity -=
        this.physics.velocity - this.physics.velocityLoss / 60 < 0
          ? this.physics.velocity
          : this.physics.velocityLoss / 60;
      this.physics.acceleration -=
        this.physics.acceleration - this.physics.accelerationLoss / 60 < 0
          ? this.physics.acceleration
          : this.physics.accelerationLoss / 60;
      if (!this.collisionWithSolid()) {
        this.x +=
          (this.physics.velocity / 60) * Math.cos(rad(this.physics.degree));
      } else {
        this.physics.velocity = 0;
      }
      if (!this.collisionWithSolid()) {
        this.y +=
          (this.physics.velocity / 60) * Math.sin(rad(this.physics.degree));
      } else {
        this.physics.velocity = 0;
      }
      if (this.physics.velocity > this.physics.maxVelocity) {
        this.physics.velocity = this.physics.maxVelocity;
      }
      this.physics.calcHandle = requestAnimationFrame(physicsCalc);
    };
    this.physics.calcHandle = requestAnimationFrame(physicsCalc);
  }
  togglePlayer({ maxSpeed, acceleration }) {
    this.player = {
      looking: false,
      acceleration,
      maxSpeed
    };
    this.togglePhysics({
      solid: true
    });
    const playerCalc = () => {};
    this.physics.calcHandle = requestAnimationFrame(playerCalc);
  }
}
