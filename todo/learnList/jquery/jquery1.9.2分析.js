1. jQuery入口函数的改版：
var jQuery = function(selector, context) {
    this.selector = selector;
    this.context = context;
    console.log("jQuery 构造");
    if(!(this instanceof jQuery)) {
        console.log("第一次调用对象");
        return new jQuery(selector, context);
    }
    
    if(this.init) {
        console.log("执行对象方法");
        this.init();
    }
}

jQuery.prototype = {
    constructor: jQuery,
    init: function() {
        console.log("init method");
        return this;
    }
}

var $div = jQuery("div", "body");
console.log($div);
//  入口函数执行结果：

/****************************  
    jQuery 构造 
    第一次调用对象 
    jQuery 构造 
    执行对象方法 
    init method 

    jQuery
        context: "body"
        selector: "div"
        __proto__: Object
*****************************/

2. jQuery.fn.extend是对象方法的扩展，之所以这么说是因为：
定义在原型中的方法，只有在new对象时才能调用原型方法，
因此它是对象方法，但是jQuery.extend就是扩展静态方法，也就是类方法

3. jQuery = function( selector, context ) {
        //jQuery使用了大家比较熟悉的工厂方法创建对象
        //创建一个自定义对象，并返回，给所有jQuery方法提供一个统一的入口，避免繁琐难记
        //jQuery的构造对象，调用了jQuery.fn.init方法，最后返回jQuery.fn.init的对象
        return new jQuery.fn.init( selector, context, rootjQuery );
    },

4. (function(){
    var jQuery = function() {
        // 函数体
        return jQuery.fn.init();
    }
    jQuery.fn = jQuery.prototype = {
        // 扩展原型对象
        jquery: "1.8.3",
        init: function() {
            this.init_jquery = '2.0';
            return this;
        }
    }   
    window.jQuery = window.$ = jQuery;
})(); 

var proObject = jQuery();

console.log(proObject);

//此执行(jQuery())返回的是jQuery的原型对象
/*
Object {jquery: "1.8.3", init: function, init_jquery: "2.0"}
    init: function () {
    init_jquery: "2.0"
    jquery: "1.8.3"
    __proto__: Object

*/

/* init()方法中的this作用域：this关键字引用了init()函数作用域所在的对象，同时也能访问上一级对象jQuery.fn对象的作用域，这种思路会破坏作用域的独立性
对于jQuery框架来说，很可能造成消极影响，这里其实就似乎闭包，那怎么把init()方法中的this从jQuery.fn对象中分割出来？---实例化init初始化类型


(function(){
    var jQuery = function() {
        // 函数体
        return new jQuery.fn.init();
    }
    jQuery.fn = jQuery.prototype = {
        // 扩展原型对象
        jquery: "1.8.3",
        init: function() {
            this.init_jquery = '2.0';
            return this;
        }
    }   
    window.jQuery = window.$ = jQuery;
})();   
console.log(jQuery().jquery); ==>undefined
console.log(jQuery().init_jquery);  ==>2.0
可见，通过实例化init()初始化类型，限定了init()方法里的this，只在init()函数内活动，不让它超出范围
这里把init中的this从jquery.fn对象中分隔出来，那如何保证能访问jQuery原型对象呢，那就是原型传递===jQuery.fn.init.prototype = jQuery.fn

*/

5. $.extend = $.fn.extend = function() {
    
}