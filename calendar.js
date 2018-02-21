(function() {
  'use strict';

  class chineseCalendar extends HTMLElement {
    constructor() {
      super();
      this._year = new Date().getFullYear();
      this._month = new Date().getMonth();
      this._day = new Date().getDate();
      this.dayOfWeek = {"Sunday": "星期日", "Monday" : "星期一", "Tuesday" : "星期二", "Wednesday" : "星期三", "Thursday" : "星期四", "Friday" : "星期五", "Saturday" : "星期六"};
      this._daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
      this._daysInMonthLeap = [31,29,31,30,31,30,31,31,30,31,30,31];
      this.offset = this.calOffSetOfMonth();
    }

    connectedCallback() {
      console.log(solar2lunar(new Date()));
        const _style =
        `
        <style>
          .daysOfWeek {
            background-color: lightskyblue;
            display: grid;
            grid-template-columns: repeat(7, auto);
            color: #444;
            max-height: 100%;
            height: 50px;
            grid-template-areas:
                "1 2 3 4 5 6 7"
          }
          .content {
            grid-gap: 5px;
            position: relative;
            z-index: -2;
            background-color: pink;
            display: grid;
            grid-template-columns: repeat(7, auto);
            grid-template-rows: repeat(5, auto);
            color: #444;
            height: 100%;
            grid-template-areas:
                "1 2 3 4 5 6 7"
                "8 9 10 11 12 13 14"
                "15 16 17 18 19 20 21"
                "22 23 24 25 26 27 28"
                "29 30 31 32 33 34 35";
          }
          .bg1 {
            background: gray;
            position: absolute;
            width: 100%;
            height: 100%;
            grid-row: 1 / 7;
            grid-column: 1 / 8;
            z-index: -1;
          }
        </style>
        `
        const _template =
        `
        <div class="container" year="${this._year}">
          <section class="monthAndYr">${this._month+1}月 ${this._year}</section>
          <section class="daysOfWeek">
          </section>
          <section class="content">
            <div class="bg1"></div>
          </section>
        </div>
        `;

        this.innerHTML = _style + _template;
        for (var property in this.dayOfWeek) {
          this.addMonToSun(property);
        }

        this.getMonthInfo(this._month);

      }

      addMonToSun(val){
        let day = document.createElement('div');
        day.innerHTML = val + `<br>` +  this.dayOfWeek[val];
        let newDay = day.cloneNode(true);
        document.querySelector(".daysOfWeek").appendChild(newDay);
      }

      getMonthInfo(){
        let leap = this.isLeap(this._year);
        if(!leap){
          for(let i = 1; i <= this._daysInMonth[this._month]; i++){
            this.addDate(i);
          }
        }else{
          for(let i = 1; i <= this._daysInMonthLeap[this._month]; i++){
            this.addDate(i);
          }
        }
      }


      addDate(val){
        this.lunarInfo = solar2lunar(new Date(this._year,this._month,val));
        this.y = `<div class="circle"><div class="circle2"><h1>${val}</h1></div></div>`;
        this.x =
        `
          <div class="dateFrame" style="position:relative; height:75px; background:white;">
          <img src="asset/newYear.png">
            ${((val === this._day )? this.y: `<h1>${val}</h1>`)}
            <div class="test" style="position:absolute;bottom:0;">
            ${this.lunarInfo.lunarDay}
            </div>
            <div class="test" style="position:absolute;bottom:0;right:0;">
              ${((this.lunarInfo.lunarDay)? this.lunarInfo.solarTerms:"")}
            </div>
          </div>
        `;

        if(val == 1){
          document.querySelector(".content").innerHTML += this.x;
          document.querySelector(".dateFrame").style.gridColumnStart = this.offset+1;
          document.querySelector(".dateFrame").style.gridColumnEnd = this.offset+2;
        }else{
          document.querySelector(".content").innerHTML += this.x;
        }

        if(this.lunarInfo.lDay == 1 && this.lunarInfo.lMonth == 1){
          document.querySelector(".dateFrame").style.background = 'url(newYear.png)';
        }

      }

      calOffSetOfMonth(){
        let month = new Date().getMonth()+1;
        console.log(month);
        return new Date(`${month} 1,${this._year}`).getDay();
      }

      isLeap(year)
      {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
      }

      set year(val){
        this._year = val;
      }
  };

  customElements.define('ch-calendar', chineseCalendar);
}());
