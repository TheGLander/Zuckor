export default interface IPhysics {
	velocity?: number
	acceleration?: number
	velocityLoss?: number
	accelerationLoss?: number
	degree?: number
	maxVelocity?: number | undefined
	gravityVelocity?: number
	gravityAcceleration?: number
	gravityDegree?: number
	gravityMaxVelocity?: number | undefined
	solid?: boolean
	calcHandle?: number
}
