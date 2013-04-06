// file: logic.js
// author: Vlad Mesco
// date: 05/04/2013 15:05
// description: calculator functions

var lastResult = "0" 
var lastOp = null
var clearOnNextInput = true
var haveComma = false
var mem = null

function reset() {
	lastResult = "0"
	lastOp = null
	clearOnNextInput = true
	haveComma = false
	mem = null
	document.getElementById('number_field').value = '0'
	document.getElementById('M_span').innerHTML = ''
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

function executeOp(what) {
	var t = document.getElementById('number_field')
	var cur = t.value

	var left = new Number(lastResult)
	var right = new Number(cur)

	switch(what) {
		case '+':
			t.value = left + right
			break
		case '-':
			t.value = left - right
			break
		case '/':
			t.value = left / right
			break
		case '*':
			t.value = left * right
			break
	}
}

function equals() {
	if(lastOp != null) {
		executeOp(lastOp)
	}
	clearOnNextInput = true
	haveComma = false
}

function doMath(what) {
	equals()
	lastOp = what
	lastResult = document.getElementById('number_field').value
	clearOnNextInput = true
}

function do_sqrt() {
	lastOp = null
	var t = document.getElementById('number_field')
	clearOnNextInput = true
	lastResult = Math.sqrt(t.value)
	t.value = lastResult
}

function sign() {
	var t = document.getElementById('number_field')
	var val = new Number(t.value)
	t.value = -val
}

function clearEverything() {
	var oldMem = mem
	reset()
	mem = oldMem
	if(mem != null) {
		document.getElementById('M_span').innerHTML = 'M'
	}
}

function clear() {
	clearOnNextInput = true
	haveComma = false
	document.getElementById('number_field').value = '0'
}

function memStore() {
	mem = new Number(document.getElementById('number_field').value)
	document.getElementById('M_span').innerHTML = 'M'
	clearOnNextInput = true
}

function memRecall() {
	if(mem != null) {
		document.getElementById('number_field').value = mem
		clearOnNextInput = false
	}
}

function memClear() {
	mem = null
	document.getElementById('M_span').innerHTML = ''
}

function memAdd() {
	if(mem == null) {
		memStore()
	} else {
		mem += new Number(document.getElementById('number_field').value)
	}
}

function percent() {
	if(lastResult != null) {
		var t = document.getElementById('number_field')
		var left = new Number(t.value)
		var right = new Number(lastResult)
		t.value = left * right / 100.0
	}
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
		case '+':
		case '/':
		case '*':
			doMath(what)
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
		case '+/-':
			sign()
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
