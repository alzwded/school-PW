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

function fillWeek(id, w) {
    debug_writeln('TODO fillWeek')
    document.getElementById('week' + w + '_' + id).innerHTML = w
}

function calendar_refresh(id) {
    document.getElementById('month_' + id).innerHTML = calendar_months[model[id].month]
    document.getElementById('year_' + id).innerHTML = model[id].year
    var d = new Date(model[id].year, model[id].month, 1, 0, 0, 0, 0)
    var week = 0
    var switchWeekFunc = null
    if(d.getDay() == 0) {
        switchWeekFunc = function() {
            fillWeek(id, week)
            switchWeekFunc = function() {
                fillWeek(id, week)
                ++week
            }
        }
    } else {
        switchWeekFunc = function() {
            fillWeek(id, week)
            ++week;
        }
    }
    for(var i = 0 ; i < d.getDay() ; ++i) {
        var td = document.getElementById('w0d' + i + '_' + id)
        td.className = "calendar_otherMonthButton"
        var otherDate = new Date(d)
        otherDate = new Date(otherDate.getTime() - (d.getDay() - i) * (1000 * 60 * 60 * 24))
        td.innerHTML = otherDate.getDate() + 1
        td.onclick = null
    }
    while(d.getMonth() == model[id].month) {
        var td = document.getElementById('w' + week + 'd' + d.getDay() + '_' + id)
        td.className = 'calendar_thisMonthButton'
        td.innerHTML = d.getDate()
        td.name = id + '%|' + d
        td.onclick = calendar_select
        d = new Date(d.getTime() + (1000 * 60 * 60 * 24))
        if(d.getDay() == 0) {
            switchWeekFunc()
        }
    }
    while(d.getDay() < 6) {
        var td = document.getElementById('w' + week + 'd' + d.getDay() + '_' + id)
        td.className = 'calendar_otherMonthButton'
        td.innerHTML = d.getDate()
        d = new Date(d.getTime() + (1000 * 60 * 60 * 24))
        if(d.getDay() == 0) {
            switchWeekFunc()
        }
    }
    while(week < 6) {
        var td = document.getElementById('w' + week + 'd' + d.getDay() + '_' + id)
        td.className = 'calendar_otherMonthButton'
        td.innerHTML = d.getDate()
        d = new Date(d.getTime() + (1000 * 60 * 60 * 24))
        if(d.getDay() == 0) {
            debug_writeln(week)
            switchWeekFunc()
        }
    }
}

function nextMonth(e, id) {
    if(!(id instanceof String)) {
        id = id.id
    }
    if(model[id].month < 11) {
        model[id].month++
    } else {
        model[id].month = 0
        model[id].year++
    }
    calendar_refresh(id)
}

function prevMonth(e, id) {
    if(!(id instanceof String)) {
        id = id.id
    }
    if(model[id].month > 0) {
        model[id].month--
    } else {
        model[id].month = 11
        model[id].year--
    }
    calendar_refresh(id)
}

function nextYear(e, id) {
    if(!(id instanceof String)) {
        id = id.id
    }
    model[id].year++
    calendar_refresh(id)
}

function prevYear(e, id) {
    if(!(id instanceof String)) {
        id = id.id
    }
    model[id].year--
    calendar_refresh(id)
}

function calendar_clean(id) {
    delete model[id]
}
