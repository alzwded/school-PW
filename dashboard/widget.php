<?php
$myId = $_GET["id"];
$myTitle = $_GET["title"];
echo '<span class="title" name="'.$myId.'" id="'.$myId.'_titleBar" onclick="raiseMeCb(event) ; move(event)"> <span class="closeButton" name="'.$myId.'"onclick="closeWindow(event)">-</span>'.$myTitle.'</span> <span name="'.$myId.'" id="'.$myId.'_content" />';
?>
