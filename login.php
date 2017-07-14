<?php
include('config.php');

// Verify if user exists for login
if(isset($_GET['email']) && isset($_GET['psw'])){

$email = $_GET['email'];
$psw = $_GET['psw'];

$sql = "SELECT * FROM USERS WHERE email='". $email . "' AND password = '" . $psw . "'" or die ("ERROR: ".mysqli_error());
$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
$getUser_result =  mysqli_fetch_assoc($result);
$getUser_RecordCount = mysqli_num_rows($result);

if($getUser_RecordCount < 1){
	echo '0';
} else {
	$id = $getUser_result['id'];
	$fname = $getUser_result['fname'];
	$lname = $getUser_result['lname'];
    $obj = (object) [ "id" => $id, "fname" => $fname, "lname" => $lname ];
    $jsonObj = json_encode($obj, JSON_FORCE_OBJECT);
	echo $jsonObj;
}
}

mysqli_close($link);
?>