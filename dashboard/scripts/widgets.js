// file: widgets.js
// author: Vlad Mesco
// date: 07/04/2013 13:46
// description: widget factory

var lastWidget = 0
var movingWidget = null
var initialX = 0
var initialY = 0

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

function new_widget(what) {
	var uniqueName = "__Widget" + lastWidget++
	// request widget.php
	var widgetReq = new XMLHttpRequest()
	var params = "?id=" + uniqueName + "&title=" + what
	widgetReq.open("GET", "widget.php" + params, false)
	widgetReq.send()

	var widget = document.createElement("div")
	widget.name = uniqueName
	widget.id = uniqueName
	widget.style.left = "100px"
	widget.style.top = "100px"
	widget.classList.add("widget")
	widget.onclick = raiseMeCb
	widget.innerHTML = widgetReq.responseText
	document.getElementById('content').appendChild(widget)
	raiseMe(widget)

	// request path.php

	var appReq = new XMLHttpRequest()
	appReq.open("GET", what + ".php", false)
	appReq.send()

	document.getElementById(uniqueName + "_content").innerHTML = appReq.responseText

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
