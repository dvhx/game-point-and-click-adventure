// Evaluate inventory boolean expressions like "(book || gave_book) && !key" to true or false
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.booleanExpression = function (expression, inventory) {
    // Evaluate inventory boolean expressions like "(book || gave_book) && key" to true or false
    console.assert(typeof expression === 'string', '"if" expression must be string but is ' + typeof expression);
    inventory = inventory || {};
    // Remove spaces from the input
    expression = expression.replace(/\s+/g, '');

    // Helper function to evaluate basic operations
    function evaluate(op1, operator, op2 = null) {
        //console.log('op1', op1, 'operator', operator, 'op2', op2);
        if (operator === '||') {
            return op1 || op2;
        } else if (operator === '&&') {
            return op1 && op2;
        } else if (operator === '!') {
            return !op1;
        } else {
            throw new Error("Unsupported operator: " + operator);
        }
    }

    // Convert the expression into tokens
    const tokens = expression.match(/true|false|[a-zA-Z0-9_]+|\|\||&&|!|\(|\)/g);
    //console.log('tokens', tokens);
    if (!tokens) {
        throw new Error("Invalid boolean expression '" + expression + "'");
    }

    const valuesStack = [];
    const operatorsStack = [];

    const precedence = {
        '!': 3,
        '&&': 2,
        '||': 1,
    };

    // Function to process stacks based on operator precedence
    function processStacks() {
        const operator = operatorsStack.pop();
        if (operator === '!') {
            const op1 = valuesStack.pop();
            const result = evaluate(op1, operator);
            valuesStack.push(result);
        } else {
            const op2 = valuesStack.pop();
            const op1 = valuesStack.pop();
            const result = evaluate(op1, operator, op2);
            valuesStack.push(result);
        }
    }

    for (const token of tokens) {
        //console.log('token', token);
        if (!['(', ')', 'true', 'false', '&&', '||', '!'].includes(token)) {
            //console.log('inventory', token);
            valuesStack.push(inventory[token] ? true : false);
        } else if (token === 'true' || token === 'false') {
            valuesStack.push(token === 'true'); // Convert to boolean
        } else if (token === '&&' || token === '||' || token === '!') {
            while (
                operatorsStack.length &&
                precedence[operatorsStack[operatorsStack.length - 1]] >= precedence[token]
            ) {
                processStacks();
            }
            operatorsStack.push(token);
        } else if (token === '(') {
            operatorsStack.push(token);
        } else if (token === ')') {
            while (operatorsStack.length && operatorsStack[operatorsStack.length - 1] !== '(') {
                processStacks();
            }
            // Pop the '('
            operatorsStack.pop();
        } else {
            throw new Error("Unexpected token: " + token);
        }
    }

    // Process remaining operators
    while (operatorsStack.length) {
        processStacks();
    }

    return valuesStack.pop();
};

