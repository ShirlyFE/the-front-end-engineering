# ES5

## use less but useful skill

A few Array methods have an extra parameter for specifying the value that this should have when invoking the callback. That’s the last parameter in line A, below.

```javascript
function Prefixer(prefix) {
    this.prefix = prefix;
}

// the first solution of using this inside map func 
Prefixer.prototype.prefixArray = function (arr) {
    return arr.map(function (x) {
        return this.prefix + x;
    }, this); // (A)
};

// the second solution of using this inside map func by "bind". I prefer the first one in ES5.
Prefixer.prototype.prefixArray = function (arr) {
    return arr.map(function (x) {
        return this.prefix + x;
    }.bind(this)); // (A)
};

// the third solution in ES6, of course the best one with a more convenient syntax.
Prefixer.prototype.prefixArray = function (arr) {
    return arr.map((x) => {
        return this.prefix + x;
    });
};
```

above can be fully achieved by ES6 with a class and a more compact variant of arrow functions:

```javascript
class Prefixer {
	constructor(prefix) {
		this.prefix = prefix;
	}
	prefixArray(arr) {
		return arr.map(x => this.prefix + x);
	}
}

// here, you can see that the methods constructor and prefixArray are defined using new, more compact ES6 syntax that also works in object literals.

// note how much an arrow function with an expression body can reduce verbosity |vēbasēti|.
```

lexical context: 词汇语境


# ECMASCRIPT 6


## Variables that are lexical in arrow functions

The source of this is an important distinguishing aspect of arrow functions.
The complete list of variables whose values are determined lexically is:

* arguments
* super
* this
*　new.target

For example:

```javascript
// this in 'setInterval' references the $curent-time element 
$('.current-time').each(function () {
  setInterval(() => $(this).text(Date.now()), 1000);
});


function log(msg) {
  const print = () => console.log(arguments[0]);
  print(`LOG: ${msg}`);
}
 
log('hello'); // hello
```

**注：**Fat arrow functions can’t be used as generators. That’s it – no exceptions, no caveats and no workarounds.


## Promise


## 生成器函数 generator

## 资料
[Generator 函数](http://es6.ruanyifeng.com/#docs/generator)

[Understanding ECMAScript 6](https://leanpub.com/understandinges6/read/)

[A javascript compiler, use next generation JavaScript, today](http://babeljs.io/)

[A collaborative website about the latest JavaScript features and tools.](http://jsrocks.org/)