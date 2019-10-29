(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Zuckor = {}));
}(this, function (exports) { 'use strict';

    /**
     * Gets the sprite's points
     *
     * @param sprite the sprite to get the point to.
     * @return the sprites points.
     */
    function getPoints(sprite) {
        function getRotatedX(x, y, degree) {
            degree = degree * (Math.PI / 180);
            return (x * Math.cos(degree)) - (y * Math.sin(degree))
        }

        function getRotatedY(x, y, degree) {
            degree = degree * (Math.PI / 180);
            return (y * Math.cos(degree)) + (x * Math.sin(degree))
        }
        let points = [];
        //X,Y
        points[0] = {
            x: getRotatedX(-sprite.width / 2, -sprite.height / 2, sprite.degree) + sprite.width / 2,
            y: getRotatedY(-sprite.width / 2, -sprite.height / 2, sprite.degree) + sprite.height / 2
        };
        //X, Y + Height
        points[1] = {
            x: getRotatedX(-sprite.width / 2, sprite.height / 2, sprite.degree) + sprite.width / 2,
            y: getRotatedY(-sprite.width / 2, sprite.height / 2, sprite.degree) + sprite.height / 2
        };
        //X + Width, Y + Height
        points[2] = {
            x: getRotatedX(sprite.width / 2, sprite.height / 2, sprite.degree) + sprite.width / 2,
            y: getRotatedY(sprite.width / 2, sprite.height / 2, sprite.degree) + sprite.height / 2
        };
        //X + Width, Y
        points[3] = {
            x: getRotatedX(sprite.width / 2, -sprite.height / 2, sprite.degree) + sprite.width / 2,
            y: getRotatedY(sprite.width / 2, -sprite.height / 2, sprite.degree) + sprite.height / 2
        };
        return points
    }

    /**
         * Converts degrees to radians.
         *
         * @param degrees the degrees.
         * @return the converted radians.
         */
    function rad(degrees) {
        return degrees * (Math.PI / 180);
    }

    class Sprite {
        constructor({
            x,
            y,
            degree,
            layer,
            nickname,
            width,
            height,
            points,
            autoSize = true,
            hidden
        }) {
            this.x = x || 0;
            this.y = y || 0;
            this.degree = degree === undefined ? 90 : degree;
            this.nickname = nickname || "";
            this.layer = layer || 0;
            this.width = width || 0;
            this.height = height || 0;
            this.physics = {};
            this.type = null;
            this.autoSize = autoSize;
            this.hidden = hidden || false;
            this.id = (function () {
                if (Object.keys(sprites) == []) {
                    return 0;
                }
                for (let x in Object.keys(sprites)) {
                    if (x != (sprites[x] === undefined ? undefined : sprites[x].id)) {
                        return x;
                    }
                }
                return Object.keys(sprites).length
            })();
            let types = ["x", "y", "degree", "width", "height"];
            for (let x in Object.values(arguments[0])) {
                if (isNaN(parseInt(Object.values(arguments[0])[x])) && (types.includes(Object.keys(arguments[0])[x])) && !(Object.values(arguments[0])[x] === undefined)) {
                    throw new Error(`Supplied value type of ${typeof Object.values(arguments[0])[x]}(Or NaN) for argument ${Object.keys(arguments[0])[x]} in a Sprite, must be a number`)
                }
            }
            this.points = points || getPoints(this);
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
            return null
        }
        collisionWith(sprite) { //TODO: Add rotated collision check
            return (Math.abs((this.x + this.width / 2) - (sprite.x + sprite.width / 2)) <= this.width / 2 + sprite.width / 2 && Math.abs((this.y + this.height / 2) - (sprite.y + sprite.height / 2)) <= this.height / 2 + sprite.height / 2)
        }
        delete() {
            if (this.deleted)
                return
            if (this.physics.calcHandle !== undefined) {
                cancelAnimationFrame(this.physics.calcHandle);
            }
            delete sprites[this.id];
            if (this.stage)
                delete this.stage.sprites[this.id];
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
        } = {
                velocity: 0,
                acceleration: 0,
                velocityLoss: 0,
                accelerationLoss: 0,
                degree: 0,
                maxVelocity: undefined,
                gravityVelocity: 0,
                gravityAcceleration: 0,
                gravityDegree: 90,
                gravityMaxVelocity: undefined,
                solid: false
            }) {
            this.physics.velocity = velocity; // Starting velocity
            this.physics.acceleration = acceleration; // Starting acceleration
            this.physics.velocityLoss = velocityLoss; // Velocity Loss
            this.physics.accelerationLoss = accelerationLoss; // Acceleration Loss
            this.physics.degree = degree; // Degree to move to
            this.physics.maxVelocity = maxVelocity; //The maximum velocity
            this.physics.gravityAcceleration = gravityAcceleration; // Gravity acceleration
            this.physics.gravityVelocity = gravityVelocity; // Gravity velocity
            this.physics.gravityDegree = gravityDegree; // Degree to move to
            this.physics.gravityMaxVelocity = gravityMaxVelocity; //The maximum gravity velocity
            this.physics.solid = solid; //If the object is solid
            const physicsCalc = () => {
                //Gravity movement calculation(No loss)
                this.physics.gravityVelocity += this.physics.gravityAcceleration / 60;
                if (!this.collisionWithSolid()) {
                    this.x += this.physics.gravityVelocity / 60 * Math.cos(rad(this.physics.gravityDegree));
                } else {
                    this.physics.gravityVelocity = 0;
                }
                if (!this.collisionWithSolid()) {
                    this.y += this.physics.gravityVelocity / 60 * Math.sin(rad(this.physics.gravityDegree));
                } else {
                    this.physics.gravityVelocity = 0;
                }
                if (this.physics.gravityVelocity > this.physics.gravityMaxVelocity) {
                    this.physics.gravityVelocity = this.physics.gravityMaxVelocity;
                }
                //Normal movement calculation(With loss)
                this.physics.velocity += this.physics.acceleration / 60;
                this.physics.velocity -= (this.physics.velocity - this.physics.velocityLoss / 60 < 0 ? this.physics.velocity : this.physics.velocityLoss / 60);
                this.physics.acceleration -= (this.physics.acceleration - this.physics.accelerationLoss / 60 < 0 ? this.physics.acceleration : this.physics.accelerationLoss / 60);
                if (!this.collisionWithSolid()) {
                    this.x += this.physics.velocity / 60 * Math.cos(rad(this.physics.degree));
                } else {
                    this.physics.velocity = 0;
                }
                if (!this.collisionWithSolid()) {
                    this.y += this.physics.velocity / 60 * Math.sin(rad(this.physics.degree));
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
        togglePlayer({
            maxSpeed,
            acceleration
        }) {
            this.player = {
                looking: null,
                maxSpeed: maxSpeed || 500,
                acceleration: acceleration || 50
            };
            this.togglePhysics({
                solid: true
            });
            const playerCalc = () => {


            };
            this.physics.calcHandle = requestAnimationFrame(playerCalc);
        }
    }

    function loadImg(img, height, width) {
        let imageName = `${img} ${height}x${width}`;
        imgNames.push(imageName);
        let localImg = new Image();
        localImg.src = img;
        localImg.onload = function (ev) {
            let cvs = document.createElement("canvas");
            cvs.width = width;
            cvs.height = height;
            let ctx = cvs.getContext("2d");
            //document.body.appendChild(cvs)
            ctx.drawImage(ev.target, 0, 0, width, height);
            spriteImg[imageName] = {};
            spriteImg[imageName].image = new Image();
            spriteImg[imageName].image.src = cvs.toDataURL("image/png").replace("image/png", "image/octet-stream");

        };
    }

    /**
     * Draws a rotated image on canvas using the 2d context.
     *
     * @param context the canvases 2d context.
     * @param image the sprite's image
     * @param sprite the sprite to draw
     */
    function drawRotatedImage(context, image, sprite) {


        let x = sprite.x + image.width / 2;
        let y = sprite.y + image.height / 2;
        let degree = sprite.degree - 90;
        // save the current co-ordinate system 
        // before we screw with it
        context.save();

        // move to the middle of where we want to draw our image
        context.translate(x, y);

        // rotate around that point, converting our 
        // angle from degrees to radians 
        context.rotate(rad(degree));

        // draw it up and to the left by half the width
        // and height of the image 
        context.drawImage(image, -(image.width / 2), -(image.height / 2));

        // and restore the co-ords to how they were when we began
        context.restore();
    }

    class Img extends Sprite {
        constructor({
            x,
            y,
            degree,
            layer,
            width,
            height,
            points,
            autoSize = true,
            hidden,
            nickname,
            image
        }) {
            super({
                x,
                y,
                degree,
                layer,
                width,
                height,
                points,
                autoSize,
                hidden,
                nickname
            });
            this.image = image || "";
            this.type = "image";
            this.renderer = (context) => {
                if (!(this.width && this.height)) {
                    let spriteImage = imgNameSizes[this.image];
                    if (!spriteImage) {
                        imgNameSizes[this.image] = new Image();
                        imgNameSizes[this.image].src = this.image;
                        spriteImage = imgNameSizes[this.image];
                    }
                    if (this.autoSize) {
                        if (!this.width) this.width = spriteImage.width;
                        if (!this.height) this.height = spriteImage.height;
                    } else {
                        if (!this.width) this.width = 1;
                        if (!this.height) this.height = 1;
                    }

                }
                let imageName = `${this.image} ${this.height}x${this.width}`;
                if (!(imgNames.includes(imageName)))
                    loadImg(this.image, this.height, this.width);
                else
                    if ((Object.keys(spriteImg).includes(imageName)))
                        drawRotatedImage(context, spriteImg[imageName].image, this);

            };
        }
    }

    class Rect extends Sprite {
        constructor({
            x,
            y,
            degree,
            layer,
            width,
            height,
            points,
            autoSize = true,
            hidden,
            nickname,
            inColor,
            outColor,
            lineWidth
        }) {
            super({
                x,
                y,
                degree,
                layer,
                width,
                height,
                points,
                autoSize,
                hidden,
                nickname
            });
            this.lineWidth = lineWidth || 1;
            this.inColor = inColor || "#000000";
            this.outColor = outColor || "#ff0000";
            this.type = "rectangle";
            this.renderer = (context) => {
                context.fillStyle = sprite.color;
                context.lineWidth = sprite.lineWidth;
                context.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
            };
        }
    }

    class Circle extends Sprite {
        constructor({
            x,
            y,
            degree,
            layer,
            width,
            height,
            points,
            autoSize = true,
            hidden,
            nickname,
            radius,
            outColor,
            inColor,
            lineWidth
        }) {
            super({
                x,
                y,
                degree,
                layer,
                width,
                height,
                points,
                autoSize,
                hidden,
                nickname
            });
            this.radius = radius || 0;
            this.outColor = outColor || "#ffffff";
            this.inColor = inColor || "#ffffff";
            this.lineWidth = lineWidth || 1;
            this.type = "circle";
            this.renderer = (context) => {
                context.lineWidth = sprite.lineWidth;
                sprite.width = sprite.radius * 2;
                sprite.height = sprite.radius * 2;
                sprites[sprite.id].width = sprite.radius * 2;
                sprites[sprite.id].height = sprite.radius * 2;
                context.beginPath();
                context.arc(sprite.x + sprite.radius, sprite.y + sprite.radius, sprite.radius, Math.PI, 3 * Math.PI);
                context.strokeStyle = sprite.outColor;
                context.fillStyle = sprite.inColor;
                context.stroke();
                context.fill();
            };
        }
    }

    class Stage {
        constructor({
            height: height = 500,
            width: width = 500,
            color: color = undefined,
            canvas: canvas = document.getElementById("game"),
        } = {
                height: 500,
                width: 500,
                color: undefined,
                canvas: document.getElementById("game"),
            }) {
            canvas.height = height;
            canvas.width = width;
            this.id = (function () {
                if (Object.keys(stages) == []) {
                    return 0;
                }
                for (let x in Object.keys(stages)) {
                    if (x != (stages[x] === undefined ? undefined : stages[x].id)) {
                        return x;
                    }
                }
                return Object.keys(stages).length
            })();
            stages[this.id] = this;
            this.sprites = {};
            canvas.addEventListener('click', (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                console.log("x: " + x + " y: " + y);
                for (let i in this.sprites) {
                    if ((x > this.sprites[i].x) && ((this.sprites[i].x + this.sprites[i].width) > x) && this.sprites[i].y < y && this.sprites[i].y + this.sprites[i].height > y) {
                        if (this.sprites[i].onClick instanceof Function) {
                            this.sprites[i].onClick(e);
                        }
                        break;
                    }
                }
            });
            canvas.onmousemove = (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                for (let i in this.sprites) {
                    if ((x > this.sprites[i].x) && ((this.sprites[i].x + this.sprites[i].width) > x) && this.sprites[i].y < y && this.sprites[i].y + this.sprites[i].height > y) {
                        if (this.sprites[i].onMouseOver instanceof Function) {
                            this.sprites[i].onMouseOver(e);
                        }
                        break;
                    }
                }
            };
            this.color = color;
            this.height = height;
            this.width = width;
            canvas.width = this.width;
            canvas.height = this.height;
            let context = canvas.getContext("2d");
            this.context = context;
            //Render process
            let renderer = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (this.color != undefined) {
                    context.fillStyle = this.color;
                    context.fillRect(0, 0, canvas.width, canvas.height);
                }
                let orderedSprites = Object.values(this.sprites).sort(function (a, b) {
                    let x = a["layer"];
                    let y = b["layer"];
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
                for (let i in orderedSprites) {
                    let currentSprite = orderedSprites[i];
                    currentSprite.x = Math.trunc(currentSprite.x);
                    currentSprite.y = Math.trunc(currentSprite.y);
                    currentSprite.height = Math.trunc(currentSprite.height);
                    currentSprite.width = Math.trunc(currentSprite.width);
                    if (currentSprite.renderer === undefined && currentSprite.renderer !== null)
                        throw new Error("All Sprites must have renderers.")
                    //if (currentSprite.renderer.getPrototype() !== Function)
                    //    throw new Error("Sprite renderers must be functions.")
                    if (!currentSprite.hidden)
                        currentSprite.renderer(context);

                }
                this.renderHandle = requestAnimationFrame(renderer);
            };
            this.renderHandle = requestAnimationFrame(renderer);
        }
        //get sprites() {
        //    return clone(sprites)
        //}
        assign(sprite) {
            this.sprites[sprite.id] = sprite;
            sprites[sprite.id].stage = this;
        }
        delete() {
            cancelAnimationFrame(this.renderHandle);
            delete stages[this.id];
        }
    }

    // This function will contain all our code
    console.log("%cPowered by the ʐ̈uckor engine\n%cMade by G lander", "background: #005454; color: #BFF8F8;font-size:20px", "color:#0000ff;background:#BFF8F8;font-size:13px");

    let sprites = {};
    let stages = {};
    let spriteImg = {};
    let imgNames = [];
    let imgNameSizes = {};
    Sprite.Img = Img;
    Sprite.Rect = Rect;
    Sprite.Circle = Circle;

    exports.Sprite = Sprite;
    exports.Stage = Stage;
    exports.imgNameSizes = imgNameSizes;
    exports.imgNames = imgNames;
    exports.loadImg = loadImg;
    exports.spriteImg = spriteImg;
    exports.sprites = sprites;
    exports.stages = stages;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=zuckor-min.js.map
