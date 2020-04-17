/**
 * This function adds the functionality
 * @param {BigInteger} ms - Number of Miliseconds to delay
 */
const delay = (ms) => {
    let timer = 0;
    return function(callback){
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    }
}

export default delay