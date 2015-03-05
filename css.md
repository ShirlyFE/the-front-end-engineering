### the most interesting HTML/JS/DOM/CSS hacks that most web developers don't know about

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

#### ddd 

