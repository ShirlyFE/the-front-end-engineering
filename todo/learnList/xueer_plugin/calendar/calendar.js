(function($, document) {
    var $body = $("body");

    function Calendar() {
        var today = new Date();

        this.year = today.getFullYear();
        this.month = today.getMonth();
        this.$dateInput = {};
        this.$calendar = {};
        this.initialize();
    }

    Calendar.prototype = {
        constructor : Calendar,

        weekDays : ['日', '一', '二', '三', '四', '五', '六'],

        days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

        calendarTemplate: '<table class="calendar" id="calendar"><thead class="calendar-header"></thead><tbody class="calendar-body"></tbody></table>',  

        initialize : function () {
            
            $body.append(this.calendarTemplate);
            this.renderCalendarHeader();
            this.renderCalendarBody();
            this.$calendar = $("#calendar");
            $(".calendar-year").on("click", this, this.events.showYearContainer);
            $(".calendar-month").on("click", this, this.events.showMonthContainer);
            $(".calendar-years").find("a").on("click", this, this.events.yearSelectHandle);
            $(".calendar-months").find("a").on("click", this, this.events.monthSelectHandle);
            $(".prev").on("click", this, this.events.prevMonthDisplay);
            $(".next").on("click", this, this.events.nextMonthDisplay);
            $(".calendar-body").find("td").on("click", this, this.events.getSelectDate);
        },

        events: {
            showYearContainer: function(e) {
                $(".calendar-years").toggleClass("active");
            },

            showMonthContainer: function() {
                $(".calendar-months").toggleClass("active");
            },

            yearSelectHandle: function(e) {
                var $this = $(this),
                    year = $(this).html(),
                    calendar = e.data;

                calendar.year = year;
                $this.closest("li").siblings().find("a").filter(".active").removeClass("active");
                $this.addClass("active");
                $(".calendar-year").html(year);
                calendar.events.showYearContainer();
                calendar.renderCalendarBody();
                $(".calendar-body").find("td").on("click", calendar, calendar.events.getSelectDate);
            },

            monthSelectHandle: function(e) {
                var $this = $(this),
                    month = $this.html(),
                    month1 = 0,
                    calendar = e.data;

                if (month[0] == "0") {
                    month1 = parseInt(month, 10) -1;
                }
                calendar.month = month1;
                $this.closest("li").siblings().find("a").filter(".active").removeClass("active");
                $this.addClass("active");
                $(".calendar-month").html(month);
                calendar.events.showMonthContainer();
                calendar.renderCalendarBody();
                $(".calendar-body").find("td").on("click", calendar, calendar.events.getSelectDate);
            },

            prevMonthDisplay: function(e) {
                var $this = $(this),
                    calendar = e.data,
                    prevDate = new Date(calendar.year, calendar.month-1, 1),
                    year = prevDate.getFullYear(),
                    month = prevDate.getMonth(),
                    month1 = month+1;

                calendar.year = year;
                calendar.month = month;
                $(".calendar-year").html(calendar.year);
                $(".calendar-month").html(month1 < 10 ? "0" + month1 : month1 );
                calendar.renderCalendarBody();
                $(".calendar-body").find("td").on("click", calendar, calendar.events.getSelectDate);
            },

            nextMonthDisplay: function(e) {
                var $this = $(this),
                    calendar = e.data,
                    nextDate = new Date(calendar.year, calendar.month+1, 1),
                    year = nextDate.getFullYear(),
                    month = nextDate.getMonth(),
                    month1 = month+1;

                calendar.year = year;
                calendar.month = month;
                $(".calendar-year").html(calendar.year);
                $(".calendar-month").html(month1 < 10 ? "0" + month1 : month1 );
                calendar.renderCalendarBody();
                $(".calendar-body").find("td").on("click", calendar, calendar.events.getSelectDate);
            },

            getSelectDate: function(e) {
                var calendar = e.data,
                    day = $(this).html(); 

                data = calendar.formatDate(calendar.year, calendar.month+1, day);
                console.log(data);
                console.log(calendar.$dateInput);
                calendar.$dateInput.val(data);
                calendar.$calendar.removeClass("active");
            }
        },

        renderCalendarHeader: function() { // 渲染日历头部
            var month = this.month < 10 ? "0" + (this.month+1) : this.month +1,
                calendarHeader = "<tr class='calendar-header-nav'><th><span class='prev'><</span></th><th colspan=2><span class='calendar-year'>" + this.year + "</span>",
                th = '',
                ulYear = '',
                liYear = '',
                ulMonth = '',
                liMonth = '',
                active = false;

            for (var j = 1901; j <= 2050; j++) {
                if (this.year == j) {
                    liYear += '<li><a class="active">' + j + '</li>';
                } else {
                    liYear += '<li><a>' + j + '</li>';
                }
            }

            ulYear += '<ul class="calendar-years">' + liYear + '</ul>';
            calendarHeader += ulYear + "</th><th>-</th><th colspan=2><span class='calendar-month'>" + month + "</span>";

            for (var i = 1; i <= 12; i++) {
                if (i === (this.month + 1)) {
                    active = true;
                };

                if (i < 10) {
                    i = "0" + i;
                };

                if (active) {
                    liMonth += '<li><a class="active">' + i + '</li>';
                    active = false;
                } else {
                    liMonth += '<li><a>' + i + '</li>';
                }
                
            }

            ulMonth += '<ul class="calendar-months">' + liMonth + '</ul>';
            calendarHeader += ulMonth + "</th><th><span class='next'>></span></th></tr>";

            for (var i = 0; i < this.weekDays.length; i++) {
                th += '<th>' + this.weekDays[i] + '</th>';
            }

            calendarHeader += '<tr class="calendar-header-weeks">' + th + '</tr>';
            $(".calendar-header").append(calendarHeader);

        },

        renderCalendarDay: function(dayEqToday, weekday, day) {
            var td = '';

            if (dayEqToday && weekday) {
                td += '<td class="calendar-today calendar-weekend">' + day + '</td>';           
            } else if (dayEqToday) {
                td += '<td class="calendar-today">' + day + '</td>';           
            } else if (weekday) {
                td += '<td class="calendar-weekend">' + day + '</td>';
                weekday = false;           
            } else {
                td += '<td>' + day + '</td>';
            }

            return {
                td: td,
                weekday: weekday
            };
        },

        renderCalendarBody: function() {
            var firstDay = this.getFirstDay(this.year, this.month),
                day = 0,
                days = 0,
                lastRow = false,
                html = '',
                row = 1,
                today = new Date().toDateString(),
                dayEqToday = false;

            this.updateFebruaryDays(this.year);
            days = this.days[this.month];

            while (true) {
                var td = '',
                    tr = '',
                    tdRenderS = {},
                    weekday = false;
                    

                for (var i = 0; i < 7; i++) {

                    weekday = (i % 7 == 0) || (i % 7 == 6);

                    if(row < 2) {
                        //if ((i+this.firstDayOfWeek) % 7 == firstDay ) && !day)
                        if (i == firstDay && !day) {
                            day++;
                        } else if (day > 0) {
                            day++;
                        }

                        dayEqToday = new Date(this.year, this.month, day).toDateString() == today;

                        if (day != 0) {
                            tdRenderS = this.renderCalendarDay(dayEqToday, weekday, day);
                            td += tdRenderS.td;
                            weekday = tdRenderS.weekday;
                        } else {
                            td += '<td></td>';
                        }

                    } else {
             
                        day++;
                        dayEqToday = new Date(this.year, this.month, day).toDateString() == today;
        
                       if (day <= days) {
                            tdRenderS = this.renderCalendarDay(dayEqToday, weekday, day);
                            td += tdRenderS.td;
                            weekday = tdRenderS.weekday;
                        } else {
                            td += '<td></td>';
                        }

                        if (day == days) {
                            lastRow = true;
                        }
                        
                    }
                 }
                
                tr = '<tr>' + td + '</tr>';
                html += tr;
                row++;

                if (lastRow) {
                    break;
                }
                
            }

            $(".calendar-body").empty().append(html);
        },

        getFirstDay: function(year, month) { // 通过this.year和this.month获取每月的第一天是周几
            return new Date(year, month, 1).getDay();
        },

        updateDate: function(year, month) { // 根据年、月重置this.year和this.month
            this.year = year;
            this.month = month;
        },

        updateFebruaryDays: function(year) { // 更新二月份天数
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                this.days[1] = 29;
            } else {
                this.days[1] = 28;    
            }

        },

        formatDate: function(year, month, day) { // 格式化日期
            if (month < 10) {
                month = "0" + month;
            }

            if (day < 10) {
                day = "0" + day;
            }

            return year + "-" + month + "-" + day;
        }
    }

    $.calendar = new Calendar();
    $.calendar.initialized = true;
    $.fn.calendar = function(options) {
        var $this = $(this),
            calendar = {},
            offset = $this.offset(),
            height = $this.height() + 2 * parseInt($this.css("padding-bottom"), 10) + 2 * parseInt($this.css("border-bottom-width"), 10); 
        
        if(!$.calendar.initialized) {
            $.calendar = new Calendar();
        }

        $.calendar.$dateInput = $this;

        calendar = $.calendar;

        $this.on("focus", function() {
            calendar.$calendar.css({
                left: offset.left,
                top: offset.top + height
            })
            calendar.$dateInput = $(this);
            calendar.$calendar.addClass("active");
        })
        return this;
    }

})(jQuery, document);

/*
不足之处，也没有给出调试信息
*/


