document.querySelector('.imgWrap').style.backgroundImage.replace('url("', '').replace('\")', '')


var imgsrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABmCAIAAADDHA3TAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACrklEQVR4nO2bPW7bQBBGLTdOFR8kvkOqADlGlCs4x/AZ7GM4SJrkDrmIO3dMIUCFIJHLn5lv59N7JbH+YMzjjJZccDcMww34cqv+ByAWBJuDYHMQbA6CzUGwOQg2B8HmINgcBJuDYHNSBX//+4HkZHYJhw1na/T8+f06k5OJFXws00lpLl33TpYQKPhQkZFyTC5wSlYR+xs8Xog1ZaqYLCFKcPveZO4upmKykMAObrnZlzVExWQVPAebEyK4n9nYQ7KWEMFzh1j7+orJWhjR5gQKbhliywZdxWQVUYJ7mI39JAuJHdHjN/uaVqiYLIF30XnJEjhNyk7OZkhk/+eO5GQyOhiE8BxsDoLNQbA5CDYHweYg2BwEm4NgcxBsDoLNQbA5CDYnSfDvhx8kS4g9TTpboy//nq4zWUKU4GOZTkpz6bp3spAQwYeKjJRjcoFTspao3+DxQqwpU8VkIdsLbt+bzN3FVEyWE9LBLTf7soaomKyF52BzNhbcz2zsIbkHNhY8d4i1r6+Y3AOMaHNCBLcMsWWDrmKylu0F9zAb+0mWEzWix2/2Na1QMVkI76IzkoVwmpSXrCHnG7dfnx5JlsDXhebwHGwOgs1BsDkINgfB5iDYHASbg2BzEGwOgs1BsDkINidb8M/7PcmZJJ0mna3R17eX60zOJFzw5O2/uGTH5JOES9d7SM4nVnDjcFtQr0PyyB9OLshPllB4kzVe4jUC4pLzCRTcvjeZu4upmKyiage3tNGyVotLllBVMDQSJbif2dhDspAowXOHWPv6islCGNHmVBXcMh6XjdC4ZAmBgnuYjf0kq6jawTdTbbSmyeKS8+FddGpyPpwmCZJTSf7Y7fXjN5Iz4etCcwpvsqAFBJuDYHMQbA6CzUGwOQg2B8HmINgcBJuDYHMQbM5/3E1qWM7CntYAAAAASUVORK5CYII=";


var img = new Image();

img.onload = function(){
  loaded()
}

img.src = imgsrc;




function loaded(){

  var c = document.createElement("canvas");

  var ctx = c.getContext("2d");

  c.width = img.width;
  c.height = img.height;

  ctx.drawImage(img, 0, 0);


  var imgData = ctx.getImageData(0, 0, c.width, c.height);

  for (var i = 0; i < imgData.data.length; i += 4) {
    var r = imgData.data[i];
    var g = imgData.data[i+1];
    var b = imgData.data[i+2];
    var a = imgData.data[i+3];

    if(r + b + g + a < 255 * 4){
      imgData.data[i] = 0;
      imgData.data[i+1] = 0;
      imgData.data[i+2] = 0;
    }

  }

  ctx.putImageData(imgData, 0, 0);


  var pixelMap = new Array(imgData.width).fill(new Array(imgData.height).fill(undefined));
  var dotCords = [];


  for(var y = 0; y < pixelMap[0].length; y++){
    for(var x = 0; x < pixelMap.length; x++){

      var i = 4*(x + y * imgData.width);
      var r = imgData.data[i];
      var g = imgData.data[i+1];
      var b = imgData.data[i+2];
      var a = imgData.data[i+3];

      var res = (r + g + b + a < 255 * 4) ? 1 : 0;

      pixelMap[x][y] = res;

      if(res){
        dotCords.push({
          x: x,
          y: y
        })
      }

    }
  }

  var circleDia = 17;
  var circles = [];

  var lastMax = 0;

  for (var i = 0; i < 3; i++) {

    var min = (Math.min.apply(Math, dotCords.filter((d)=>{
      return d.y > lastMax
    }).map((d)=>{return d.y})))

    var row = dotCords.filter((d)=>{
      return d.y == min
    })

    row.forEach((d)=>{
      var l = dotCords.filter((_d)=>{
        return _d.x == d.x && _d.y < d.y + circleDia && _d.y >= d.y
      });

      ctx.fillStyle = "#0000FF";
      l.forEach((_l)=>{
        ctx.fillRect(_l.x, _l.y, 1, 1);
      })

      ctx.fillStyle = "#FF0000";
      ctx.fillRect(d.x, d.y, 1, 1);

      circles.push( circleDia == l.length ? 1 : 0 );
    })

    lastMax = min + circleDia

  }

  circles.forEach((c, i)=>{
    c == 1 && document.querySelectorAll('.inputWrap > input')[i].click()
  })

  document.querySelector('button[type="submit"]').click()


}
