// file: common.js
// author: Vlad Mesco
// date: 15/04/2013 16:17
// description: calendar/tasks common functions

function common_addEntryData(id, entry) {
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
            expires.valueAsDate = entry.expires
        } else {
            expires.value = entry.expires.toLocaleDateString()
        }
        enableExpires.onchange = onch
    }
}

function common_addEntryTemplate(id, entry) {
    var r = new XMLHttpRequest()
    r.open('GET', 'cal/entry.php?id=' + id + '&eid=' + entry.id, false)
    r.send()
    if(r.status == 200) {
        // can't innerHTML on table on ie9
        //document.getElementById('appointments_' + id).innerHTML += r.responseText
        return r.responseText
    }
}

function common_populateWithEntries(id, entries) {
    var htmlForTable = '<table>'
    // two pass because the data in the table is cleared when
    //     setting innerHTML
    for(var i = 0 ; entries != null && i < entries.length ; ++i) {
        htmlForTable += common_addEntryTemplate(id, entries[i])
    }
    htmlForTable += '</table>'
    document.getElementById('appointments_' + id).innerHTML += htmlForTable

    for(var i = 0 ; entries != null && i < entries.length ; ++i) {
        common_addEntryData(id, entries[i])
    }
}
