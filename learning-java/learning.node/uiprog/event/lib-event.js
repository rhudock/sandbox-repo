/**
*  These functions are from tcFramework. and will be tested 
*/

// TODO: change name of function to addEventListener or something.
function addEvent(node, eventName, listener, useCapture, win) {
	win = win ? win : window;
	if (node.addEventListener) {
		node.addEventListener(eventName, listener, useCapture);
	} else if (node.attachEvent) {
		node.attachEvent("on" + eventName, listener);
	} else {
		// This try to append listener without removing current listeners
		var propertyName = getListenersPropertyName(eventName);
		if (!node[propertyName]) {
			node[propertyName] = [];
			// Set event handler
			node["on" + eventName] = function (evt) {
				evt = getEvent(evt, win);
				var listenersPropertyName = getListenersPropertyName(eventName);

				// Clone the array of listeners to leave the original untouched
				var listeners = this[listenersPropertyName].concat([]);
				var currentListener;

				// Call each listener in turn
				while ((currentListener = listeners.shift())) {
					currentListener.call(this, evt);
				}
			};
		}
		node[propertyName].push(listener);
	}
}

function removeEvent(node, eventName, listener, useCapture) {
	if (node.removeEventListener) {
		node.removeEventListener(eventName, listener, useCapture);
	} else if (node.detachEvent) {
		node.detachEvent("on" + eventName, listener);
	} else {
		var propertyName = getListenersPropertyName(eventName);
		if (node[propertyName]) {
			array_remove(node[propertyName], listener);
		}
	}
}


/**
*  More general function.
*/
function addEvnListener(element, eventName, handler) {
	if (element.addEventListener) {
		// on target element maybe there is handler which stopped the bubbling of event: event.stopPropagation()
		// in this case our handler will be not fired, therefore useCapture = true.
		element.addEventListener(eventName, handler, true);
	} else if (element.attachEvent) {
		element.attachEvent("on" + eventName, handler);
	}
}

function addEvnListener(element, eventName, handler) {
	if (element.removeEventListener) {
		// on target element maybe there is handler which stopped the bubbling of event: event.stopPropagation()
		// in this case our handler will be not fired, therefore useCapture = true.
		element.removeEventListener(eventName, handler, true);
	} else if (element.detachEvent) {
		element.detachEvent("on" + eventName, handler);
	}
}