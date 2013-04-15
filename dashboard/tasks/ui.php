<?php
/*
file: ui.php
author: Vlad Mesco
date: 15/04/2013 16:24
description: ui for task lister
*/
header('Content-Type: text/html');
$id = $_GET["id"];
echo <<<EOT
<table class="tasks_table"><tr><td>
	<div id="appointments_$id" class="tasks_appointments" />
</td></tr>	
<tr><td>
	<input id="save_$id" type="button" style="display:block; float:right;" onclick="tasks_save(event)" value="Save" />
</td></tr><table>
EOT;
?>
