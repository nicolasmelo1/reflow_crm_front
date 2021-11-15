/**
 * Validates a given email to the RFC_2822 standard.
 * 
 * Reference can be found here: https://stackoverflow.com/a/1373724
 * 
 * @param {string} email - The email to validate if it's valid or not.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
const validateEmail = (email) => {
    const RFC_2822_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    return RFC_2822_REGEX.test(email)
}

export default validateEmail