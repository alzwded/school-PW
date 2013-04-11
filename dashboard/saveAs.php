<?php
/*
file: saveAs.php
author: Vlad Mesco
date: Thu Apr 11 22:10:03 EEST 2013
description: puke back data as a file which hopefully shows the save as dialog
*/
$data = $_POST["data"];
header("Content-Type: application/x-save-me-as");
print($data);
?>
