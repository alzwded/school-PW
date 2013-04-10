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

function calendar_refresh(id) {
    document.getElementById('month_' + id).innerHTML = calendar_months[model[id].month]
    document.getElementById('year_' + id).innerHTML = model[id].year
}

function calendar_clean(id) {
}
