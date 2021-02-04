
class Circle {
  constructor(args) {
    let def = {
      p: {x:0,y:0},
      r: 100,
      lineTo: function (d, i) {
        return true;
      },
      getWidth: function (d, i) {
        return 1;
      },
      anglePen: function (t) {
        return 0;
      },
      virtical: false,
      getVirticalLength: function (i) {
        return 1;
      },
      hollow: false,
      hollowWidth: 0,
      hollowLength: 0,
      getHollowI: function (i) {
        return 1;
      },
      color: "rgba(255,255,255,0.8)" 
      
    };

    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw(ctx,degToPI,t) {
    ctx.save();
    for (var i = 1; i <= 360; i++) {
      let angle1 = i + this.anglePen(t);
      let angle2 = i - 1 + this.anglePen(t);
      let p1 = {x :this.r * Math.cos(angle1 * degToPI) , y: this.r * Math.sin(angle1 * degToPI)};
      let p2 = {x :this.r * Math.cos(angle2 * degToPI), y: this.r * Math.sin(angle2 * degToPI)};
      ctx.strokeStyle = this.color;
      if (this.lineTo(this, i)) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      if (this.vertical && this.getVirticalLength(i)) {
        let test = this.getVirticalLength(i);
        let p3 = {x: p1.x + (5 * test + 3) * Math.cos(angle1 * degToPI), y: p1.y + (5 * test + 3) * Math.sin(angle1 * degToPI)};
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineWidth = test;
        ctx.strokeStyle = test == 3 ? "#CA9D00" : "	rgba(242,133,0,0.5)";
        ctx.stroke();
      }
      if (this.hollow && this.getHollowI(i)) {
        let angleh = i + this.hollowWidth + this.anglePen(t);
        ctx.beginPath();
        ctx.arc(0, 0, this.r, angle1 * degToPI, angleh * degToPI);
        ctx.arc(0, 0, this.r + this.hollowLength, angleh * degToPI, angle1 * degToPI, -1);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    ctx.restore();
  }}

  export default Circle