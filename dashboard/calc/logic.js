// file: logic.js
// author: Vlad Mesco
// date: 08/04/2013 18:32
// description: calculator functions

var ctx = new Object()

function newContext() {
	var ret = new Object()
	ret.lastResult = "0"
	ret.lastOp = null
	ret.clearOnNextInput = true
	ret.haveComma = false
	ret.mem = null
	return ret
}

function clean(id) {
	delete ctx[id]
}

function reset(id) {
	ctx[id] = newContext()
	document.getElementById('number_field_' + id).value = '0'
	document.getElementById('M_span_' + id).innerHTML = ''
}

function inputInTextField(id, what) {
	var t = document.getElementById('number_field_' + id)
	if(ctx[id].clearOnNextInput) {
		t.value = what
		ctx[id].haveComma = false
		ctx[id].clearOnNextInput = false
	} else {
		t.value += "" + what
	}
}

function inv(id) {
	var t = document.getElementById('number_field_' + id)
	t.value = 1.0 / t.value
	ctx[id].clearOnNextInput = true
	ctx[id].lastResult = t.value
}

function comma(id) {
	var t = document.getElementById('number_field_' + id)
	if(!ctx[id].haveComma) {
		t.value += "" + "."
		ctx[id].haveComma = true
		ctx[id].clearOnNextInput = false
	}
}

function bs(id) {
	var t = document.getElementById('number_field_' + id)
	if(ctx[id].clearOnNextInput || t.value.length == 1) {
		t.value = '0'
		ctx[id].clearOnNextInput = true
	} else if(t.value != '0') {
		if(t.value.substr(t.value.length - 1, 1) == '.') {
			ctx[id].haveComma = false
		}
		t.value = t.value.substr(0, t.value.length - 1)
	}
}

function executeOp(id, what) {
	var t = document.getElementById('number_field_' + id)
	var cur = t.value

	var left = new Number(ctx[id].lastResult)
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

function equals(id) {
	if(ctx[id].lastOp != null) {
		executeOp(id, ctx[id].lastOp)
	}
	ctx[id].clearOnNextInput = true
	ctx[id].haveComma = false
}

function doMath(id, what) {
	ctx[id].lastOp = what
	ctx[id].lastResult = document.getElementById('number_field_' + id).value
	ctx[id].clearOnNextInput = true
}

function do_sqrt(id) {
	ctx[id].lastOp = null
	var t = document.getElementById('number_field_' + id)
	ctx[id].clearOnNextInput = true
	ctx[id].lastResult = Math.sqrt(t.value)
	t.value = ctx[id].lastResult
}

function sign(id) {
	var t = document.getElementById('number_field_' + id)
	var val = new Number(t.value)
	t.value = -val
}

function clearEverything(id) {
	var oldMem = ctx[id].mem
	reset(id)
	ctx[id].mem = oldMem
	if(ctx[id].mem != null) {
		document.getElementById('M_span_' + id).innerHTML = 'M'
	}
}

function clear(id) {
	ctx[id].clearOnNextInput = true
	ctx[id].haveComma = false
	document.getElementById('number_field_' + id).value = '0'
}

function memStore(id) {
	ctx[id].mem = new Number(document.getElementById('number_field_' + id).value)
	document.getElementById('M_span_' + id).innerHTML = 'M'
	ctx[id].clearOnNextInput = true
}

function memRecall(id) {
	if(ctx[id].mem != null) {
		document.getElementById('number_field_' + id).value = ctx[id].mem
		ctx[id].clearOnNextInput = true
	}
}

function memClear(id) {
	ctx[id].mem = null
	document.getElementById('M_span_' + id).innerHTML = ''
}

function memAdd(id) {
	if(ctx[id].mem == null) {
		memStore(id)
	} else {
		ctx[id].mem += new Number(document.getElementById('number_field_' + id).value)
		ctx[id].clearOnNextInput = true
	}
}

function percent(id) {
	if(ctx[id].lastResult != null) {
		var t = document.getElementById('number_field_' + id)
		var left = new Number(t.value)
		var right = new Number(ctx[id].lastResult)
		t.value = left * right / 100.0
	}
}

function press(id, what) {
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
			inputInTextField(id, what)
			break
		case '1/x':
			inv(id)
			break
		case '.':
			comma(id)
			break
		case '=':
			equals(id)
			break
		case '-':
		case '+':
		case '/':
		case '*':
			doMath(id, what)
			break
		case 'sqrt':	
			do_sqrt(id)
			break
		case 'bs':
			bs(id)
			break
		case 'ce':
			clearEverything(id)
			break
		case 'c':
			clear(id)
			break
		case 'mc':
			memClear(id)
			break
		case 'mr':
			memRecall(id)
			break
		case 'ms':
			memStore(id)
			break
		case 'm+':
			memAdd(id)
			break
		case '%':
			percent(id)
			break
		case '+/-':
			sign(id)
			break
	}
}
