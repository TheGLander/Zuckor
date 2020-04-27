import Sprite from "../classes/sprite"

export default class Circle extends Sprite {
	radius: number
	outColor: string
	inColor: string
	lineWidth: number
	type: string
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
		radius,
		outColor,
		inColor,
		lineWidth,
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
			nickname,
		})
		this.radius = radius || 0
		this.outColor = outColor || "#ffffff"
		this.inColor = inColor || "#ffffff"
		this.lineWidth = lineWidth || 1
		this.type = "circle"
	}
	renderer = (context: CanvasRenderingContext2D) => {
		context.lineWidth = this.lineWidth
		this.width = this.radius * 2
		this.height = this.radius * 2
		context.beginPath()
		context.arc(
			this.x + this.radius,
			this.y + this.radius,
			this.radius,
			Math.PI,
			3 * Math.PI
		)
		context.strokeStyle = this.outColor
		context.fillStyle = this.inColor
		context.stroke()
		context.fill()
	}
}
