var assert = require('assert');

var fs = require('fs');
var dox = require('dox');

var utils = require('../lib/utils');

describe('doxdox util methods', function () {

    ['dox', 'facade'].forEach(function (file) {

        it('parseData on ' + file + '.js', function (done) {

            fs.readFile(__dirname + '/fixtures/' + file + '.js', 'utf8', function (err, data) {

                var methods = utils.parseData(
                    dox.parseComments(data, { raw: true }),
                    file + '.js'
                );

                // fs.writeFileSync(__dirname + '/fixtures/' + file + '.json', JSON.stringify(methods, true, 4));

                fs.readFile(__dirname + '/fixtures/' + file + '.json', 'utf8', function (err, data) {

                    assert.deepEqual(methods, JSON.parse(data));

                    done();

                });

            });

        });

    });

    it('formatStringForName', function () {

        assert.equal(utils.formatStringForName('Class.prototype.method()'), 'Class.method()');

    });

    it('formatStringForUID', function () {

        assert.equal(utils.formatStringForUID('Class.prototype.method()'), 'class.prototype.method');

    });

});
