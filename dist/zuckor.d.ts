export interface IRenderable {
	x: number;
	y: number;
	width: number;
	height: number;
	nickname: string;
	source?: string;
	renderer?: Function;
	onClick?: Function;
	onHover?: Function;
	hidden: boolean;
	id: number;
}
export declare class Stage {
	canvas: HTMLCanvasElement;
	id: number;
	sprites: Array<IRenderable>;
	color: string;
	height: number;
	width: number;
	context: CanvasRenderingContext2D;
	renderHandle: number;
	constructor({ height, width, color, canvas }?: {
		height?: number;
		width?: number;
		color?: any;
		canvas?: any;
	});
	assign(sprite: IRenderable): void;
	delete(): void;
}
export interface IPhysics {
	velocity?: number;
	acceleration?: number;
	velocityLoss?: number;
	accelerationLoss?: number;
	degree?: number;
	maxVelocity?: number | undefined;
	gravityVelocity?: number;
	gravityAcceleration?: number;
	gravityDegree?: number;
	gravityMaxVelocity?: number | undefined;
	solid?: boolean;
	calcHandle?: number;
}
export interface IPlayer {
	looking: boolean;
	maxSpeed: number;
	acceleration: number;
}
export declare class Sprite implements IRenderable {
	x: number;
	y: number;
	degree: number;
	layer: number;
	nickname: string;
	width: number;
	height: number;
	points: any;
	autoSize: boolean;
	hidden: boolean;
	physics: IPhysics;
	player: IPlayer;
	type: any;
	id: number;
	stage: Stage;
	deleted: boolean;
	onClick: Function;
	onHover: Function;
	renderer: Function;
	static Img: any;
	static Rect: any;
	static Circle: any;
	constructor({ x, y, degree, layer, nickname, width, height, autoSize, hidden }: {
		x: any;
		y: any;
		degree: any;
		layer: any;
		nickname: any;
		width: any;
		height: any;
		autoSize?: boolean;
		hidden: any;
	});
	collisionWithSolid(): any;
	collisionWith(sprite: Sprite): boolean;
	delete(): void;
	togglePhysics({ velocity, acceleration, velocityLoss, accelerationLoss, degree, maxVelocity, gravityVelocity, gravityAcceleration, gravityDegree, gravityMaxVelocity, solid }?: IPhysics): void;
	togglePlayer({ maxSpeed, acceleration }: {
		maxSpeed: any;
		acceleration: any;
	}): void;
}
export function loadImg(img: string, height: number, width: number): void;
export declare let sprites: {};
export declare let stages: {};

export as namespace Zuckor;

export {};
