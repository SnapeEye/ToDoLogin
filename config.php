<?php
// Connection's Parameters
$db_host="localhost";
$db_name="todoregbase";
$username="root";
$password="";
$link=mysqli_connect($db_host,$username,$password,$db_name) or die ("cannot connect");

if (!$link) {
    die("ERROR: ".mysqli_error($link));
}
?>