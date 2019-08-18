(function (window) {
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
            framerate: framerate = 60
        } = {
            height: 500,
            width: 500,
            color: undefined,
            canvas: document.getElementById("game"),
            framerate: 60
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
                var orderedSprites = Object.values(sprites).sort(function (a, b) {
                    var x = a["layer"];
                    var y = b["layer"];
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }).reverse();
                for (var i in orderedSprites) {
                    if (!(Object.keys(spriteImg).includes(orderedSprites[i].image))) {
                        spriteImg[orderedSprites[i].image] = {}
                        spriteImg[orderedSprites[i].image].image = new Image()
                        spriteImg[orderedSprites[i].image].image.src = orderedSprites[i].image;
                        spriteImg[orderedSprites[i].image].image["data-i"] = i
                        spriteImg[orderedSprites[i].image].image["data-image"] = orderedSprites[i].image
                        spriteImg[orderedSprites[i].image].image.onload = function (ev) {
                            drawRotatedImage(context, spriteImg[ev.currentTarget["data-image"]].image, orderedSprites[ev.currentTarget["data-i"]].x, orderedSprites[ev.currentTarget["data-i"]].y, orderedSprites[ev.currentTarget["data-i"]].y)
                            spriteImg[ev.currentTarget["data-image"]].pixels = getNonTransparentPixels(ev.currentTarget)
                        }
                    } else {
                        drawRotatedImage(context, spriteImg[orderedSprites[i].image].image, orderedSprites[i].x, orderedSprites[i].y, orderedSprites[i].degree)
                    }

                }
            }, 1000 / frameRate)
        }
        __myLibraryObject.Sprite = function ([x, y, layer, degree] = [0, 0, 0], image, nickname) {
            this.x = x || 0
            this.y = y || 0
            this.degree = degree || 0
            this.nickname = nickname || ""
            this.layer = layer || 0
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
            Object.defineProperty(this, "collisionWith", {
                writable: false,
                enumerable: true,
                configurable: true,
                value: function collisionWith(sprite) {
                    return (Math.abs((this.x + spriteImg[this.image].image.width / 2) - (sprite.x + spriteImg[sprite.image].image.width / 2)) <= spriteImg[this.image].image.width / 2 + spriteImg[sprite.image].image.width / 2 && Math.abs((this.y + spriteImg[this.image].image.height / 2) - (sprite.y + spriteImg[sprite.image].image.height / 2)) <= spriteImg[this.image].image.height / 2 + spriteImg[sprite.image].image.height / 2)
                }
            });
            Object.defineProperty(this, "collisionWithSolid", {
                writable: false,
                enumerable: true,
                configurable: true,
                value: function collisionWithSolid() {
                    for (var i in sprites) {
                        if (sprites[i].physics.solid && sprites[i].id !== this.id) {
                            var sprite = sprites[i]
                            if (this.collisionWith(sprite)) {
                                return sprite;
                            }

                        }

                    }
                    return null
                }
            })
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
                        this.physics.gravityVelocity += this.physics.gravityAcceleration / frameRate
                        if (!this.collisionWithSolid()) {
                            this.x += this.physics.gravityVelocity / frameRate * Math.cos(rad(this.physics.gravityDegree));
                        } else {
                            this.physics.gravityVelocity = 0
                        }
                        if (!this.collisionWithSolid()) {
                            this.y += this.physics.gravityVelocity / frameRate * Math.sin(rad(this.physics.gravityDegree));
                        } else {
                            this.physics.gravityVelocity = 0
                        }
                        //Normal movement calculation(With loss)
                        this.physics.velocity += this.physics.acceleration / frameRate
                        this.physics.velocity -= (this.physics.velocity - this.physics.velocityLoss / frameRate < 0 ? this.physics.velocity : this.physics.velocityLoss / frameRate)
                        this.physics.acceleration -= (this.physics.acceleration - this.physics.accelerationLoss / frameRate < 0 ? this.physics.acceleration : this.physics.accelerationLoss / frameRate)
                        if (!this.collisionWithSolid()) {
                            this.x += this.physics.velocity / frameRate * Math.cos(rad(this.physics.degree));
                        } else {
                            this.physics.velocity = 0
                        }
                        if (!this.collisionWithSolid()) {
                            this.y += this.physics.velocity / frameRate * Math.sin(rad(this.physics.degree));
                        } else {
                            this.physics.velocity = 0
                        }
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
})(window);