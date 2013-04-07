// file: widgets.js
// author: Vlad Mesco
// date: 07/04/2013 13:46
// description: widget factory

var lastWidget = 0
var movingWidget = null
var initialX = 0
var initialY = 0

var cssMap = {}
var scriptMap = {}

function raiseMe(w) {
	var container = document.getElementById('content')
	for(i = 0 ; i < container.children.length ; ++i) {
		container.children[i].style.zIndex = 10
	}
	w.style.zIndex = 1000
}

function raiseMeCb(e) {
	var d = e.target || e.srcElement
	raiseMe(d.parentElement)
}

function loadCSSes(csses) {
	for(i = 0 ; i < csses.length ; ++i) {
		var me = csses[i].childNodes
		for(j = 0 ; j < me.length ; ++j) {
			var href = me[j].nodeValue
			if(cssMap[href] == null) {
				var css = document.createElement('link')
				css.async = false
				css.setAttribute('rel', 'stylesheet')
				css.setAttribute('type', 'text/css')
				css.setAttribute('href', href)
				cssMap[href] = css
				document.getElementsByTagName('head')[0].appendChild(css)
			}
		}
	}
}

function loadScripts(scripts) {
	for(i = 0 ; i < scripts.length ; ++i) {
			var href = scripts[i].childNodes[1].childNodes[0].nodeValue
			var executeCode = scripts[i].childNodes[3].childNodes[0].nodeValue
			if(scriptMap[href] == null) {
				var script = document.createElement('script')
				script.async = false
				script.setAttribute('type', 'text/javascript')
				script.setAttribute('src', href)
				if(executeCode != null) {
					script.onload = function() { eval(executeCode) }
				}
				scriptMap[href] = script
				document.getElementsByTagName('head')[0].appendChild(script)
			}
	}
}

function new_widget(what, title) {
	var uniqueName = "__Widget" + lastWidget++
	// request widget.php
	var widgetReq = new XMLHttpRequest()
	var params = "?id=" + uniqueName + "&title=" + title
	widgetReq.open("GET", "widget.php" + params, false)
	widgetReq.send()

	var widget = document.createElement("div")
	widget.name = uniqueName
	widget.id = uniqueName
	widget.style.left = "100px"
	widget.style.top = "100px"
	widget.className += " widget"
	widget.onclick = raiseMeCb
	widget.innerHTML = widgetReq.responseText
	document.getElementById('content').appendChild(widget)
	raiseMe(widget)

	// request path.php

	var appReq = new XMLHttpRequest()
	appReq.open("GET", what, false)
	appReq.send()

	if(appReq.status == 200) {
		var csses = appReq.responseXML.getElementsByTagName('css')
		loadCSSes(csses)
		var scripts = appReq.responseXML.getElementsByTagName('script')
		loadScripts(scripts)

		var contentReq = new XMLHttpRequest()
		contentReq.open("GET", appReq.responseXML.getElementsByTagName('content')[0].childNodes[0].nodeValue, false)
		contentReq.send()
		var content = contentReq.responseText

		contentSpan = document.getElementById(uniqueName + "_content")
		contentSpan.innerHTML = content

	}


	return widget
}

function move(e) {
	var source = e.target || e.srcElement
	var d = source.parentElement
	var titleBar = document.getElementById(d.name + "_titleBar")
	if(movingWidget == null) {
		movingWidget = d
		initialX = e.pageX
		initialY = e.pageY

		titleBar.classList.add("titleClicked")
	} else {
		movingWidget = null

		titleBar.classList.remove("titleClicked")
	}
}

function mouseMove(e) {
	if(movingWidget == null) return
		
	var x = e.pageX
	var y = e.pageY
	var dx = x - initialX
	var dy = y - initialY

	var d = movingWidget
	var left = new Number(d.style.left.replace("px", ""))
	left += dx
	d.style.left = left + "px"
	var top = new Number(d.style.top.replace("px", ""))
	top += dy
	d.style.top = top + "px"

	initialX = x
	initialY = y
}

function closeWindow(e) {
	var source = e.target || e.srcElement
	var d = source.parentElement.parentElement
	d.parentNode.removeChild(d)
}
