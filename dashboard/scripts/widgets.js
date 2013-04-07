// file: widgets.js
// author: Vlad Mesco
// date: 07/04/2013 13:46
// description: widget factory

var lastWidget = 0
var movingWidget = null
var initialX = 0
var initialY = 0

function new_widget(path) {
	var uniqueName = "__Widget" + lastWidget++
	// request widget.php
	var widget = null
	// inject widget in document
	// request path.php
	// inject app in widget
	return widget
}

function move(e) {
	var source = e.target || e.srcElement
	var d = source.parentElement
	var titleBar = document.getElementById(d.name + "_titleBar")
	if(!moving) {
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
