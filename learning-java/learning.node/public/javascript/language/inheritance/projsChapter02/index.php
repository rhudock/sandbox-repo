<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Pro Javascript Chapter 2</title>
<style type="text/css">
<!--
.style5 {color: #000000; font-weight: bold; }
-->
</style>
</head>

<body>
<h2>Pro Javascript Chapter 2</h2>
<p>Object Oriented Language</p>
<ol>
  <li>Reference: A fundamental aspect of JavaScript is the concept of references. A reference is a pointer to an 
    actual location of an object. This is an incredibly powerful feature The premise is that a physical 
    object is never a reference. A string is always a string; an array is always an array. However, 
    multiple variables can refer to that same object. It is this system of references that JavaScript 
    is based around. By maintaining sets of references to other objects, the language affords you
  much more flexibility.
    <ol>
      <li><a href="01-reference.php">01-reference</a></li>
      <li><a href="02-modify.php">02-modify</a> - array modified and reference is pointing to the same object.</li>
      <li><a href="03-change.js">03-change</a> - When a new obejct is created.</li>
      <li><a href="04-newobj.js">04-newobj</a> - String concatnate creates a new string objet.</li>
    </ol>
  </li>
  <li><div>Function Overloading: A common feature in other object-oriented languages, such as Java, is the ability to &ldquo;overload&rdquo;
    functions to perform different behaviors when different numbers or types of arguments are
    passed to them. While this ability isn&rsquo;t immediately available in JavaScript, a number of tools
  are provided that make this quest entirely possible.
  
<p>Table 2-1. Type-Checking Variables</p>
<table width="600" border="1" cellpadding="4" cellspacing="0" bordercolor="#333333">
  <tr>
    <td bgcolor="#CCCCCC"><span class="style5">Variable</span></td>
    <td bgcolor="#CCCCCC"><span class="style5">typeof Variable Variable</span></td>
    <td bgcolor="#CCCCCC"><span class="style5">constructor</span></td>
  </tr>
  <tr>
    <td>{ an: &ldquo;object&rdquo; }</td>
    <td>object</td>
    <td>Object</td>
  </tr>
  <tr>
    <td>[ &ldquo;an&rdquo;, &ldquo;array&rdquo; ]</td>
    <td>object</td>
    <td>Array</td>
  </tr>
  <tr>
    <td>function(){}</td>
    <td>function</td>
    <td>Function</td>
  </tr>
  <tr>
    <td>&ldquo;a string&rdquo;</td>
    <td>string</td>
    <td>String</td>
  </tr>
  <tr>
    <td>55</td>
    <td>number</td>
    <td>Number</td>
  </tr>
  <tr>
    <td bordercolor="#333333">true</td>
    <td>boolean</td>
    <td>Boolean</td>
  </tr>
  <tr>
    <td>new User()</td>
    <td>object</td>
    <td>User</td>
  </tr>
</table>
</div>
    <ol>
      <li><a href="05-overload.js">05-overload</a></li>
      <li><a href="06-displayerror.js">06-displayerror</a></li>
      <li><a href="07-typeof.js">07-typeof</a></li>
      <li><a href="08-constructor.js">08-constructor</a></li>
      <li><a href="09-strict.js">09-strict</a> - Shows how to check number of arguments.</li>
    </ol>
  </li>
  <li>scope: In JavaScript, scope is 
    kept within functions, but not within blocks (such as while, if, and for statements). The end 
  result could be some code whose results are seemingly strange
      <ol>
        <li><a href="10-scope.js">10-scope</a></li>
        <li><a href="11-global.js">11-global</a> An interesting 
          aspect of browser-based JavaScript is that all globally scoped variables are actually just properties 
        of the window object.</li>
        <li><a href="12-global.js">12-global</a></li>
      </ol>
  </li>
  <li>closures: Closures are means through which inner functions can refer to the variables present in their
    outer enclosing function after their parent functions have already terminated. This particular
  topic can be very powerful and very complex
    <ol>
      <li><a href="13-closures.js">13-closures</a></li>
      <li><a href="14-currying.js">14-currying</a></li>
      <li><a href="15-anon.js">15-anon</a></li>
      <li><a href="16-scope.js">16-scope</a></li>
    </ol>
  </li>
  <li>Context: Within JavaScript your code will always have some form on context (an object within which 
    it is operating). This is a common feature of other object-oriented languages too, but without 
    the extreme in which JavaScript takes it. 
    The way context works is through the this variable. The this variable will always refer to 
    the object that the code is currently inside of. Remember that global objects are actually properties 
    of the window object. This means that even in a global context, the this variable will still 
    refer to an object. Context can be a powerful tool and is an essential one for object-oriented 
  code.
    <ol>
      <li><a href="17-context.js">17-context</a> ***</li>
      <li><a href="18-change.php">18-change</a> *** I don't understand this yet.</li>
    </ol>
  </li>
  <li>Objects: Objects are the foundation of JavaScript. Virtually everything within the language is an object.
    <ol>
      <li><a href="19-objects.js">19-objects</a></li>
      <li><a href="20-create.js">20-create</a></li>
      <li><a href="21-constructor.js">21-constructor</a></li>
      <li><a href="22-prototype.js">22-prototype</a></li>
      <li><a href="23-private.js">23-private</a>
        <ol>
          <li><a href="http://javascript.crockford.com/">List of JavaScript articles: http://javascript.crockford.com/</a></li>
          <li><a href="http://javascript.crockford.com/private.html">&ldquo;Private Members in JavaScript&rdquo; article: 
          http://javascript.crockford.com/private.html</a></li>
        </ol>
      </li>
      <li><a href="24-priv.js.php">24-priv.js</a></li>
      <li><a href="25-dyn.js">25-dyn</a></li>
      <li><a href="26-static.js">26-static</a> - The premise behind static methods is virtually identical to that of any other normal function.
        The primary difference, however, is that the functions exist as static properties of an object.
        As a property, they are not accessible within the context of an instance of that object; they are
        only available in the same context as the main object itself. For those familiar with traditional
      classlike inheritance, this is sort of like a static class method.</li>
    </ol>
  </li>
</ol>
</body>
</html>
