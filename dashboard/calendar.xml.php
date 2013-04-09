<?php
/*
file: calendar.xml.php
author: Vlad Mesco
date: 09/04/2013 18:59
description: calendar widget definition
*/
header('Content-Type: text/xml');
$id = $_GET["id"];
echo <<<EOT
<?xml version="1.0" encoding="UTF-8" ?>
<app>
	<css>cal/style.css</css>
	<script>
		<path>cal/logic.js</path>
		<onload>calendar_reset('$id')</onload>
		<unload>calendar_clean('$id')</unload>
	</script>
	<content>cal/ui.php?id=$id</content>
</app>
EOT;
?>
