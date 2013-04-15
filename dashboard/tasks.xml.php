<?php
/*
file: tasks.xml.php
author: Vlad Mesco
date: 15/04/2013 16:23
description: calendar widget definition
*/
header('Content-Type: text/xml');
$id = $_GET["id"];
echo <<<EOT
<?xml version="1.0" encoding="UTF-8" ?>
<app>
	<css>cal/style.css</css>
	<css>tasks/style.css</css>
	<script>
		<path>cal/common.js</path>
	</script>
	<script>
		<path>tasks/logic.js</path>
		<onload>tasks_reset('$id')</onload>
		<unload>tasks_clean('$id')</unload>
	</script>
	<content>tasks/ui.php?id=$id</content>
</app>
EOT;
?>
