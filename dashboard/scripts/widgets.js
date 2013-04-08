// file: widgets.js
// author: Vlad Mesco
// date: 07/04/2013 13:46
// description: widget factory & methods

var lastWidget = 0
var movingWidget = null
var initialX = 0
var initialY = 0

var cssMap = {}
var scriptMap = {}
var instanceMap = {}

function raiseMe(w) {
	var container = document.getElementById('content')
	for(var i = 0 ; i < container.children.length ; ++i) {
		container.children[i].style.zIndex = 10
	}
	w.style.zIndex = 1000
}

function raiseMeCb(e) {
	var d = e.target || e.srcElement
	raiseMe(d.parentElement)
}

function loadCSSes(csses, iInstance) {
	for(var i = 0 ; i < csses.length ; ++i) {
		var me = csses[i].childNodes
		for(var j = 0 ; j < me.length ; ++j) {
			var href = me[j].nodeValue
			iInstance.csses.push(href)
			if(cssMap[href] == null) {
				var css = document.createElement('link')
				var node = new Object
				node.css = css
				css.async = false
				css.setAttribute('rel', 'stylesheet')
				css.setAttribute('type', 'text/css')
				css.setAttribute('href', href)
				node.rc = 1
				cssMap[href] = node
				document.getElementsByTagName('head')[0].appendChild(css)
			} else {
				cssMap[href].rc++
			}
		}
	}
}

function loadScripts(scripts, iInstance) {
	for(var i = 0 ; i < scripts.length ; ++i) {
		var href = null
		var executeCode = null
		var unloadCode = null
		for(var j = 0 ; j < scripts[i].childNodes.length ; ++j) {
			if(scripts[i].childNodes[j].tagName == "path") {
				href = scripts[i].childNodes[j].childNodes[0].nodeValue
			} else if(scripts[i].childNodes[j].tagName == "onload") {
				executeCode = scripts[i].childNodes[j].childNodes[0].nodeValue
			} else if(scripts[i].childNodes[j].tagName == "unload") {
				unloadCode = scripts[i].childNodes[j].childNodes[0].nodeValue
			}
		}
		iInstance.destructors.push(unloadCode)
		iInstance.scripts.push(href)
		if(scriptMap[href] == null) {
			var script = document.createElement('script')
			script.async = false
			script.setAttribute('type', 'text/javascript')
			script.setAttribute('src', href)
			if(executeCode != null) {
				script.onload = function() { eval(executeCode) }
			}
			var node = new Object()
			node.script = script
			node.onload = function() { eval(executeCode) }
			node.unload = function() { eval(unloadCode) }
			node.rc = 1
			scriptMap[href] = node
			document.getElementsByTagName('head')[0].appendChild(script)
		} else {
			/*var node = scriptMap[href]
			node.onload()*/
			scriptMap[href].rc++
			iInstance.constructors.push(executeCode)
		}
	}
}

function new_instance() {
	var instance = new Object
	instance.csses = new Array()
	instance.scripts = new Array()
	instance.constructors = new Array()
	instance.destructors = new Array()
	return instance
}

function new_widget(what, title) {
	var uniqueName = "__Widget" + lastWidget++
	// request widget.php
	var widgetReq = new XMLHttpRequest()
	var params = "?id=" + uniqueName + "&title=" + title
	widgetReq.open("GET", "widget.php" + params, false)
	widgetReq.send()

	var instance = new_instance()
	instanceMap[uniqueName] = instance

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
	appReq.open("GET", what + "?id=" + uniqueName, false)
	appReq.send()

	if(appReq.status == 200) {
		var csses = appReq.responseXML.getElementsByTagName('css')
		loadCSSes(csses, instance)
		var scripts = appReq.responseXML.getElementsByTagName('script')
		var executes = new Array()
		loadScripts(scripts, instance)

		var contentReq = new XMLHttpRequest()
		contentReq.open("GET", appReq.responseXML.getElementsByTagName('content')[0].childNodes[0].nodeValue, false)
		contentReq.send()
		var content = contentReq.responseText

		contentSpan = document.getElementById(uniqueName + "_content")
		contentSpan.innerHTML = content

		for(var i = 0 ; i < instance.constructors.length ; ++i) {
			eval(instance.constructors[i])
		}

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

	var nameId = d.name
	var instance = instanceMap[nameId]
	for(var i = 0 ; i < instance.destructors.length ; ++i) {
		eval(instance.destructors[i])
	}
	for(var i = 0 ; i < instance.scripts.length ; ++i) {
		var href = instance.scripts[i]
		var node = scriptMap[href]
		if(--node.rc < 1) {
			var domElement = node.script
			delete scriptMap[href]
			domElement.parentElement.removeChild(domElement)
		}
	}
	for(var i = 0 ; i < instance.csses.length ; ++i) {
		var href = instance.csses[i]
		var node = cssMap[href]
		if(--node.rc < 1) {
			var domElement = node.css
			delete cssMap[href]
			domElement.parentElement.removeChild(domElement)
		}
	}
	
	d.parentNode.removeChild(d)
}
