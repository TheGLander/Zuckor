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
	sprites: Array<IRenderable>;
	color: string;
	height: number;
	width: number;
	context: CanvasRenderingContext2D;
	private id;
	private renderHandle;
	constructor({ height, width, color, canvas, }?: {
		height?: number;
		width?: number;
		color?: string;
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
	looking?: boolean;
	maxSpeed?: number;
	acceleration?: number;
}
export declare class Sprite implements IRenderable {
	x: number;
	y: number;
	degree: number;
	layer: number;
	nickname: string;
	width: number;
	height: number;
	autoSize: boolean;
	hidden: boolean;
	physics: IPhysics;
	player: IPlayer;
	id: number;
	stage: Stage;
	onClick: Function;
	onHover: Function;
	renderer: Function;
	static Img: any;
	static Rect: any;
	static Circle: any;
	protected type: any;
	protected deleted: boolean;
	constructor({ x, y, degree, layer, nickname, width, height, autoSize, hidden, }: {
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
	collisionWithSolid(): IRenderable;
	collisionWith(sprite: Sprite): boolean;
	delete(): void;
	togglePhysics({ velocity, acceleration, velocityLoss, accelerationLoss, degree, maxVelocity, gravityVelocity, gravityAcceleration, gravityDegree, gravityMaxVelocity, solid, }?: IPhysics): void;
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
