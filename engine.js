(function (window, $) {
    'use strict';


    // This function will contain all our code
    function myLibrary() {
        var _myLibraryObject = {};
        var nextId = 0;
        var sprites = []
        var spriteImg = {};
        _myLibraryObject.Stage = function ({
            height: height = 500,
            width: width = 500,
            color: color = undefined
        } = {
            height: 500,
            width: 500,
            color: undefined
        }) {
            clone($("#game").html(`<canvas class="canvas" height=${height} width=${width}><h1>Canvas not supported!</h1></canvas><p>Made by G lander</p>`));
            setInterval(() => {
                var canvas = document.getElementsByClassName("canvas")[0]
                var context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (color != undefined) {
                    context.fillStyle = color
                    context.fillRect(0, 0, canvas.width, canvas.height);
                }
                for (var i in sprites) {
                    if(!(Object.keys(spriteImg).includes(sprites[i].image))){
                        spriteImg[i] = new Image()
                        spriteImg[i].src = sprites[i].image;
                        spriteImg[i]["data-i"] = i
                        spriteImg[i]["data-image"] = sprites[i].image
                        spriteImg[i].onload = function (ev) {
                            spriteImg[ev.currentTarget["data-image"]] = spriteImg[ev.currentTarget["data-i"]]
                            context.drawImage(spriteImg[ev.currentTarget["data-image"]], sprites[ev.currentTarget["data-i"]].x, sprites[ev.currentTarget["data-i"]].y)
                        }
                    }else{
                        context.drawImage(spriteImg[sprites[i].image], sprites[i].x, sprites[i].y)
                    }
                    
                }
            })
        }
        _myLibraryObject.Sprite = function ([x, y, degree] = [0, 0, 0], image = "") {
            this.x = x
            this.y = y
            this.degree = degree
            this.id = nextId
            this.image = image
            this.physics = {}
            nextId++
            this.delete = function () {
                sprites.splice(this.id)
            }
            this.togglePhysics = function ({
                speed,
                velocity
            } = {
                speed: 0,
                velocity: 0
            }) {
                this.physics.speed = speed
                this.physics.velocity = velocity
            }
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