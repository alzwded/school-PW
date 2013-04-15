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
    pim_purge()
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
    return escape(ret)
}

function deserialize(str) {
	pim_data = new Array()
	var a = unescape(str).split('%\\')
	for(var i = 0 ; i < a.length ; ++i) {
                if(a == '') {
                        continue
                }
		var fields = a[i].split('%|')
		var expires = null
		if(fields[3] != null && fields[3] != '') {
			expires = new Date(Date.parse(fields[3]))
		}
		if(!isValidDate(expires)) {
			expires = null
		}
		var entry = new_pimEntryWithId(new Number(fields[0]), new Date(Date.parse(fields[1])), unescape(fields[2]).replace('%%', '%'), expires)
		pim_data.push(entry)
	}
	pim_purge()
        pim_data.sort(pim_comparator)
}

/* taken from http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript */
function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}

function pim_isValid(e) {
	var ret = true
	if(!(e.id instanceof Number)) {
		return false
	}
	if(!(e.date instanceof Date)) {
		return false
	}
	if(!isValidDate(e.date)) {
		return false
	}
	if(!(e.text instanceof String) && typeof(e.text) != "string") {
		return false
	}
	if(e.expires != null) {
		if(!(e.expires instanceof Date) || !isValidDate(e.expires)) {
			return false
		}
	}
	return true
}

// hack function that purges invalid objects because they are annoying
//     and corrupt my (de)serialization
function pim_purge() {
	for(var i = 0 ; i < pim_data.length ;) {
		if(pim_isValid(pim_data[i])) {
			++i
			continue
		} else {
			pim_data.splice(i, 1)
		}
	}
}

function pim_save() {
	var theDate = new Date()
	var data = new String()
	data += "pim_uniqueId=" + pim_uniqueId
	data += "&pim_data=" + serialize()
	document.getElementById('saveAsData').value = data
	document.saveAsForm.submit()
}

function pim_load() {
        var iframe = document.createElement('iframe')
        iframe.setAttribute('id', '__upload_iframe')
        iframe.setAttribute('name', '__upload_iframe')
        iframe.setAttribute('width', '1')
        iframe.setAttribute('height', '1')
        iframe.setAttribute('border', '0')
        iframe.setAttribute('style', 'width: 1px; height: 1px; border: none;')
        document.loadFile.parentNode.appendChild(iframe)
        window.frames['__upload_iframe'].name = '__upload_iframe'
        IFRAMEID = document.getElementById('__upload_iframe')
        var handler = function() {
                IFRAMEID.removeEventListener('load', handler)

                var response = IFRAMEID.contentDocument.body.innerText
                var fields = response.split('&')
                pim_uniqueId = new Number(fields[0].substr(fields[0].search('=') + 1))
                deserialize(fields[1].substr(fields[1].search('=') + 1))

                setTimeout('IFRAMEID.parentElement.removeChild(IFRAMEID)', 250);
                pim_fireChanged()
        }
        IFRAMEID.addEventListener('load', handler)

        var form = document.loadFile
        form.setAttribute('target', '__upload_iframe')
        form.setAttribute('action', 'load.php')
        form.setAttribute('method', 'post')
        form.setAttribute('enctype', 'multipart/form-data')
        form.setAttribute('encoding', 'multipart/form-data')
        form.submit()
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
	if(!(id instanceof Number)) {
		throw new Error('Invalid Argument Type')
	}
	ret.id = id
	if(!(date instanceof Date)) {
		throw new Error('Invalid Argument Type')
	}
	ret.date = date
	if(!(text instanceof String || typeof(text) == 'string')) {
		throw new Error('Invalid Argument Type')
	}
	ret.text = new String(text)
	if(expires != null && (!(expires instanceof Date) || !isValidDate(expires))) {
		throw new Error('Invalid Argument Type')
	}
	ret.expires = expires

	ret.setDate = function(d) {
		if(!(d instanceof Date)) {
			throw new Error('Invalid Argument Type')
		}
                if(d.getTime() == this.date.getTime()) {
                        return
                }
		this.date = d
		pim_fireChanged()
	}
	ret.setText = function(x) {
		if(!(x instanceof String || typeof(x) == 'string')) {
			throw new Error('Invalid Argument Type')
		}
                var other = new String(x)
                if(this.text.valueOf() == x.valueOf()) {
                        return
                }
		this.text = new String(x)
		pim_fireChanged()
	}
	ret.setExpires = function(d) {
		if(d != null && (!(d instanceof Date))) {
			throw new Error('Invalid Argument Type')
		}
                if(d == null && this.expires == null) {
                        return
                }
                if(d != null && this.expires != null && d.getTime() == this.expires.getTime()) {
                        return
                }
		this.expires = d
		pim_fireChanged()
	}

	return ret
}

function new_pimEntry(date, text, expires) {
	var ret = new_pimEntryWithId(new Number(pim_uniqueId++), date, text, expires)
	return ret
}

function pim_comparator(a, b) {
        if(a.date.valueOf() == b.date.valueOf()) {
                if(a.expires != null && b.expires != null) {
                        return a.expires.valueOf() - b.expires.valueOf()
                } else if(a.expires != null) {
                        return -1
                } else {
                        return 1
                }
                return a.date.valueOf() - b.date.valueOf()
        } else {
                return a.date.valueOf() - b.date.valueOf()
        }
}

/* returns: id */
function pim_add(date, text, expires) {
	var e = new_pimEntry(date, text, expires)
	pim_data.push(e)
        pim_data.sort(pim_comparator)
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
        pim_data.sort(pim_comparator)
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
