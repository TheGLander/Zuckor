"use strict"
// This function will contain all our code
console.log(
	"%cPowered by the ʐ̈uckor engine\n%cMade by G lander",
	"background: #005454; color: #BFF8F8;font-size:20px",
	"color:#0000ff;background:#BFF8F8;font-size:13px"
)
import Sprite from "./classes/sprite"
import Stage from "./classes/stage"
import loadImg from "./functions/loadImg"
import Circle from "./renders/circle"
import Rect from "./renders/rect"
import Img from "./renders/image"
Sprite.Circle = Circle
Sprite.Rect = Rect
Sprite.Img = Img
import { sprites, stages } from "./vars"
export { Sprite, Stage, sprites, stages, loadImg }
