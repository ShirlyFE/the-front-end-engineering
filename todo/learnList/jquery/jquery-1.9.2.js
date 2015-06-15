//前言：jQuery凭借简洁的语法和跨平台的兼容性，极大地简化了JavaScript开发开发人员遍历HTML文档、操作DOM、处理事件、执行动画和开发Ajax的操作。
//分析源码目的：学习先进的设计理念；学习各种实现技巧；巩固js基础；无限接近牛人
//jQuery团队核心人物：John Resig ------http://ejohn.org/  
//Brandon Aaron -----http://brandonaaron.net/  
//Jorn Zaefferer --http://bassistance.de/
/*  jQuery对象构造函数的主体结构
var jQuery = (function() {

    //创建jQuery对象,给所有的jQuery方法提供统一的入口,避免繁琐难记

    var jQuery = function( selector, context ) {

        //jQuery的构造对象,调用了jQuery.fn.init方法

        //最后返回jQuery.fn.init的对象

        return new jQuery.fn.init( selector, context, rootjQuery );

    },
    //定义jQuery的原型,jQuery.fn指向jQuery.prototype对象

    jQuery.fn = jQuery.prototype = {

    //重新指定构造函数属性,因为默认指向jQuery.fn.init

    constructor: jQuery,

    init: function( selector, context, rootjQuery ) {.....},

    //返回jQuery变量,同时定义将全局变量window.jQuery和window.$指向jQuery
    return (window.jQuery = window.$ = jQuery);
})();

*/

/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Date: 2013-2-4
 */
 /*为什么要在参数列表中增加undefined
 在自调用匿名函数的作用域内，确保undefined是真的未定义，因为undefined能够被重写，赋予新的值



 */
(function( window, undefined ) {
// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,//获取document对象，保存为一个局部变量
	location = window.location, //获取URL信息

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	/**
	 * _jQuery和_$保存已经存在的jQuery和$,因为默认情况下jQuery占用jQuery和$两个命名空间
	 * 这里保存已存在的$属性，在处理类库冲突时很有用，比如prototype也有用到$，则在加载了prototype.js之后又加载jquery.js文件时，
     * window.$*就是prototype的$(element)方法，而不是jQuery方法，将window.$保存在_$之后，为后面noConflict方法处理类库冲突做铺垫
	 */
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

/**
 * jQuery提供了四种封装jQuery对象的方法，分别是：
 * 1.DOM Element： 调用elem =document.getElementsByTagName("div");
 * 2.HTML string:  调用 elem = $(elem);
 * 3.Tag :  调用 elem = $("div");
 * 4.exp :  调用 elem = $("<p>hello</p>");
 * 5.选择器 ： 调用 elem = $("body > div");
 */
 /*不直接返回jQuery对象，而是调用另一个方法的原因：如果直接返回对象，则每次使用jQuery对象,都要new jQuery()，这样很不方便，
    直接将new这个操作封装在jQuery构造函数里面，简化了实例化的操作，同时通过jQuery或者$符号，统一了接口，方便了代码的编写，化繁为简

其实在使用返回 new jQuery.fn.init( selector, context, rootjQuery ) 对象方式，我还有另一种实现：

var jQuery = function( selector, context ) {  
    //如果以$("#id") 方式调用this就不是jQuery.这样返回jQuery对象  
    if(!(this instanceof jQuery)) {  
        return new jQuery(selector, context);  
    }  
    if(this.init) {  
        this.init();  
    }  
}  
//这行就可以注释了  
//jQuery.fn.init.prototype = jQuery.fn;


*/
	jQuery = function( selector, context ) {
        //jQuery使用了大家比较熟悉的工厂方法创建对象
		//创建一个自定义对象，并返回，给所有jQuery方法提供一个统一的入口，避免繁琐难记
        //jQuery的构造对象，调用了jQuery.fn.init方法，最后返回jQuery.fn.init的对象
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, //(?:<\/\1>|)匹配'</div>'或者''

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};
/*
(function(){
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
console.log(jQuery().jquery);  ==>1.8.3
console.log(jQuery().init_jquery);  ==>2.0

init()方法中的this作用域：this关键字引用了init()函数作用域所在的对象，同时也能访问上一级对象jQuery.fn对象的作用域，这种思路会破坏作用域的独立性
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

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,
//重新指定构造函数属性，因为默认指向jQueryjQuery.fn.init
	constructor: jQuery,
//所有查找或生成元素的结果，封装为jQuery对象数组返回
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// 处理 $(""), $(null), $(undefined), $(false)，this指向jQuery对象
		if ( !selector ) {
			//
            return this;
		}

/*
  如果是字符串，有六种情况：
  1.单个html元素，不带属性对象字面量：ElementCreate+Merge
  2.单个html元素，带属性对象字面量：createElement+Merge+attr
  3.多个html元素：buildFragment+merge
  4.#id不带context：个体ElementById或者getElementById+Sizzle
  5.#id 带context：sizzle
  6.expression string ：Sizzle
  7.标签选择器：Sizzle（内置getElementsByTagName）;
*/
        //selector是字符串字面量
		if ( typeof selector === "string" ) {
            //此处match[1]是类似于'<div>'、'<div>dfdfd<span>fdd</span></div>'、'<div></div>'的形式
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				//假如string以"<"开始和">"结束，则是html，可以跳过正则的检查
				match = [ null, selector, null ];

			} else {
            //形如(?:pattern)的正则可以避免保存括号内的匹配结果
            //\w：匹配字母、数字或下划线字符
            //\W:匹配所有与\w不匹配的字符
            //rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,
            //由于(?:parrern)的原因，第一个括号(?:...)里的自正则不会被匹配，但是子匹配(<[\w\W]+>)和([\w-]*)会被匹配
            /* 示例：
            function execReg(reg,str){ 
                var result = reg.exec(str);
                console.log(result);
            } 
            var str = '<div>hello<div>';
            var reg  = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/;
            execReg(reg,str);
            结果：
            result是类似数组的对象：["<div>hello<div>","<div>hello<div>",undefined]
            0  :  "<div>hello<div>"  --->整匹配
            1  :  "<div>hello<div>"  --->子匹配(<[\w\W]+>)
            2  :  undefined    --->子匹配([\w-]*)
            index  :  0
            input  :  "<div>hello<div>"
            可见子匹配：(?:(<[\w\W]+>)[^>]*|#([\w-]*))被忽略
            */
            //此处得到的match[1]是类似于'<div>gdfgfdg',match[2]是类似于'#id'
				match = rquickExpr.exec( selector );
			}
			//分析匹配结果，match[1]为子匹配(<[\w\W]+>)
			if ( match && (match[1] || !context) ) {

				// 处理html字符 $(html) -> $(array)
				if ( match[1] ) {
                //如果context是jQuery对象，则取用第一个元素，即context[0]，事实上得到的是DOM对象
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
                    //这里的jQuery.parseHTML()方法返回创建的数组形式的doM对象节点：[context.createElement(parsed[1])];

                    //这里的jQuery是函数，因为jQuery函数本身有merge方法
//this是选择器init构造函数的实例对象，该对象继承jQuery.prototype对象中的length属性(默认为0)，因此这里的this是数组对象
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// 处理match[1]为空标签且context是一个非空纯对象$('<div></div>', { class: 'css-class', data-name: 'data-val' });
                    //\s匹配任何空白字符，包括制表符、空白和分页
                    //rsingleTag.test(match[1])是判断是否为单个元素字符串,if用来确定它是带对象属性字面量的，例如：$('<div>',{'id':'test','class':'test'});
                    //rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,它用来匹配一个独立的空标签，比如'<div>','<div></div>','<hr />',其他的比如：'<div >dfdsf'、'<div>fafdasfdsfdasf</div>'、'<div>fdsfdsZ<span>fdsfds</span>fdf</div>'均无效
					//isPlainObject判断传入的参数是否是纯粹的对象，比如由{}或者new Object()创建的对象
                    if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
                                
								this.attr( match, context[ match ] );
							}
						}
					}
					return this;
                //match存在，且!context为真
				// 处理 $('#id')并且!context为真，也就是context不存在,例如$("#XXX");
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// 处理IE和Opera ID和Name混淆的bug，使用Sizzle查找
						if ( elem.id !== match[2] ) {
                        //rootjQuery =jQuery(document);   
							return rootjQuery.find( selector );
						}

						// 否则简单插入jQuery对象数组
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}
            //如果是!context为真，则match必为false，即selector不是含有标签('<'和'>')的字符串，如果!context为假，则说明match[1]为undefined，match[2]存在，且context存在，即$('#id',context)的形式
			// 处理: $(expr, $(...))，使用SIzzle查找，例如$('div'),$('div > a').$('div , a'),$('div:first')
            //这里处理context不存在或者context为jQuery对象
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
            //处理context为className或者dom节点元素
			} else {
				return this.constructor( context ).find( selector );
			}
        //selector非字符串
		//处理$(DOMElement)  ---elementNode:1,attributeNode:2,textNode:3,CDATA_SECTION_NODE:4,commentNode:8,documentNode:9,documentTypeNode:10,documentFragmentNode:11,NotationNode:12
		} else if ( selector.nodeType ) {
        //如果nodeType为真，说明selector已经是一个DOM对象，直接放进jQuery对象数组中
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// 处理: $(function)，设置dom加载的时候绑定的函数，等同于$(document).ready(){},是它的简写形式
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}
//处理$($(...)),完成克隆jQuery对象的简单参数，具体有makeArray完成
		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}
        //处理$($(selector,context))的情况，也就是说当第一个参数selector为jQuery对象时，将selector中的dom节点合并到this对象中，并返回this对象
		return jQuery.makeArray( selector, this );
	},

	//为对象初始化一个空的选择器
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},
    /*
    var obj= {
        name:'tianlili',
        age:24
    };
    obj[0] = 'hello';
    obj[1] = 'world';
    obj.length = 2;
    var arr = [];
    var slice = arr.slice;
    console.log(slice.call(obj));  ====>["hello", "world"]
    如果不设置length，则length默认为0，因此
    console.log(slice.call(obj));  ====>[]
    */
    /*
    关于为什么可以使用对象冒充数组的问题
    ----查看V8之类开源引擎的源码就知道，要调用Array原型链上的方法，通常对象满足2个条件就可以了
    1.本身可以存取属性；2.length属性不能是只读（可以没有length属性）拿Array.prototype.push方法举例，在v8的src目录下的array.js可以找到这些方法
    push代码如下：
    function ArrayPush() {  
      var n = ToUint32(this.length);  
        //对象/数组本身的length. 如果为null或者undefined, 会在ToUint32中转化为0. 所以 
        //即使没有length属性,也会给一个默认的0值. 

      var m = %_ArgumentsLength();    //参数的length.  
      for (var i = 0; i < m; i++) {  
        this[i+n] = %_Arguments(i);   //复制属性  
      }  
      this.length = n + m;            //重设length.  
      return this.length;  
    }  
    可以看到push操作的核心就是赋值属性和重设长度。jQuery对象完全可以满足这2个条件，同样的道理一个对象字面量{}也可以
    而string类型的不可以，因为不能在string上存取属性。function对象孙然可以存取属性，也有length属性，不过它的length属性比较特殊
    表示形参的个数，是一个只读属性，源码中的this.length = n+m这一句不起作用，所以function对象也不行，同理window对象也不行，
    那下面的core_slice.call实现也是这个原理
    这样我们就可以解释很多奇怪的问题，比如：
    var a = {};  
    a[0] = 1;  
    a[1] = 2;  
    Array.prototype.push.call(a, 3);  
    alert (a.length)   // a没有length属性, 默认的给0值, 所以结果为1 .  
    如果在push操作之前添加一句 a.length = 2;
    再进行push操作后, a.length就为3了. 
    
    */
	toArray: function() {
		return core_slice.call( this );//一个对象要想调用数组的slice方法，必须有length属性，形成类数组

	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
        return num == null ?
            
			// Return a 'clean' array
            //调用数组的slice方法得到一个‘纯净’的数组
			this.toArray() :

			//因为是类数组，所以可以用下标的形式去取，之前是通过slice方法截取的
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
    //讲一个数组或者对象压入栈中，同时返回一个新的对象集合，在后面，会看到jQuery利用这个方法来筛选、查找上一个、下一个对象
	pushStack: function( elems ) {

        //this.constructor();返回一个length为0的空jQuery对象，相当于jQuery();
		var ret = jQuery.merge( this.constructor(), elems );
        //ret为将elems合并了到了空jQuery对象里形成jQuery对象

		// Add the old object onto the stack (as a reference)
        //将当前调用的对象（this），作为新jQuery对象的前一个对象，
		ret.prevObject = this;
        //将当前调用对象的上下文环境（Dom集）赋给新的jQuery对象
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},
    //判断don是否载入完毕？？？？？？？
	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},
    //返回要jQuery对象集合中需要的局部jQuery对象集合，返回的对象包含原始jQuery对象集合
	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},
//返回jQuery对象集合中特定jQuery对象，返回的对象的prevObject属性包含原始jQuery对象集合
	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
            //注意传递给pushStack的参数是数组形式的dom集合
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},
//callback将调用当前集合中的每个元素
//map是通过一个函数匹配当前集合中的每个元素，返回执行后的结果？？？？？？？？
	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},
//返回当前调用之前的对象
	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

//这一句很关键，每当我们调用$()方法时，jQuery就会用new运算符调用他prototype上的init创建一个实例对象，而此实例对象拥有init构造器的prototype原型对象的方法，
//通过改变prototype指针的指向，使其指向jQuery的prototype，这样创建出来的对象就继承了jQuery.fn圆形对象定义的方法
//原因就是这个实例对象的_proto_内部属性会指向jQuery的prototype属性，从而使这个由init创建的实例会继承jQuery prototype上的所有方法
jQuery.fn.init.prototype = jQuery.fn;

/**
 * jQuery.extend与jQuery.fn.extend指向同一个函数对象
 * jQuery.extend是jQuery的属性函数（静态方法）
 * jQuery.fn.extend是jQuery函数所构造对象的属性函数（对象方法）
 * 1.对象合并：
 *   对象合并不区分调用这，jQuery.extend与jQuery.fn.extend完全一致
 *   对象合并返回最终合并后的对象，支持深度拷贝
 * 2.为jQuery对象本身增加方法：----也就是扩展jQuery的命名空间（命名空间是指标识符的各种可见范围）
 *   这种方法从调用者和参数进行区分，形式为$.extend({Object})
 * 3.原型继承  
 *   这种方式为jQuery所构造的对象增加方法  形式为$.fn.extend({Object})
 *   实际上是将｛Object｝追加到jQuery.prototype，实现原型继承
 * jQuery.fn = jQuery.prototype
 * jQuery.fn.extend = jQuery.prototype.extend
 */
