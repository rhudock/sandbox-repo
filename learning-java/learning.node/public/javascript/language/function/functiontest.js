/**
 * $Id$
 *   http://ejohn.org/apps/learn/
 * 
 */
$(function() {
	
/*
var logger = new Log4js.getLogger("function"); 
logger.addAppender(new Log4js.BrowserConsoleAppender());
logger.setLevel(Log4js.Level.ALL);
*/

/**
 *  Set of tests to understand Function in javascript.
 *
 *  Ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
 */
module("Function in Javascript", {
	setup : function() {
		try	{

		} catch (e){
			logger.error("ERROR():" + e.message, e); 
			ok(false);
		}
	},

	tearDown: function () {
		try	{

		} catch (e){
			logger.error("ERROR():" + e.message, e); 
			ok(false);
		}
    }
});

	/**
	 *   Test and Understand Function properties
	 *
	 *	 arguments  Deorecated
	 *   caller		Non-Standard
	 *	 constructor
	 *	 length 
	 *	 name		Non-Standard
	 */
	test("arguments[i] is the i'th argument in function call ---------------->", function() {
		
		var f_arg0, expected = 2;

		f( expected );
		equal ( expected, f_arg0, "expected:" + expected + ", actual:" + f_arg0 );

		function f(n) { 
			f_arg0 = arguments[0];
		}
	});

	test("arguments.callee is function itself", function() {
		
		var f_arg0, expected = 2;

		f( expected );

		function f(n) { 
			equal( f, arguments.callee, "I am " + arguments.callee );
			f_arg0 = arguments[0];
		}
	});

	test("caller is not standard", function() {
		
		if (typeof caller != "undefined") {
			logger.debug("caller is " + caller);
		}
		ok (true);
	});

	test("other properties", function() {
		
		ok (typeof length != "undefined", "length is " + length);
		ok (name, "name is " + name);
		ok (constructor, "constructor is " + constructor);

	});



	/**
	 *   Test and Understand Function Methods
	 *
	 *	 apply
	 *	 binder			> 1.8.5
	 *	 call
	 *	 isGenerator	> 1.8.6 
	 *	 toSource		Non-Standard
	 *	 toString
	 */
	test("Methods ------------ apply() Test fun.apply(thisArg[, argsArray])", function() {
		
		/* min/max number in an array */
		var numbers = [5, 6, 2, 3, 7];

		/* using Math.min/Math.max apply */
		var max = Math.max.apply(null, numbers); /* This about equal to Math.max(numbers[0], ...) or Math.max(5, 6, ..) */
		var min = Math.min.apply(null, numbers);

		equal( max, 7 );
		equal( min, 2 );

	});

	test("call() fun.call(thisArg[, arg1[, arg2[, ...]]])" + 
		"\nTest While the syntax of this function is almost identical to that of apply(), " + 
		"\nthe fundamental difference is that call() accepts an argument list, while apply() accepts a single array of arguments.", 
		function() {
		
		var animals = [
		  {species: 'Lion', name: 'King'},
		  {species: 'Whale', name: 'Fail'}
		];

		for (var i = 0; i < animals.length; i++) {
		  (function (i) { 
			this.print = function () { 
			  console.log('#' + i  + ' ' + this.species + ': ' + this.name); 
			} 
			this.print();
		  }).call(animals[i], i);
		}

		ok(true);

	});

/*
 *	bind function cannot be tested as is from MDN, because this is different
 *  
 */


/*
 *  This is not 
 *
 */
	window.x = 9; 
	window.modX = {
	  x: 81,
	  getX: function() { 
		  return this.x; 
		}
	};

	test("bind() fun.bind(thisArg[, arg1[, arg2[, ...]]])", function() {

		equal( window.modX.getX(), 81 ); // 81

		window.getX = window.modX.getX;
		var getXanswer = window.gitX(); // 9, because in this case, "this" refers to the global object
		/*
			Well not in Qunit test since the global object is not window but qunit or something.
		*/
		equal( getXanswer, 9 ); // 9, because in this case, "this" refers to the global object
		equal( window.gitX(), 9 ); // 9, because in this case, "this" refers to the global object

		// create a new function with 'this' bound to module
		var boundGetX = getX.bind(modX);
		equal( boundGetX(), 81 ); // 81

	});
/*
	test("should call all subscribers for a message exactly once", function () {
		var message = getUniqueString();

		var spy1 = this.spy();
		PubSub.subscribe(message, spy1);

		var spy2 = this.spy();
		PubSub.subscribe(message, spy2);

		PubSub.publishSync(message, "my payload");

		ok(spy1.calledOnce, "first subscriber called once");
		ok(spy2.calledOnce, "second subscriber called once");
	});
	test("------------- should inspect jQuery.getJSON's usage of jQuery.ajax", function () {
		this.spy(jQuery, "ajax");
		jQuery.getJSON("/some/resource");

		ok(jQuery.ajax.calledOnce);
		equal(jQuery.ajax.getCall(0).args[0].url, "/some/resource");
		equal(jQuery.ajax.getCall(0).args[0].dataType, "json");
	});
*/

/**
 *  Testing OO concept of Function. 
 */
module("Javascript Function in OO", {
	setup : function() {
		try	{

		} catch (e){
			logger.error("ERROR():" + e.message, e); 
			ok(false);
		}
	},

	tearDown: function () {
		try	{

		} catch (e){
			logger.error("ERROR():" + e.message, e); 
			ok(false);
		}
    }
});

	/**
	 *  Test function overloading. 
	 *  It is not supported and the second one overwrites first one in FF.
	 */
	test("Function overloading", function() {
		
		var myLogger = function(name) {
		};

		myLogger.prototype = {

			fatal: function(message) {
				console.log("fatal: function(message) Not ");
			},
			fatal: function(message, throwable) {
				console.log("fatal: function(message, mytest) ");
			},

			avar: "first",
			avar: "second"
		};

		var alogger = new myLogger("test");

		alogger.fatal("test");
		alogger.fatal("test", "test");

		ok(true);

		equal ( alogger.avar, "second" );

	});








	/**
	 * Module of Array Qunit tests
	 */
	module("Function return anonymous function");

	test("#1 each call should create a new function.", function() {
		
		var funA = createFunction(1);
		var funB = createFunction(2);

		notEqual(funA(), funB(), "New instances are created funA's id is " + funA() + " and funB's id is " + funB());

		function createFunction(id) {

			return function() {
				var myId = id;
				return myId;
			}
		}

	});


	/**
	 * Important to understand anonymous function and it variable scope.
	 *
	 *
	 *
	 *
	 *
	 */
	test("#1 each function should has its own closure", function() {
		
		var funA = createFunction("2-1");
		var funB = createFunction("2-2");
		// var funB = function () {} ;
		var arrf = [];

		ok(true);

		for (var i = 0; i <= 10; i++) {
			arrf.push(funA());
		};

		equal(arrf[0].id, arrf[arrf.length -1].id, "Objects from funA have same id");
		notEqual(arrf[0].counter, arrf[arrf.length -1].counter, "Objects from funA have different counter");
		equal(arrf[0].lcounter, arrf[arrf.length -1].lcounter, "Objects from funA have same lcounter");

		var objB = funB();

		notEqual(arrf[0].id, objB.id, "Objects from different function instan have different ids");


		// notEqual(funA(), funB(), "New instances are created funA's id is " + funA() + " and funB's id is " + funB());


		function createFunction(id) {

			var counter;				// counter is created each time createFunction() is called.	

			if (!counter) {
				counter = 0;
				console.log("counter has been created");
			};


			return function() {

				var lcounter;           // lcounter is created every time this anonymous fuction is called. 
				if (!lcounter) {
					lcounter = 0;
					console.log("lcounter has been created");
				};

				lcounter += 1;
				counter += 1;
				this.id = id;			// Each anonymous function owns its own id.
				console.log("Hi id:" + this.id + ", counter:" + counter + ", lcounter:" + lcounter);
				return {"id": this.id, "counter": counter, "lcounter": lcounter };
			}
		}

	});

});
