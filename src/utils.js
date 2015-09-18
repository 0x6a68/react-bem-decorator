export const filter = fn => arr => arr.filter(fn);
export const join = separator => arr => arr.join(separator);

export function pipeline(seed, ...rest) {
    return rest.reduce((l, r) => r(l), seed);
};

export function uniqueString(value, index, self) {
    return self.indexOf(value) === index;
}

export function curry(fn) {
    return function curried(...args) {
        return args.length >= fn.length
            ? fn.call(this, ...args)
            : (...rest) => curried.call(this, ...args, ...rest);
    };
};

export function invoke(fn, args) {
    return (typeof fn === 'function') && fn(args);
}

export function filterAndConcatWithSeperator(seperator) {
    return curry((...strings) => {
        return pipeline(
            strings,
            filter((str) => str),
            filter(uniqueString),
            join(seperator)
        )}, seperator);
};
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