//后续的大部分功能都通过该函数扩展，通过jQuery.fn.extend扩展的函数，大部分都会调用jQuery.extend扩展的同名函数
jQuery.extend = jQuery.fn.extend = function() {
	//当deep为false时，由target = arguments[0] || {},得到target为{},因此i=1,options=arguments[1]
/**
 * 1.变量i：循环变量,它会在循环时指向需要复制的第一个对象的位置,默认为1  
 *           如果需要进行深度复制,则它指向的位置为2 
 * 2.变量target：是目标对象，默认是第一个参数，当深度复制时是第二个参数，当第一个参数是false(deep)时，target是{}
 * 3.变量deep：是否进行深度拷贝
 * 4.变量options：复制时记录参数对象
 * 5.变量name：复制时记录对象属性名
 * 6.变量src：复制时记录目标对象的属性值
 * 7.变量copu：复制时记录参数对象的属性值
 */
    var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	if ( typeof target === "boolean" ) {
		//deep =true时进行深度拷贝
        deep = target;
        //进行深度拷贝时目标对象为第二个实参,如果没有则默认为空对象
		target = arguments[1] || {};
        //因为有了deep深度复制参数,因此i指向的位置为除deep之外的第二个参数，也就是跳过boolean和target
		i = 2;
	}
	//当目标对象不是一个Object且不是一个Function时(函数也是对象,因此使用jQuery.isFunction进行检查)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	//如果当前参数中只包含一个{Object}  
    //如 $.extend({Object}) 或 $.extend({Boolean}, {Object})  
    //是对jquery命名空间的扩展，将该对象中的属性拷贝到当前jQuery对象或实例中  
    //此情况下deep深度复制仍然有效  
	if ( length === i ) {
		//target = this;这句代码是整个extend函数的核心  
        //在这里目标对象被更改,这里的this指向调用者  
        //在 $.extend()方式中表示jQuery对象本身  
        //在 $.fn.extend()方式中表示jQuery函数所构造的对象(即jQuery类的实例) 
        target = this;
		//自减1,便于在后面的拷贝循环中,可以指向需要复制的对象
        --i;
	}
    //循环实参,循环从第1个参数开始,如果是深度复制,则从第2个参数开始  
    for ( ; i < length; i++ ) {
		//当前参数不为null,undefined,0,false,空字符串时  
        //options表示当前参数对象  
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ]; //目标对象的属性值
				copy = options[ name ]; //待拷贝对象的属性值
				//存在目标对象本身的引用,构成死循环,造成内存溢出，所以这里要进行判断，防止死循环的出现
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
				if ( target === copy ) {
					continue;
				}

				//如果需要进行深度拷贝,深度处理copy，且copy类型为纯对象或数组  
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) { //copy是数组
						copyIsArray = false;
                        //clone是src的修正值，如果src也为数组则clone是src，如果不是，则置为空数组，以clone作为深度拷贝时的目标数组
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
                        //同上，如果copy是对象则clone是当前属性值的修正后的对象，作为深度拷贝的目标对象
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					//递归调用jQuery.extend，对copy迭代深度复制
					target[ name ] = jQuery.extend( deep, clone, copy );

				// 如果不进行深度拷贝，直接将待增加的对象copy赋值给目标对象，在进行深度拷贝时，如果copy不为数组或者对象，不管src是什么类型，直接进行替换
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// 返回合并后的目标对象
	return target;
};
//在jQuery上扩展静态方法
jQuery.extend({
	/**
     * 在同时包含多个库的时候很有用，比如同事包含prototype库和jQuery库，可以先加载prototype库，然后调用
     * jq=jQuery.noConfilct()就可以直接使用jQuery框架，$就变回了prototype中的方法了，noConflict方法的deep参数，
     * 可以让另一个jQuery(可能不怎么有名，但对项目有用)和现在的jQuery库共存
	 */
     //通过向参数传递true，可以将$和jQuery的控制权都交出来
	noConflict: function( deep ) {
		//交出$的控制权
        if ( window.$ === jQuery ) {
			window.$ = _$;
		}
        //交出jQuery的控制权
		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
    //一个计数器，用于跟踪在ready事件触发前的等待次数？？？？等待什么？？
	readyWait: 1,

	// Hold (or release) the ready event  ---暂停或恢复ready事件的执行
    /*
    $.holdReady()方法允许调用者延迟jQuery的ready事件。此功能允许在 ready 事件触发之前，动态加载其它的 JavaScript，例如 jQuery 插件，即使 DOM 可能已经准备就绪。该方法必须在文档开头被调用，例如，在 <head> 中加载完 jQuery 脚本之后，立刻调用该方法。如果在 ready 事件已经被调用后再调用该方法，将不会起作用。
    为了延迟 ready 事件，首先要调用 $.holdReady(true)，当 ready 事件准备执行时，再调用 $.holdReady(false) 。注意，在 ready 事件中可以设置多个 hold。每一个都对应一次 $.holdReady(true) 调用。直到所有的 hold 都被释放，也就是调用了对应数量的 $.holdReady(false)之后，并且满足正常的文档 ready 条件时，ready 事件才会被真正执行。
    例如：延迟就绪事件，直到已加载的插件。
    $.holdReady(true);
    $.getScript("myplugin.js", function() {
      $.holdReady(false);
    });
    */
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// 当DOM准备就绪时执行ready事件
    /*
    .ready()方法通常和<body onload="">属性是不兼容的。如果load必须使用，要么不使用.ready()，要么使用jQuery的.load()方法向 window 或一些指定的元素（例如，图片）绑定 load 事件。
    还有$(document).bind("ready", handler)。该方法在从 jQuery 1.8 开始不再建议使用。这种用法的行为和 ready 方法类似，只有一点不同：如果 .ready() 方法已经被执行，再试图进行 .bind("ready")的话，此时通过 .bind("ready") 绑定的函数是不会被立刻执行的，而是在使用上述三种方法之一进行绑定的函数执行完后，才会执行通过这种方法绑定的 ready 事件处理。（愚人码头注：如果同时使用 .ready() 方法和 $(document).bind("ready", handler) 的话，那么始终会先执行 .ready()，再执行通过 bind 绑定的事件。）
    
    */
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},
//如果浏览器有内置的Array.isArray实现，就是用浏览器自身的实现方法
	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
    //$.isWindow(window)==>true;$.isWindow(document)==>false
    //旧版中是：return obj && typeof obj ==='object' && 'setInterval' in obj;===>通过setInterval属性来判断
    //关键：window对象有一个特殊的属性window,等价于self属性，它包含了对窗口自身的引用。通过这个属性判断是否是window对象
		return obj != null && obj == obj.window;
	},
//window对象的isFinite判断
	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},
//获取对象的类型
	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},
/*
用于判断对象是否是纯粹的对象（通过 "{}" 或者 "new Object" 创建的）。 
'纯粹的对象'指的就是由Object构造出来的对象。那哪些对象是由Object构造出来的呢。首当其充的肯定是由new Object()所构造出来的对象，注意：在Object后的括号里可没加任何东西。因为Object是所有'类'的根基，因此它有一些特殊的行为,如当调用new Object(3)的时候，会构造一个Number类型的对象。new Object('')会构造一个String类型的对象。然后以{}这种形式定义的对象也属于'纯粹的对象'。'{}'的实质就是new Object()，只是表现形形式不同
var objStr = new Object('');
alert(objStr.constructor);//String
alert(isPlainObject(objStr));//false
var objNum = new Object(3);
alert(objNum.constructor);//Number
alert(isPlainObject(objNum));//false
function Person(){}
var person = new Person();
alert(isPlainObject(person));//false
var obj01 = new Object();
obj01.name = '笨蛋的座右铭';
alert(isPlainObject(obj01));//true
alert(isPlainObject({name:'笨蛋的座右铭'}));//true 
console.info( $.isPlainObject( {} ) ); // true

    // console.info( $.isPlainObject( '' ) ); // false

    // console.info( $.isPlainObject( document.location ) ); // true

    // console.info( $.isPlainObject( document ) ); // false

    // console.info( $.isPlainObject( new Date() ) ); // false

    // console.info( $.isPlainObject( ) ); // false
*/
	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
        /*obj不存在 或 非object类型 或 DOM节点 或 widnow对象，直接返回false；
        测试以下三中可能的情况：
        jQuery.type(obj) !== "object" 类型不是object，忽略
        obj.nodeType 认为DOM节点不是纯对象
        jQuery.isWindow( obj ) 认为window不是纯对象
        */
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
            //constructor是对创建对象的函数的引用（指针）。对于 Object 对象，该指针指向原始的 Object() 函数
    //判断obj是否具有isPrototypeOf属性，isPrototypeOf是挂在Object.prototype上的。通过字面量或自定义类（构造器）创建的对象都会继承该属性方法
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,  ====》注意这里的描述
		// if last one is own, then all properties are own.

		var key;
        /*for - in循环使用时，返回的是所有能够通过对象访问的、可枚举的属性，其中既包括存在于实力中的属性，也包括存在于原型中的属性。屏蔽了原型中不可枚举属性（即设置了[[DontEnum]]标记的属性）的实例属性也会在for-in中返回
        因为根据规定，所有开发人员定义的属性都是可枚举的
        (new fn).constructor.prototype.hasOwnProperty('isPrototypeOf')==false.
        实际上对于 *.hasOwnProperty('isPrototypeOf')===true唯一只有Object.prototype。
        */
        //key === undefined即不存在任何属性，认为是简单的纯对象
        //core_hasOwn.call( obj, key );表示key不为空并且最后一个属性也是自身的属性为true，最后一个属性不是自身的属性false
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},
/*
    jQuery.merge( this, jQuery.parseHTML(
                    match[1],
                    context && context.nodeType ? context.ownerDocument || context : document,
                    true
                ) );

*/
	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context; //如果只传递了两个参数，则将keepScripts设置为context，context设置false，下面再对context重新赋值，确保它为上下文对象
			context = false;
		}
		context = context || document;  //默认context是document
        //rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
        //parsed[1]为子匹配(\w+)部分，比如'div','span'标签等
        //逻辑与操作符：如果第一个操作数是对象且求值结果为true，则返回第二个操作数，如果有一个操作数为null则返回null，有一个为NaN则返回NaN有一个为undefined则返回undefined
		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];  //当keepScripts为false时，scripts = [];当keepScripts为true时，scripts = false

		//匹配单独的标签，比如'<div></div>'、'<div>'、'<hr />'
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];//创建新节点对象，以数组的形式返回
		}
        //如果parsed为false，则表示data非独立标签，而是诸如'<div>fdsfs</div>','<div>ffd<span>fd</span>fdf</div>','<div>fdf'等的字符串
		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
            //当keepScripts为false，即不包含脚本时，scripts为[]，!!scripts为true,也就是空数组判断为真
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},
//parseJSON把一个字符串变成JSON对象，我们一般使用的是eval，parseJSON封装了这个操作，但是eval被当作了最后的手段
//最新js标准中加入了JSON序列化和反序列化的API，如果浏览器支持这个标准，则这两个API是在JS引擎中用Native Code实现的，效率肯定比eval高很多
	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
        //用原生JSON API处理，反序列化是JSON.stringify(object);
//		if ( window.JSON && window.JSON.parse ) {
//			return window.JSON.parse( data );
//		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
            //移除头部和尾部空白，否则IE无法处理
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
                //检查json字符串的合法性
                /*
                rvalidchars = /^[\],:{}\s]*$/,
                rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
                rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
                rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
                */
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {
                    //return 语句的执行，将字符串类型的data转换为object类型了
                    /*
                    其转换实质是：创建一个方法，而这个方法直接return一个对象字面量，最后用()来立即调用
                    例如var data2 = {"name":"tianlili","age":"25"};就创建了一个字面量对象
                    console.log(data2)==>   Object { name="tianlili", age="25"}
                    console.log(typeof data2)===> object
                    下面方法返回的data同理
                    */
					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
    //
    /*
    解析XML文件的浏览器实例：
    <html>
        <body>
        <script type="text/javascript">
        try //Internet Explorer
          {
          xmlDoc=new ActiveXObject("Microsoft.XMLDOM");  //创建空微软XML文档对象
          }
        catch(e)
          {
          try //Firefox, Mozilla, Opera, etc.
            {
            xmlDoc=document.implementation.createDocument("","",null);  //创建空XML文档对象
            }
          catch(e) {alert(e.message)}
          }
        try 
          {
          xmlDoc.async=false;  //关闭异步加载，确保在文档完整加载之前，解析器不会继续执行脚本
          xmlDoc.load("books.xml");  //告知解析器加载名为‘books.xml’的‘文档’
          document.write("xmlDoc is loaded, ready for use");
          }
        catch(e) {alert(e.message)}
        </script>
        </body>
    </html>
    解析XML字符串的实例：
    <html>
        <body>
        <script type="text/javascript">
        text="<bookstore>"
        text=text+"<book>";
        text=text+"<title>Harry Potter</title>";
        text=text+"<author>J K. Rowling</author>";
        text=text+"<year>2005</year>";
        text=text+"</book>";
        text=text+"</bookstore>";

        try //Internet Explorer
          {
          xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async="false";
          xmlDoc.loadXML(text);  //IE用loadXML()方法来解析xml字符串
          }
        catch(e)
          {
          try //Firefox, Mozilla, Opera, etc.//其他浏览器使用DOMParser对象
            {
            parser=new DOMParser();  //创建空的XML文档对象
            xmlDoc=parser.parseFromString(text,"text/xml");  //告知浏览器加载名为text的字符串
            }
          catch(e) {alert(e.message)}
          }
        document.write("xmlDoc is loaded, ready for use");
        </script>
        </body>
        </html>
    
    */
    //跨浏览器解析XML字符串，parseXML函数主要是标准API和IE的封装，标准API是DOMParser对象，而IE使用的是Microsoft.XMLDOM的ActiveXObject对象
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
            /*
            第一行创建一个空的 XML 文档对象
            第二行告知解析器加载名为 txt 的字符串
            Internet Explorer 使用 loadXML() 方法来解析 XML '字符串'，而其他浏览器使用 DOMParser 对象。
            */
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
            /*
            所有现代浏览器都内建了用于读取和操作 XML 的 XML 解析器。
            解析器把 XML 读入内存，并把它转换为可被 JavaScript 访问的 XML DOM 对象。
            第一行创建空的微软 XML 文档对象
            第二行关闭异步加载，这样可确保在文档完整加载之前，解析器不会继续执行脚本
            第三行告知解析器加载名为 "books.xml" 的文档

            */
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );//注释：loadXML() 方法用于加载字符串（文本），而 load() 用于加载文件。
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},
//当你仅仅想要传递一个空函数的时候，就用他吧。
//这对一些插件作者很有用，当插件提供了一个可选的回调函数接口，那么如果调用的时候没有传递这个回调函数，就用jQuery.noop来代替执行。

	noop: function() {},//无操作空函数

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
    /*
    globalEval函数把一段脚本加载全局context（window）中，IE可以使用window.execScript,其他浏览器可以使用eval
    因为整个jQuery代码都是一整个匿名函数，所以当前context是jQuery，如果要将上下文设为window则需使用globalEval
    
    */
    //用于在全局范围下执行一些js脚本，此方法的表现不同于正常使用eval，因为它全局范围下执行（这对加载外部动态脚本很重要）
    //eval和jQuery.globalEval的不同之处在于：作用域，例如：
    /*
    (function() {
        var foo = "foo";
        // eval的作用域是当前作用域(在这里就是local也就是function作用域),
        // 因此既能访问local也能访问global作用域
        eval("alert('eval: ' + foo)");  //====>eval: foo
    })();

    (function() {
        var foo = "foo";
        // jQuery.globalEval的作用域是global, 因此只能访问global作用域的变量
        // 这里的foo是local变量, 因此在global作用域下找不到
        // ReferenceError: foo is not defined
        $.globalEval("alert('globalEval: ' + foo)");  //=====>foo is not defined
    })();
    
    */
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		/*
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		},
		*/
		/*
		介绍一下replace方法的replacement为函数的情况，每个匹配都会调用该函数，他返回的字符串将作为替换文本使用，该函数的第一个参数是匹配模式的字符串，接下来的参数是与模式中的“子表达式”（关键）匹配的字符串，可以有0个或者多个这样的参数，接下来的参数是一个整数，声明了在stringObject中匹配的位置，最后一个参数是stringObject本身。
		例如：
		var	rmsPrefix = /^-ms-/,
			rdashAlpha = /-([\da-z])/gi,
			fcamelCase = function( all, letter,threeParam,fourParam ) {
				document.write("threePara is : "+threeParam+" fourParam is : "+fourParam+"<br />");
				return letter.toUpperCase();
			};
		camelCase=function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		}
		var str = '-ms-dfd-3fsd';
		document.write(camelCase(str));
		运行结果为：
		threePara is : 2 fourParam is : ms-dfd-3fsd
		threePara is : 6 fourParam is : ms-dfd-3fsd
		msDfd3fsd
	*/
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},
//判断节点名称是否相同
	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},
