### 1. the most interesting HTML/JS/DOM/CSS hacks that most web developers don't know about

#### see the layout

```css
    * { background-color: rgba(255,0,0,.2); }
    * * { background-color: rgba(0,255,0,.2); }
    * * * { background-color: rgba(0,0,255,.2); }
    * * * * { background-color: rgba(255,0,255,.2); }
    * * * * * { background-color: rgba(0,255,255,.2); }
    * * * * * * { background-color: rgba(255,255,0,.2); }
```
e.g. take [http://time.com](http://time.com)

![time home page](./images/main-qimg-9c359cbc341b1f22ea03300c0e2fe529.jpg)

With the above CSS, you will see something along the lines of:

![the layout of home page](./images/main-qimg-5e440f5d3fe8eb6ac7786d5bb6bb125b.jpg)

Different depth of nodes will use different colour allowing you to see the size of each element on the page, their margin and their padding. Now you can easily identify inconsistencies. Cool!

#### 2. quickly run html in the browser without creating a HTML file

Enter this in the address bar(won't work in IE): 

<pre>data:text/html,&lt;h1&gt;Hello, world!&lt;/h1&gt;</pre>

You can **make a page's CSS editable in the browser without using JS**(which also won't work in IE):

```html
    <!DOCTYPE html>
    <html>
        <body>
            <style style="display:block" contentEditable>
                body { color: blue }
            </style>
        </body>
    </html>
```
### 3. vh & vw (viewport width & viewport height) 

There are two units in CSS that have a solid browser support, yet they are widely underused:

One of the scenarios where we can use vh is a website with about 3-4 scrollable pages of content on which we have some elements. If we want to make each element the same height as the viewport (not the body height), the height: 100%; will not do the trick. Instead, height: 100vh; on each element will give each one the height of the viewport size.

To prevent the content from being hiddden if it overflows the height of that element, a min-height can be used.

[Using vw and vh Measurements In Modern Site Design](http://demosthenes.info/blog/660/Using-vw-and-vh-Measurements-In-Modern-Site-Design)

### 4. An HTML element with an ID creates a JavaScript global with the same name

Surprising but true, and it's done by modern browsers as a means of backwards compatibility:

```html
    <div id="someInnocentDiv"></div>
```

```javascript
    console.log(someInnocentDiv) // <div id="someInnocentDiv"></div>
```




