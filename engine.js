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
            //Render process
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
                        spriteImg[sprites[i].image] = {}
                        spriteImg[sprites[i].image].image = new Image()
                        spriteImg[sprites[i].image].image.src = sprites[i].image;
                        spriteImg[sprites[i].image].image["data-i"] = i
                        spriteImg[sprites[i].image].image["data-image"] = sprites[i].image
                        spriteImg[sprites[i].image].image.onload = function (ev) {
                            drawRotatedImage(context, spriteImg[ev.currentTarget["data-image"]].image, sprites[ev.currentTarget["data-i"]].x, sprites[ev.currentTarget["data-i"]].y, sprites[ev.currentTarget["data-i"]].y)
                            spriteImg[ev.currentTarget["data-image"]].pixels = getNonTransparentPixels(ev.currentTarget)
                        }
                    } else {
                        drawRotatedImage(context, spriteImg[sprites[i].image].image, sprites[i].x, sprites[i].y, sprites[i].degree)
                    }

                }
            }, 1000 / frameRate)
        }
        _myLibraryObject.Sprite = function ([x = 0, y = 0, degree = 0] = [0, 0, 0], image = "", nickname) {
            this.x = x
            this.y = y
            this.degree = degree
            this.nickname = nickname
            Object.defineProperty(this, "id", {
                writable: false,
                enumerable: true,
                configurable: true,
                value: (function () {
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
            });
            this.image = image
            this.physics = {}
            //Delete
            Object.defineProperty(this, "delete", {
                writable: false,
                enumerable: true,
                configurable: true,
                value: function () {
                    clearInterval(this.physics.calcId);
                    delete sprites[this.id]
                }
            });
            //Collisions
            Object.defineProperty(this, "getCollisions", {
                writable: false,
                enumerable: true,
                configurable: true,
                value: function getCollisions() {
                    var collisions = []
                    for (var i in sprites) {
                        if (sprites[i].id !== this.id) {
                            for (var x in spriteImg[sprites[i].image].pixels) {
                                for (var z in spriteImg[this.image].pixels) {
                                    if (spriteImg[this.image].pixels[z].x + this.x == spriteImg[sprites[i].image].pixels[x].x + sprites[i].x && spriteImg[this.image].pixels[z].y + this.y == spriteImg[sprites[i].image].pixels[x].y + sprites[i].y && !collisions.includes(sprites[i])) {
                                        collisions.push(sprites[i])
                                    }
                                }
                            }
                        }
                    }
                    return collisions
                }
            });
            //Physics
            Object.defineProperty(this, "togglePhysics", {
                writable: false,
                enumerable: true,
                configurable: true,
                value: function togglePhysics({
                    velocity = 0,
                    acceleration = 0,
                    velocityLoss = 0,
                    accelerationLoss = 0,
                    degree = 0,
                    gravityVelocity = 0,
                    gravityAcceleration = 0,
                    gravityDegree = 90,
                    solid = false
                } = {
                    velocity: 0,
                    acceleration: 0,
                    velocityLoss: 0,
                    accelerationLoss: 0,
                    degree: 0,
                    gravityVelocity: 0,
                    gravityAcceleration: 0,
                    gravityDegree: 90,
                    solid: false
                }) {
                    this.physics.velocity = velocity // Starting velocity
                    this.physics.acceleration = acceleration // Starting acceleration
                    this.physics.velocityLoss = velocityLoss // Velocity Loss
                    this.physics.accelerationLoss = accelerationLoss // Acceleration Loss
                    this.physics.degree = degree // Degree to move to
                    this.physics.gravityAcceleration = gravityAcceleration // Gravity acceleration
                    this.physics.gravityVelocity = gravityVelocity // Gravity velocity
                    this.physics.gravityDegree = gravityDegree // Degree to move to
                    this.physics.solid = solid //If the object is solid
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
            });
            sprites[this.id] = this
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