//jquery中的$().each和$.each的区别，前者只能遍历数组，后者可以遍历数组和对象 
	// args is for internal usage only
    //遍历对象或数组
    /*回调函数穿的参数为数组或对象的索引index和该索引所对应的值，这个值也可以通过this关键字取得，但是js不管该值是字符串还是数值都会将this的值当object对象
    我们也可以通过是callback返回false来结束each的循环遍历
    例如：
        <body>
            <div id="one"></div>
            <div id="two"></div>
            <div id="three"></div>
            <div id="four"></div>
            <div id="five"></div>
            <script>
                var arr = [ "one", "two", "three", "four", "five" ];
                var obj = { one:1, two:2, three:3, four:4, five:5 };
                //注意这里this的使用，它指value而非index
                jQuery.each(arr, function() {
                $("#" + this).text("Mine is " + this + ".");
                return (this != "three"); // will stop running after "three"
                });
                jQuery.each(obj, function(i, val) {
                $("#" + i).append(document.createTextNode(" - " + val));
                });
            </script>
        </body>
    
    */
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );
        //如果有参数args，调用apply，上下文设置为当前遍历的对象，参数使用args
		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
                    //可以通过this获取callback中的value值的原因就是obj[i]调用的callback
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );
					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},
    //core_version = '1.9.1'
    //core_trim = core_version.trim,

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :
//rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},
//init调用jQuery.makeArray( selector, this );
	// results is for internal usage only
    //把类数组的集合转换成数组，如果是单个元素就生成单个元素的数组
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
                //如果是arr是function类型的，则直接push，当然还有其他非类数组的arr
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
        //是否有本地化的Array.prototype.indexOf
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},
//合并两个数组内容到第一个数组
//init中的调用jQuery.merge( this,[domObj] );
//数组的合并可以使用concat()方法来实现，这里不使用的原因是：Array.concat()只能是数组间的合并，first可能是jQuery类型的伪数组
	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;
//如果second的length属性是Number类型，则把second当数组处理
		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
        // 遍历second，将非undefined的值添加到first中
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}
//修正first的length属性，因为first可能不是真正的数组
		first.length = i;

		return first;
	},
//过滤数组，返回新数组，callback返回true是保留，如果inv（inverse）为true，callback放回false才会保留
	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
            //很巧妙，因为当inv为false（默认）时，callback返回true保存，当inv为true是callback返回false保存，因此这里加下面的判断
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},
//为数组或对象中的每一个元素应用一个转换函数，并将转换后的结果添加到新生成的数组中
//callback中的this是指向全局window对象的
//1.6之前仅支持遍历数组，类数组必须通过$.makeArray()转换成真正的数组之后才能使用map，1.6之后支持遍历数组和对象
	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];
        //jQuery对象是类数组，因此它必然会执行if里的语句
		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
        //非类数组的对象在else语句里执行
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}
        //array对象的concat用于连接两个或多个数组，比如：
        /*
        var dimensions = { width: 10, height: 15, length: 20 };
        dimensions = $.map( dimensions, function( value, index ) {
        return [value * 2,value*3];
        });
        调用map方法执行return core_concat.apply( [], ret );语句之前，ret的值是：[[20,30], [30,45],[40,60]]
        最终返回后的值是：[20,30,30,45,40,60];
        */

		// Flatten any nested arrays
        //消除嵌套数组 -----很棒的技巧
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
    //代理，为fn指定上下文(即this)
    //接受一个函数，返回一个新函数，并且这个新函数始终保持了特定的上下文语境。
    /*
    第一个参数是function（将要改变的上下文语境的函数），context：函数的上下文语境（this会被设置成这个object对象）。
    第一个参数如果是context（函数的上下文语境会被设置成这个object对象）第二个参数就是name（将要改变上下文语境的函数名，这个函数必须是前一个参数context对象的属性）
    实例：
    html：
    <p><button id="test">Test</button></p>
    <button id='test2' name='buttontest'>testButton</button>
    <p id="log"></p>
    js:
    var person1 = {
        name: "John",
        test: function() {
            $("#log").append( '<br />'+this.name);
            $("#test").off("click", person1.test);
        }
    };
    var person2 = {
        name:'Shirly',
        test: function(){
            $('#log').append("<br />"+this.name);
        }
    }
    $("#test").on( "click", jQuery.proxy( person1, "test" ) );  ========>John <--->对应$.proxy(context,name);
    $('#test').on('click',jQuery.proxy(person1.test,person2));  ========>Shirly <---> 对应$.proxy(fn,context);
    $('#test2').on('click',person1.test);  =======>buttonTest 普通的执行情况
    */
	proxy: function( fn, context ) {
		var args, proxy, tmp;
        //对应jQuery.proxy(person1,'test')即jQuery.proxy(context,name);下面的if将context对应为fn，将name对应为context以便做统一处理
		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}
       
		// Simulated bind
		args = core_slice.call( arguments, 2 );

		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
        //同意guid使得proxy可以被移除
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
    /*多功能函数，读取或设置集合的属性值；值为函数时会被执行
     fn：jQuery.fn.css, jQuery.fn.attr, jQuery.fn.prop
    */
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// 只设置一个属性
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});
//初始化readyList事件处理函数队列，兼容不同浏览器对绑定事件的区别
jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
        //确保不会出现browser ready事件已经发生了但是还在调用$(document).ready()
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded  ---通过检测浏览器的功能特性而非嗅探浏览器
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}
//doScroll(“left”)方法在IE下只能在dom树准备好之后执行，所以可以用来判断dom树是否ready。
			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};//jQuery.Callbacks的一个缓存变量

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {//这个方法会和jquery.callbacks方法结合使用,用于生成一个包含若干属性且值为真的对象  
	// optionsCache[ options ] 用于缓存 object所引用的值
    var object = optionsCache[ options ] = {};
    //core_rnotwhite = /\S+/g,   \S匹配一个非空白字符
    //options.match( core_rnotwhite )返回全局匹配的数组
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
    return object;


}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
    function fn1( value ){
        console.log( value );
        return false;
    }
     
    function fn2( value ){
        fn1( "fn2 says: " + value );
        return false;
    }


 * Possible options:
 *  once    确保回调列表仅只fire一次
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
    实例：
    var callbacks = $.Callbacks( "once" );
        callbacks.add( fn1 );
        callbacks.fire( "foo" );
        callbacks.add( fn2 );
        callbacks.fire( "bar" );
        callbacks.remove( fn2 );
        callbacks.fire( "foobar" );
        
        output:
        foo
        
 *  memory  在执行过fire后，保存之前fire时的参数，该参数会传递给在add中执行的最新添加的回调
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
    实例：
    var callbacks = $.Callbacks( "memory" );
        callbacks.add( fn1 );
        callbacks.fire( "foo" );
        callbacks.add( fn2 );
        callbacks.fire( "bar" );
        callbacks.remove( fn2 );
        callbacks.fire( "foobar" );
         
        output:
        foo
        fn2 says:foo
        bar
        fn2 says:bar
        foobar

 *  unique  确保在add操作中，阻止存在回调列表中的回调再次被添加到回调列表中
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
    实例：
    var callbacks = $.Callbacks( "unique" );
        callbacks.add( fn1 );
        callbacks.fire( "foo" );
        callbacks.add( fn1 ); // repeat addition
        callbacks.add( fn2 );
        callbacks.fire( "bar" );
        callbacks.remove( fn2 );
        callbacks.fire( "foobar" );
         
        output:
        foo
        bar
        fn2 says:bar
        foobar

 *  stopOnFalse  当正在执行的回调返回false，将中断其他未执行回调的执行
 *	stopOnFalse:	interrupt callings when a callback returns false
    实例：
    
    var callbacks = $.Callbacks( "stopOnFalse" );
        callbacks.add( fn1 );
        callbacks.fire( "foo" );
        callbacks.add( fn2 );
        callbacks.fire( "bar" );
        callbacks.remove( fn2 );
        callbacks.fire( "foobar" );
         

        output:
        foo
        bar
        foobar

 *
 */
