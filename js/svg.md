### 与svg相关联的知识点

画思维导图比如我的[actree](https://github.com/shirlyLoveU/actree)时常用的库是d3，这里我将d3使用过程中的注意点列出来，做备忘

d3.json()不能读取本地文件。例如将 html 文件与 json 文件放到本地同一目录，打开 html 文件是不能顺利读取的。需要搭建一个网络服务器来使用它，例如用 Apache 搭建一个简单的服务器（参见【搭建 Apache】）。否则Chrome的控制台会报错

### 相关资料

[深度掌握SVG路径path的贝塞尔曲线指令](http://www.zhangxinxu.com/wordpress/2014/06/deep-understand-svg-path-bezier-curves-command/)

[贝塞尔曲线算法的Javascript实现](http://blog.csdn.net/cuixiping/article/details/6872095)

[贝塞尔曲线](http://www.cnblogs.com/random/archive/2011/05/27/2060301.html)

[SVG矢量绘图 path路径详解（贝塞尔曲线及平滑）](http://xbingoz.com/194.html)

[贝塞尔曲线的升阶](http://hczhcz.github.io/2014/07/16/bezier-curves-degree-elevation.html)

[用svg画思维导图时常用的js库d3](http://d3js.org/)

[d3 api](https://github.com/mbostock/d3/wiki/Api-%E5%8F%82%E8%80%83)

[贝塞尔曲线直观操作](http://dayu.pw/svgcontrol/)

[贝塞尔曲线与CSS3动画、SVG和canvas的基情](http://www.zhangxinxu.com/wordpress/2013/08/%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF-cubic-bezier-css3%E5%8A%A8%E7%94%BB-svg-canvas/)

[很赞的svg tutorial](http://tutorials.jenkov.com/svg/scripting.html)

[SVG 超硬派了解 path Arcs](http://wcc723.github.io/d3js/2014/10/03/Ironman-30-days-04/)




