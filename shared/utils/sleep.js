/**
 * Adds the same funcionality as python's time.sleep
 * @param {BigInteger} ms - Number of Miliseconds 
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default sleep