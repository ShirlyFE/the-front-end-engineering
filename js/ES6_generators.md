# ES6/ES7 Features

### Basic generator use

```js
function* genFuncWithReturn() {
    yield 'a';
    yield 'b';
    return 'result';
}
```
usage 1:

```js
const genObjWithReturn = genFuncWithReturn(); //return a generator
//call the next to start execute the function body
console.log(genObjWithReturn.next())  //{"value":"a","done":false}
console.log(genObjWithReturn.next())  //{"value":"b","done":false}
console.log(genObjWithReturn.next())  //{"value":"result","done":true}
```

usage 2:

```js
for (const x of genFuncWithReturn()) {
    console.log(x);
}
/* Output:
a
b
// It is because most constructs that work with iterables ignore the value inside the done object
*/
```

### Convenient to implement iterables

```js
function* objectEntries(obj) {
    // In ES6, you can use strings or symbols as property keys,
    // Reflect.ownKeys() retrieves both
    const propKeys = Reflect.ownKeys(obj);

    for (const propKey of propKeys) {
        yield [propKey, obj[propKey]];
    }
}

const jane = { first: 'Jane', last: 'Doe' };
for (const [key,value] of objectEntries(jane)) {
    console.log(`${key}: ${value}`);
}
/*
Output:
first: Jane
last: Doe
*/
```

### Recursion via yield*

yield*, an operator for making recursive generator calls, does consider values inside done objects

```js
"use strict";
function* foo() {
    yield 'a';
    yield 'b';
}

function* bar() {
    yield 'x';
    yield* foo();
    yield 'y';
}
```

the above bar internally works roughly as follows

```js
function* bar() {
    yield 'x';
    for (const value of foo()) {
        yield value;
    }
    yield 'y';
}

const arr = [...bar()];

console.log(arr); //["x","a","b","y"]
```

The operand of yield* does not have to be a generator object, it can be any iterable:

```js
function* bla() {
    yield 'sequence';
    yield* ['of', 'yielded'];
    yield 'values';
}

const arrOfBla = [...bla()];
console.log(arrOfBla); //["sequence","of","yielded","values"]
```

yield* considers end-of-iteration values, The result of yield* is the end-of-iteration value.
Although most constructs that support iterables ignore the value included in the end-of-iteration object (whose property done is true), generators not:

```js
function* genFuncWithReturn() {
    yield 'a';
    let test = yield 'b';
    console.log("test : "+test); //test : undefined
    return 'The result';
}
function* logReturned(genObj) {
    const result = yield* genObj;
    console.log(result); // (A)
}
console.log([...logReturned(genFuncWithReturn())])
/*Output
The result
["a","b"]
*/
```

### Generators as observers (data consumption)

If you use a generator as an observer, you send values to it via next() and it receives those values via yield:

```js
function* dataConsumer() {
    console.log('Started');
    console.log(`1. ${yield}`); // (A)
    console.log(`2. ${yield}`);
    return 'result';
}

const genObj = dataConsumer();

// start the generator by calling genObj.next();
console.log(genObj.next());
/*Output
Started
{"done":false}
*/
console.log(genObj.next('a'));
/*Output:
1. a
{"done":false}
*/
console.log(genObj.next('b'));
/*Output:
2. b
{"value":"result","done":true}
*/
```

as we see above: It always sends a value to the currently suspended yield, but returns the operand of the following yield


When using a generator as an observer, it is important to note that the only purpose of the first invocation of next() is to start the observer. It is only ready for input afterwards, because this first invocation has advanced execution to the first yield. Therefore, any input you send via the first next() is ignored

```js
function* gen() {
    // (A)
    while (true) {
        const input = yield; // (B)
        console.log("input is : "+input);
    }
}
const obj = gen();
console.log(obj.next('a'));
console.log(obj.next('b'));
/*Output:
{"done":false}
input is : b
{"done":false}
*/
```

```js
function* callee() {
  console.log('callee start');
    console.log('callee: ' + (yield));
    console.log('the received data by yield is : '+ (yield));
}
function* caller() {
  console.log('caller start');
    while (true) {
        yield* callee();
    }
}

const callerObj = caller();


console.log('generator created by call caller()');
console.log(callerObj.next());
console.log(callerObj.next('a'));
console.log(callerObj.next('b'));
/*Output:
generator created by call caller()
caller start
callee start
{"done":false}
callee: a
{"done":false}
the received data by yield is : b
callee start
{"done":false}
*/
```
callee doesn’t catch the exception, which is why it is propagated into caller, where it is logged before caller finishes

