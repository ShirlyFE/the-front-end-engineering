jQuery.prototype = {
    toArray: function(this) {
        return [].slice.call(this);
    },

    get: function(num) {
        return num != null ? 
            (num < 0 ? this[num + this.length] : this[num]) : 
            [].slice.call(this);
    },

    // ？？
    //Add a collection of DOM elements onto the jQuery stack.
    // .pushStack(elements, name, arguments)
    pushStack: function() {

    },

    each: function(callback, args) {
        return jQuery.each(this, callback, args);
    },

    map: function() {

    },
    //  为什么要使用pushStack
    slice: function() {

    }


}

/*
jQuery.extend( target [, object1 ] [, objectN ] )
jQuery.extend( [deep ], target, object1 [, objectN ] )
如果extend方法只有一个参数则是在跟新jQuery或者jQuery.fn的命名空间，只不过jQuery是类方法 
jQuery.fn是对象方法
*/

$.extend = $.fn.extend = function() {
    var name, src, copy, copyIsArray, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep: false;

    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
    }

    // 如果不是对象或者方法就将其设为{},可见是可以扩这方法的，也就是说target是一个方法，就像扩展jQuery方法一样
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {};
    }

    if (length == i) {
        target = this;
        --i;
    }

    for (; i < length; i++) {

        if (options = arguments[i] != null ) {

            for (name in options) {
                src = target[name];
                copy = options[name];
                /*
                    var jQuery = function() {
                        return new jQuery();
                    } 
                    因为引用了自身，因此当执行jQuery();时就会造成死循环，不管是否进行深拷贝都会出现此情况
                    比如 var obj1 = {name:'tianlili',age:25};
                    $.extend(obj1,{name="leijing",friend:obj1});
                    如果不进行判断，则得到的结果是:
                    name:'leijing'
                    age:25
                    friend:{    name:"leijing"
                                age:25
                                friend:{    name:'leijing'
                                            age:25
                                            friend:{ ... //继续下去
                                      
                                            }
                                }
                           }
                */
                if (target == copy) {
                    continue;
                }

                if (copy && deep && (jQuery.isPlainObject(copy) || copyIsArray = jQuery.isArray(copy))) {
                    if (copyIsArray) {
                        copyIsArray = false;

                        clone = src && jQuery.isArray(src) ? src : [];
                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }

                    target[name] = jQuery.extend(deep, clone, copy);
                } else if (copy != undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
    
}

jQuery.extend({
    // 保证页面上每一个jQuery的复制都是唯一的
    expando: "jQuery"+(version+Math.random()).replace(/\D/g, ""),

    noConflict: function(deep) {
        if (window.$ === jQuery) {
            window.$ = _$;
        }

        if (deep && window.jQuery = jQuery) {
            window.jQuery = _jQuery;
        }

        return jQuery;

    },

    isReady: false,

    readyWait: 1,
    // ??
    hodeReady: function() {

    },
    // ??
    ready: function() {

    },

    error: function(msg) {
        throw new Error(msg);
    },

    isWindow: function(obj) {
        return obj != null && obj == obj.window;
    },

    type: function(obj) {
        // jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        //     class2type[ "[object " + name + "]" ] = name.toLowerCase();
        // });
        var class2type = {},
            core_toString = class2type.toString;

        if (obj == null) {
            return String(obj);
        }
        // 注意运算符优先级：typeof > === > || > ?:
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[ core_toString.call(obj) ] || "object" : 
            typeof obj;
    },

    isArray: Array.isArray || function(obj) {
        return jQuery.type(obj) === "array";
    }

    // plainObject 是指简单对象，只能是{}或new Object生成
    isPlainObject: function(obj) {

        var class2type = {},
            core_hasOwn = class2type.hasOwnProperty;

        if(!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
            return false;
        }

        /* 判断上层原型链的对象是否有isPrototypeOf属性，也就是说对象是Object构造出来的
        (isPrototypeOf是Object。prototype的属性)

        */
        try {
            /*
                var obj = {}, hasOwn = obj.hasOwnProperty; 
                console.log(hasOwn.call(window.constructor.prototype, isPrototypeOf));
                输出： false

                说明：window是宿主对象，和DOM，BOM对象一样
            */
            if (obj.constructor && !core_hasOwn.call(obj, "constructor") &&
                !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch(e) {
            //IE8,9在一些宿主对象上做判断时会抛出异常
            return false;
        }
        /*
            上面几部已经基本能确定是否为PlainObjecgt了，但是还有一种情况，手动修改了原型，
            使得原型上也可枚举

            比如：
            function Foo() {
                this.a = 1;
                this.b = 2;
            }

            Foo.prototype = {
                c: 3,
                d: 4
            }

            foo = new Foo();
            console.log(foo.constructor.prototype.hasOwnProperty("isPrototypeOf")) // => true
            所以还需要一层判断，是否还有上层的原型链，如何实现呢，先看for in如何运作

            Enumeration the properties of an object includes enumerating properties of its prototype, 
            and the prototype of the prototype ,and so on,recursively;

            枚举的时候会先读对象自己的属性，然后再从原型链上依次往上找，这些属性要是可枚举的。
            所以关键是：循环完后读的最后一个属性如果还是对象自身的话那说明已经没有上层的原型链了。
        */  
        var key;
        for (key in obj) {}
        return key === undefined || core_hasOwn.call(obj, key);

    },

    isEmptyObject: function(obj) {
        var name ;
        for (name in obj) {
            return false;
        }
        return true;
    },

    isFunction: function(obj) {
        return jQuery.type(obj) === 'function';
    },

    isNumeric: function(obj) {
        /*
            isNaN(x) 函数用于检查其参数(x)是否是非数字值。
            可以记忆为 is not a number  通过这个可以得到 如果参数x不是数字返回true、数字就返回false。
            提示 ： isNaN() 函数通常用于检测 parseFloat() 和 parseInt() 的结果，以判断它们表示的是否是合法的数字。
            也可以用 isNaN() 函数来检测算数错误，比如用 0 作除数的情况。
            例：

                     isNaN(123)                 ---> false
                     isNaN(-1.23)               ---> false
                     isNaN(5-2)                  ---> false
                     isNaN(0)                     ---> false
                     isNaN("Hello")             ---> true
                     isNaN("2005/12/12")  ---> true
                     isNaN(0/0))                 ---> true
            2.isFinite(number)
            isFinite() 函数用于检查其参数是否是无穷大。
            如果 number 是有限数字（或可转换为有限数字），那么返回 true。否则，如果 number 是 NaN（非数字），或者是正、负无穷大的数，则返回 false。
            例：
                     isFinite(123)                 ---> true
                     isFinite(-1.23)               ---> true
                     isFinite(5-2)                  ---> true
                     isFinite(0)                     ---> true
                     isFinite("Hello")             ---> false
                     isFinite("2005/12/12")  ---> false
                     isFinite(0/0))                 ---> false
        */
        //  isFinite的存在还是很有必要的，因为像"23.23d"其实就不是Number，但是23.23是，而这两者的区别就通过isFinite来判断
        return !isNaN(parseFloat(obj)) && isFinite(obj);  
    },

})


function createSafeFragment (document) {
    
}