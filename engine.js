(function (window, $) {
    'use strict';


    // This function will contain all our code
    function myLibrary() {
        var _myLibraryObject = {};
        var nextId = 0;
        var sprites = []
        _myLibraryObject.Stage = function ({
            height: height,
            width: width
        } = {
            height: 500,
            width: 500
        }) {
            this.stage = clone($("#game").html(`<canvas class="canvas" height=${height} width=${width}><h1>Canvas not supported!</h1></canvas><div style="visibility:hidden"><img class="picRender"></div>`));
        }
        _myLibraryObject.Sprite = function ([x, y] = [0, 0], image = "") {
            this.x = x
            this.y = y
            this.id = nextId
            nextId++
            var image = $(".picRender").attr("src", image)
            
            this.image = clone(image);
            var c = document.getElementsByClassName("canvas")[0]
            var ctx = c.getContext("2d");
            ctx.drawImage(image[0], x,y);
        }
        return _myLibraryObject;
    }
    if (typeof (window.myWindowGlobalLibraryName) === 'undefined') {
        window.BCGE = myLibrary();
    }
})(window, $);