function uniqueString(value, index, self) {
    return self.indexOf(value) === index;
}

export function extend (obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        var descriptor, prop;
        if (source) {
            for (prop in source) {
                descriptor = Object.getOwnPropertyDescriptor(source, prop);
                Object.defineProperty(obj, prop, descriptor);
            }
        }
    });
    return obj;
};

export function invoke(fn, args) {
    return (typeof fn === 'function') && fn(args);
}

export function concatAndFilterString(seperator = ' ') {
    return (...strings) => strings
        .filter(str => str)
        .filter(uniqueString)
        .join(seperator);
}

export function invariant(condition, format = '', ...vars) {
    if (condition) {
        return;
    }

    let index = 0;
    throw new Error(
        `Invariant Violation: ${format.replace(/%s/g, () => vars[index++])}`
    );
}

export function filterByTruthy(objOrArr, startArray = []) {
    if (Array.isArray(objOrArr)) {
        return objOrArr;
    }
    return Object.keys(objOrArr).reduce((result, key) => {
        const value = objOrArr[key];
        return (value) ? result.concat([key]) : result
    }, startArray);
}
