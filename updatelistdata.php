<?php
include('config.php');

if(isset($_GET['id']) && isset($_GET['data'])){

$id = $_GET['id'];
$data = $_GET['data'];

$sql = "UPDATE USERS SET data='" . $data . "' WHERE id='". $id . "'";

if (mysqli_query($link, $sql)){
	echo "success";
} else {
	echo "error";
}
}

mysqli_close($link);
?>