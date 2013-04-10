<?php
/*
file: entry.php
author: Vlad Mesco
date: 10/04/2013 19:25
description: template for a task entry in the calendar
*/
$id = $_GET["id"];
$eid = $_GET["eid"];
$cid = $id.":".$eid;
header('Content-Type: text/html');
echo <<<EOT
<tr><td class="calendar_appointmentContainer">
    <input type="button" value="x" />
    <input type="checkbox" id="enableExpires_$cid" onchange="calendar_enableExpires('$cid')" title="enable expiration date" />
    <input type="date" title="expiration date" id="expires_$cid" disabled />
    <textarea class="calendar_appointmentTextArea" rows="2" cols="30" maxlength="80" id="textarea_$cid"></textarea>
</td></tr>
EOT;
?>