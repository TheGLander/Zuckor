'use strict';
// This function will contain all our code
console.log("%cPowered by the ʐ̈uckor engine\n%cMade by G lander", "background: #005454; color: #BFF8F8;font-size:20px", "color:#0000ff;background:#BFF8F8;font-size:13px")

let sprites = {};
let stages = {};
let spriteImg = {};
let imgNames = [];
let imgNameSizes = {}
Sprite.Img = Img
Sprite.Rect = Rect
Sprite.Circle = Circle
import Sprite from "./classes/sprite"
import Stage from "./classes/stage"
import loadImg from "./functions/loadImg"
export {
    Sprite,
    Stage,
    sprites,
    stages,
    loadImg,
    spriteImg,
    imgNames,
    imgNameSizes
}