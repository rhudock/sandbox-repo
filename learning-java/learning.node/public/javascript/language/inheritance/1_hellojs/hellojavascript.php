

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
      <h3>Javascript Hello World </h3>
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
              <h3>Javascript Hello World </h3>
            </div>
            <div id="main-content">
              <div class="subtopic">
                <div class="title collapsable">
                  <!-- Title comes here -->
                  Hello World</div>
                <div class="content">
                  <!-- contents comes here -->
                  <dl class="Cl-101">

<!-- contents comes here -->
<p>Hello world sample
<div id="j_test" class="code_result">
<script type="text/javascript">
document.write('<h3>Hello World by Javascript</h3>');

      var x = document.getElementById('j_test');
          x['onclick'] = function () {
          alert('You clicked on element with the id of j_test');
      }
</script>
</div>
</p>

  <p>The Javascript code with jQuery library make that happen.
  <pre><code class="mix">
&lt;script type=&quot;text/javascript&quot;&gt;<br />	document.write('&lt;h3&gt;Hello World by Javascript&lt;/h3&gt;');<br />&lt;/script&gt;
  </code></pre>
  </p>

  <p>When you click on the div box contains 'hello world' sentence, a message pops up. An Unobtrusive JavaScript code is behind the event.
  <pre><code class="mix">
&lt;script type=&quot;text/javascript&quot;&gt;
	var x = document.getElementById('j_test');
	x.onclick = function () {
		alert('You clicked on element with the id of j_test');
	}
&lt;/script&gt;
  </code></pre>
  </p>

  <p>And the dot notation can be rewriten with square bracket notation
  <pre><code class="mix">
&lt;script type=&quot;text/javascript&quot;&gt;
	var x = document.getElementById('j_test');
	x['onclick'] = function () {
		alert('You clicked on element with the id of j_test');
	}
&lt;/script&gt;
</code></pre>
  </p>
 <!-- <div class="block_wrapper"> -->



<div class="block_wrapper">
<div class="block_title c_title">
<!-- Title comes here -->
Templates

</div>
<div class="block_content">

<!-- contents comes here -->
<p>You can include external javascript file by using
<pre><code class="mix">
&lt;script src=&quot;http://code.jquery.com/jquery-latest.js&quot;&gt;&lt;/script&gt;
  </code></pre>
</p>

<p>Or a Web page can have something like below in the page.
<pre><code class="mix">
&lt;script type=&quot;text/javascript&quot;&gt;<br />	document.write('&lt;h3&gt;Hello World by Javascript&lt;/h3&gt;');<br />&lt;/script&gt;</code></pre>
</div>
</div> <!-- <div class="block_wrapper"> -->

<div class="block_wrapper">
<div class="block_title c_title">
<!-- Title comes here -->
Where to get study meterials.

</div>
<div class="block_content">

<!-- contents comes here -->
<p><a href="links.html">JavaScript Links </a></p>
<ul>
  <li>JavaScript Essencial ( Official Links, Sample Study Codes from books, My Test Codes )</li>
  <ul>
    <li><a href="https://developer.mozilla.org/en/JavaScript">Mozilla &lt;developer center&gt;</a>
        <ul>
          <li><a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference">Core JavaScript Reference</a></li>
          <li><a rel="internal" href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide">Core JavaScript Guide</a></li>
          <li><a rel="internal" href="https://developer.mozilla.org/en/JavaScript_Language_Resources">JavaScript Language Resources</a></li>
        </ul>
    </li>
    <li><a href="reserved_words.html">Reserved Words</a></li>
  </ul>
  <li>Web Tutorials
    <ul>
        <li><a href="http://www.w3schools.com/">http://www.w3schools.com/</a></li>
    </ul>
  </li>
  <li>Samples
    <ul>
      <li><a href="http://www.smashingmagazine.com/2007/05/30/tables-and-data-grids-with-ajax-dhtml-javascript/">http://www.smashingmagazine.com/2007/05/30/tables-and-data-grids-with-ajax-dhtml-javascript/</a></li>
    </ul>
  </li>
  <li>Libraries, Plug-Ins</li>
  <li>FrameWorks
    <ul>
        <li><a href="http://cappuccino.org/"> http://cappuccino.org/</a></li>
        </ul>
  </li>
  <li><a href="links.html"></a></li>
</ul>
</div>
</div> <!-- <div class="block_wrapper"> -->

              
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

  <div id="devnote-wrap">
    <!-- ======================================== -->
    <div id="devnote-tab">
      <ul class="tabs-nav">
        <li><a href="#fragment-25"><span>Links</span></a></li>
        <li><a href="#fragment-26"><span>Note</span></a></li>
        <li><a href="#fragment-27"><span>TODOs</span></a></li>
      </ul>
      <div id="fragment-25" class="foot-note">
	  <?php include "../links.php"; ?>
      </div>
      <div id="fragment-26" class="foot-note">
	  <?php include "../devnote.php"; ?>
      </div>
      <div id="fragment-27" class="foot-note">
	  <?php include "../todo.php"; ?>
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
