// file: logic.js
// author: Vlad Mesco
// date: 05/04/2013 15:05
// description: style sheet for calculator

var lastResult = null 
var lastOp = null
var clearOnNextInput = true
var haveComma = false
var haveMem = false

function reset() {
	lastResult = null
	lastOp = null
	clearOnNextInput = true
	haveComma = false
	haveMem = false
	document.getElementById('number_field').value = '0'
	document.getElementById('M_span').innertHTML = ''
}

function inputInTextField(what) {
	var t = document.getElementById('number_field')
	if(clearOnNextInput) {
		t.value = what
		haveComma = false
		clearOnNextInput = false
	} else {
		t.value += "" + what
	}
}

function inv() {
	var t = document.getElementById('number_field')
	t.value = 1.0 / t.value
	clearOnNextInput = true
	lastResult = t.value
}

function comma() {
	var t = document.getElementById('number_field')
	if(!haveComma) {
		t.value += "" + "."
		haveComma = true
		clearOnNextInput = false
	}
}

function bs() {
	var t = document.getElementById('number_field')
	if(clearOnNextInput || t.value.length == 1) {
		t.value = '0'
		clearOnNextInput = true
	} else if(t.value != '0') {
		if(t.value.substr(t.value.length - 1, 1) == '.') {
			haveComma = false
		}
		t.value = t.value.substr(0, t.value.length - 1)
	}
}

function equals() {
	if(lastOp != null) {
		executeOp(lastOp)
	}
	lastResult = null
	lastOp = null
	clearOnNextInput = true
	haveComma = false
}

function minus() {
	lastOp = '-'
	lastResult = document.getElementById('number_field').value
	clearOnNextInput = true
}

function press(what) {
	switch(what) {
		case '0':
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			inputInTextField(what)
			break
		case '1/x':
			inv()
			break
		case '.':
			comma()
			break
		case '=':
			equals()
			break
		case '-':
			minus()
			break
		case '+':
			plus()
			break
		case '/':
			div()
			break
		case '*':
			mul()
			break
		case 'sqrt':	
			do_sqrt()
			break
		case 'bs':
			bs()
			break
		case 'ce':
			clearEverything()
			break
		case 'c':
			clear()
			break
		case 'mc':
			memClear()
			break
		case 'mr':
			memRecall()
			break
		case 'ms':
			memStore()
			break
		case 'm+':
			memAdd()
			break
		case '%':
			percent()
			break
	}
}

function keyHandler(e) {
	switch(e.keyCode) {
		case '0'.charCodeAt(0):
		case '1'.charCodeAt(0):
		case '2'.charCodeAt(0):
		case '3'.charCodeAt(0):
		case '4'.charCodeAt(0):
		case '5'.charCodeAt(0):
		case '6'.charCodeAt(0):
		case '7'.charCodeAt(0):
		case '8'.charCodeAt(0):
		case '9'.charCodeAt(0):
		case '+'.charCodeAt(0):
		case '-'.charCodeAt(0):
		case '='.charCodeAt(0):
		case '/'.charCodeAt(0):
		case '*'.charCodeAt(0):
		case '.'.charCodeAt(0):
		case '%'.charCodeAt(0):
			press(String.fromCharCode(e.keyCode))
			break
		case '_'.charCodeAt(0):
			press('+/-')
			break
		case 's'.charCodeAt(0):
			press('sqrt')
			break
	}
}

window.onkeypress = keyHandler;