/*
        用$.Callbacks实现观察者模式
        // 观察者模式
        var observer = {
            hash: {},
            subscribe: function(id, callback) {
                if (typeof id !== 'string') {
                    return
                }
                if (!this.hash[id]) {
                    this.hash[id] = $.Callbacks()
                    this.hash[id].add(callback)
                } else {
                    this.hash[id].add(callback)
                }
            },
            publish: function(id) {
                if (!this.hash[id]) {
                    return
                }
                this.hash[id].fire(id)
            }
        }
         
        // 订阅
        observer.subscribe('mailArrived', function() {
            alert('来信了')
        })
        observer.subscribe('mailArrived', function() {
            alert('又来信了')
        })
        observer.subscribe('mailSend', function() {
            alert('发信成功')
        })
         
        // 发布
        setTimeout(function() {
            observer.publish('mailArrived')
        }, 5000)
        setTimeout(function() {
            observer.publish('mailSend')
        }, 10000)
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
    /*
    第一次执行$.Callbacks(调用的参数不同)的时候调用createOptions()方法
    只有当执行$.Callbacks(参数相同)二次及以上时，才不会执行createOptions函数
    */
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
        // 说明也可以这样$.Callbacks({once:true, memory:true})使用
        //都没有排除除了memory once unique stopOnFalse之外的参数属性
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		// data传递的是一个数组
        // 使用Callbacks.fireWidth时，data包含fireWith函数传递的一个上下文环境和一个数组
        // 使用Callbacks.fire时，data包含Callbacks对象和fire函数的arguments对象
        fire = function( data ) {
            /*
                如果memory为true时，fire方法只是保存上次fire时的作用域参数和参数
                看例子：
                function fn1( value ) {
                    console.log( value );
                    return false;
                }
                 
                function fn2( value ) {
                    fn1( "fn2 says: " + value );
                    return false;
                }
                function fn3( value ) {
                    fn1( "fn3 happys: " + value );
                    return false;
                }
                var callbacks = $.Callbacks( "memory" );
                callbacks.add( fn1 );
                callbacks.add( fn2 );
                callbacks.add( fn3 );
                callbacks.fire("hello world");
                输出：
                hello world
                fn2 says: hello world
                fn3 happys: hello world

                作为对比请继续看例子：
                var callbacks = $.Callbacks( "memory" );
                callbacks.add( fn1 );
                callbacks.add( fn2 );
                callbacks.fire("yesYouCan");  //---->唯一不同的地方就是这里触发的fire
                callbacks.add( fn3 );
                callbacks.fire("hello world");
                看一下输出：
                yesYouCan
                fn2 says: yesYouCan
                fn3 happys: yesYouCan   //可见第一次fire("yesYouCan")的时候因为fn2是最后一次回调，因此记录了它的作用域和参数，当add了fn3之后又fire时先使用上次的回调作用域和参数处理了新添加的回调
                hello world
                fn2 says: hello world
                fn3 happys: hello world
            */
			memory = options.memory && data;  //如果需要记录,则记录本次执行的作用域和参数  
			fired = true;
            // 如果options.memory为true，firingStart为上一次Callbacks.add后回调列表的length值
			firingIndex = firingStart || 0;
            
			firingStart = 0;
			firingLength = list.length;
			firing = true;
            // 将data作为参数，执行回调列表中的所有回调
                // 如果回调列表中其中一个回调返回false，且options.stopOnFalse为true，则中断接下来其他回调的执行
                // 如果options.memory为true，将memory设置为false，阻止在Callbacks.add中新增回调的执行
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {//遍历list并执行, 
				//当stopOnFalse为真,只要有一个方法返回false,则执行中断 ,执行中断则清除memory

                if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					/*
                        当stopOnFalse为true时的操作，执行中断，示例代码如下：
                        function fn1( value ) {
                            console.log( value );
                        }
                         function fn2( value ) {
                            fn1( "fn2 says: " + value );
                            return false;
                        }
                        function fn3( value ) {
                            fn1( "fn3 happys: " + value );
                        }
                        var callbacks = $.Callbacks( "memory stopOnFalse" );
                        callbacks.add( fn1 );
                        callbacks.add( fn2 );
                        callbacks.fire("yesYouCan");
                        callbacks.add( fn3 );
                        callbacks.fire("hello world");
                        输出：
                        yesYouCan
                        fn2 says: yesYouCan  //返回false执行中断，并且清除了memory（保存上次回调的作用域和参数）
                        hello world
                        fn2 says: hello world
                    */
                    
                    memory = false; // To prevent further calls using add
                    /*
                        memory为false之后再次fire的时候还会在fire的一开始执行memory=options.memory && data;
                        因此memory不是说在这里false之后就永远false了
                        看例子：
                        function fn1( value ) {
                            console.log( value );
                        }
                         function fn2( value ) {
                            fn1( "fn2 says: " + value );
                            return false;
                        }
                        function fn3( value ) {
                            fn1( "fn3 happys: " + value );
                        }
                        var callbacks = $.Callbacks( "memory stopOnFalse" );
                        callbacks.add( fn1 );
                        callbacks.add( fn2 );
                        callbacks.fire("yesYouCan");
                        callbacks.remove(fn2);
                        callbacks.fire("在remove fn2之后紧接着fire");
                        callbacks.add( fn3 );
                        callbacks.fire("hello world");
                        输出：
                        yesYouCan
                        fn2 says: yesYouCan  //这里返回false，因此memory为false，
                        在remove fn2之后紧接着fire   //这里fire之后，memory为data，因此下次fire的时候会先使用data的上下文对象和参数调用新添加的回调
                        fn3 happys: 在remove fn2之后紧接着fire   //利用memory保存的数据执行回调
                        hello world
                        fn3 happys: hello world
                    */
					break;
				}
			}
            
			firing = false;
			if ( list ) {
                // 如果options.once为false
				if ( stack ) {
                    // stack在fireWith操作时可能拥有成员
                    // 当stack拥有成员时(只有一个),并将其成员作为参数传递给将要执行的所有回调
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					// 如果options.memory为true且options.once为true，那么在add中执行一次fire(只执行最新添加的回调)
                    // 这里设置list = []，那么再次fire时，将不会有任何操作
                    list = [];
				} else {
                    // 如果存在options.once为true，options.memory为false的其他情况，将禁用Callbacks对象
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
            //add方法参数是function或者Array
            /*
                调用方式
                // 方式1
                callbacks.add(fn1);
                // 方式2 一次添加多个回调函数
                callbacks.add(fn1, fn2);
                // 方式3 传数组
                callbacks.add([fn1, fn2]);
                // 方式4 函数和数组掺和
                callbacks.add(fn1, [fn2]);
            */
            add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							//如果arg是一个函数
                            if ( type === "function" ) {
								// arg为要新增到回调列表中的回调
                                // 如果arg不存在回调列表中，则将它增加到回调列表中
                                // 如果arg存在回调列表中，且options.unique为false，则将它增加到回调列表中
                                // 如果arg存在回调列表中，且options.unique为true，则不执行push动作
                                if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
                                // 如果arg为数组或伪数组，则递归检查
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					//当正在fire一个回调的时候再add一个回调时，会执行下面的if
                    /*
                    例如：
                    function fn1( value ) {
                        console.log( value );
                    }
                     function fn2( value ) {
                        fn1( "fn2 says: " + value );
                        callbacks.add(fn3);
                        return false;
                    }
                    function fn3( value ) {
                        fn1( "fn3 happys: " + value );
                    }
                    var callbacks = $.Callbacks( "memory" );
                    console.log(callbacks);
                    callbacks.add( fn1 );
                    callbacks.add( fn2 );
                    callbacks.fire("yesYouCan");
                    输出：
                    yesYouCan
                    fn2 says: yesYouCan
                    fn3 happys: yesYouCan
                    由上面的结果可以看出，即使memory为true，但是在fire的时候进行的add不可以执行memory保存的上次回调的作用域和参数，这点有点类似queue的进程锁机制
                    */
                    // 如果回调列表中的回调正在执行时，其中的一个回调函数执行了Callbacks.add操作
                    // 上句话可以简称：如果在执行Callbacks.add操作的状态为firing时
                    // 那么需要更新firingLength值
                    if ( firing ) {
                        
						firingLength = list.length;
                        
					// With memory, if we're not firing then
					// we should call right away
                    // 如果options.memory为true，则将memory做为参数，应用最近增加的回调函数
					} else if ( memory ) {
						firingStart = start;
                        //如果memory为true，并且已记录上次执行的回调作用域和参数，则重新启动执行,否则不执行  
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
            //移除某一个方法,并对其他相关变量做修改,  
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						// 通过找到arguments成员在回调列表中索引位置遍历arguments对象，并将arguments成员从回调列表中移除
                        //remove方法会把添加多次的函数如fn1，全部删除掉。这就是这里用where而不是用if的区别
                        while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							//splice直接对数组进行删除，slice会返回删除后的新数组，但是不改变原数组
                            list.splice( index, 1 );
							// Handle firing indexes
							// 如果在执行Callbacks.remove操作的状态为firing时
                            // 则更新firingLength和firingIndex的值
                            if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
                                // 特殊处理，如果移除的回调的索引小于当前正在执行回调的索引，则firingIdex--
                                // 后面未执行的回调则得以正常执行
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
            // 检查fn是否存在回调列表中,或者callbacks对象中是否存有有回调函数的回调列表
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			// 清空回调列表中的所有回调
            empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
            // 禁用Callbacks对象
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			// 检查回调列表是否被禁用
            disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			// 锁定回调对象，阻止回调列表中的所有回调的执行
            lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
            //arguments参数对象是一个类数组，所以args必然是类数组对象
            /*
                callbacks.fireWith 同fire，但可以指定执行上下文
                function fn() {
                    console.log(this); // 上下文是person
                    console.log(arguments); // [3]
                }
                var person = {name: 'jack'};
                var callbacks = $.Callbacks();
                callbacks.add(fn);
                callback.fireWith(person, 3);
                其实fire内部调用的是fireWith，只是将上下文指定为this了，而this正是$.Callbacks构造的对象。
            */
			fireWith: function( context, args ) {
				args = args || [];
                //stack = !options.once && [],
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					/*
                        // 如果fired为true，options.once为false，且如果在执行fireWith操作的状态为firing
                        // 则将处理过的args作为stack数组的第一个数组项，并在firing为false后，将stack第一个数组项作为参数传递给将要执行的所有回调
                    
                        // 如果fired为true，options.once为true，则不执行任何操作
                        // 可以看出，$.Callbacks('once')表示回调对象只fire一次
                    */
                    if ( firing ) {
                        stack.push( args );
                        console.log(stack);
					
                    } else {
					// 第一次执行fireWith时，一定执行else分支
                        fire( args );
					}
				}
				return this ;
			},
			// Call all the callbacks with the given arguments
            //将Callbacks对象(就是self对象，最终jQuery.Callbacks()方法返回的是self对象也就是callbacks对象)，及Callbacks.fire函数中的arguments对象传递给Callbacks.fireWith函数，并执行
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
            // 是否执行过fire函数
            //注意，只要调用过一次fire或fireWith就会返回true。
			fired: function() {
				return !!fired;
			}
		};

	return self;
};

//方式一：  
//var deferred = $.Deferred();  
//方式二：使用new操作符号，一般不这样做，显得冗余  
//var deferred = new $.Deferred();  
//方式三：传入一个函数作为回调函数，这个函数会在构造的Deferred对象返回前执行。该函数被传入要返回的Deferred对象作为可选的参数  
//在函数内部this指向要返回的Deferred对象。在函数的内部可以调用Deferred对象的方法，比如下面的this.then  
/*
var dfd = new $.Deferred(function(){ 
	console.log(this);
    this.then(function(){console.log("new deferred");});  
});
*/

/*一个Deferred（延迟）对象开始于pending状态。 任何使用deferred.then(), deferred.always(), deferred.done(), 或者 deferred.fail()方法添加到这个对象的回调函数，都是排队等待执行。调用deferred.resolve() 或者 deferred.resolveWith()转换Deferred对象为resolved（解决）的状态，并立即执行设置中任何的doneCallbacks。调用deferred.reject() 或者 deferred.rejectWith()转换Deferred为rejected（拒绝）的状态，并立即执行设置中任何的failCallbacks。一旦对象已经进入了解决或拒绝状态，它处于该状态。回调也可以添加到解决或拒绝Deferred（递延） - 他们会立即执行。
*/


//deferred.always( alwaysCallbacks [, alwaysCallbacks ] )
/*
	当Deferred对象为resolved或者rejected状态时立即调用回调函数
	alwaysCallbacks(第一个参数)类型是Function，它可以是一个函数，也可以是函数数组，当Deferred对象为resolved or rejected状态时立即执行。
	alwaysCallbacks(第二个参数，可选的)类型也是Function，可以是一个函数，也可以是函数数组，也是在Deferred对象为resolved or rejected状态时立即执行。
	可见当Deferred对象得到解决或者拒绝时，alwaysCallbacks始终都会被调用执行。
	因为deferred.always()返回Deferred对象，所以可以链接其他的Deferred对象的方法，当然也包括always方法。当Deferred对象得到解决或者拒绝时，回调将按他们被添加的顺序执行
	实例：
	jQuery.get() 方法返回一个jqXHR对象，它是来自与Deferred对象，因此我们可以使用deferred.always()方法附加一个成功或错误的回调
	$.get("test.php").always( function() {
		alert("$.get completed with success or error callback arguments");
	} );
*/

//deferred.done( doneCallbacks [, doneCallbacks ] )
/*
	doneCallbacks(第一个参数)，Function类型，可以是一个函数，也可以是函数数组，当Deferred对象为resolved状态时被调用。
	doneCallbacks(第二个参数)，Function类型，可选的，可以是一个函数，也可以是函数数组，当Deferred对象为resolved状态时被调用。
	done()方法接受一个或者多个参数，每一个参数都可以是单独的函数或者函数数组。他们按照添加的顺序被调用。因为deferred.done()方法返回deferred对象，因此deferred对象的其他方法也可以链接在done方法之后，包括done在内。当Deferred对象为resolved状态时，doneCallbacks执行时使用传给resolve方法或者resolveWith方法的参数
	实例：当用户点击go按钮时!受理延迟对象，触发一系列回调函数：
	html:
	<button>Go</button>
	<p>Ready...</p>
	script:
function fn1() {
  $("p").append(" 1 ");
}
function fn2() {
  $("p").append(" 2 ");
}
function fn3(n) {
  $("p").append(n + " 3 " + n);
}
var dfd = $.Deferred();
dfd
.done( [fn1, fn2], fn3, [fn2, fn1] )
.done(function(n) {
  $("p").append(n + " we're done.");
});
 
$("button").bind("click", function() {
  dfd.resolve("and");
});
点击go按钮后运行结果如下：
Ready... 1 2 and 3 and 2 1 and we're done.	
*/

//deferred.fail( failCallbacks [, failCallbacks ] )与done类似，这里不做详细介绍
//deferred.isRejected()
/*
此方法不接受任何参数，确定Deferred对象是否为rejected状态
jquery 1.7已经将此方法废弃，请使用deferred.state()方法代替之
如果Deferred（延迟）对象是在被拒绝的状态，则返回true，这意味着要么deferred.reject()或者deferred.rejectWith()已经在对象上被调用过，并且 failCallbacks 已经被调用过（或者正处于被调用的阶段）。
*/

//deferred.isResolved()类似与isRejected，这里不做详细介绍
//deferred.notify( args )
/*
根据给定的 args参数 调用Deferred（延迟）对象上进行中的回调 （progressCallbacks）。
args是可选的参数Object对象，
通常只有延迟对象的创建者才可以调用该方法。你可以通过调用 deferred.promise()，返回一个受限的 Promise 对象，来阻止其它代码改变延迟对象的状态或报告它的状态。
当 deferred.notify 被调用后，任何通过deferred.then或者 deferred.progress方法添加的progressCallbacks 将被调用。调用的顺序是依照他们添加的顺序执行的。notify()方法的参数被传递给每个prigressCallbacks回调。当Deferred对象是resolved或者rejected状态时，或者progressCallbacks在notify方法之后被添加时，如果再调用.notify()方法都将会被忽略
*/

//deferred.notifyWith( context [, args ] )
/*
根据给定的上下文（context）和args调用Deferred对象的progressCallbacks回调。
使用同notify方法，唯一的不同是它添加上下文对象（上下文对象context是个Object，被传递给progressCallbacks回调作为this对象）
*/
//deferred.pipe( [doneFilter ] [, failFilter ] ) =======》1.6版本添加
//deferred.pipe( [doneFilter ] [, failFilter ] [, progressFilter ] )  ======>1.7版本添加
/*
doneFilter:Function类型，可选的，当Deferred对象为resolved时被调用
failFilter:Function类型，可选的，当Deferred对象为rejected时被调用
progressFilter：Function类型，可选的，当进度通知被传递给Deferred对象时调用
注：1.8版本时，pipe方法被废弃，then方法代替了它，所以最好使用then
deferred.pipe()方法返回一个新的promise对象，用于通过函数过滤Deferred对象的状态或者值。doneFilter和failFilter函数过滤原先deferred对象的解决/拒绝的状态和值。1.7版本开始，该方法还接受一个progressFilter函数，用来过滤任何访问deferred对象的notify或notifyWith 方法。这些过滤函数返回一个新值，传递给piped的promise对象的done方法或者fail方法。或返回其它可见对象(Deferred, Promise, 等等)，这些可见对象传递了自身的解决（resolve) / 拒绝(reject)状态和传递给 pipe promise 回调函数的值。如果将 null 作为过滤函数，或者不指定过滤函数，那么 pipe promise 被受理（resolve)或被拒绝(reject)时，会使用相同的值作为原始值。
实例1：过滤resolve value
var defer = $.Deferred(),
    filtered = defer.pipe(function( value ) {
      return value * 2;
    });
 
defer.resolve( 5 );
filtered.done(function( value ) {
  console.log( "Value is ( 2*5 = ) 10: " + value );  //Value is ( 2*5 = ) 10: 10
});

实例2：过滤reject value
var defer = $.Deferred(),
    filtered = defer.pipe( null, function( value ) {
      return value * 3;
    });
 
defer.reject( 6 );
filtered.fail(function( value ) {
  console.log( "Value is ( 3*6 = ) 18: " + value );  //Value is ( 3*6 = ) 18: 18
});
实例3：Chain tasks:
var request = $.ajax( url, { dataType: "json" } ),
    chained = request.pipe(function( data ) {
      return $.ajax( url2, { data: { user: data.userId } } );
    });
 
chained.done(function( data ) {
  // data retrieved from url2 as provided by the first request
});
*/

//deferred.progress( progressCallbacks )
/*
当Deferred（延迟）对象生成进度通知时，调用添加处理程序。
progressCallbacks:Function类型，可以是一个函数，或者函数数组，当Deferred（延迟）对象生成进度通知时被调用的一个函数。
 当通过调用 notify或notifyWith 使延迟对象产生进度通知时，progressCallbacks 就会被调用。由于 deferred.progress()返回的是延迟对象，所以其它延迟对象方法可以链接到该对象上。当延迟对象被 resolved 或 rejected 时，进度回调函数将不再被调用。
*/

//deferred.promise( [target ] )
/*
这两个API语法几乎一样，但是有着很大的差别。deferred.promise()是Deferred实例的一个方法，他返回一个Deferred.Promise实例。一个Deferred.Promise对象可以理解为是deferred对象的一个视图，它只包含deferred对象的一组方法，包括：done(),then(),fail(),isResolved(), isRejected(), always(),这些方法只能观察一个deferred的状态，而无法更改deferred对象的内在状态。这非常适合于API的封装。例如一个deferred对象的持有者可以根据自己的需要控制deferred状态的状态（resolved或者rejected），但是可以把这个deferred对象的Promise对象返回给其它的观察者，观察者只能观察状态的变化绑定相应的回调函数，但是无法更改deferred对象的内在状态，从而起到很好的隔离保护作用。 
*/
/*
.promise( [type ] [, target ] )
首先这不是Deferred实例的方法！该方法是jQuery实例的方法。该方法用于一组类型的动作（例如动画）全部完成后返回一个Promise对象，供事件监听器监听其状态并执行相应的处理函数。 

该方法接受两个可选参数：.promise( [type,] [target] ) 

type：队列的类型，默认值是fx，fx即jQuery对象的动画.需要被观察的队列的type
targetObject ：要赋予Promise行为的对象， 

这两个参数是可选的。其中第一个参数（我）目前除了fx还没有找到其他的值类型。因此一般都是用于动画的监控，在动画完成后做一些操作。 

*/
/*
返回Deferred的Promise对象。
target:Object类型，可选，绑定 promise 方法的对象。
deferred.promise() 方法允许一个异步函数来防止那些干涉其内部请求进度（progress）或状态（status）的外部代码。Promise 对象只会暴露那些用来绑定处理函数或判断状态的延迟方法(then, done, fail, always, pipe, progress, 和 state)，并不会暴露任何用于改变状态的Deferred对象的方法(resolve, reject, notify, resolveWith, rejectWith, 和 notifyWith).
如果提供target参数，deferred.promise() 会将事件绑定到该参数上，然后返回该对象，而不是创建一个新的对象。 这个方法可以用于在已经存在的对象上绑定 Promise 行为的情况。
如果您要创建一个Deferred对象，并且保持这个Deferred(延迟)的引用，以便它可以在任何时候“解决”或“拒绝”。只需通过deferred.promise()定义的Promise对象来使其它的代码注册回调函数或检查当前状态。
请看一个实例1：
创建一个延迟对象，并设定两个延时时间是随机的定时器，分别用于受理（resolve）和拒绝（reject）延迟对象。无论哪一个先执行，都会调用其中一个回调函数。而另一个定时器则不会产生任何效果，因为在最先调用的那个定时器处理中，延迟对象已经处于完成状态(resolved 或 rejected 状态)。同时，还会设定一个定时器进度（progress）通知函数，用于进度通知处理，并在文档的 "body" 中显示 "working..."。
function asyncEvent(){
    var dfd = new jQuery.Deferred();
 
    // Resolve after a random interval
    setTimeout(function(){
        dfd.resolve("hurray");
    }, Math.floor(400+Math.random()*2000));
 
    // Reject after a random interval
    setTimeout(function(){
        dfd.reject("sorry");
    }, Math.floor(400+Math.random()*2000));
 
    // Show a "working..." message every half-second
    setTimeout(function working(){
        if ( dfd.state() === "pending" ) {
            dfd.notify("working... ");
            setTimeout(working, 500);
        }
    }, 1);
 
    // Return the Promise so caller can't change the Deferred
    return dfd.promise();
}
 
// Attach a done, fail, and progress handler for the asyncEvent
$.when( asyncEvent() ).then(
    function(status){
        console.log( status+', things are going well' );  //hurray, things are going well
    },
    function(status){
        console.log( status+', you fail this time' );  //sorry, you fail this time
    },
    function(status){
        $("body").append(status); //working..
    }
);
实例2：使用target参数，来增强已经存在的对象，使其具有promise对象的方法：
var obj = {
  hello: function( name ) {
    console.log( "Hello " + name );
  }
},
defer = $.Deferred();
defer.promise( obj );
defer.resolve( "John" );
obj.done(function( name ) {
  obj.hello( name ); // will console "Hello John"
}).hello( "Karl" ); // will console "Hello Karl"
*/
//deferred.reject( [args ] )
/*
args:可以是任何类型，可选，该参数会被传递给failCallbacks回调.
通常只有延迟对象的创建者才可以调用该方法。你可以通过调用 deferred.promise()，返回一个受限的 Promise 对象，来阻止其它代码改变延迟对象的状态或报告它的状态。

当延迟对象被 rejected 时，任何通过 deferred.then或deferred.fail 添加的 failCallbacks，都会被调用。回调函数的执行顺序和它们被添加的顺序是一样的。传递给 deferred.reject() 的 args 参数，会传给每个回调函数。当延迟对象进入 rejected 状态后，再添加的任何 failCallbacks，当它们被添加时，就会被立刻执行，并带上传入给 .reject() 的参数

*/
//deferred.rejectWith( context [, args ] )
/*
同reject方法，不同的是添加了一个上下文对象context，Context（上下文） 作为 this对象传递给失败回调函数（failCallbacks ）
*/
//deferred.resolve( [args ] )  -----同reject
//deferred.resolveWith(context,[,args])   -----同rejectWith
//deferred.state()
/*
该方法不接受任何参数，用来判断Deferred对象的状态，返回字符串，其值是“pending”、"resolved"、"rejected"中的一个
比如：resolved：Deferred对象是在解决状态，这意味着，deferred.resolve() 或者 deferred.resolveWith()被对象访问和doneCallbacks被访问（或在被调用的过程中） 。
*/
//deferred.then( doneFilter [, failFilter ] [, progressFilter ] )
/*
同pipe方法，事实上then是pipe的替代品
*/
//jQuery.when( deferreds )
/*
deferreds:类型: Deferred,一个或多个延迟对象，或者普通的JavaScript对象。
提供一种方法来执行一个或多个对象的回调函数， Deferred对象通常表示异步事件。

如果向 jQuery.when 传入一个Deferred对象，那么会返回它的 Promise 对象(Deferred对象的一个子集)。这样就可以继续绑定 Promise 对象的其它方法，例如， defered.then 。当延迟对象已经被受理（resolved）或被拒绝(rejected）（通常是由创建延迟对象的最初代码执行的），那么就会调用适当的回调函数。例如，由 jQuery.ajax 返回的 jqXHR 对象是一个延迟对象，可以向下面这样使用：
$.when( $.ajax("test.aspx") ).then(function(data, textStatus, jqXHR){
     alert( jqXHR.status ); // alerts 200
});
如果一个参数被传递给jQuery.when ，并且该参数不是Deferred对象或者promise对象， 那么它会被当作是一个被受理（resolved）的Deferred对象，并且添加到上面的任何 doneCallbacks 都会被立刻执行。向 doneCallbacks 中传入的是when方法原始的参数。在这种情况下，设定的任何 failCallbacks 永远都不会被执行，因为延迟对象永远不会被拒绝（rejected）。例如：
$.when( { testing: 123 } ).done(
    function(x) { alert(x.testing); } // alerts "123" 
    );
在案例中有多个延迟对象传递给jQuery.when ，该方法返回一个新的“宿主”延迟对象，跟踪所有已通过Deferreds聚集状态。 当所有的延迟对象被受理（resolve）时，该方法才会受理它的 master 延迟对象。当其中有一个延迟对象被拒绝（rejected）时，该方法就会拒绝它的 master 延迟对象。如果 master 延迟对象被受理（resolved），那么会传入所有延迟对象的受理（resolved）值，这些延迟对象指的就是传给 jQuery.when 的参数。例如，当延迟对象是 jQuery.ajax() 请求，那么传入的受理（resolved）参数就是请求用的 jqXHR 对象，传入顺序就是它们在参数列表中的顺序。

在多延迟情况下，如果延迟一被拒绝，jQuery.when触发立即调用 master 延迟对象的 failCallbacks。请注意，在上述情况中，有一些延迟对象依然是不能被受理（unresolved）的。那么，在这种情况下，如果需要执行一些额外的处理，例如，取消所有未完成的 ajax 请求，你可以在闭包中进行保持 jqXHR 对象的引用，并且在 failCallback 中检查或取消它们。
$.when($.ajax("/page1.php"), $.ajax("/page2.php")).done(function(a1,  a2){
  // a1 and a2 are arguments resolved for the page1 and page2 ajax requests, respectively
  var jqXHR = a1[2]; // arguments are [ "success", statusText, jqXHR ] 
  if ( /Whip It/.test(jqXHR.responseText) ) {
    alert("First page has 'Whip It' somewhere.");
  }
});
*/
 // jQuer 1.5版本引入Deferred功能, 为处理事件回调提供了更加强大而灵活的编程模型. 
 // 目前在jQuery.ajax支持deferred这种用法
 // jQuery.Deferred()背后的设计理念来自CommonJS Promises/A , jQuery.Deferred()基于这个理念实现，但并没有完全遵循其设计。其它语言或者框架，例如python和dojo中都有类似的实现。 
 // 一、什么是deferred对象？
    // 开发网站的过程中，我们经常遇到某些耗时很长的javascript操作。其中，既有异步的操作（比如ajax读取服务器数据），也有同步的操作（比如遍历一个大型数组），它们都不是立即能得到结果的。
    // 通常的做法是，为它们指定回调函数（callback）。即事先规定，一旦它们运行结束，应该调用哪些函数。
    // 但是，在回调函数方面，jQuery的功能非常弱。为了改变这一点，jQuery开发团队就设计了deferred对象。
    // 简单说，deferred对象就是jQuery的回调函数解决方案。在英语中，defer的意思是"延迟"，所以deferred对象的含义就是"延迟"到未来某个点再执行。
    // 它解决了如何处理耗时操作的问题，对那些操作提供了更好的控制，以及统一的编程接口。

jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
            // deferred的状态，分为三种：pending(初始状态), resolved(解决状态), rejected(拒绝状态)
			state = "pending",
            // promise对象，主要有两点作用：
            // 1. 在初始化deferred对象时，promise对象里的方法都会被extend到deferred中去，作为引用（见86行）
            // 2. 那么，生成的deferred对象里必然引用了promise对象的promise方法，所以当调用deferred.promise()时，
            //    deferred对象会通过闭包返回promise对象，这就是所谓的受限制的deferred对象（用deferred2表示），因为相比之前，
            //    返回的deferred2不在拥有resolve(With), reject(With), notify(With)这些能改变deferred对象状态并且执行callbacklist的方法了
			promise = {
                // 返回闭包里的内部state（外部只读）
				state: function() {
					return state;
				},
                // 同时在doneList和failList的list里添加回调函数（引用）
                // 那么不论deferred最终状态是resolved还是rejected, 回调函数都会被执行，这就是所谓的always
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
                // jQuery.then()会创建一个新的受限制的deferred对象
                /*   then 接口的胡思乱想
                实例一：resolve，then的doneFilterFn返回新的def1对象
                function a1(def){
                    alert('Ok');
                    console.log(arguments);
                    return def1;
                }
                function a2(def){
                    alert('No');
                    return this;
                }
                var def = $.Deferred();
                var def1 = $.Deferred();
                def1.done(function(){alert('def1 Ok!')});
                // then 返回一个 newDefer，当 def.resolve()时，函数a1执行，并且 a1 的返回值（这里是 def1）会执行以下操作：
                // def1.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify) 即依赖绑定
                // 因此 def1.resolve() 时，会触发 newDefer.resolve(), 即 def1 的状态改变直接影响 newDefer 的状态
                def.then(a1, a2).done(function (){ alert('newdef Ok!')}).fail(function (){alert('newdef No!')});
                def.resolve();
                def1.resolve();
                输出：
                []
                Ok
                def1 Ok!
                newdef Ok!
                实例二：reject，then的failFilterFn返回def本身
                function a1(def){
                    alert('Ok');
                }
                function a2(def){
                    alert('No1');
                    return this;
                }
                var def = $.Deferred();

                // 这里函数 a2()返回 this。这样 def.reject()时，触发 newDefer.reject(), 实现 newDefer 等阶订阅 def。
                // done(newDefer.reject)是动态添加的回调函数, 因此总是在最后执行。返回值 No1 No2 newNo1
                // 如果将函数 a2()中的 return this 注释掉，返回值 No1 newNo1 No2，这是因为调用 a2()后会立刻触发 newDefer.reject
                // 但是这里的应用并不常见，实现等阶订阅效果也不需要这么复杂逻辑。。。

                def.then(a1, a2).fail(function () {alert('newNo1')});
                def.fail(function (){alert('No2')});
                def.reject();
                PS：
                    我们称 newDefer 等阶订阅 def， 是指 def 发布某一行为(比如resolve)时，newDefer 也发布相同的行为(resolve)。

                    依赖等阶订阅功能，我们可以实现不同优先级的多个回调函数队列，在上例中， def 的优先级比 newDefer高( 因为newDefer 等阶订阅 def )。
               
                */
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer

                            /*
                            var defer = $.Deferred(),
                                filtered = defer.then(function( value ) {
                                  return value * 2;
                                },null,null,"xueerAdd");
                            defer.resolve( 5 );
                            filtered.done(function( value ) {
                              console.log( "Value is ( 2*5 = ) 10: " + value );  //Value is ( 2*5 = ) 10: 10
                            });
                            */
                            /* 分别为deferred的三个callbackList添加回调函数
                             根据传入的参数是否未函数，分为两种情况
                             1.是函数的情况，根据返回值(称作returnReferred)是否是deferred对象，又可以分为两种情况
                             1.1 返回值是deferred对象，那么在returned对象的三个回调函数列表中添加newDeferred的resolve(reject,notify)方法
                             newDeferrred的执行依赖returned的状态
                             1.2 返回值不是deferred对象，那么将返回值returned作为newDeferred的参数并将从外层deferred那边的上下文环境作为newDeferred
                             的执行上下文，然后执行对应的回调函数列表，此时newDeferrred的执行依赖外层的调用者deferred的状态
                             2.不是函数的情况（如值为undefined或者null等），直接链接到newDeferred的resolve(reject,notify)方法，也就是说
                              newDeferrred的执行依赖外层的调用者deferred的状态或者说是执行动作（resolve还是reject或者是notify）
                              此时deferred.then()相当于将自己的callbacklist和newDeferred的callbacklist连接起来了，故可以在newDeferred
                              中大做文章
                            */

                            //下面的deferred[tuple[1]](function(){...})其实调用的deferred对象的done方法去执行add
                            //当deferred对象向上面那样defer.resolve(5)的时候，就会执行fire回调函数列表里的函数，即下面deferred[tuple[1]]()括号里的回调
                            deferred[ tuple[1] ](function() {
                                //一直在纠结这里的this是什么，arguments又是什么，终于想明白，在执行defer.resolve方法的时候，方法里执行了下面的代码：
                                /*
                                    deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				                    return this;
                                */
                                //可见在resolve的时候调用了resolveWith也就是回调队列Callbacks对象的fireWith方法，将fireWith的context参数设为这里的受限的promise对象，将args设为这里的resolve的参数arguments，然后执行实际意义的fire方法，并记录了memory(memory保存了fire是的上下文对象和参数)
                                //因为有了resolve即fire方法记录了memory(这里的回调队列都是memory、once，也就说只会在每次add回调的时候马上利用上次fire的上下文对象和参数fire执行此新加的回调)
                                //而这个方法的执行是这样触发的：list[ firingIndex ].apply( data[ 0 ], data[ 1 ] );---这里的data就是记录的memory，那么下面的this和arguments是什么就清楚了
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
                                //fn不是函数的情况或者returned不是deferrred对象的情况
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;  //优化内存
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
            // 实际返回的deferred对象
			deferred = {};

		// Keep pipe for back-compat
        // pipe和then引用同一个函数，所以功能是一样的
        // 只不过通常的用法是：会用pipe进行filter操作
		promise.pipe = promise.then;

		// Add list-specific methods
        // 通过上面定义的数据元组集来扩展一些方法
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
            // 给上面的promise对象添加done，fail，process方法
            // 这三个方法分别引用三个不同jQuery.Callbacks对象的add方法（不是同一个引用），
            // 那么这三个方法的用途就是向各自的回调函数列表list（各自闭包中）中添加回调函数，互不干扰
			promise[ tuple[1] ] = list.add;

			// Handle state
            // 通过stateString有值这个条件，预先向doneList,failList中的list添加三个回调函数
            // doneList : [changeState, failList.disable, processList.lock]
            // failList : [changeState, doneList.disable, processList.lock]
            // changeState 指的是下面首先添加的一个改变deferred对象的匿名函数
            // 可以看的出: 不论deferred对象最终是resolve（还是reject），在首先改变对象状态之后，都会disable另一个函数列表failList(或者doneList)
            // 然后lock processList保持其状态，最后执行剩下的之前done（或者fail）进来的回调函数
            // 当然了，上述情况processList除外
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
            // 给deferred对象添加resolve(With), reject(With), notify(With)方法
            // 这三个方法分别引用三个不同jQuery.Callbacks对象的fire方法（不是同一个引用），
            // 那么这三个方法的用途就是执行各自的回调函数列表，互不干扰
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};

			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
        // 将上面的promise对象extend进deferred中
		promise.promise( deferred );

		// Call given func if any
        // 如果调用jQuery.Deferred(func)指定了参数，那么调用func并设置func的上下文和参数均为deferred
        // 在jQuery.then()中有用到这一点
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
        // 返回最终的deferred对象
		return deferred;
	},

	// Deferred helper
    // DEMO:http://jsfiddle.net/xcgfly2sky/P2GkC/2/
    // 参数：一个（或多个）deferred对象（或其他）
    // 当传入的所有deferred对象都resolve或者reject了，执行when()创建的deferred对象（称之为whenDeferred）对应的回调函数列表（非deferred对象被认为是resolve了）
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
            // 首先将arguments伪数组转换为真正的数组
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,
            // 1. 在参数个数等于1的情况下：
            //   1.1 如果参数是deferred对象，那么remaining = length, 这是remaining就是1嘛             
            //   1.2 否则remaining为0
            // 2. 在参数不等于1(即等于0或者大于1)的情况：remaining = length
			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
            // 如果参数个数仅为1个，并且是deferred对象，那么就无需再生成deferred对象
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				// 这里返回一个函数作为一个callback完全是为了创建一个闭包，主要是为了保持i的值
                return function( value ) {
                    // 保存各个deferred执行的上下文，也就是说之后whenDeferred的回调函数的上下文就是一个数组
					contexts[ i ] = this;
                    // 保存各个deferred执行时的参数，之后传递给whenDeferred的回调函数
                    // 此时values的值由原先的jQuery.when()传进来的参数变为各个deferred执行回调时的参数了，也就是说覆盖了
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
                        // 触发progressList上的回调函数
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
                        //即所有延迟都resolve，执行whenDeferred的回调函数
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;
		// add listeners to Deferred subordinates; treat others as resolved
        // 如果参数个数大于1，那么就是说有可能存在多个deferred对象 
        // 这时需要一些条件判断以保证是所有的deferred对象都resolve了，再执行whenDeferred的resolve
        // 或者当有一个deferred对象reject了，whenDeferred的reject 
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				// 如果是deferred对象
                if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					// 给每个参数（deferred对象）添加最后的回调，用来检查此时的状态
                    resolveValues[ i ].promise()
                        // 用于当每一个deferred对象resolve回来，用updateFunc返回的函数检查此时其他deferred对象的状态（即此时remaining是否等于0了）
                        // 如果等于0，则执行whenDeferred的resolve，否则继续等待
						.done( updateFunc( i, resolveContexts, resolveValues ) )
                        //任何一个when穿进来的deffered对象触发了fail操作之后fail（Callbacks.add）的回调因为因为记录了reject（Callbacks.fire）时的memory，因此fail回调以memory记录的上下文调用
                        //fail回调，并将memory纪录的参数传给此回调，因此deferred.reject（whenDefererred的reject方法）将被传入触发fail操作的deferred对象执行reject时传递的参数
                        //这样whenDeferred对象的fail回调就会收到失败deferred对象的回调参数
                        /*以下面的示例说明：a()执行后返回的受限的deferred对象（称其为LimitDefer）为when方法的第一个参数，因其为defererred对象，因此进入此循环执行.fail(deferred.reject);
                        当tasks执行后，LimitDefer执行reject方法，并传入参数'a'，这时就会执行deferred(其实就是whenDeferred).reject回调，并且将a作为参数传入，而deferred.reject触发了whenDeferred的fail回调，并将deferred的reject的参数传给此回调
                        */
                        //如果有一个deferred对象reject,whenDeferred将执行reject
						.fail( deferred.reject )
                        // 用于通知
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
                // 如果不是deferred对象，直接--remaining，视为resolve
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
        // 如果此时remaining就等与0了，表示没有什么延迟需要等待，那么立即之行whenDeferred的resolveWith
        // 此时resolveContexts为undefined， 这就意味这上下文将为全局的window
		if ( !remaining ) {
            //resolveValues在传给updateFunc之后，可能会被传给when的deferred对象修改为自己的回调参数
            /*示例：
            jQuery(function($){
                var a = function(){
                    var dtd = $.Deferred();
                    var tasks = function(){
            　　　　　　alert("执行完毕！");
            　　　　　　dtd.resolve('a'); // 改变deferred对象的执行状态
                        //当用dtd.reject('a')代替上面的dtd.resolve('a')时将会执行when的fail回调，
            　　　　};
            　　　　setTimeout(tasks,1000);
                    return dtd.promise();
                }
                var b = function(){
                    return 'b';
                }
                   
                $.when(a(),b(),{test:12}).done(function(){
                    console.log(arguments);  // ['a','b',{test:12}]  -----此处第一个参数是“a”而不是执行a返回的defereed对象，就是因为resolveValues被修改的原因
                    console.log('done2!');
                                      
                }).fail(function(){
                    console.log(arguments);  //['a']  ==>可见是a()执行后返回的deferred对象的fail回调参数
                    console.log('fail!');      
                });
            });
            
            
            */
			deferred.resolveWith( resolveContexts, resolveValues );
		}
		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;
//data部分明确区分了js对象和DOM对象的保存，这是为了解决部分浏览器的内存泄露问题，再低版本IS中，当DOM和JS对象之间出现循环引用时，GC就无法正确处理。
//jQuery.data()方法也支持用另一个对象为对象附加数据，也就是传入两个参数，第一个参数为需要附加的数据对象，第二个参数也是一个对象，这个对象中包含的键值对将会被复制到第一个对象的数据缓存cache中。
//因为IE6、7对直接附加在DOM对象上的垃圾回收存在问题，因此我们将数据存在全局缓存中
/*
使用jQuery.data()为普通对象附加数据时，其本质是将一个cache附加到对象上，并使用了一个特殊的属性名称
*/
function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		//DOM元素直接保存在Cache，js对象直接保存到elem
		
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		//如果elem的jQuery.expando已经有值，就重用
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;
	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	//如果data未定义，说明当前调用的是查询数据，但是对象没有任何数据，直接返回
	//id不存在，说明没有数据，或者id存在，但是没有数据保存
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		//如果是赋值则data不能为空
		return;
	}
//保存数据先分配为对象保存数据的属性id
	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		//id不存在就生成一个
		if ( isNode ) {
			//用guid递增分配唯一ID，只有DOM元素需要，因为需要存在全局cache中
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			//js对象则直接使用jQuery.expando，既然是直接附加到对象上，又何必要id呢？？==》为了避免与其他属性冲突！
			id = internalKey;
		}
	}
//数据存储在一个映射对象中，分配存储数据的对象
	if ( !cache[ id ] ) {
		cache[ id ] = {}; //初始化存储对象

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {//如果不是节点，则添加属性toJSON空方法以分辨之。
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	//data接口接受对象和函数，浅拷贝
	
	if ( typeof name === "object" || typeof name === "function" ) {
	
		//内部数据保存在cache[id]中，什么类型的数据算是私有数据？？？？？？？----事件处理函数还有？
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			//自定义数据存在cache[i].data中
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );

		}
	}
//存储对象，存放了所有数据的映射对象
	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	//jQuery内部数据存在一个独立的对象上，为了避免内部数据和用户定义的数据冲突
	//不是私有数据，将当前操作的缓存对象赋给thisCache
	if ( !pvt ) {
		//name非object类型也非function类型，也就是cache[id].data未定义
		if ( !thisCache.data ) {
			thisCache.data = {};//对于name为string类型的情况。初始化thisCache.data;
		}
		//将自定义数据的真实数据存储对象data赋值给thisCache
		thisCache = thisCache.data;
	}
//如果data不是undefined，表示传入了data参数，则存储data到name属性上，这里name必然设为string，否则有问题
	if ( data !== undefined ) {
		//没有过滤name为obj，data却依然有值的不合法情况，事实上在这种时候应该return false，或者报错
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	//如果name是字符串则获取对应的属性值，未取到则尝试进行驼峰化后再取，如果没有name则输出所有数据
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		//因为存储的时候进行了驼峰命名存储，因此在原始名字找不到的情况下找驼峰命名的值
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		//如果name为obj或者function或者未传值则直接返回所有存储的值（是cache[id].data对象）
		ret = thisCache;
	}

	return ret;
}
//jQuery.data()方法也可以为jQuery内部数据缓存数据
//删除指定对象上的数据
function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {  //不支持缓存数据则直接退出
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,  //去除缓存对象的父对象
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;  //取出缓存对象对应的Id，节点是当前属性expando的值，否则是expando本身

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {
	//内部数据保存在cache[id]上，自定义数据保存在cache[id].data上，找出当前操作对象
		thisCache = pvt ? cache[ id ] : cache[ id ].data;
/*
var obj = {age:25};
$.data(obj,'name','tianlili');
$.data(obj,'friends',{name:'leijing'});
*/
		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {  //将name转成数组，方便后面统一操作

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					//$.removeData(obj,'name');===》name=["name"];
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						//调用方式$.removeData(obj,'name friends');返回结果：['name','friends'];
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				//调用方式：
				//返回结果：["name","friends","name", "friends"]
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}
			for ( i = 0, l = name.length; i < l; i++ ) {//对数组内所有元素都进行移除操作
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {//如果此时缓存对象非空，则退出
				return;  
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {//到这里说明name不存在，则全部删除缓存数据
		delete cache[ id ].data; //先用delete尝试删除，js对象可以用delete删除

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		//如果cache[id]非空，也就是还有内部缓存数据则退出
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );//如果是节点则用删除节点属性的办法删除

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];//如果浏览器支持delete删除对象的属性，或者节点不是frame则delete删除之。

	// When all else fails, null
	} else {
		cache[ id ] = null;//为对象直接赋空值
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	/*
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	expando是页面上jQuery副本的唯一标识由jQuery加版本号加随机数组成
	下面的非数字字符被移除以匹配：rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rinlinejQuery匹配' jQuery234="null"'或者' jQuery234="342"字符串，注意前面的空格、中间的=和""不能省,还要注意是全局匹配，在使用test的时候，rinlinejQuery的lastIndex属性会改变，为了使每次都从头匹配，可以设置rinlinejQuery.lastIndex = 0;
	*/
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	/*
    // embed标签用于播放一个多媒体对象，包括Flash、音频、视频等
    // object元素用于向页面添加多媒体对象，包括Flash、音频、视频等。它规定了对象的数据和参数，以及可用来显示和操作数据的代码。
    // <object>与</object>之间的文本是替换文本，如果用户的浏览器不支持此标签会显示这些文本。
    // object元素中一般会包含<param>标签，<param>标签可用来定义播放参数。
    // <embed>和<object>标签的区别：两者都是用来播放多媒体文件的对象，object元素用于IE浏览器，embed元素用于非IE浏览器，为了保证兼容性，通常我们同时使用两个元素，浏览器会自动忽略它不支持的标签。同时使用两个元素时，应该把<embed>标签放在<object>标签的内部。
	*/
	//以下元素没有Data：embed和applet除了flash之外的object
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},
//jquery提供了jQuery.data()和jQuery.fn.data(),实现对缓存的操作。jQuery.fn.data()内部通过jQuery.data()实现
/*
	jQuery.data()的三种用法：jQuery.data(elem,key,value)//在指定元素上存储/添加任意的数据，处理了循环引用和内存泄露问题
	jQuery.data(elem,key)返回指定元素上name指定的值
	jQuery.data(elem)返回全部数据
	实现思路：
	在匹配的DOM元素上附加一个唯一ID，在$.cache中添加同样的ID属性，该ID属性的值是一个对象，其中存储了key/value映射。
	其中几个关键点：
	1.所有数据都存储在全局变量$.cache中
	2.唯一ID是一个整型值，初始为0，调用data接口时自动加一，生成新的唯一ID
	3.唯一ID附加在以$.expando命名的属性上，$.expando是动态生成的，类似于一个时间戳，以尽可能的避免与用户变量冲突
	读取：从匹配的DOM元素（elem）上取到唯一ID，在$.cache中找到唯一ID对应的对象，再从对应的对象中找到key对应的值
*/

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	//内部程序用来保存数据
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		//1是elementNode9是documentNode
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		//两种情况可保存数据：1.不在枚举数组noData内，2.在枚举数组内，但值部位true，并且classid与对应值相同
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

//fn.data请看下面的链接
//http://www.cnblogs.com/lovesueee/archive/2012/10/24/2737839.html
//http://nuysoft.iteye.com/blog/1195313
//http://blog.csdn.net/manwea/article/details/8257499
jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
/*
队列控制也是jquery中很有特点的一个功能. 可以用来管理动画或者事件等的执行顺序. queue和dequeue主要为动画服务. 
比如在jquery的动画里, 因为javascript的单线程异步机制, 如果要管理一批动画的执行顺序, 而不是让它们一起在屏幕上飞舞. 
一般我们是一个一个的把下个动画写在上个动画的回调函数中, 意味着如果要让十个动画按次序执行. 至少要写9个回调函数. 

现在有了队列机制, 可以把动画都放到队列中依次执行.究竟怎样把动画填充进队列.用的是queue方法. 
不过queue非常先进的是.把动画push进队列之后,还会自动去执行队列里的第一个函数. 
队列机制里面的另外一个重要方法是dequeue, 意为取出队列的第一个函数并执行.此时队列里面的函数个数变为N-1. 

看个例子.比如我要让2个div以动画效果交替隐藏和显示.同时只能有一个div在进行动画. 
代码  
<style type="text/css">   
#div1 {background:#aaa;width:188px;height:188px;position:absolute;top:10px;left: 110px;}  
#div2 {background:#aaa;width:188px;height:188px;position:absolute;top:310px;left: 110px;}  
</style>  
  
<body>   
<div id="div1">我是一个div</div>  
<div id="div2">我是另一个div</div>  
</body>  
用queue可以这样做.  
<script type="text/javascript">  
$(document).queue([  
    function(fn){  
        $("#div1").hide(1000, fn);   
      //fn === $(document).dequeue;  
    },  
    function(fn){  
        $("#div2").hide(1000, fn);  
    },  
    function(fn){  
        $("#div1").show(1000, fn);  
    },  
    function(fn){  
        $("#div2").show(1000, fn);  
    }  
])  
</script>  

首先我们需要一个载体, 来保存这个队列, 这里选择了document. 其实选什么节点都一样, 保存队列其实也是一个jQuery.data操作.
然后queue的参数是一个数组. 里面的函数就是队列依次执行的函数. 前面讲到, queue方法会自动把队列里的第一个函数取出来执行. 
意味着这些代码写完后, div1已经开始渐渐隐藏了. 隐藏完毕后, 如果要让后面的动画继续执行, 还要用$(document).dequeue()继续取出并执行现在队列里的第一个函数. 
当然这个操作是放在第一个动画的回调函数里, 以此类推, 第二个.dequeue()要放在第二个动画的回调函数里. 
我们看到这里没有用$(document).dequeue(). 因为这句代码太长. 注意队列函数里有一个参数fn, fn是dequeue方法内部传给此函数的, 就是$(document).dequeue(). 

在看源码之前, 先自己来想想这个功能应该怎么实现. 
首先我们需要一个数组, 里面存放那些动画. 然后需要2个方法, set和get.可以存取动画. 
可能我们还需要一个变量来模拟线程锁, 保证队列里的函数不会同时被执行. 
最后我们要把这个数组存入dom的缓存中, 方便随时存取和删除. 

*/




jQuery.extend({
/*
fn.jquery的调用jQuery.queue(this[0],type);所以elem必为dom对象
*/
// jQuery.queue( element, [queueName] )
    // 返回在指定的元素element上将要执行的函数队列
   
    // jQuery.queue( element, queueName, newQueue or callback )
    // 修改在指定的元素element上将要执行的函数队列
    // 使用jQuery.queue添加函数后，最后要调用jQuery.dequeue()，使得下一个函数能线性执行
    //
    // 调用jQuery.data，存储为内部数据（pvt为true）
    //入队的元素必须是函数，或由函数构成的数组
	queue: function( elem, type, data ) {
		var queue;
        //elem必须存在否则没有意义，
		if ( elem ) {
			type = ( type || "fx" ) + "queue";  //改名，每个都要加上queue
            //取出队列
			queue = jQuery._data( elem, type );
            //如果data存在，才会进行后边转换数组、入队等操作，可以加速取出整个队列
			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
                //如果队列不存在，或者data是数组，则调用makeArray转换为数组，并覆盖现有队列（入队）
                //当queue不存在的时候，function类型的data会被makeArray为数组保存进队列中
				if ( !queue || jQuery.isArray(data) ) {

					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
                    //队列存在的话，且data不是数组，直接入队，这里并没有判断data的类型，不管data是不是函数
                    //队列用数组实现，入队直接调用数组对象的push方法
					queue.push( data );
				}
			}
            //返回队列（即入队的同时，返回整个队列）
            //简洁使用的避免空引用的技巧
			return queue || [];
		}
	},
/*
如果是dequeue操作, 去掉锁, 执行队列里的函数, 同时给队列加上锁. 如果是queue操作, 要看锁的状态, 如果被锁上了, 就只执行队列的添加操作. 不再调用dequeue. 
其实dequeue和queue都可以执行队列里的第一个函数.queue操作添加完队列之后, 会调用dequeue方法去执行函数. 
但是用dequeue执行函数的时候, 这时候如果又用queue触发dequeue的话, 很可能同时有2个函数在执行. 队列就失去一大半意义了(还是可以保证顺序, 但是2个动画会同时执行). 
不过这个锁只能保证在dequeue的时候, 不被queue操作意外的破坏队列. 
如果人为的同时用2个dequeue, 还是会破坏动画效果的. 所以要把fn写在回调函数里. 

*/
	dequeue: function( elem, type ) {
		type = type || "fx";
        //先取得type类型的整个队列
		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
            //队列用数组实现，调用shift方法取得队列的第一个元素
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
            
            //因为next在queue.unshift之前定义，又因为不管fn是inprogress还是fn，接下来的都必然是fn，所以next就是接下来要执行的动画

			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
        //继续找下一个, 下一个肯定是函数了.  
			fn = queue.shift();
			startLength--;
		}
		hooks.cur = fn;
        //至此，fn必为队列的入队动画函数
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
            //函数执行前, 在queue数组的最前面添加一个进程锁
            //自定义type类型队列，不添加进程锁,对于特定元素上添加的队列动画一般都是按顺序执行的，因为回调就是同步执行的
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
            //执行第一个元素时采用fn.call( context, args )，由此可以看出jQuery队列只支持函数（这么说不完全准确，fx动画是个特例，会在队列头端插入哨兵inprogress，类型为字符串）
            //出队的元素会自动执行，无论这个元素是不是函数，如果不是函数此时就会抛出异常（这个异常并没有处理）
            /*
                回调函数的上下文是dom元素，参数是next函数和hooks对象
                var p = $('p')[0];
                function func(next, hooks) {
                   console.log(this);
                   console.log(next);
                   console.log(hooks);
                   next();  ////关键，会alert出“自动执行下一个函数”
                }
                $.queue(p, 'mx', func);
                $.queue(p,'mx',function(){alert("自动执行下一个函数")});
                $.dequeue(p, 'mx'); // p, function, [object Object]
                next内部仍然调用$.dequeue，这样可以接着执行队列中的下一个callback。$.dequeue里的hooks是当队列里所有的callback都执行完后(此时startLength为0)进行最后的一个清理工作，

                if ( !startLength && hooks ) {
                    hooks.empty.fire();
                }
            
            */
            /*
                queue里存的都是function。个人觉得如果只存function，应该对data参数做个严格类型判断，如果不是function则抛异常。但目前的版本没有做严格判断，如果我存的不是function，这样dequeue时会报错。如下
                var p = $('p')[0];
                $.queue(p, 'mx1', {}); // 注意第三个参数是对象，非function
                $.dequeue(p, 'mx1'); // fn.call 报错，因为fn不是function
            */
			fn.call( elem, next, hooks );  //注意这里的next的参数以及hooks参数
		}
		if ( !startLength && hooks ) {
            //队列为空
			hooks.empty.fire();
		}
	},
//fn.queue中的调用方式：jQuery._queueHooks( this, type );
	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
        //hooks.empty是一个jQuery.Callbacks对象，而它则是定义在$._queueHooks里
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});
/*
.queue([queueName]);  =====>返回在匹配的元素上的将要执行的函数队列  queueName是一个string类型，指还有队列名的字符串，默认是fx，标准的动画队列
//以下两种调用都是修改指定元素上将要执行的函数队列
.queue([queueName],newQueue);  =====>newQueue是数组，一个用来替换当前队列内容的函数数组
.queue([queueName],callback(next));  ======>callback(next)是function类型，指将要添加到队列中的新函数，当该函数被调用时，会调用next回调来弹出队列中的下一个函数
注：每个元素可以通过jQuery，包含一个或多个函数队列，在大多数应用中，只有一个队列（访问fx）被使用，队列允许一个元素来异步的访问一连串动作，而不终止程序执行

*/

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;
        //修正type,只传了一个非字符串的参数，则默认为动画fx, 如果不为"fx", 即为自己的自定义动画, 一般我们用"fx"就足够了. 
        
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}
        //如果只是传入了queuename或者没有传递参数，则表示是要取队列
        //旧版中未定义setter，而是通过判断data=== undefined为true来确定的

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}
        //入队操作，这里不清楚为什么要改成data===undefined的判断形式？？？？？
        //$("body").queue(undefined);--------此种调用返回undefined;
		return data === undefined ?
			this :
            //在每一个匹配元素上执行入队操作,并返回元素数组
			this.each(function() {
				var queue = jQuery.queue( this, type, data );
				// ensure a hooks for this queue
                //如果动画执行完毕（即不是inprogress），则从队列头部移除
                //第一次入队时，如果type默认或者是fx因为queue[0]不为inprogress所以会执行下面的if，
                //如果第一次入队时type不为fx也就是说是自定义的，则不会执行下面的if，也就是说不会在queue的同时自动dequeue
                //进程锁inprogress（只有fx有）避免当正dequeue时（某个动画正在执行)时，又入队一个动画，造成动画非线性进行
                /*
                    下面的代码说明了没有进程锁时动画顺序被打乱的事实，前提是：if条件为if(queue[0] !== "inprogress")-----因为只有自定义动画没有进程锁
                    $('li').queue('test',[
                        function(){ 
                            console.log("第一个动画函数");  //因为test队列没有inprogress进程锁，因此入队结束后就会调用dequeue进行出对，因此第一个显示“第一次显示”;
                            var sum=0;
                            $("li").queue('test',function(){console.log("执行！")});//注意这里在dequeue操作在进行的时候，又进行了queue操作，因为test队列没有inprogress进程所因此会在入队结束后调用dequeue出队，所以接下来显示的是“第二次显示”
                            for(var i=0;i<2;i++){
                                sum+=20;
                                console.log(sum);  //第三次显示  -----在alert“第二次显示之后”继续第一个出队函数的执行
                            }
                        },
                        function(){
                            console.log("第二个动画函数");  //alert 第二次显示内容
                        }
                    ]);
                    $('li').dequeue('test');   //alert 执行
                    运行结果是：
                        第一个动画函数
                        第二个动画函数
                        20
                        40
                        执行！
                   从以上运行结果可以看出第一个队列动画函数被打乱
                   但是fx因为有进程锁就不会出现这种情况，请看实例，if条件为if ( type === "fx" && queue[0] !== "inprogress" ) 
                   $('li').queue([
                        function(){ 
                            console.log("第一个动画函数");  //因为test队列没有inprogress进程锁，因此入队结束后就会调用dequeue进行出对，因此第一个显示“第一次显示”;
                            var sum=0;
                            $("li").queue(function(){console.log("执行！")});//注意这里在dequeue操作在进行的时候，又进行了queue操作，因为test队列没有inprogress进程所因此会在入队结束后调用dequeue出队，所以接下来显示的是“第二次显示”
                            for(var i=0;i<2;i++){
                                sum+=20;
                                console.log(sum);  //第三次显示  -----在“第二次显示之后”继续第一个出队函数的执行
                            }
                        },
                        function(){
                            console.log("第二个动画函数");  // 第二次显示内容
                        }
                    ]);
                    $('li').dequeue();   // 第二个动画函数
                    $('li').dequeue(); //执行
                    运行结果是：
                        第一个动画函数
                        20
                        40
                        第二个动画函数
                        执行！
                */
                //if (queue[0] !== "inprogress" ) { // =====>这种判断方式的话，因为自定义动画没有添加inprogress进程锁，因此在进行dequeue的时候执行queue（每次queue都会dequeue）操作可能使动画不能按顺序执行
				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
    /*
        delay用来延迟后续添加的callback的执行，第一个参数time是延迟时间(另可使用"slow"和"fast")，第二个是队列名。
        function cb() {
            console.log(1);    
        }
        var $p = $('p');
        $p.delay(2000, 'mx').queue('mx', cb); 
         
        $p.dequeue('mx'); // 2秒后输出1
        如果是这样

        function ff1() {console.log(1)}
        function ff2() {console.log(2)}
         
        var $p = $('p');
        $p.queue('mx', ff1);
        $p.delay(4000, 'mx');  //其实是加了一个队列函数（匿名的）
        $p.queue('mx', ff2);
        $p.dequeue('mx'); // 立即输出1
        $p.dequeue('mx'); // 4秒后输出2//其实是执行delay时加的匿名函数，执行完后，在time之后执行next，next其实就是dequeue
    
    */
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},


    //顾名思义，清空所有队列。没什么好说的，源码如下，直接使用一个空数组覆盖之前的数组队列了。
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
    /*
        这个方法返回一个promise对象，promise对象既是前面提到的Deferred对象的阉割版。你可以使用done、fail、progress添加，但不能触发。用在queue模块里有特殊意义，比如done它指queue里所有function都执行后才执行done添加的。如
        function ff1() {
            alert(1)
        }
        function ff2() {
            alert(2)
        }
        function succ() {
            alert('done')
        }
        $body = $('body')
        $body.queue('mx', ff1);
        $body.queue('mx', ff2);
        var promise = $body.promise('mx');
        promise.done(succ);
        setInterval(function() {
            $body.dequeue('mx') // 先弹出1,2，最后是"done"
        }, 1500)
    
    */
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
            //在遍历时最好缓存length属性，避免每次都去查找length属性，稍微提升遍历速度，如果遍历HTMLCollection时，性能提升非常明显
            //因为每次访问HTMLCollection的属性，HTMLCollection都会内部匹配一次所有的节点。比如千万别这样写：for(var j = 0 ;j<domEles.length;j++),而要这样写for(var j = 0,l=handles.length;j<l;j++)
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
        //arr.push()方法返回数组的长度
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                console.log("tokenize");
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
            console.log(match);
            /*  ["[type='checkbox']", "type", "=", "'", "checkbox", undefined]
                0 : "[type='checkbox']"
                1 : "type"
                2 : "="
                3 : "'"
                4 : "checkbox"
                5 : undefined
                index : 0
                input : "[type='checkbox'], #pFirst:first-child"
            */

            /*
            关于replace的替换函数：
            实例：
            function fn() 
            { 
                for(var i = 0;i < arguments.length;i++){ 
                　　document.write("第"+(i+1)+"个参数的值："+arguments[i] + " ; "); 
                　　} 
            } 
            var str = '<div id="{wo}" >{ni}</div>'; 
            str.replace(/\{([a-z]+)\}/ig, fn); 
            输出结果：
            第1个参数的值：{wo} ；第2个参数的值：wo ；第3个参数的值：9 ；第4个参数的值：第4个参数的值：<div id="{wo}" >{ni}</div> ； 
            
            第1个参数的值：{ni} ；第2个参数的值：ni ；第3个参数的值：16 ；第4个参数的值：第4个参数的值：<div id="{wo}" >{ni}</div> ； 

            可见：
            　  第一个参数为匹配到的字符串,如{wo}和{ni}; 

            　　第二个参数可以有0-N个,为第一个参数中匹配到一个括号正则的字符串,如第一个参数中的wo和ni,能匹配([a-z]+), 括号有几组,则参数有几个; 

            　　第三个参数为第一个参数中匹配到的字符串所在位置,如{wo}返回9,{ni}返回16; 

            　　第四个参数为用来匹配的字符串,在这个例子中就是<div id="{wo}" >{ni}</div>. 
                        */
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
            //正则：RegExp /^:(only|first|last|nth|nth-last)-(child|of-type)(?:\([\x20\t\r\n\f]*(even|odd|(([+-]|)(\d*)n|)[\x20\t\r\n\f]*(?:([+-]|)[\x20\t\r\n\f]*(\d+)|))[\x20\t\r\n\f]*\)|)/i
            
            /*
                [":first-child", "first", "child", undefined, undefined, undefined, undefined, undefined, undefined]
                index : 0
                input ：":first-child"
            */
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
            /*
            :nth-child伪类选择器的用法：
                
                第一种：:nth-child(number)
                直接匹配第number个元素。参数number必须为大于0的整数。
                例子：
                li:nth-child(3){background:orange;}//把第3个LI的背景设为橙色

                第二种：倍数写法

                :nth-child(an)

                匹配所有倍数为a的元素。其中参数an中的字母n不可缺省，它是倍数写法的标志，如3n、5n。

                例子：

                li:nth-child(3n){background:orange;}//把第3、第6、第9、…、所有3的倍数的LI的背景设为橙色
                第三种：倍数分组匹配

                :nth-child(an+b) 与 :nth-child(an-b)

                先对元素进行分组，每组有a个，b为组内成员的序号，其中字母n和加号+不可缺省，位置不可调换，这是该写法的标志，其中a,b均为正整数或0。如3n+1、5n+1。但加号可以变为负号，此时匹配组内的第a-b个。（其实an前面也可以是负号，但留给下一部分讲。）

                例子：

                li:nth-child(3n+1){background:orange;}//匹配第1、第4、第7、…、每3个为一组的第1个LI

                li:nth-child(3n+5){background:orange;}//匹配第5、第8、第11、…、从第5个开始每3个为一组的第1个LI

                li:nth-child(5n-1){background:orange;}//匹配第5-1=4、第10-1=9、…、第5的倍数减1个LI

                li:nth-child(3n±0){background:orange;}//相当于(3n)

                li:nth-child(±0n+3){background:orange;}//相当于(3)
                第四种：反向倍数分组匹配

                :nth-child(-an+b)

                此处一负一正，均不可缺省，否则无意义。这时与:nth-child(an+1)相似，都是匹配第1个，但不同的是它是倒着算的，从第b个开始往回算，所以它所匹配的最多也不会超过b个。

                例子：

                li:nth-child(-3n+8){background:orange;}//匹配第8、第5和第2个LI

                li:nth-child(-1n+8){background:orange;}//或(-n+8)，匹配前8个（包括第8个）LI，这个较为实用点，用来限定前面N个匹配常会用到
                第五种：奇偶匹配

                :nth-child(odd) 与 :nth-child(even)

                分别匹配序号为奇数与偶数的元素。奇数(odd)与(2n+1)结果一样；偶数(even)与(2n+0)及(2n)结果一样。
           
            */
			match[1] = match[1].toLowerCase();
            /*
                :nth-of-type(n) 选择器匹配属于父元素的特定类型的第 N 个子元素的每个元素.
                其中：n 可以是数字、关键词或公式。
                实例 1 ： 
                    Odd 和 even 是可用于匹配下标是奇数或偶数的子元素的关键词（第一个子元素的下标是 1）。
                    在这里，我们为奇数和偶数 p 元素指定两种不同的背景色：
                    p:nth-of-type(odd)
                    {
                    background:#ff0000;
                    }
                    p:nth-of-type(even)
                    {
                    background:#0000ff;
                    }
                实例2 ：
                    使用公式 (an + b)。描述：表示周期的长度，n 是计数器（从 0 开始），b 是偏移值。
                    在这里，我们指定了下标是 3 的倍数的所有 p 元素的背景色：
                    p:nth-of-type(3n+0)
                    {
                    background:#ff0000;
                    }
                                
            */
            /*
                match对应的数组元素分别代表的含义上面有用正则来说明，下面举例说明：
                以":nth-child( -3n + 2 )"为例：
                    match[1]:nth
                    match[2]:child 
                    match[3]: -3n + 2
                    match[4]: -3n
                    match[5]: -
                    match[6]: 3
                    match[7]: +
                    match[8]: 2
            */
			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1

                //match[4] = +(-3) = -3;
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				//match[5] = +(+2) = 2
                match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}
            console.log(match);

			return match;
		},

		"PSEUDO": function( match ) {
            console.log(match);
            
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}
/*
以 $("div > p + .clr [type='checkbox'], #pFirst:first-child",$("#body")) 为例，对选择器的分析过程如下：
groups:[
	[Object { value="div", type="TAG", matches=[1]}, Object { value=" > ", type=">"}, Object { value="p", type="TAG", matches=[1]}, 4 更多...],
	[Object { value="#pFirst", type="ID", matches=[1]}, Object { value=":first-child", type="CHILD", matches=[8]}]
]
groups[0]内容如下：	
0 ： Object { value="div", type="TAG", matches=[1]}
	matches	:["div"]
	0 : "div"
	index: 0
	input : "div > p + .clr [type='checkbox'], #pFirst:first-child"
1 : Object { value=" > ", type=">"}
2 : Object { value="p", type="TAG", matches=[1]}
	matches :["p"]
	0 : "p"
	index : 0
	input : "p + .clr [type='checkbox'], #pFirst:first-child"
3 : Object { value=" + ", type="+"}
4 : Object { value=".clr", type="CLASS", matches=[1]}	 //value = mateched = match.shift(); matches = match;
	matches : ["clr"]
	0 : "clr"
	index : 0
	input : ".clr [type='checkbox'], #pFirst:first-child"
5 : Object { value=" ", type=" "}
6 : Object { value="[type='checkbox']", type="ATTR", matches=[3]}
	matches : 	["type", "=", "checkbox"]
	0 : "type"
	1 : "="
	2 : "checkbox"
groups[1]内容如下： 
0 ： Object { value="#pFirst", type="ID", matches=[1]}
	matches : ["pFirst"]
	0 : "pFirst"
	index : 0
	input : "#pFirst:first-child"
1 : Object { value=":first-child", type="CHILD", matches=[8]}
	matches : 	["first", "child", undefined, 5 更多...]
	0 : "first"	
	1 : "child"
	2 : undefined
	3 : undefined	
	4 : undefined
	5 : undefined
	6 : undefined
	7 : undefined
	index : 0
	input : ":first-child"
*/
function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {
		// Comma and first run
        //主要是处理并列选择器，进入的条件是：第一次进入tokenize进行分析 || 匹配到并列选择器的标志","
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
                console.log("foFar is : "+soFar);
			}
            //groups.push(tokens=[])是这里最棒的代码，刚进入tokenize进行表达式的分析时，matched为false，!matched为true，进入条件的函数体
            //因为刚进来的时候不会出现并列选择器的匹配，即由以空格(可选)+","开头进行分割的并列选择器，所以groups执行push操作，保存并列选择器的第一个选择器选项
            //后面设置matched为false，因为每次对并列选择器的匹配都会生成matched，因此!matched始终为false，直到碰到并列选择器标志","，match不为空，重新进入此条件体
            //再次执行groups.push(tokens=[])操作，达到保存各个并列选择器匹配的效果。
            //因为tokens是数组的引用，因此tokens的push操作会自动更新groups里对应push的数组选项
			groups.push( tokens = [] );
		}
        //matched = false是关键
		matched = false;

		// Combinators
        //rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
        //匹配层次关系" "(后代选择器) 、 " > "（子选择器） 、 " + "（相邻兄弟选择器） 、 " ~ "（同级兄弟选择器） 、 
		if ( (match = rcombinators.exec( soFar )) ) {
            matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
            //更新剩下要分割的选择器,这里也很关键，注意切割的位置
			soFar = soFar.slice( matched.length );
		}

		// Filters
        //匹配选择器比如："tag"、"attr"、"class"、"id"、"child"、"presudo"
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}

		}
		if ( !matched ) {
			break;
		}
	}
	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
            console.log("tokenize");
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );
        console.log("tokenize");
	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
    /*
    搜索匹配的元素，并返回相应元素的索引值，从0开始计数。
    如果不给 .index() 方法传递参数，那么返回值就是这个jQuery对象集合中第一个元素相对于其同辈元素的位置。
    如果参数是一组DOM元素或者jQuery对象，那么返回值就是传递的元素相对于原先集合的位置。
    如果参数是一个选择器，那么返回值就是原先元素相对于选择器匹配元素中的位置。如果找不到匹
    */
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
        //elementNode:1,documentNode:9,documentFragmentNode:11
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},
/*
append对此方法的调用：this.domManip(arguments, true, function( elem ) {
        //elementNode:1,documentNode:9,documentFragmentNode:11
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
        append调用方法中的true参数是用来处理tbody的情况的
        这个API不会单独用到，但却是操作dom时候的核心函数
        arguments可以是htmlString\Element或者jQuery对象或者elements数组，也可以是function，该fn接受两个参数，第一个是将要append到的匹配元素在匹配元素集的索引，第二个是其对应的html值
        实例：
        html代码：
        <ul>
          <li>li1</li>
          <li class="liEle">li2</li>
          <li class="liEle">li3</li>
          <li class="liEle">li4</li>
          <li>li5</li>
          <li>li6</li>
          
        </ul>
        <div id="header">
          <span>hello world </span>
        </div>
        <button>click</button>
        js代码：
        $('button').click(function(){
            $('.liEle').append(function(index,value) {
                return '<p>this append index is : '+index+' and the html is : '+value+'</p>';
            });
        });
        运行代码click按钮后的结果是：
        li1
        li2
        this append index is : 0 and the html is : li2
        li3
        this append index is : 1 and the html is : li3
        li4
        this append index is : 2 and the html is : li4
        li5
        li6
        hello world
        观察上面的li2、li3、li4的显示
*/
	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}
                    /*IE6下创建table元素的时，tr不能直接append到table，因为IE6认为tr是在tbody下面的，所以IE6下创建table元素要像这样：
                    var table = document.getElementsByTagName('table')[0]; 

                    var tbody = document.createElement('tbody');  //标准浏览器可以省掉这一步

                    var tr = document.createElement('tr'); 

                    var td = document.createElement('td'); 

                    var txt = document.createTextNode('haha'); 

                    td.appendChild(txt); 

                    tr.appendChild(td); 

                    tbody.appendChild(tr);  //标准浏览器可以省掉这一步而不会出错，IE6就不行

                    table.appendChild(tbody); 

                    
                    */
                    //append、prepend、before、after都是操作都dom元素的函数，如果被插入的对象是table，那就要在table中加入tbody标签
                   
					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},
