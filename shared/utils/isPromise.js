// inspired by this dumb lib: https://github.com/then/is-promise/blob/master/index.js
const isPromise = (obj) => {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export default isPromise