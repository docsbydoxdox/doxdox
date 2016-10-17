const fs = require('fs');

const parseInput = (input, config) => new Promise((resolve, reject) => {

    return resolve({'file': input});

});

const parseInputs = (inputs, config) => new Promise((resolve, reject) => {

    if (inputs.length) {

        Promise.all(inputs.map((input) => {

            return parseInput(input, config);

        })).then(data => {

            console.log(data);

        });

    }

});

module.exports = {
    parseInputs
};
