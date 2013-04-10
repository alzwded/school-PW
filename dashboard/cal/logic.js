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
    debug_writeln('TODO calendar_select')
    alert(fields[0] + ' on ' + fields[1])
}

/* meta:
    below code (getWeekNumber and comment) are taken from 
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
    debug_writeln('TODO fillWeek')
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
        td.className = 'calendar_thisMonthButton'
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

    // TODO place in functions
    var r = new XMLHttpRequest()
    r.open('GET', 'cal/entry.php?id=' + id + '&eid=' + 0, false)
    r.send()
    document.getElementById('appointments_' + id).innerHTML += r.responseText
    var r = new XMLHttpRequest()
    r.open('GET', 'cal/entry.php?id=' + id + '&eid=' + 1, false)
    r.send()
    document.getElementById('appointments_' + id).innerHTML += r.responseText
}

function calendar_enableExpires(cid) {
    if(document.getElementById('enableExpires_' + cid).checked) {
        document.getElementById('expires_' + cid).disabled = false
    } else {
        document.getElementById('expires_' + cid).disabled = true
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
    // TODO stub
    alert(eid)
}

function calendar_clean(id) {
    delete model[id]
}
