<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Lee-Create WebSkills Javascript</title>
<link rel="stylesheet" href="/assets/style-screen.css" media="screen" />
<link rel="stylesheet" href="/assets/style-print.css" media="print" />
<link rel="stylesheet" href="/assets/layout-screen.css" media="screen" />
<link rel="stylesheet" href="/assets/ui.css" type="text/css" media="print, projection, screen">
<!-- Additional IE/Win specific style sheet (Conditional Comments) -->
<!--[if lte IE 7]>
<link rel="stylesheet" href="/assets/jquery.tabs-ie.css" type="text/css" media="projection, screen">
<![endif]-->
</head>
<body>
<div id="page-wrap">
   <!-- page header -->
   <div id="page-header">
      <?php include "../../assets/include/shead.php"; ?>
      <div class="title">
         <h3>Javascript</h3>
      </div>
   </div>
   <!-- End page-header -->
   <!-- Page content -->
   <div id="content-wrap">
      <table>
         <tr>
            <td id="td-sidebar-index-wrap" valign="top"><div id="sidebar-index">
               <?php include "index.php"; ?>
            </td>
            <td valign="top"><div id="main-content-wrap">
                  <div class="title">
                     <h3>Javascript Study Note</h3>
                  </div>
                  <div id="main-content">
                     <div class="subtopic">
                        <div class="title collapsable">
                           <!-- Title comes here -->
                           Introduction</div>
                        <div class="content">
                           <!-- contents comes here -->
                           <dl class="Cl-101">
                              <p>JavaScript is a cross-platform, object-oriented scripting language.  JavaScript is a small, lightweight language; it is not useful as a  standalone language, but is designed for easy embedding in other  products and applications, such as web browsers. Inside a host  environment, JavaScript can be connected to the objects of its  environment to provide programmatic control over them. (<a href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/JavaScript_Overview#What_is_JavaScript.3F">JavaScript Overview</a>, 2008)</p>
                              <ul>
                                 <li><a href="1_hellojs/hellojavascript.php">Hello JavaScript</a></li>
                                 <li><a href="2_basictestcode/index.html">Basic Knowledge and Test codes</a> | <a href="1_hellojs/reserved_words.html">Reserved Words</a></li>
                                 <li>Advanced Codes</li>
                                 <li>Libraries</li>
                                 <li><a href="6_jsdev/index.html">Development (JUnit, Debug)</a></li>
                                 <li><a href="resources/resources.html">Resources (include AP)</a> </li>
                              </ul>
                              <p>Learning JavaScript, JavaScript Library and Advanced Topics </p>
                              <ol>
                                 <li>Function
                                    <ol>
                                       <li><a href="learningjavascript/lc_jssamples/function_callby.html">function_callby.html</a> - How does a function argument is called by value or by reference? (Taste of prototype and function.call(Object) (http://snook.ca/archives/javascript/javascript_pass/)</li>
                                       <li><a href="learningjavascript/my.test.code/function/function.string.arg.html">This</a> tests a String type Function Argument </li>
                                       <li><a href="learningjavascript/my.test.code/function/fn.parseInt.html">parseInt()</a></li>
                                       <li><a href="learningjavascript/my.test.code/function/fn.isNaN.html">isNaN()</a></li>
                                    </ol>
                                 </li>
                                 <li>Object
                                    <ol>
                                       <li><a href="learningjavascript/my.test.code/object/object.html">Object.html </a>- In this file I have created an Object with a Function and used it. (I also tested inline javascript)</li>
                                       <li><a href="learningjavascript/my.test.code/object/object01.html">object01.html</a> - trite to modify this.variable value with in a nested function (which is a variable) and it did not work.</li>
                                    </ol>
                                 </li>
                                 <li>Array
                                    <ol>
                                       <li><a href="learningjavascript/my.test.code/array/array.html">Array.html</a></li>
                                       <li>Array has more functions and add the cl_array.lib.js file. </li>
                                    </ol>
                                 </li>
                                 <li>this
                                    <ol>
                                       <li><a href="learningjavascript/my.test.code/this/this.html">this.html - What is this </a></li>
                                    </ol>
                                 </li>
                                 <li>Regular Expression
                                    <ol>
                                       <li>My regular expression test <a href="learningjavascript/my.test.code/regularexpression/regexp.php">regexp.php</a> and a<a href="learningjavascript/my.test.code/regularexpression/regexp.html"> good reference </a></li>
                                       <li>Developing regular expression functions <a href="learningjavascript/my.test.code/regularexpression/regexfns.js">regexfn.js</a> and its unit test page <a href="learningjavascript/my.test.code/regularexpression/regexfnstest.html">regexfntest.html</a> </li>
                                    </ol>
                                 </li>
                                 <li>string</li>
                                 <li>math
                                    <ol>
                                       <li><a href="learningjavascript/my.test.code/math/math.random.html">random</a></li>
                                    </ol>
                                 </li>
                                 <li>Object
                                    <ol>
                                       <li>Case1: obj1 = obj2; what obj1 is?</li>
                                       <li>Case2:  function ( obj ) {};  - is the 'obj' variable same as the original? </li>
                                    </ol>
                                 </li>
                                 <li>What is true in javascript Case &quot;if ( variable || variable2 )&quot; </li>
                              </ol>
                              <p>Development Resources </p>
                              <ul>
                                 <li>APIs</li>
                                 <li>jsUnit local <a href="jsunit/docs/index.html">Doc</a>, <a href="jsunit/samples/AllTests.html">Sample</a>, <a href="jsunit/samples/ArrayTest.html">My Array Test is here</a> (downloaded from <a href="http://jsunit.berlios.de/">http://jsunit.berlios.de/ </a>)</li>
                              </ul>
                              <p>&nbsp;</p>
                           </dl>
                        </div>
                     </div>
                     <!-- <div class="subtopic"> -->
                  </div>
                  <!-- End of <div id="main-content"> -->
               </div>
               <!-- End main-content-wrap -->
            </td>
         </tr>
         <tr>
            <td id="td-sidebar-index-wrap" valign="top">&nbsp;</td>
            <td valign="top">&nbsp;</td>
         </tr>
      </table>
   </div>
   <!-- End content-wrap -->
   <hr />
   <div>
      <div align="center"><a href="http://www.lee-create.com">Lee-Create Home</a> | <a href="http://build.lee-create.com">Build Web</a> | <a href="http://home.lee-create.com">Lee-Home</a> | <a href="http://localhost/drupal6t/">Local Drupal Test on Dady</a> </div>
   </div>
  <div id="devnote-wrap">
    <!-- ======================================== -->
    <div id="devnote-tab">
      <ul class="tabs-nav">
        <li><a href="#fragment-25"><span>Links</span></a></li>
        <li><a href="#fragment-26"><span>Note</span></a></li>
        <li><a href="#fragment-27"><span>TODOs</span></a></li>
      </ul>
      <div id="fragment-25" class="foot-note">
	  <?php include "links.php"; ?>
      </div>
      <div id="fragment-26" class="foot-note">
	  <?php include "devnote.php"; ?>
      </div>
      <div id="fragment-27" class="foot-note">
	  <?php include "todo.php"; ?>
	  </div>
    </div>
    <!-- <div id="devnote-tab"> -->
  </div>
  <!-- <div id="devnote-wrap"> -->
  </div>
<!-- End page-wrap -->
<!-- ================================== -->
<!-- <script src="http://code.jquery.com/jquery-latest.js"></script> -->
<script src="/scripts/jquery.js" type="text/javascript"></script>
<script src="/assets/ui/ui.core.js" type="text/javascript"></script>
<script src="/assets/ui/ui.tabs.js" type="text/javascript"></script>
<script type="text/javascript">

$(function() {

   $('#devnote-tab > ul').tabs();

});
</script>
<script src="/assets/jquery.block_collapse.js" type="text/javascript"></script>
<script src="/scripts/webskills/basic.js" type="text/javascript"></script>
</body>
</html>
