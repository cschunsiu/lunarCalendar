(function() {
  'use strict';

  class chineseCalendar extends HTMLElement {
    constructor() {
      super();
      this._year = new Date().getFullYear();
      this._month = new Date().getMonth();
      this._day = new Date().getDate();
      this._lunarInfo = solar2lunar(new Date());
      this._dayOfWeek = {"Sunday": "星期日", "Monday" : "星期一", "Tuesday" : "星期二", "Wednesday" : "星期三", "Thursday" : "星期四", "Friday" : "星期五", "Saturday" : "星期六"};
      this._animal = {"鼠" : "asset/rat.jpg",
                     "牛" : "asset/ox.jpg",
                     "虎" : "asset/tiger.jpg",
                     "兔" : "asset/rabbit.jpg",
                     "龍" : "asset/dragon.jpg",
                     "蛇" : "asset/snake.jpg",
                     "馬" : "asset/horse.jpg",
                     "羊" : "asset/sheep.jpg",
                     "猴" : "asset/monkey.jpg",
                     "雞" : "asset/rooster.jpg",
                     "狗" : "asset/dog.jpg",
                     "猪" : "asset/pig.jpg"};
      this._monthNames = ["January", "February", "March", "April", "May", "June",
                 "July", "August", "September", "October", "November", "December"];
      this._daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
      this._daysInMonthLeap = [31,29 ,31,30,31,30,31,31,30,31,30,31];
      this._offset = this.calOffSetOfMonth(this._month);
    }

    connectedCallback() {
      console.log(solar2lunar(new Date()));
        const _style =
        `
        <style>
          .container {
            box-shadow: 10px 5px 20px -3px black;
            max-width: 600px;
            text-align: center;
          }
          .circle {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: red;
            position: absolute;
          }
          .circle2 {
            width: 50%;
            height: 50%;
            border-radius: 50%;
            background: white;
            margin-left: 25%;
          }
          .daysOfWeek {
            background-color: lightskyblue;
            display: grid;
            grid-template-columns: repeat(7, auto);
          }
          .content {
            grid-gap: 5px;
            position: relative;
            display: grid;
            grid-template-columns: repeat(7, auto);
          }
          .bg1 {
            background: gray;
            position: absolute;
            width: 100%;
            height: 100%;
          }
          .monthAndYr{
            display: flex;
            align-items: center;
            justify-content: space-evenly;
          }
          .monthAndYr img{
            height:100px;
          }
          .dateFrame{
            position:relative;
            height:75px;
            background:white;
            border-radius:10px;
          }
          .dateFrame .chi-date{
            position:absolute;
            bottom:0;
          }
          .dateFrame .chi-climate-change{
            position:absolute;
            bottom:0;
            right:0;
          }
        </style>
        `
        const _template =
        `
        <div class="container" year="${this._year}">
          <section class="monthAndYr"><img src=${this._animal[this._lunarInfo.lunarYear]}><h1>${this._monthNames[this._month]} ${this._month+1}月 ${this._year}</h1></section>
          <section class="daysOfWeek">
          </section>
          <section class="content">
            <div class="bg1"></div>
          </section>
        </div>
        `;

        //create the component with style
        this.innerHTML = _style + _template;

        //fill out the days in a week on the calendar
        for (var property in this._dayOfWeek) {
          this.addMonToSun(property);
        }

        //fill out the info of the specific month in calendar
        this.fillCalInfo(this._month);

      }

      addMonToSun(val){
        let day = document.createElement('section');
        day.innerHTML = val + `<br>` +  this._dayOfWeek[val];
        let newDay = day.cloneNode(true);
        document.querySelector(".daysOfWeek").appendChild(newDay);
      }

      fillCalInfo(){
        let leap = ((this._year % 4 == 0) && (this._year % 100 != 0)) || (this._year % 400 == 0);
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
        //get lunarInfo of each date
        this.lunarInfo = solar2lunar(new Date(this._year,this._month,val));
        //set up template for each date
        this.todayCircle = `<div class="circle"><div class="circle2"><h1>${val}</h1></div></div>`;
        this.dateTemp =
        `
          <div class="dateFrame">
            ${((val === this._day )? this.todayCircle: `<h1>${val}</h1>`)}
            <div class="chi-date">
            ${this.lunarInfo.lunarDay}
            </div>
            <div class="chi-climate-change">
              ${((this.lunarInfo.lunarDay)? this.lunarInfo.solarTerms:"")}
            </div>
          </div>
        `;

        //set the offset position for the first day of the month and the rest will be position wrapping after the first date
        if(val == 1){
          document.querySelector(".content").innerHTML += this.dateTemp;
          document.querySelector(".dateFrame").style.gridColumnStart = this._offset+1;
          document.querySelector(".dateFrame").style.gridColumnEnd = this._offset+2;
        }else{
          document.querySelector(".content").innerHTML += this.dateTemp;
        }

        //change background of the date if it is the first day of chinese new year
        if(this.lunarInfo.lDay == 1 && this.lunarInfo.lMonth == 1){
          document.querySelectorAll(".dateFrame")[val-1].style.background = 'url(asset/newYear.png) white';
          document.querySelectorAll(".dateFrame")[val-1].style.backgroundSize = '100% 100%';
        }

      }

      calOffSetOfMonth(month){
        return new Date(this._year,month,1).getDay();
      }

      set year(val){
        this._year = val;
      }
  };

  customElements.define('ch-calendar', chineseCalendar);
}());
