<?php
include('config.php');

// Verify if user exists for login
if(isset($_GET['id'])){

$id = $_GET['id'];

$sql = "SELECT * FROM USERS WHERE id='". $id . "'" or die ("ERROR: ".mysqli_error());
$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
$getUser_result =  mysqli_fetch_assoc($result);
$getUser_RecordCount = mysqli_num_rows($result);

if($getUser_RecordCount < 1){
	echo '0';
} else {
	$data = $getUser_result['data'];
	echo $data;
}
}

mysqli_close($link);
?>