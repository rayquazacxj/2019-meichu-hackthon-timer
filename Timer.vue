<template>
  <div class="widgets__timer">
    <canvas id="mycanvas"></canvas> 
  </div>
</template>

<script>
	import moment from 'moment'
	import dat from 'dat.gui'
  import Circle from '../../assets/js/circle'


	export default {
		name: 'Timer',
		data () {
			return {
        time : 0,
				degToPI : Math.PI / 180,
				controls : {
          year: 2019,
          month: 8,
          day: 27,
          hour: 7,
          min: 10,
          sec: 30 
        },
				circles : [],
        circles2 : [],
        canvas : null,
        ctx: null,
        ww: 0,
        wh: 0,
			}
    },
    mounted(){
        this.setDatGui()
        this.canvas = document.getElementById("mycanvas")
        this.ctx = this.canvas.getContext("2d")
        this.initCanvas()
        this.init(this.time)
        setInterval(this.update, 1000 / 30)
        window.requestAnimationFrame(this.draw(this.ctx,this.ww,this.wh,this.controls,this.time))
        window.addEventListener("resize", this.initCanvas())
    },
		methods: {
			initCanvas() {
        if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
          this.wh  = this.canvas.height = 700* window.innerHeight/window.screen.availHeight;  
          this.ww = this.canvas.width = 1200 * window.innerWidth/window.screen.availWidth; 
        }
        else {
          this.wh = this.canvas.height = window.innerHeight;
          this.ww = this.canvas.width = window.innerWidth;
        } 
      },
      init(time) {
        this.circles.push(new Circle({
          r: 100,
          color: "rgba(127,255,0,0.9)",
          lineTo: function (d, i) {
            return false;
          },
          anglePen: function () {
            return -time / 2;
          },
          hollow: true,
          hollowWidth: 2,
          hollowLength: 30,
          getHollowI: function (i) {
            return i % 6 == 0;
          } }));
        this.circles.push(new Circle({
          r: 130,
          color: "rgba(102, 225,0,0.5)",
          lineTo: function (d, i) {
            return false;
          },
          anglePen: function () {
            return time / 2;
          },
          hollow: true,
          hollowWidth: 59,
          hollowLength: 20,
          getHollowI: function (i) {
            return i % 60 == 0;
          } }));
        this.circles.push(new Circle({
          r: 155,
          color: "rgba(39, 139, 34,1)",
          lineTo: function (d, i) {
            return false;
          },
          anglePen: function () {
            return -time / 4;
          },
          hollow: true,
          hollowWidth: 34,
          hollowLength: 30,
          getHollowI: function (i) {
            return i % 36 == 0;
          } }));
        this.circles.push(new Circle({
          r: 150,
          lineTo: function (d, i) {
            return 0;
          },
          anglePen: function () {
            return time / 6;
          },
          vertical: true,
          getVirticalLength: function (i) {
            if (i % 120 != 0) return 0;else
            {
              if (!(i / 6 % 5)) return 3;else
              return 2;
            }
          } }));
        this.circles.push(new Circle({
          r: 152,
          lineTo: function (d, i) {
            return i % 120 < 60;
          },
          anglePen: function () {
            return time / 6;
          } }));
        this.circles.push(new Circle({
          r: 185,
          color: "#003000",
          lineTo: function (d, i) {
            return 0;
          },
          hollow: true,
          hollowWidth: 40,
          hollowLength: 34,
          getHollowI: function (i) {
            return i % 180 < 60;
          },
          anglePen() {
            return time % 500 * Math.sin(-time / 75);
          } }));
        this.circles.push(new Circle({
          r: 199,
          color: "#006000",
          lineTo: function (d, i) {
            return true;
          } }));
        this.circles.push(new Circle({
          r: 236,
          lineTo: function (d, i) {
            return 0;
          },
          vertical: true,
          getVirticalLength: function (i) {
            if (!(i / 6 % 5)) return 3;else
            if (!(i % 15)) return 2;else
            return 1;
          },
          anglePen() {
            return time / 10;
          } }));
        //--------------------------------------
        //timer2
        this.circles2.push(new Circle({
          r: 100,
          color: "#e8300b",
          lineTo: function (d, i) {
            return false;
          },
          anglePen: function () {
            return -time/2;
          },
          hollow: true,
          hollowWidth: 2,
          hollowLength: 30,
          getHollowI: function (i) {
            return i % 6 == 0;
          } }));
        this.circles2.push(new Circle({
          r: 134,
          color: "#c19919",
          lineTo: function (d, i) {
            return false;
          },
          anglePen: function () {
            return time/2.5;
          },
          hollow: true,
          hollowWidth: 3,
          hollowLength: 3,
          getHollowI: function (i) {
            return 1;
          } }));
        this.circles2.push(new Circle({
          r: 140,
          color: "rgba(249, 229, 9,0.9)",
          lineTo: function (d, i) {
            return false;
          },
          anglePen: function () {
            return 60*Math.sin(time/100) ;
          },
          hollow: true,
          hollowWidth: 3,
          hollowLength: 30,
          getHollowI: function (i) {
            return i % 7 == 0;
          } }));
        this.circles2.push(new Circle({
          r: 178,
          color: "red",
          lineTo: function (d, i) {
            return false;
          },
          anglePen: function () {
            return time / 4;
          },
          hollow: true,
          hollowWidth: 3,
          hollowLength: 3,
          getHollowI: function (i) {
            return 1;
          } }));
        this.circles2.push(new Circle({
          r: 175,
          color: "#efbf2f",
          lineTo: function (d, i) {
            return false;
          },
          anglePen: function () {
            return -time / 4;
          },
          hollow: true,
          hollowWidth: 3,
          hollowLength: 8,
          getHollowI: function (i) {
            return i % 180 < 60;
          } }));
        this.circles2.push(new Circle({
          r: 200,
          color: "rgba(252, 240, 12,0.4)",
          lineTo: function (d, i) {
            return false;
          },
          anglePen: function () {
            return time % 500 * Math.cos(time / 75);
          },
          hollow: true,
          hollowWidth: 3,
          hollowLength: 3,
          getHollowI: function (i) {
            return i % 120 < 60;
          } }));
        this.circles2.push(new Circle({
          r: 236,
          lineTo: function (d, i) {
            return 0;
          },
          vertical: true,
          getVirticalLength: function (i) {
            if (!(i / 6 % 5)) return 3;else
            if (!(i % 15)) return 2;else
            return 1;
          },
          anglePen() {
            return time / 10;
          } }));
      },
      update() {
        this.time++;
      },
      draw(ctx,ww,wh,controls,time) {
        let widthRatio = window.innerWidth/window.screen.availWidth
        let heightRatio = window.innerHeight/window.screen.availHeight
        //清空背景(之前畫的)
        ctx.fillStyle = "black";
        ctx.save()
        ctx.fillRect(0, 0, ww, wh)
        if(!/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ctx.translate(30,0)
        //------------------------
        var currentTime = new moment();
        var taipeiTime = currentTime.utc().utcOffset(480);
        var targetTime = new moment([controls.year, controls.month-1, controls.day, controls.hour, controls.min, controls.sec,0]) 
        var dur = new moment.duration(targetTime.diff(taipeiTime))
        
        var hours = Math.floor(dur.asHours());
        var mins = Math.floor(dur.asMinutes()) - hours * 60;
        var secs = Math.floor(dur.asSeconds()) - hours * 60 * 60 - mins * 60
        //-----------------------
        //currentTime
        ctx.save()
          if(window.screen.availWidth<400 && window.screen.availHeight<700){
            ctx.translate(ww/2,wh/4)
            ctx.scale(widthRatio*0.5 , widthRatio*0.5)
          }else if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
            ctx.translate(ww/2,wh/4)
            ctx.scale(widthRatio*0.65 , widthRatio*0.65)
          }else if(window.screen.availWidth<800 ){
            ctx.translate(ww/3-80*widthRatio,wh/2-100*heightRatio)
            ctx.scale(widthRatio*0.75 , widthRatio*0.75)
          }else {
            ctx.translate(ww/4,wh/2 - 30)
            ctx.scale(widthRatio,widthRatio)
          }
          
          this.circles.forEach((obj,i)=>{
            obj.draw(ctx,this.degToPI)
          })
          ctx.fillStyle="white"
          ctx.font = "20pt Arial";
          ctx.fillText(currentTime.format("YYYY/MM/DD"),-65,-20)
          ctx.font = "40pt Arial";
          ctx.fillText(currentTime.format("HH:mm:ss"),-105,30)
        ctx.restore()
        //------------------------
        //targetTime
        ctx.save();
        if(window.screen.availWidth<400 && window.screen.availHeight<700){
            ctx.translate(ww/2,(wh*3/4) -100)
            ctx.scale(widthRatio*0.5 , widthRatio*0.5)
        }else if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
          ctx.translate(ww/2,wh*3/4 -100)
          ctx.scale(widthRatio*0.65 , widthRatio*0.65)
        } else if(window.screen.availWidth<800 ){
          ctx.translate(ww/2+160*widthRatio,wh/2)
          ctx.scale(widthRatio*0.75 , widthRatio*0.75)
        }else {
          ctx.translate(ww*3/4 -30,wh/2)
          ctx.scale(widthRatio,widthRatio)
        }
        
          this.circles2.forEach((obj, i) => {
            obj.draw(ctx,this.degToPI);
          });
        
          let rt = (targetTime.isBefore(currentTime))? "time's up!":((hours > 9) ? hours : ("0" + hours)) + ":" + ((mins > 9) ? mins : ("0" + mins)) + ":" + ((secs > 9) ? secs : ("0" + secs));
          if(targetTime.isBefore(currentTime)){
            ctx.font = "35pt Arial";
            ctx.fillStyle="white"
          }else{
            ctx.font = "38pt Arial";
            ctx.fillStyle="#CA9D00"
          }
          ctx.fillText(rt,-100,20)
          ctx.moveTo(-60,40)
          ctx.lineTo(60,40)
          ctx.lineWidth=2
          ctx.strokeStyle="red"
          ctx.stroke()
        ctx.restore()
        //------------------------
        //Polygon
        ctx.save()
        if(window.screen.availWidth<400 && window.screen.availHeight<700){
            ctx.translate(ww/2,(wh*3/4) -100)
            ctx.scale(widthRatio*0.5 , widthRatio*0.5)
        }else if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
          ctx.translate(ww/2,wh*3/4 -100)
          ctx.scale(widthRatio*0.65, widthRatio*0.65)
        } else if(window.screen.availWidth<800 ){
          ctx.translate(ww/2+160*widthRatio,wh/2)
          ctx.scale(widthRatio*0.75 , widthRatio*0.75)
        }else {
          ctx.translate(ww*3/4 -30,wh/2)
          ctx.scale(widthRatio,widthRatio)
        }
        
          ctx.beginPath()
            for(var i=0;i<6;i++){
              let polygonAngle = 360/6 *this.degToPI
              ctx.moveTo(130*Math.sin(polygonAngle*i-time/50),130*Math.cos(polygonAngle*i-time/50))
              ctx.lineTo(130*Math.sin(polygonAngle*(i+1)-time/50),130*Math.cos(polygonAngle*(i+1)-time/50))
            }
          //ctx.closePath()
          ctx.strokeStyle="rgba(237, 221, 47,0.9)"
          ctx.lineWidth=3
          ctx.stroke()
        ctx.restore()
        //------------
        ctx.restore()
        window.requestAnimationFrame(this.draw(ctx,ww,wh,controls,time))
        
      },
      setDatGui(){
          var gui = new dat.GUI();
          gui.add(this.controls, "year", 2019, 2100).step(1);
          gui.add(this.controls, "month", 1, 12).step(1);
          gui.add(this.controls, "day", 1, 31).step(1);
          gui.add(this.controls, "hour", 0, 23).step(1);
          gui.add(this.controls, "min", 0, 59).step(1);
          gui.add(this.controls, "sec", 0, 59).step(1);
          gui.domElement.style = 'position:absolute;top:0px;left:0px;width:50px';
      }
		}
	}
</script>
<style lang='scss' scoped>
  .widgets__timer {
    width: 100%;
    height: 600px;
    background-color: greenyellow;
  }
</style>