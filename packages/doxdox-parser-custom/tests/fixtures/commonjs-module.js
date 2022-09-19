/**
 * Shirt module.
 * @module my/shirt
 */

/** Button the shirt. */
exports.button = function () {
    // ...
};

/** Unbutton the shirt. */
exports.unbutton = function () {
    // ...
};

/**
 * Shirt module.
 * @module my/shirt
 */

/** Wash the shirt. */
var wash = (exports.wash = function () {
    // ...
});

/**
 * Shirt module.
 * @module my/shirt
 */

/**
 * Wash the shirt.
 * @alias module:my/shirt.wash
 */
var wash = (exports.wash = function () {
    // ...
});

/**
 * Shirt module.
 * @module my/shirt
 */

var wash =
    /** Wash the shirt. */
    (exports.wash = function () {
        // ...
    });

/**
 * Color mixer.
 * @module color/mixer
 */

module.exports = {
    /**
     * Blend two colors together.
     * @param {string} color1 - The first color, in hexadecimal format.
     * @param {string} color2 - The second color, in hexadecimal format.
     * @return {string} The blended color.
     */
    blend: function (color1, color2) {
        // ...
    },

    /**
     * Darken a color by the given percentage.
     * @param {string} color - The color, in hexadecimal format.
     * @param {number} percent - The percentage, ranging from 0 to 100.
     * @return {string} The darkened color.
     */
    darken: function (color, percent) {
        // ..
    }
};

/**
 * Color mixer.
 * @module color/mixer
 */

module.exports = {
    /**
     * Blend two colors together.
     * @param {string} color1 - The first color, in hexadecimal format.
     * @param {string} color2 - The second color, in hexadecimal format.
     * @return {string} The blended color.
     */
    blend: function (color1, color2) {
        // ...
    }
};

/**
 * Darken a color by the given percentage.
 * @param {string} color - The color, in hexadecimal format.
 * @param {number} percent - The percentage, ranging from 0 to 100.
 * @return {string} The darkened color.
 */
module.exports.darken = function (color, percent) {
    // ..
};

/**
 * Color mixer.
 * @module color/mixer
 */

/**
 * Blend two colors together.
 * @param {string} color1 - The first color, in hexadecimal format.
 * @param {string} color2 - The second color, in hexadecimal format.
 * @return {string} The blended color.
 */
module.exports = function (color1, color2) {
    // ...
};

/**
 * Color mixer.
 * @module color/mixer
 */

/** Create a color mixer. */
module.exports = function ColorMixer() {
    // ...
};

/**
 * Module representing the word of the day.
 * @module wotd
 * @type {string}
 */

module.exports = 'perniciousness';

/**
 * Color mixer.
 * @exports color/mixer
 */
var mixer = (module.exports = {
    /**
     * Blend two colors together.
     * @param {string} color1 - The first color, in hexadecimal format.
     * @param {string} color2 - The second color, in hexadecimal format.
     * @return {string} The blended color.
     */
    blend: function (color1, color2) {
        // ...
    }
});

/**
 * Module for bookshelf-related utilities.
 * @module bookshelf
 */

/**
 * Create a new Book.
 * @class
 * @param {string} title - The title of the book.
 */
this.Book = function (title) {
    /** The title of the book. */
    this.title = title;
};
