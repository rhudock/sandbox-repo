/**
 * $Id$
 *
 * Try to test for in in IE.

 "number"    Operand is a number
 "string"    Operand is a string
 "boolean"    Operand is a Boolean
 "object"    Operand is an object
 null    Operand is null.
 "undefined"    Operand is not defined.

 */

$(function () {

    function max() {
        return Math.max.apply(null, arguments);
    }

    module("typeof operator");

    QUnit.asyncTest('max', function (assert) {
        expect(1);

        window.setTimeout(function () {
            assert.strictEqual(max(3, 1, 2), 3, 'All positive numbers');
            QUnit.start();
        }, 0);
    });

    QUnit.asyncTest('max', function (assert) {
        expect(4);
        QUnit.stop(3);

        window.setTimeout(function () {
            assert.strictEqual(max(), -Infinity, 'No parameters');
            QUnit.start();
        }, 1000);

        window.setTimeout(function () {
            assert.strictEqual(max(3, 1, 2), 3, 'All positive numbers');
            QUnit.start();
        }, 0);

        window.setTimeout(function () {
            assert.strictEqual(max(-10, 5, 3, 99), 99, 'Positive and negative numbers');
            QUnit.start();
        }, 0);

        window.setTimeout(function () {
            assert.strictEqual(max(-14, -22, -5), -5, 'All positive numbers');
            QUnit.start();
        }, 0);
    });
/*

    QUnit.asyncTest('max', function (assert) {
        expect(1);

        var promise = new Promise(function (resolve, reject) {
            // do a thing, possibly async, then…
            window.setTimeout(function () {
                assert.strictEqual(max(3, 1, 2), 3, 'All positive numbers');
                QUnit.start();
            }, 0);

            if (/!* everything turned out fine *!/) {
                resolve("Stuff worked!");
            }
            else {
                reject(Error("It broke"));
            }
        });

        promise.then(function(result) {
            console.log(result); // "Stuff worked!"
        }, function(err) {
            console.log(err); // Error: "It broke"
        });
    });
*/

    // QUnit.asyncTest('max', function (assert) {

        function get(url) {
            // Return a new promise.
            return new Promise(function(resolve, reject) {
                // Do the usual XHR stuff
                var req = new XMLHttpRequest();
                req.open('GET', url);

                req.onload = function() {
                    // This is called even on 404 etc
                    // so check the status
                    if (req.status == 200) {
                        // Resolve the promise with the response text
                        resolve(req.response);
                    }
                    else {
                        // Otherwise reject with the status text
                        // which will hopefully be a meaningful error
                        reject(Error(req.statusText));
                    }
                };

                // Handle network errors
                req.onerror = function() {
                    reject(Error("Network Error"));
                };

                // Make the request
                req.send();
            });
        }

    get('story.json').then(function(response) {
        console.log("Success!", response);
    }, function(error) {
        console.error("Failed!", error);
    })

    // });


});