//parsed = jQuery.buildFragment( [ data ], context, scripts );
	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/**
 * jQuery框架本身对extend函数的使用非常频繁，典型示例为jQuery.ajax
 *
 */

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

 //使用extend对jQuery对象本身进行扩展，只给了一个参数对象
 //该对象中的属性将被追加到jQuery对象中
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
                            //rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
                            //此处对rheaders.exec的结果进行循环，要是exec能够反复调用，必须设置正则表达式为全局匹配，即正则后面必须加'g'
                            //设置了g之后，exec执行之后会更新正则表达式的lastIndex属性，表示本次匹配后，所匹配字符串的下一个字符的索引，下次再用这个正则表达式匹配字符串的时候就会从上次的lastIndex属性开始匹配
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
//定义将全局变量window.$和window.jQuery指向jQuery变量
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );  //nuysoft君连分号都注意了呢，分号其实可选，但省略分号并不是一个好的编程习惯，为了更好的兼容和健壮性，请在每行代码后加上分号并养成习惯。
//jQuery的定义是在自执行函数中进行，而自执行匿名函数中声明的局部变量和函数在匿名函数执行完毕后撤销，释放内存，对外只保留jQuery变量接口
/*
这里创建一个‘自调用匿名函数’的原因：
通过定义一个匿名函数，创建了一个‘私有’命名空间，该命名空间的方法和变量，不会破环全局的命名空间。这点非常有用，也是一个js框架必须支持的功能。
匿名函数从语法上叫函数直接量。自调用匿名函数有两种写法：
方法一：
(function() {

    console.info( this );

    console.info( arguments );

}( window ) );
方法二：
(function() {

    console.info( this );

    console.info( arguments );

})( window );
为什么要传入window？？ -----之前没有细细的想过这个问题，后来看了别人的分析才知道window作为参数传入也是很有心机的
通过传入window变量，使得window由全局变量变为局部变量，当在jQuery代码块中访问window时，不需要将作用域链回退到顶层作用域，这样可以更快的访问window；这还不是关键所在，更重要的是，将window作为参数传入，可以在压缩代码时进行优化，看看jquery-1.6.1.min.js：

(function(a,b){})(window); // window 被优化为 a   
*/
/*
自调用匿名函数中都实现了什么功能，按照代码顺序排列
(function( window, undefined ) {

    // 构造jQuery对象

var jQuery = function( selector, context ) {

        return new jQuery.fn.init( selector, context, rootjQuery );

    }

// 工具函数 Utilities

// 异步队列 Deferred

// 浏览器测试 Support

// 数据缓存 Data

// 队列 queue

// 属性操作 Attribute

// 事件处理 Event

// 选择器 Sizzle

// DOM遍历

// DOM操作

// CSS操作

// 异步请求 Ajax

// 动画 FX

// 坐标和大小

    window.jQuery = window.$ = jQuery;

})(window);
可见jQuery的源码结构相当清晰、有条理
*/