<?php
/*
file: ui.php
author: Vlad Mesco
date: Tue Apr  9 20:43:10 EEST 2013
description: calendar ui
*/
header('Content-Type: text/html');
$id = $_GET["id"];
echo <<<EOT
<table class="calendar_table">
    <tr><td style="display:block;">
        <span style="display:block; float:left;">
            <span class="calendar_button" onclick="prevMonth($id)">&lt;</span>
            <span id="month_$id"></span>
            <span class="calendar_button" onclick="nextMonth($id)">&gt;</span>
        </span>
        <span style="display:block; float:right;">
            <span class="calendar_button" onclick="prevYear($id)">&lt;</span>
            <span id="year_$id"></span>
            <span class="calendar_button" onclick="nextYear($id)">&gt;</span>
        </span>
    </td></tr>
    <tr><td>
    </td></tr>
</table>
EOT;
?>
