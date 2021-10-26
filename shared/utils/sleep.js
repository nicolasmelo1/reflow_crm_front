/**
 * Adds the same funcionality as python's time.sleep
 * 
 * Reference: https://stackoverflow.com/a/39914235
 * 
 * @param {BigInteger} ms - Number of Miliseconds 
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default sleep