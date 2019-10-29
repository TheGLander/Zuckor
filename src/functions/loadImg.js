
export default function loadImg(img, height, width) {
    let imageName = `${img} ${height}x${width}`
    imgNames.push(imageName)
    let localImg = new Image()
    localImg.src = img
    localImg.onload = function (ev) {
        let cvs = document.createElement("canvas")
        cvs.width = width
        cvs.height = height
        let ctx = cvs.getContext("2d")
        //document.body.appendChild(cvs)
        ctx.drawImage(ev.target, 0, 0, width, height)
        spriteImg[imageName] = {}
        spriteImg[imageName].image = new Image()
        spriteImg[imageName].image.src = cvs.toDataURL("image/png").replace("image/png", "image/octet-stream");

    }
}