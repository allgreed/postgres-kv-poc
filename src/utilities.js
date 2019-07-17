exports.mapObjectKeys = (fn, obj) => Object.assign(...Object.entries(obj).map(([k, v]) => ({[k]: fn(v)})));