```js
function* callee() {
    try {
        yield 'b'; // (A)
        yield 'c';
    } finally {
        console.log('finally callee');
    }
}
function* caller() {
    try {
        yield 'a';
        yield* callee();
        yield 'd';
    } catch (e) {
        console.log('[caller] ' + e);
    }
}

const genObj = caller();
console.log(genObj.next());
console.log(genObj.next());
console.log(genObj.throw(new Error('Problem!')));

/*Output:
{"value":"a","done":false}
{"value":"b","done":false}
finally callee
[caller] Error: Problem!
{"done":true}
*/
```

```js
function* callee1() {
    try {
        yield 'b';
        yield 'c';
    } finally {
        console.log('finally callee');
    }
}
function* caller1() {
    try {
        yield 'a';
        yield* callee();
        yield 'd';
    } finally {
        console.log('finally caller');
    }
}

const [x, y] = caller1(); 
console.log('x is : '+x)
console.log('y is : '+y)

/*Output:
finally callee
finally caller
x is : a
y is : b
*/
```

```
var gen = function * () {
  yield 'a';
  yield 'b';
  return 'gen finish';
}

function* parGen() {
  var a = yield 'test start';
  console.log('a : '+a);
  var b = yield* gen();
  console.log('b is : '+b);
  yield 'last';
}


var ge = parGen();
console.log(ge.next());
console.log(ge.next());
console.log(ge.next());
console.log(ge.next());
console.log(ge.next());


/*Output:
{"value":"test start","done":false}
a : undefined
{"value":"a","done":false}
{"value":"b","done":false}
b is : gen finish
{"value":"last","done":false}
{"done":true}
*/
```

### Promise with generator

```js
function* printNames(firstName, lastName) {
    console.log('the timestamp is : '+Date.now());
    var printMessage = yield printFirstName(firstName);
    console.log('the timestamp is : '+Date.now());
    console.log('printMessage is : ')
    console.log(printMessage);
    var printFullNameMes = yield printFullName(firstName, lastName);
    console.log('the timestamp is : '+Date.now());
    console.log('printFullNameMes is : ')
    console.log(printFullNameMes);
}

function printFirstName(firstName) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve('the first name is : ' + firstName);
        }, 1000)
    })
}

function printFullName(firstName, lastName) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve('the fullName is : ' + firstName + " " + lastName);
        }, 1000)
    })
}

var gen = printNames('Shirly', 'Tian');
gen.next().value.then(function(theFirstName) {
    gen.next(theFirstName).value.then(function(theFullMessage) {
        console.log(gen.next(theFullMessage));
    })
})

/*Output:
the timestamp is : 1455695346787
the timestamp is : 1455695347782
printMessage is : 
the first name is : Shirly
the timestamp is : 1455695348788
printFullNameMes is : 
the fullName is : Shirly Tian
{"done":true}
*/
```


### ES7 async and await 

```js
async function printNames(firstName, lastName) {
    console.log('the timestamp is : '+Date.now());
    var printMessage = await printFirstName(firstName);
    console.log('the timestamp is : '+Date.now());
    console.log('printMessage is : ')
    console.log(printMessage);
    var printFullNameMes = await printFullName(firstName, lastName);
    console.log('the timestamp is : '+Date.now());
    console.log('printFullNameMes is : ')
    console.log(printFullNameMes);
    return 'Completed!'
}

function printFirstName(firstName) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve('the first name is : ' + firstName);
        }, 1000)
    })
}

function printFullName(firstName, lastName) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve('the fullName is : ' + firstName + " " + lastName);
        }, 1000)
    })
}

printNames('Shirly', 'Tian').then(function(res) {
    console.log(res);
})

/*Output:
the timestamp is : 1455696208503
the timestamp is : 1455696209517
printMessage is : 
the first name is : Shirly
the timestamp is : 1455696210522
printFullNameMes is : 
the fullName is : Shirly Tian
Completed!
*/
```