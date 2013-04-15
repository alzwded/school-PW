// file: logic.js
// author: Vlad Mesco
// date: 15/04/2013 16:32
// description: logic for task lister

var taskModel = {}

function tasks_save(e) {
    var src = e.target || e.srcElement
    var id = src.id.substr(5)

    var table = document.getElementById('appointments_' + id)
    var tableRows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr')
    for(var k = 0 ; k < tableRows.length ; ++k) {
        var cell = tableRows[k].cells[0]
        var children = cell.childNodes
        var cid = null
        var expires = null
        var text = null
        var date = null
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
            } else if(child.attributes.name.nodeValue == 'date') {
                if(cid == null) {
                    cid = child.id.substr(5)
                }
                date = new Date(Date.parse(child.value))
            }
        }
        var eid = cid.substr(cid.search(':') + 1)
        var found = pim_data[k]
        if(found != null) {
            // don't use getter and setter because we might change
            //     more than one thing (sigh)
	    found.date = date
            found.expires = expires
            found.text = text
            // TODO maybe in the future change the thing via the
            //     onchange event on the individual elements
        }
    }
    pim_fireChanged()
}

function tasks_refresh(id) {
	document.getElementById('appointments_' + id).innerHTML = ''
	common_populateWithEntries(id, pim_data, true)
}

function tasks_reset(id) {
	taskModel[id] = new Object()
	taskModel[id].callback = function() { tasks_refresh(id); }
	pim_registerChangeCallback(taskModel[id].callback)
	tasks_refresh(id)
}

function tasks_clean(id) {
	pim_unregisterChangeCallback(taskModel[id].callback)
	delete taskModel[id]
}
