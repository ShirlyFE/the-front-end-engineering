### event.stopPropagation()
> This prevents any callbacks from being fired on any nodes further along the event chain, but it does not prevent any additional callbacks of the same event name from being fired on the current node.

也就是说stopPropagation是阻止事件的传播，而不是之前理解的阻止事件的冒泡

### event.stopImmediatePropagation

> stopImmediatePropagation (function)
This prevents any callbacks from being fired on any nodes further along the event chain, including any additional callbacks of the same event name on the current node.

[An Introduction To DOM Events](./http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/)

[javascript事件机制详解（涉及移动兼容）](http://www.cnblogs.com/yexiaochai/p/3462657.html)

### 利用modern browser生成图片的base64编码

```javascript
    var image = document.createElement('img')

    document.ondragover = function(e) {
        e.preventDefault()
    }
    document.ondrop = function (e) {
        e.preventDefault()  // prevent browser from trying to run/display the file
        var reader = new FileReader();
        reader.onload = function(e) {
            var result = e.target.result
            console.log(result) // base64 encoded file data!
            image.src = result
            document.body.appendChild(image)
        };
        reader.readAsDataURL(e.dataTransfer.files[0]);
    }
```

关于拖曳与拖放事件的API这里做下简单说明：

1. **DataTransfer**对象：拖曳对象媒介，使用一般为Event.dataTransfer。
2. **draggable**属性：标签元素要设置draggable=true，否则不会有效果，例如：
```html
    <div title="拖拽我" draggable="true">列表1</div>
```
3. **ondragstart**事件：拖拽元素开始被拖拽时触发，此事件作用在被拖曳元素上
4. **ondragenter**事件：拖曳元素进入目标元素时触发，此事件作用在目标元素上
5. **ondragover**事件：拖拽元素在目标元素上移动时触发，此事件作用在目标元素上
6. **ondrop** 事件：拖拽元素在目标元素上同时鼠标放开时触发，此事件作用在目标元素上
7. **ondragend**事件：拖拽完成后触发，此事件作用在被拖曳元素上
8. **Event.preventDefault()**方法：阻止默认的些事件方法等执行。在ondragover中一定要执行preventDefault()，否则ondrop事件不会被触发。另外，如果是从其他应用软件或是文件中拖东西进来，尤其是图片的时候，默认的动作是显示这个图片或是相关信息，并不是真的执行drop。此时需要用用document的ondragover事件把它直接干掉。
9. **Event.effectAllowed**属性：拖拽效果

[简单拖曳demo](http://shirlyloveu.github.io/shirlyDemo/dragAnddrop.html)

[生成图片base64编码demo](http://shirlyloveu.github.io/shirlyDemo/getBase64EncodeOfImage.html)

