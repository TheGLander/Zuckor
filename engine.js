(function (window, $) {
    'use strict';


    // This function will contain all our code
    function myLibrary() {
        var _myLibraryObject = {};
        var sprites = {}
        var spriteImg = {};
        var frameRate = 0;
        _myLibraryObject.Stage = function ({
            height: height = 500,
            width: width = 500,
            color: color = undefined,
            canvas: canvas = document.getElementById("game"),
            framerate: framerate = 1000
        } = {
            height: 500,
            width: 500,
            color: undefined,
            canvas: document.getElementById("game"),
            framerate: 1000
        }) {
            frameRate = framerate
            canvas.height = height
            canvas.width = width
            setInterval(() => {
                this.color = color
                this.height = height
                this.width = width
                canvas.width = this.width
                canvas.height = this.height
                var context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (this.color != undefined) {
                    context.fillStyle = this.color
                    context.fillRect(0, 0, canvas.width, canvas.height);
                }
                for (var i in sprites) {
                    if (!(Object.keys(spriteImg).includes(sprites[i].image))) {
                        spriteImg[sprites[i].image] = new Image()
                        spriteImg[sprites[i].image].src = sprites[i].image;
                        spriteImg[sprites[i].image]["data-i"] = i
                        spriteImg[sprites[i].image]["data-image"] = sprites[i].image
                        spriteImg[sprites[i].image].onload = function (ev) {
                            drawRotatedImage(context, spriteImg[ev.currentTarget["data-image"]], sprites[ev.currentTarget["data-i"]].x, sprites[ev.currentTarget["data-i"]].y, sprites[ev.currentTarget["data-i"]].y)
                        }
                    } else {
                        drawRotatedImage(context, spriteImg[sprites[i].image], sprites[i].x, sprites[i].y,sprites[i].degree)
                    }

                }
            }, 1000 / frameRate)
        }
        _myLibraryObject.Sprite = function ([x = 0, y = 0, degree = 0] = [0, 0, 0], image = "") {
            this.x = x
            this.y = y
            this.degree = degree
            this.id = (function () {
                if (Object.keys(sprites) == []) {
                    return 0;
                }
                for (var x in Object.keys(sprites)) {
                    if (x != (sprites[x] === undefined ? undefined : sprites[x].id)) {
                        return x;
                    }
                }
                return Object.keys(sprites).length
            })()
            this.image = image
            this.physics = {}
            this.delete = function () {
                clearInterval(this.physics.calcId);
                delete sprites[this.id]
            }
            //Physics
            this.togglePhysics = function ({
                velocity = 0,
                acceleration = 0,
                velocityLoss = 0,
                accelerationLoss = 0,
                degree = 0,
                gravityVelocity = 0,
                gravityAcceleration = 0,
                gravityDegree = 90
            } = {
                velocity: 0,
                acceleration: 0,
                velocityLoss: 0,
                accelerationLoss: 0,
                degree: 0,
                gravityVelocity: 0,
                gravityAcceleration: 0,
                gravityDegree: 90
            }) {
                this.physics.velocity = velocity // Starting velocity
                this.physics.acceleration = acceleration // Starting acceleration
                this.physics.velocityLoss = velocityLoss // Velocity Loss
                this.physics.accelerationLoss = accelerationLoss // Acceleration Loss
                this.physics.degree = degree // Degree to move to
                this.physics.gravityAcceleration = gravityAcceleration // Gravity acceleration
                this.physics.gravityVelocity = gravityVelocity // Gravity velocity
                this.physics.gravityDegree = gravityDegree // Degree to move to
                this.physics.calcId = setInterval(() => {
                    //Gravity movement calculation(No loss)
                    this.physics.gravityVelocity += this.physics.gravityAcceleration / 1000
                    this.x += this.physics.gravityVelocity / 1000 * Math.cos(rad(this.physics.gravityDegree));
                    this.y += this.physics.gravityVelocity / 1000 * Math.sin(rad(this.physics.gravityDegree));
                    //Normal movement calculation(With loss)
                    this.physics.velocity += this.physics.acceleration / 1000
                    this.physics.velocity -= (this.physics.velocity - this.physics.velocityLoss / 1000 < 0 ? this.physics.velocity : this.physics.velocityLoss / 1000)
                    this.physics.acceleration -= (this.physics.acceleration - this.physics.accelerationLoss / 1000 < 0 ? this.physics.acceleration : this.physics.accelerationLoss / 1000)
                    this.x += this.physics.velocity / 1000 * Math.cos(rad(this.physics.degree));
                    this.y += this.physics.velocity / 1000 * Math.sin(rad(this.physics.degree));
                }, 1000 / frameRate)
            }
            sprites[this.id] = this
            this.id = clone(this.id)
        }
        _myLibraryObject.sprites = function () {
            return clone(sprites)
        }
        return _myLibraryObject;
    }
    if (typeof (window.myWindowGlobalLibraryName) === 'undefined') {
        window.BCGE = myLibrary();
    }
})(window, $);