define('my/shirt', function () {
    /**
     * A module representing a shirt.
     * @exports my/shirt
     */
    var shirt = {
        /** The module's `color` property. */
        color: 'black',

        /**
         * Create a new Turtleneck.
         * @class
         * @param {string} size - The size (`XS`, `S`, `M`, `L`, `XL`, or `XXL`).
         */
        Turtleneck: function (size) {
            /** The class's `size` property. */
            this.size = size;
        }
    };

    return shirt;
});

/**
 * A module representing a jacket.
 * @module my/jacket
 */
define('my/jacket', function () {
    /**
     * Create a new jacket.
     * @class
     * @alias module:my/jacket
     */
    var Jacket = function () {
        // ...
    };

    /** Zip up the jacket. */
    Jacket.prototype.zip = function () {
        // ...
    };

    return Jacket;
});

/**
 * Module representing a shirt.
 * @module my/shirt
 */

define('my/shirt', function () {
    // Do setup work here.

    return /** @alias module:my/shirt */ {
        /** Color. */
        color: 'black',
        /** Size. */
        size: 'unisize'
    };
});

define(
    'my/jacket',
    function (
        /**
         * Utility functions for jackets.
         * @exports my/jacket
         */
        module
    ) {
        /**
         * Zip up a jacket.
         * @param {Jacket} jacket - The jacket to zip up.
         */
        module.zip = function (jacket) {
            // ...
        };
    }
);

// one module
define('html/utils', function () {
    /**
     * Utility functions to ease working with DOM elements.
     * @exports html/utils
     */
    var utils = {
        /**
         * Get the value of a property on an element.
         * @param {HTMLElement} element - The element.
         * @param {string} propertyName - The name of the property.
         * @return {*} The value of the property.
         */
        getStyleProperty: function (element, propertyName) {}
    };

    /**
     * Determine if an element is in the document head.
     * @param {HTMLElement} element - The element.
     * @return {boolean} Set to `true` if the element is in the document head,
     * `false` otherwise.
     */
    utils.isInHead = function (element) {};

    return utils;
});

// another module
define('tag', function () {
    /** @exports tag */
    var tag = {
        /**
         * Create a new Tag.
         * @class
         * @param {string} tagName - The name of the tag.
         */
        Tag: function (tagName) {
            // ...
        }
    };

    return tag;
});
