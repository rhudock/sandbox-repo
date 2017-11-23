<?php
foreach ($_POST as $key => $value) {
 echo "Field ".$key." is ".$value."<br>";
}

	$firstname = $_POST['firstname'];
	$lastname = $_POST['lastname'];

	$stringData =  $firstname ." - ". $lastname ."\n";
	echo $firstname ." - ". $lastname ."<br />";

	$myFile = "testFile.txt";
    $fh = fopen($myFile, 'a') or die("can't open file");
    fwrite($fh, $stringData);
    fclose($fh);
?>