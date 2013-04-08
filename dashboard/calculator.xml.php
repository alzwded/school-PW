<?php
/*
file: calculator.xml.php
author: Vlad Mesco
date: 08/04/2013 18:30
description: calculator widget definition
*/
header('Content-Type: text/xml');
$id = $_GET["id"];
echo <<<EOT
<?xml version="1.0" encoding="UTF-8" ?>
<app>
	<css>calc/style.css</css>
	<script>
		<path>calc/logic.js</path>
		<onload>reset('$id')</onload>
		<unload>clean('$id')</unload>
	</script>
	<content>calc/ui.php?id=$id</content>
</app>
EOT;
?>
