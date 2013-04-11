// file: pim.js
// author: Vlad Mesco
// date: 09/04/2013 17:48
// description: pim model stuff

var pim_data = new Array()
var pim_uniqueId = 0

var pim_byDateCache = {}
var pim_callbacks = new Array()
var pim_cacheValid = false

function serialize() {
	var ret = new String()
	for(var i = 0 ; i < pim_data.length ; ++i) {
		var s = new String()
		var element = pim_data[i]
		s += element.id + '%|'
		s += element.date.toUTCString() + '%|'
		s += element.text.replace('%', '%%') + '%|'
		if(element.expires != null) {
			s += element.expires
		}
		s += '%\\'
        ret += s
	}
    return escape(s)
}

function deserialize(str) {
	pim_data = new Array()
	var a = unescape(str).split('%\\')
	for(var i = 0 ; i < a.length ; ++i) {
		var fields = a[i].split('%|')
		var expires = null
		if(fields[3] != null) {
			expires = new Date(Date.parse(fields[3]))
		}
		var entry = new_pimEntryWithId(fields[0], new Date(Date.parse(fields[1])), unescape(fields[2]).replace('%%', '%'), expires)
		pim_data.push(entry)
	}
}

function pim_save() {
	debug_writeln('pim_save not implemented')
}

function pim_load() {
	debug_writeln('pim_load not implemented')
}

function pim_toCookie() {
	var theDate = new Date()
	var oneYearLater = new Date(theDate.getTime() + 31536000000)
	document.cookie = "pim_uniqueId=" + pim_uniqueId + ";expires=" + oneYearLater.toUTCString()
	document.cookie = "pim_data=" + serialize() + ";expires=" + oneYearLater.toUTCString()
}

function pim_fromCookie() {
	var s = document.cookie
	var cookies = s.split('; ')
	for(var i = 0 ; i < cookies.length ; ++i) {
		var fields = cookies[i].split('=')
		if(fields[0] == 'pim_uniqueId') {
			if(fields[1] != null) {
				pim_uniqueId = new Number(fields[1])
			}
		} else if(fields[0] == 'pim_data') {
			if(fields[1] != null) {
				/*pim_data = */
				deserialize(fields[1])
			}
		}
	}
}

function pim_getDateId(date) {
	if(!(date instanceof Date)) {
		throw new Error('not a date')
	}
	var year = new String(date.getFullYear())
	var month = new String(date.getMonth())
	var day = new String(date.getDate())
	if(month.length != 2) {
		month = "0" + month
	}
	if(day.length != 2) {
		day = "0" + day
	}
	return year + month + day
}

function pim_rebuildDateCache() {
	pim_byDateCache = {}
	for(var i = 0 ; i < pim_data.length ; ++i) {
		var dateId = pim_getDateId(pim_data[i].date)
		if(pim_byDateCache[dateId] == null) {
			pim_byDateCache[dateId] = new Array()
		}
		pim_byDateCache[dateId].push(pim_data[i])
	}
}

function new_pimEntryWithId(id, date, text, expires) {
	var iid = new Number(id)

	var ret = new Object()
	ret.id = "" + id
	if(!(date instanceof Date)) {
		throw new Error('Invalid Argument Type')
	}
	ret.date = date
	if(!(text instanceof String || typeof(text) == 'string')) {
		throw new Error('Invalid Argument Type')
	}
	ret.text = text
	if(expires != null && (!(expires instanceof Date) || expires < date)) {
		throw new Error('Invalid Argument Type')
	}
	ret.expires = expires

	ret.setDate = function(d) {
		if(!(d instanceof Date)) {
			throw new Error('Invalid Argument Type')
		}
		this.date = d
		pim_fireChanged()
	}
	ret.setText = function(x) {
		if(!(x instanceof String || typeof(x) == 'string')) {
			throw new Error('Invalid Argument Type')
		}
		this.text = x
		pim_fireChanged()
	}
	ret.setExpires = function(d) {
		if(d != null && (!(d instanceof Date) || d < this.date)) {
			throw new Error('Invalid Argument Type')
		}
		this.expires = d
		pim_fireChanged()
	}

	return ret
}

function new_pimEntry(date, text, expires) {
	var ret = new_pimEntryWithId(pim_uniqueId++, date, text, expires)
	return ret
}

/* returns: id */
function pim_add(date, text, expires) {
	var e = new_pimEntry(date, text, expires)
	pim_data.push(e)
	pim_fireChanged()
	return e
}

function pim_getEntriesForDate(date) {
	if(!pim_cacheValid) {
		pim_rebuildDateCache()
	}
	return pim_byDateCache[pim_getDateId(date)]
}

function pim_delete(id) {
	for(var i = 0 ; i < pim_data.length ; ++i) {
		if(pim_data[i].id == id) {
			pim_data.splice(i, 1)
			pim_fireChanged()
			break
		}
	}
}

function pim_fireChanged() {
	pim_cacheValid = false
	for(var i = 0 ; i < pim_callbacks.length ; ++i) {
		pim_callbacks[i]()
	}
	pim_toCookie()
}

function pim_registerChangeCallback(f) {
	pim_callbacks.push(f)
}

function pim_unregisterChangeCallback(f) {
	for(var i = 0 ; i < pim_callbacks.length ; ++i) {
		if(pim_callbacks[i] == f) {
			pim_callbacks.splice(i, 1)
		}
	}
}

pim_fromCookie()
