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
            <span class="calendar_button" onclick="prevMonth(event, $id)">&lt;</span>
            <span id="month_$id"></span>
            <span class="calendar_button" onclick="nextMonth(event, $id)">&gt;</span>
        </span>
        <span style="display:block; float:right;">
            <span class="calendar_button" onclick="prevYear(event, $id)">&lt;</span>
            <span id="year_$id"></span>
            <span class="calendar_button" onclick="nextYear(event, $id)">&gt;</span>
        </span>
    </td></tr>
    <tr><td><table>
        <tr>
            <td class="calendar_headerButton"></td>
            <td class="calendar_headerButton">S</td>
            <td class="calendar_headerButton">M</td>
            <td class="calendar_headerButton">T</td>
            <td class="calendar_headerButton">W</td>
            <td class="calendar_headerButton">T</td>
            <td class="calendar_headerButton">F</td>
            <td class="calendar_headerButton">S</td>
        </tr>
        <tr>
            <td class="calendar_headerButton" id="week0_$id"></td>
            <td class="calendar_otherMonthButton" id="w0d0_$id"></td>
            <td class="calendar_otherMonthButton" id="w0d1_$id"></td>
            <td class="calendar_otherMonthButton" id="w0d2_$id"></td>
            <td class="calendar_otherMonthButton" id="w0d3_$id"></td>
            <td class="calendar_otherMonthButton" id="w0d4_$id"></td>
            <td class="calendar_otherMonthButton" id="w0d5_$id"></td>
            <td class="calendar_thisMonthButton" id="w0d6_$id"></td>
        </tr>
        <tr>
            <td class="calendar_headerButton" id="week1_$id"></td>
            <td class="calendar_otherMonthButton" id="w1d0_$id"></td>
            <td class="calendar_otherMonthButton" id="w1d1_$id"></td>
            <td class="calendar_otherMonthButton" id="w1d2_$id"></td>
            <td class="calendar_otherMonthButton" id="w1d3_$id"></td>
            <td class="calendar_otherMonthButton" id="w1d4_$id"></td>
            <td class="calendar_otherMonthButton" id="w1d5_$id"></td>
            <td class="calendar_otherMonthButton" id="w1d6_$id"></td>
        </tr>
        <tr>
            <td class="calendar_headerButton" id="week2_$id"></td>
            <td class="calendar_otherMonthButton" id="w2d0_$id"></td>
            <td class="calendar_otherMonthButton" id="w2d1_$id"></td>
            <td class="calendar_otherMonthButton" id="w2d2_$id"></td>
            <td class="calendar_otherMonthButton" id="w2d3_$id"></td>
            <td class="calendar_otherMonthButton" id="w2d4_$id"></td>
            <td class="calendar_otherMonthButton" id="w2d5_$id"></td>
            <td class="calendar_otherMonthButton" id="w2d6_$id"></td>
        </tr>
        <tr>
            <td class="calendar_headerButton" id="week3_$id"></td>
            <td class="calendar_otherMonthButton" id="w3d0_$id"></td>
            <td class="calendar_otherMonthButton" id="w3d1_$id"></td>
            <td class="calendar_otherMonthButton" id="w3d2_$id"></td>
            <td class="calendar_otherMonthButton" id="w3d3_$id"></td>
            <td class="calendar_otherMonthButton" id="w3d4_$id"></td>
            <td class="calendar_otherMonthButton" id="w3d5_$id"></td>
            <td class="calendar_otherMonthButton" id="w3d6_$id"></td>
        </tr>
        <tr>
            <td class="calendar_headerButton" id="week4_$id"></td>
            <td class="calendar_otherMonthButton" id="w4d0_$id"></td>
            <td class="calendar_otherMonthButton" id="w4d1_$id"></td>
            <td class="calendar_otherMonthButton" id="w4d2_$id"></td>
            <td class="calendar_otherMonthButton" id="w4d3_$id"></td>
            <td class="calendar_otherMonthButton" id="w4d4_$id"></td>
            <td class="calendar_otherMonthButton" id="w4d5_$id"></td>
            <td class="calendar_otherMonthButton" id="w4d6_$id"></td>
        </tr>
        <tr>
            <td class="calendar_headerButton" id="week5_$id"></td>
            <td class="calendar_otherMonthButton" id="w5d0_$id"></td>
            <td class="calendar_otherMonthButton" id="w5d1_$id"></td>
            <td class="calendar_otherMonthButton" id="w5d2_$id"></td>
            <td class="calendar_otherMonthButton" id="w5d3_$id"></td>
            <td class="calendar_otherMonthButton" id="w5d4_$id"></td>
            <td class="calendar_otherMonthButton" id="w5d5_$id"></td>
            <td class="calendar_otherMonthButton" id="w5d6_$id"></td>
        </tr>
    </table></td></tr>
</table>
EOT;
?>
