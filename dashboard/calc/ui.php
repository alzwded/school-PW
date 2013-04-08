<?php
/*
file: ui.php
author: Vlad Mesco
date: 08/04/2013 18:32
description: calculator widget UI
*/
header('Content-Type: text/html');
$id = $_GET["id"];
echo <<<EOT
<table id="frame_$id" class="frame">
	<tr>
		<td colspan="2" style="padding:10px;">
			<input class="number_field" type="text" id="number_field_$id" readonly="readonly" title="Your number"/>
		</td>
	</tr>
	<tr>
		<td><table>
			<tr><td><span class="M_span" id="M_span_$id" />
			<tr><td><input type="button" class="memoryButton" value="MC" onclick="press('$id', 'mc')" title="Memory Clear"/>
			<tr><td><input type="button" class="memoryButton" value="MR" onclick="press('$id', 'mr')" title="Memory Recall"/>
			<tr><td><input type="button" class="memoryButton" value="MS" onclick="press('$id', 'ms')" title="Memory Store"/>
			<tr><td><input type="button" class="memoryButton" value="M+" onclick="press('$id', 'm+')" title="Memory Add"/>
		</table></td>
		<td><table><tr><td>
			<input type="button" class="clearButtons" value="Backspace" onclick="press('$id', 'bs')" title="Backspace"/>
			<input type="button" class="clearButtons" value="CE" onclick="press('$id', 'ce')" title="Clear everything"/>
			<input type="button" class="clearButtons" value="C" onclick="press('$id', 'c')" title="Clear"/>
		</td></tr>
		<tr><td>
			<table>
				<tr>
					<td><input type="button" class="regularButton" value="7" onclick="press('$id', '7')" title="7"/></td>
					<td><input type="button" class="regularButton" value="8" onclick="press('$id', '8')" title="8"/></td>
					<td><input type="button" class="regularButton" value="9" onclick="press('$id', '9')" title="9"/></td>
					<td><input type="button" class="memoryButton" value="/" onclick="press('$id', '/')" title="division"/></td>
					<td><input type="button" class="regularButton" value="sqrt" onclick="press('$id', 'sqrt')" title="square root"/></td>
				</tr>
				<tr>
					<td><input type="button" class="regularButton" value="4" onclick="press('$id', '4')" title="4"/></td>
					<td><input type="button" class="regularButton" value="5" onclick="press('$id', '5')" title="5"/></td>
					<td><input type="button" class="regularButton" value="6" onclick="press('$id', '6')" title="6"/></td>
					<td><input type="button" class="memoryButton" value="*" onclick="press('$id', '*')" title="multiply"/></td>
					<td><input type="button" class="regularButton" value="%" onclick="press('$id', '%')" title="percentage"/></td>
				</tr>
				<tr>
					<td><input type="button" class="regularButton" value="1" onclick="press('$id', '1')" title="1"/></td>
					<td><input type="button" class="regularButton" value="2" onclick="press('$id', '2')" title="2"/></td>
					<td><input type="button" class="regularButton" value="3" onclick="press('$id', '3')" title="3"/></td>
					<td><input type="button" class="memoryButton" value="-" onclick="press('$id', '-')" title="minus"/></td>
					<td><input type="button" class="regularButton" value="1/x" onclick="press('$id', '1/x')" title="invert"/></td>
				</tr>
				<tr>
					<td><input type="button" class="regularButton" value="0" onclick="press('$id', '0')" title="0"/></td>
					<td><input type="button" class="regularButton" value="+/-" onclick="press('$id', '+/-')" title="negate"/></td>
					<td><input type="button" class="regularButton" value="." onclick="press('$id', '.')" title="comma"/></td>
					<td><input type="button" class="memoryButton" value="+" onclick="press('$id', '+')" title="sum"/></td>
					<td><input type="button" class="memoryButton" value="=" onclick="press('$id', '=')" title="compute result"/></td>
				</tr>
			</table>
		</tr></td></table></td>
	</tr>
</table>
<br /><br /><input type="button" value="Panic button" title="Fully reset state" onclick="reset('$id')" />
EOT;
