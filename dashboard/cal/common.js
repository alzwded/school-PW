// file: common.js
// author: Vlad Mesco
// date: 15/04/2013 16:17
// description: calendar/tasks common functions

function getDateyString(d) {
    var day = new String(d.getDate())
    if(day.length < 2) {
        day = '0' + day
    }
    var month = new String(d.getMonth() + 1)
    if(month.length < 2) {
        month = '0' + month
    }
    return d.getFullYear() + '-' + month + '-' + day
}

function common_addEntryData(id, entry, alsoPrintDate) {
    var cid = id + ':' + entry.id
    document.getElementById('textarea_' + cid).value = entry.text
    if(entry.expires != null) {
        var enableExpires = document.getElementById('enableExpires_' + cid)
        var onch = enableExpires.onchange
        enableExpires.onchange = null
        enableExpires.checked = true
        var expires = document.getElementById('expires_' + cid)
        expires.disabled = false
        if(expires.type == "date") {
            expires.value = getDateyString(entry.expires)
        } else {
            expires.value = entry.expires.toLocaleDateString()
        }
        enableExpires.onchange = onch
    }
    if(alsoPrintDate) {
        var dateC = document.getElementById('date_' + cid)
        if(dateC.type == "date") {
            dateC.value = getDateyString(entry.date)
        } else {
            dateC.value = entry.date.toLocaleDateString()
        }
    }
}

function common_addEntryTemplate(id, entry, alsoPrintDate) {
    var r = new XMLHttpRequest()
    var pd = ((alsoPrintDate) ? '&pd=1' : '')
    r.open('GET', 'cal/entry.php?id=' + id + '&eid=' + entry.id + pd, false)
    r.send()
    if(r.status == 200) {
        // can't innerHTML on table on ie9
        //document.getElementById('appointments_' + id).innerHTML += r.responseText
        return r.responseText
    }
}

function common_populateWithEntries(id, entries, alsoPrintDate) {
    var htmlForTable = '<table>'
    // two pass because the data in the table is cleared when
    //     setting innerHTML
    for(var i = 0 ; entries != null && i < entries.length ; ++i) {
        htmlForTable += common_addEntryTemplate(id, entries[i], alsoPrintDate)
    }
    htmlForTable += '</table>'
    document.getElementById('appointments_' + id).innerHTML += htmlForTable

    for(var i = 0 ; entries != null && i < entries.length ; ++i) {
        common_addEntryData(id, entries[i], alsoPrintDate)
    }
}
