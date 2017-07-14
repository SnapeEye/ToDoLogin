<?php
include('config.php');

// Verify if user exists for login
if( isset($_GET['email']) && isset($_GET['psw']) && isset($_GET['fname']) && isset($_GET['lname']) ){

$email = $_GET['email'];
$psw = $_GET['psw'];
$fname = $_GET['fname'];
$lname = $_GET['lname'];

$sql = "SELECT * FROM USERS WHERE email='". $email . "'" or die ("ERROR: ".mysqli_error());
$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
$getUser_RecordCount = mysqli_num_rows($result);

if ($getUser_RecordCount > 0){
	echo 'exists';
} else {
	$count_result = mysqli_query($link,"SELECT COUNT(1) FROM USERS");
	$count = mysqli_fetch_array( $count_result );
	$id = $count[0]; // выведет число строк

	$add_sql = "INSERT INTO USERS (id,email,password,fname,lname) VALUES ('" .$id . "','" . $email . "','" . $psw . "','" . $fname . "','" . $lname . "')" or die ("ERROR: ".mysqli_error());

	$add_result = mysqli_query($link, $add_sql) or die (mysqli_error($link));

	echo 'success';
}
}

mysqli_close($link);
?>