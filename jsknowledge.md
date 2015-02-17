### event.stopPropagation()
> This prevents any callbacks from being fired on any nodes further along the event chain, but it does not prevent any additional callbacks of the same event name from being fired on the current node.

也就是说stopPropagation是阻止事件的传播，而不是之前理解的阻止事件的冒泡

### event.stopImmediatePropagation

> stopImmediatePropagation (function)
This prevents any callbacks from being fired on any nodes further along the event chain, including any additional callbacks of the same event name on the current node.

[An Introduction To DOM Events](./http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/)

[javascript事件机制详解（涉及移动兼容）](http://www.cnblogs.com/yexiaochai/p/3462657.html)
