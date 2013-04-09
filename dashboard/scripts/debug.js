// file: debug.js
// author: Vlad Mesco
// date: 09/04/2013 17:23
// description: debug routines

var enableDebugging = false

function loadDebug() {
	if(!enableDebugging) {
		document.getElementById('debug').style.visibility = "hidden"
	} else {
		document.getElementById('debug').style.visibility = "visible"
	}
}

function debugOn() {
	enableDebugging = true
	loadDebug()
}

function debugOff() {
	enableDebugging = false
	loadDebug()
}

function debug_purge() {
	if(!enableDebugging) { return; }
	document.getElementById('debug').innerHTML = ''
}

function debug_write() {
	if(!enableDebugging) { return; }
	for(var i = 0 ; i < arguments.length ; ++i) {
		document.getElementById('debug').innerHTML += arguments[i]
	}
}

function debug_writeln() {
	if(!enableDebugging) { return; }
	for(var i = 0 ; i < arguments.length ; ++i) {
		document.getElementById('debug').innerHTML += arguments[i]
	}
	document.getElementById('debug').innerHTML += "<br/>"
}

function debug_timestamp() {
	if(!enableDebugging) { return; }
	debug_write((new Date()).toUTCString(), ': ')
}

function debug_timestampln() {
	if(!enableDebugging) { return; }
	debug_timestamp()
	debug_writeln
}
