<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>CSS Note</title>
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
    <?php include "../../../assets/include/shead.php"; ?>
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
            <?php include "../index.php"; ?>
        </td>
        <td valign="top"><div id="main-content-wrap">
          <div class="title">
            <h3>Reserved Words </h3>
          </div>
          <div id="main-content">
          <div class="subtopic">
          <div class="block_wrapper">
            <div class="block_title c_title">The following are reserved words and may not be used as variables,  functions, methods, or object identifiers. The following are reserved  as existing keywords by the <a rel="internal" href="https://developer.mozilla.org/en/ECMAScript">ECMAScript</a> specification: </div>
            <div class="block_content">
              <ul>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/break">break</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/switch">case</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/try...catch">catch</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/continue">continue</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/switch">default</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Operators/Special_Operators/delete_Operator">delete</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/do...while">do</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/if...else">else</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/try...catch">finally</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/for">for</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/function">function</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/if...else">if</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/for...in">in</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Operators/Special_Operators/instanceof_Operator">instanceof</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Operators/Special_Operators/new_Operator">new</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/return">return</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/switch">switch</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Operators/Special_Operators/this_Operator">this</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/throw">throw</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/try...catch">try</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Operators/Special_Operators/typeof_Operator">typeof</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/var">var</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Operators/Special_Operators/void_Operator">void</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/while">while</a> </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/with">with</a> </li>
              </ul>
            </div>
          </div>
          <!-- <div class="block_wrapper"> -->
          <div class="block_wrapper">
            <div class="block_title c_title"> The following are reserved as future keywords by the ECMAScript specification: </div>
            <div class="block_content">
              <ul>
                <li> abstract </li>
                <li> boolean </li>
                <li> byte </li>
                <li> char </li>
                <li> class </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/const">const</a> </li>
                <li> debugger </li>
                <li> double </li>
                <li> enum </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/export">export</a> </li>
                <li> extends </li>
                <li> final </li>
                <li> float </li>
                <li> goto </li>
                <li> implements </li>
                <li> <a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Statements/import">import</a> </li>
                <li> int </li>
                <li> interface </li>
                <li> long </li>
                <li> native </li>
                <li> package </li>
                <li> private </li>
                <li> protected </li>
                <li> public </li>
                <li> short </li>
                <li> static </li>
                <li> super </li>
                <li> synchronized </li>
                <li> throws </li>
                <li> transient </li>
                <li> volatile </li>
              </ul>
            </div>
          </div>
          <!-- End subtopic -->
        </td>
      </tr>
    </table>
  </div>
  <!-- End content-wrap -->
  <hr />
  <div>
    <div align="center"><a href="http://www.lee-create.com">Lee-Create Home</a> | <a href="http://build.lee-create.com">Build Web</a> | <a href="http://home.lee-create.com">Lee-Home</a> | <a href="http://localhost/drupal6t/">Local Drupal Test on Dady</a> </div>
  </div>
  <?php include "../footnote.php"; ?>
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
<script type="text/javascript">
// License Duration Action
$(document).ready(function(){
   $('.collapsable').click
   (
      function() {
         $(this).block_collapse(   {   }   );
      }
   );

   $('#main-content-wrap > .title').click
   (
      function() {
         $('.collapsable').block_collapse(   {   }   );
      }
   );
	 
	 $('.Cl-101 dt').click
   (
      function() {
         $(this).block_collapse(   {   }   );
      }
   );	 
	 
});
</script>
</body>
</html>
