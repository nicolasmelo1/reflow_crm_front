/**
 * Inspired by: https://github.com/eranbo/react-native-base64/blob/master/base64.js
 */

const keyString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const base64 = {
    encode: function (input) {
        let output = []
        let char1, char2, char3 = ""
        let encode1, encode2, encode3, encode4 = ""
        let i = 0

        do {
            char1 = input.charCodeAt(i++)
            char2 = input.charCodeAt(i++)
            char3 = input.charCodeAt(i++)

            encode1 = char1 >> 2
            encode2 = ((char1 & 3) << 4) | (char2 >> 4)
            encode3 = ((char2 & 15) << 2) | (char3 >> 6)
            encode4 = char3 & 63

            if (isNaN(char2)) {
                encode3 = encode4 = 64
            } else if (isNaN(char3)) {
                encode4 = 64
            }

            output.push(
                keyString.charAt(encode1) +
                keyString.charAt(encode2) +
                keyString.charAt(encode3) +
                keyString.charAt(encode4))
            char1 = char2 = char3 = ""
            encode1 = encode2 = encode3 = encode4 = ""
        } while (i < input.length)

        return output.join('')
    },

    encodeFromByteArray: function (input) {
        let output = []
        let char1, char2, char3 = ""
        let encode1, encode2, encode3, encode4 = ""
        let i = 0

        do {
            char1 = input[i++]
            char2 = input[i++]
            char3 = input[i++]

            encode1 = char1 >> 2
            encode2 = ((char1 & 3) << 4) | (char2 >> 4)
            encode3 = ((char2 & 15) << 2) | (char3 >> 6)
            encode4 = char3 & 63

            if (isNaN(char2)) {
                encode3 = encode4 = 64
            } else if (isNaN(char3)) {
                encode4 = 64
            }

            output.push(
                keyString.charAt(encode1) +
                keyString.charAt(encode2) +
                keyString.charAt(encode3) +
                keyString.charAt(encode4))
            char1 = char2 = char3 = ""
            encode1 = encode2 = encode3 = encode4 = ""
        } while (i < input.length)

        return output.join('')
    },

    decode: function (input) {
        let output = ""
        let char1, char2, char3 = ""
        let encode1, encode2, encode3, encode4 = ""
        let i = 0

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        let base64test = /[^A-Za-z0-9\+\/\=]/g
        if (base64test.exec(input) !== null) {
            throw new Error("There were invalid base64 characters in the input text.\n" +
              "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
              "Expect errors in decoding.")
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "")

        do {
            encode1 = keyString.indexOf(input.charAt(i++))
            encode2 = keyString.indexOf(input.charAt(i++))
            encode3 = keyString.indexOf(input.charAt(i++))
            encode4 = keyString.indexOf(input.charAt(i++))

            char1 = (encode1 << 2) | (encode2 >> 4)
            char2 = ((encode2 & 15) << 4) | (encode3 >> 2)
            char3 = ((encode3 & 3) << 6) | encode4

            output = output + String.fromCharCode(char1)

            if (encode3 != 64) {
                output = output + String.fromCharCode(char2)
            }
            if (encode4 != 64) {
                output = output + String.fromCharCode(char3)
            }

            char1 = char2 = char3 = ""
            encode1 = encode2 = encode3 = encode4 = ""

        } while (i < input.length)

        return output
    },
    isBase64: function (input) {
        try {
            base64.decode(input)
            return true
        } catch {
            return false
        }
    }
}

export default base64