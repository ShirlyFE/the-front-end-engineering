# SSI(server side include)

## SSI语法

Basic SSI directives Syntax

```html
<!--#element attribute=value attribute=value ... -->
```

Today's date

```html
<!--#config timefmt="%Y/%m/%d %a %H:%M:%S" -->
Today is <!--#echo var="DATE_LOCAL" -->
```

Modification date of the file

```html
This document last modified <!--#flastmod file="index.html" -->
```

Including the results of a CGI program

```html
<!--#include virtual="/cgi-bin/counter.pl" -->
<!--#include virtual="/cgi-bin/example.cgi?argument=value" -->
```

You can use "#exec cgi=" directive, but it can be disabled using the IncludesNOEXEC Option.

Including a standard footer

```html
<!--#include virtual="/footer.html" -->
```

Executing commands

```html
<!--#exec cmd="ls" -->
```

This feature is dangerous. You can allow SSI, but not the exec feature, with the IncludesNOEXEC argument to the Options directive.

Setting variables

```html
<!--#set var="modified" value="$LAST_MODIFIED" -->
<!--#set var="date" value="${DATE_LOCAL}_${DATE_GMT}" -->
```

Conditional expressions

```html
<!--#if expr="test_condition" -->
<!--#elif expr="test_condition" -->
<!--#else -->
<!--#endif -->
```