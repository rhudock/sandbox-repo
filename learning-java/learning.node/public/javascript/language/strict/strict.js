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

        function func(x) {
            "use strict";
            // var arguments = []; // error: redefinition of arguments    // ...
        }

        function funcNs(x) {
            var arguments = [];
        }

        module("typeof operator");

        QUnit.asyncTest('max', function (assert) {
            expect(1);

            window.setTimeout(function () {
                funcNs(1);
                try {
                    func(1);
                } catch (e) {
                }
                assert.strictEqual(func(3, 1, 2), 3, 'All positive numbers');
                QUnit.start();
            }, 0);
        });
    }
);