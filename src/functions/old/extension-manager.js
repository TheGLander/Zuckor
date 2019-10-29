export default function extend(params = {}) {
    if (params === null || typeof params !== 'object')
        throw new Error("Extension must be an object.")
    let extendSpecific = function (target, source) {
        for (let i in source)
            if (typeof source[i] === "object" && target[i] !== undefined)
                extendSpecific(target[i], source[i])
            else
                target[i] = source[i]
    }
    extendSpecific(exports, params)
}