<?php
/*
file: load.php
author: Vlad Mesco
date: Thu Apr 11 22:10:03 EEST 2013
description: puke back a file read locally
*/
echo file_get_contents($_FILES["file_data"]["tmp_name"]);
?>
