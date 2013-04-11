// file: logic.js
// author: Vlad Mesco
// date: Tue Apr  9 20:42:36 EEST 2013
// description: calendar functions

var model = new Object()
var calendar_months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
    12: 'January'
}

function calendar_reset(id) {
    model[id] = new Object()
    var now = new Date()
    model[id].month = now.getMonth()
    model[id].year = now.getFullYear()
    model[id].selected = null
    model[id].callback = function() { calendar_refresh(id); }
    pim_registerChangeCallback(model[id].callback)
    calendar_refresh(id)
}

function calendar_select(e) {
    var td = e.target || e.srcElement
    var fields = td.name.split('%|')
    debug_writeln(fields[0], ' on ', fields[1])
    model[fields[0]].selected = fields[1]
    calendar_refresh(fields[0])
}

/* meta:
    the code below (getWeekNumber and comment) was taken from 
    http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
*/ 
/* For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 */
function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
}

function fillWeek(id, w, d) {
    document.getElementById('week' + w + '_' + id).innerHTML = getWeekNumber(d)[1]
}

function calendar_refresh(id) {
    document.getElementById('month_' + id).innerHTML = calendar_months[model[id].month]
    document.getElementById('year_' + id).innerHTML = model[id].year
    var d = new Date(model[id].year, model[id].month, 1, 0, 0, 0, 0)
    var week = 0
    var aWeekDayDate = null
    var switchWeekFunc = function() {
        fillWeek(id, week, aWeekDayDate)
        ++week
    }
    for(var i = 0 ; i < d.getDay() ; ++i) {
        var td = document.getElementById('w0d' + i + '_' + id)
        td.className = "calendar_otherMonthButton"
        var otherDate = new Date(d)
        otherDate = new Date(d)
        otherDate.setDate(d.getDate() - d.getDay() + i)
        td.innerHTML = otherDate.getDate()
        td.onclick = null
    }
    while(d.getMonth() == model[id].month) {
        var td = document.getElementById('w' + week + 'd' + d.getDay() + '_' + id)
        if(d == model[id].selected) {
            td.className = 'calendar_selectedButton'
        } else {
            td.className = 'calendar_thisMonthButton'
        }
        td.innerHTML = d.getDate()
        td.name = id + '%|' + d
        td.onclick = calendar_select
        aWeekDayDate = d
        d.setDate(d.getDate() + 1)
        if(d.getDay() == 0) {
            switchWeekFunc()
        }
    }
    while(week < 6) {
        var td = document.getElementById('w' + week + 'd' + d.getDay() + '_' + id)
        td.className = 'calendar_otherMonthButton'
        td.innerHTML = d.getDate()
        aWeekDayDate = d
        d.setDate(d.getDate() + 1)
        if(d.getDay() == 0) {
            debug_writeln(week)
            switchWeekFunc()
        }
    }

    document.getElementById('appointments_' + id).innerHTML = ''

    // get entries for selected day
    if(model[id].selected != null) {
        var entries = pim_getEntriesForDate(new Date(Date.parse(model[id].selected)))
        for(var i = 0 ; entries != null && i < entries.length ; ++i) {
            calendar_addEntry(id, entries[i])
        }
    }
}

function calendar_addEntry(id, entry) {
    var r = new XMLHttpRequest()
    r.open('GET', 'cal/entry.php?id=' + id + '&eid=' + entry.id, false)
    r.send()
    if(r.status == 200) {
        document.getElementById('appointments_' + id).innerHTML += r.responseText
        var cid = id + ':' + entry.id
        document.getElementById('textarea_' + cid).value = entry.text
        if(entry.expires != null) {
            var enableExpires = document.getElementById('enableExpires_' + cid)
            var onch = enableExpires.onchange
            enableExpires.onchange = null
            enableExpires.checked = true
            var expires = document.getElementById('expires_' + cid)
            expires.disabled = false
            expires.valueAsDate = entry.expires
            enableExpires.onchange = onch
        }
    }
}

function calendar_save(e) {
    var src = e.target || e.srcElement
    var id = src.id.substr(5)
    if(model[id].selected == null) {
        return
    }
    var entries = pim_getEntriesForDate(new Date(Date.parse(model[id].selected)))
    var table = document.getElementById('appointments_' + id)
    for(var i = 0 ; i < table.rows.length ; ++i) {
        var cell = table.rows[i].cells[0]
        var children = cell.childNodes
        var cid = null
        var expires = null
        var text = null
        for(var i = 0 ; i < children.length ; ++i) {
            var child = children[i]
            if(child.attributes == null || child.attributes.name == null) {
                continue
            }
            if(child.attributes.name.nodeValue == 'expires') {
                if(cid == null) {
                    cid = child.id.substr(8)
                }
                if(document.getElementById('enableExpires_' + cid).checked) {
                    expires = new Date(Date.parse(child.value))
                }
            } else if(child.attributes.name.nodeValue == 'text') {
                if(cid == null) {
                    cid = child.id.substr(9)
                }
                text = child.value
            }
        }
        var eid = cid.substr(cid.search(':') + 1)
        var found = null
        for(var i = 0 ; i < entries.length ; ++i) {
            if(entries[i].id == eid) {
                found = entries[i]
                break
            }
        }
        if(found != null) {
            if(found.expires != expires) {
                found.setExpires(expires)
            }
            if(found.text != text) {
                found.setText(text)
            }
        }
    }
}

function calendar_add(e) {
    var src = e.target || e.srcElement
    var id = src.id.substr(4)
    if(model[id].selected == null) {
        alert('no date selected')
        return
    }
    var entry = pim_add(new Date(Date.parse(model[id].selected)), '', null)
}

function calendar_enableExpires(cid) {
    if(document.getElementById('enableExpires_' + cid).checked) {
        document.getElementById('expires_' + cid).disabled = false
    } else {
        document.getElementById('expires_' + cid).disabled = true
    }
}

function calendar_clearEverything(e) {
    if(model[id].selected == null) {
        return
    }
    var src = e.target || e.srcElement
    var id = src.id.substr(5)
    var entries = pim_getEntriesForDate(model[id].selected)
    for(var i = 0 ; i < entries.length ; ++i) {
        pim_delete(entries[i].id)
    }
}

function nextMonth(e) {
    var src = e.target || e.srcElement
    var id = src.attributes["name"].nodeValue
    if(model[id].month < 11) {
        model[id].month++
    } else {
        model[id].month = 0
        model[id].year++
    }
    calendar_refresh(id)
}

function prevMonth(e) {
    var src = e.target || e.srcElement
    var id = src.attributes["name"].nodeValue
    if(model[id].month > 0) {
        model[id].month--
    } else {
        model[id].month = 11
        model[id].year--
    }
    calendar_refresh(id)
}

function nextYear(e) {
    var src = e.target || e.srcElement
    var id = src.attributes["name"].nodeValue
    model[id].year++
    calendar_refresh(id)
}

function prevYear(e) {
    var src = e.target || e.srcElement
    var id = src.attributes["name"].nodeValue
    model[id].year--
    calendar_refresh(id)
}

function calendar_delete(eid) {
    pim_delete(eid)
}

function calendar_clean(id) {
    pim_unregisterChangeCallback(model[id].callback)
    delete model[id]
}