/*
// small test set
(function () {
    var test = {
    "true": true,
    "false": false,
    "true && true": true,
    "false || false": false,
    "( true )": true,
    "( false )": false,
    "false && true": false,
    "true || true": true,
    "true || false": true,
    "true && false": false,
    "false || true": true,
    "true && false || false": false,
    "false && false": false,
    "false || false && true": false,
    "( false ) || false": false,
    "false && true && ( true )": false,
    "( false ) && false": false,
    "true && false || true": true,
    "true && ( false ) && false": false,
    "false && false || false": false,
    "( true || false )": true,
    "( ( false ) )": false,
    "true || false || true": true,
    "( ( true || true ) )": true,
    "true && false && true": false,
    "( false && false )": false,
    "false || false && false || false": false,
    "( true ) && false": false,
    "true || false || false": true,
    "false && false || false && true": false,
    "true || ( true && false )": true,
    "false || false && false": false,
    "( false || true )": true,
    "false || true || true": true,
    "true || true || true": true,
    "false || ( false || true )": true,
    "( true || true )": true,
    "false && false || true": true,
    "true || ( false )": true,
    "true || false && true": true,
    "false || true && false": false,
    "( false && true )": false,
    "true || true && true": true,
    "( false ) && true": false,
    "true && true && false": false,
    "false && true && false": false,
    "( true ) || false": true,
    "( true ) && true": true,
    "( ( false || true ) )": true,
    "( true && true )": true,
    "false && false && true": false,
    "false && ( false )": false,
    "false || false || false": false,
    "true && ( false )": false,
    "( true ) || true": true,
    "false && ( true )": false,
    "false || true && true": true,
    "( ( true ) )": true,
    "true || true || false": true,
    "( false ) || true": true,
    "false || true || false": true,
    "( false ) || ( true )": true,
    "false || false || true": true,
    "( true || true && true )": true,
    "false && true && true": false,
    "false && false || false || true": true,
    "true && ( true )": true,
    "false && false && false": false,
    "false || true && ( true )": true,
    "true && true && false && false": false,
    "true && true && false || false": false,
    "false && true || false": false,
    "( false && false ) && false": false,
    "( true && false )": false,
    "true || ( true )": true,
    "true && false && false": false,
    "( false || false )": false,
    "true || ( ( true ) ) && true": true,
    "( ( true ) && true )": true,
    "false && true || true": true,
    "false && ( false ) && true": false,
    "true && false || false && true": false,
    "false || true && true && false": false,
    "( true || false ) && true || true": true,
    "true || true && false": true,
    "true || true || false && true": true,
    "( false && true || true )": true,
    "true && false || true && false": false,
    "true && true || true": true,
    "false || false && true || true": true,
    "true && true || ( true )": true,
    "false || ( ( false ) )": false,
    "true && ( false && false )": false,
    "true || true || false || false": true,
    "false || ( false )": false,
    "true && true || false && true": true,
    "false || ( true || false && true )": true,
    "false && true || true || true": true,
    "true && true || false": true,
    "false || ( true )": true,
    "true || false || true && true": true,
    "( true ) && false || false": false,
    "false && true && false && false": false,
    "( true && ( false ) )": false,
    "true || false || false || ( true )": true,
    "false && ( false || true )": false,
    "( false && true && true )": false,
    "true && ( false ) || true": true,
    "( false && true && true && false )": false,
    "true || true || ( false )": true,
    "( true || true && false )": true,
    "false && false && ( false )": false,
    "true && false && true && false": false,
    "( false ) && ( false ) && false": false,
    "true || false || ( true )": true,
    "( true && false ) || true": true,
    "true && true || true || false || true": true,
    "true || true || ( true || true )": true,
    "true || false && false": true,
    "true && true && true || false": true,
    "true || false && true && true": true,
    "true && true || true || true && true": true,
    "true || ( false && true )": true,
    "true || true || true || false": true,
    "true && true || false || true": true,
    "true && true && true": true,
    "true || ( false || true )": true,
    "true || ( ( true || true ) )": true,
    "true || false && true || false": true,
    "true && false || true || false": true,
    "false || ( ( true ) )": true,
    "( true ) || true && false": true,
    "false || false && ( true )": false,
    "false && ( true ) || true": true,
    "( true ) && ( false )": false,
    "true && true && false || true": true,
    "true || false && false || false || true": true,
    "true || false || ( false )": true,
    "false || ( true ) || false": true,
    "( false ) && ( false )": false,
    "false && ( true ) && true": false,
    "false && true || ( false )": false,
    "false || false && false || true": true,
    "( true ) || ( false )": true,
    "true && ( true ) && false": false,
    "( false || false ) || true": true,
    "( true && ( true ) ) || false": true,
    "false || false && false && true": false,
    "( true || false ) || false": true,
    "true || false && false && true": true,
    "true && false || true && false && true": false,
    "true || false || false || true": true,
    "true || false && true && false": true,
    "false || true || true || true": true,
    "false || ( true || false )": true,
    "true && ( true || true ) || false": true,
    "true && ( false ) && true": false,
    "( true || true ) && false": false,
    "false || true || false || false": true,
    "( true && false ) && true": false,
    "( false ) && false || true && false": false,
    "false && true || true && false": false,
    "false && false || ( true )": true,
    "( false && ( true ) )": false,
    "false || true && false && true": false,
    "false || true && true || false": true,
    "true && ( true && false )": false,
    "( true && false ) || true && false": false,
    "false && ( false || false )": false,
    "true || ( false ) || false": true,
    "true || true || true || true": true,
    "( true ) && true || true": true,
    "false && false && false && true": false,
    "( false && true || false ) || false": false,
    "( false && true || false )": false,
    "false || ( ( false || false ) )": false,
    "true || true || true || ( false )": true,
    "true || true && false || true": true,
    "( false || false || true )": true,
    "false || false || true || false": true,
    "( false && ( false ) )": false,
    "true || true && false && true": true,
    "false && true || false || false": false,
    "( ( true ) || ( true ) )": true,
    "( true ) && false || true": true,
    "false && ( true || true )": false,
    "true && true || ( false )": true,
    "true && true && ( true )": true,
    "( true || false ) || true": true,
    "true && false && false && ( false )": false,
    "( false || ( true ) )": true,
    "( false || false ) && false && true": false,
    "( false && false || true )": true,
    "true && false && false && true && false": false,
    "false || false || false || false": false,
    "( true ) || false || false": true,
    "false || ( true || true )": true,
    "true || true || false && false": true,
    "( false ) || true || true && false": true,
    "( true || true && false ) || true": true,
    "( false ) && false && false": false,
    "false && ( true ) || false": false,
    "( ( false && true ) )": false,
    "( false && false && false )": false,
    "true || ( false && false )": true,
    "true && false || true || true": true,
    "( ( false && false ) )": false,
    "false && false || false || false": false,
    "true && false || false && false": false,
    "true || true || true && true && true": true,
    "false || false || true && true": true,
    "( true && true && false )": false,
    "( ( false ) ) && false": false,
    "( true || false && true )": true,
    "true || false && ( true )": true,
    "true || false && ( true ) || false": true,
    "true && ( false || true )": true,
    "( true && false && false )": false,
    "( false ) || false && true": false,
    "( true && false && ( true ) )": false,
    "true || false || true || false": true,
    "( true ) && ( true )": true,
    "true && true || true && true": true,
    "( false && true ) || false": false,
    "false || false || true && false && false": false,
    "false || true && false || true && false": false,
    "true || false || false && true": true,
    "false && true && ( !false )": false,
    "false && ( false || true || false )": false,
    // negations
    "! false": true,
    "! true": false,
    "false || ! true": false,
    "! ( true )": false,
    "! ( true && false )": true,
    "! true || false": false,
    "! true || true": true,
    "false || ! false": true,
    "false && ! false": false,
    "! false || ! false": true,
    "true || ! false": true,
    "( ( ! false ) )": true,
    "! false && false": false,
    "false && ! true": false,
    "! false || ( ( false ) )": true,
    "true && ! true": false,
    "! true && false": false,
    "true || false && ! false": true,
    "true || ! true": true,
    "! ( false )": true,
    "( ! false )": true,
    "false && false && true || false": false,
    "! false || false": true,
    "! true && ! false": false,
    "! false || ! false || true": true,
    "! true && ! true && false": false,
    "true && ! false": true,
    "! true || ! ( true )": false,
    "true || ! false && true": true,
    "! false || true": true,
    "false || false || ! false": true,
    "false && ! true && true && true": false,
    "! false && true": true,
    "true && ! ( false )": true,
    "! true || ! true": false,
    "! true || true || ! true": true,
    "true && true && ! false": true,
    "! ( ! false )": false,
    "! true || false && false": false,
    "! false || true && ! false": true,
    "! true && true": false,
    "true && true || ! false": true,
    "true && true || ! true": true,
    "true && ! false || ! true": true,
    "( ! true && false )": false,
    "( ( false ) ) || false": false,
    "false || ! true && ! true": false,
    "false && ! ( true )": false,
    "! ( true ) && true": false,
    "! false || true && true": true,
    "false || ! false && true && true": true,
    "! ( false && false )": true,
    "( false ) && ! false": false,
    "true || false ( ! false )": true,
    "( ! true ) || false && true": false,
    "true && ! true || true": true,
    "false || true && ! false": true,
    "false || ! false || false": true

    };
    for (var k in test) {
        window.last = k;
        if (SC.booleanExpression(k) !== test[k]) {
            console.error('unit test failed for ' + k);
        }
    }
    console.log('done');
}());
*/

