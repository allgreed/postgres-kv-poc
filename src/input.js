exports.validate_key = key => ! key.includes("\\")

const isObject = x => Object.prototype.toString.call(x) === '[object Object]'

exports.validate_value = value => isObject(value)
