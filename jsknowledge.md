1. event.stopPropagation()
> This prevents any callbacks from being fired on any nodes further along the event chain, but it does not prevent any additional callbacks of the same event name from being fired on the current node.

也就是说它不只阻止事件的冒泡，而是阻止事件的传播

[An Introduction To DOM Events](./http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/)
