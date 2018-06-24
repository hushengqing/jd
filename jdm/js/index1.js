/**
 * Created by Jepson on 2018/6/14.
 */

// 功能需求:
// 功能1: 页面滚动, 需要动态设置头部透明度
// 功能2: 动态设置秒杀产品 ul 的宽度
// 功能3: 倒计时功能
// 功能4: 京东快报
// 功能5: 京东轮播图




// 注意: 如果使用无分号规范, 需要在所有 () [] `` 开头的前面, 都要加分号, 闭合语句


//功能1 页面滚动，动态设置头部透明度
;(function () {
  var jd_header = document.querySelector('.jd_header');
  window.addEventListener('scroll', function () {
    // console.log(jd_header);
//  获取页面滚动距离
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    var opacity = 0;
    // console.log(scrollTop);
    if (scrollTop > 600) {
      opacity = 0.9;
    }else {
      opacity = scrollTop / 600 * 0.9;
    }
    jd_header.style.backgroundColor = "rgba(222, 24, 27, "+ opacity +")";
  })
})();
  
//  功能2动态秒杀部分产品的宽度
;(function () {
  //获取单个li的宽度 算出总宽度
  var ul = document.querySelector(".seckill_product ul");
  var lis = ul.children;
  // console.log(lis);
  var liWidth = lis[0].offsetWidth;
  var ulWidth = liWidth * lis.length;
  ul.style.width = ulWidth + 'px';
  new IScroll(".seckill_product", {
    scrollX: true,
    scrollY: false
  })
})();
  
//  3.京东秒杀倒计时功能
;(function () {
  //  3.1获取当前时间
  var spans = document.querySelectorAll(".seckill_title .time span:nth-child(2n+1)");
  setTime();
  var timer = setInterval(setTime, 1000);
  function setTime() {
    var nowTime = new Date();
    var skillTime = new Date("2018/06/22 12:00:00");
    var time = parseInt((skillTime - nowTime) /1000);
  
    if (time <= 0) {
      time = 0;
      clearInterval(timer);
    }
    
    var hours = parseInt(time / 3600);
    var minutes = parseInt(time / 60) % 60;
    var secondes = time % 60;
    spans[0].innerHTML = addZero(hours);
    spans[1].innerHTML = addZero(minutes);
    spans[2].innerHTML = addZero(secondes);
  }
  function addZero(n) {
    return n < 10 ? "0" + n : n;
  }
})();

// 4 京东快报轮播
;(function () {
  var ul = document.querySelector(".jd_news .info ul");
  var lis = ul.children;
  var liHeight = lis[0].offsetHeight;
  // console.log(liHeight);
  var index = 0;
  setInterval(function () {
    index++;
    ul.style.transition = "all .5s";
    ul.style.transform = "translateY(" + (-index * liHeight) + "px)";
  }, 1000);
  //监听动画结束
  ul.addEventListener("transitionend", function () {
    if (index >= lis.length - 1) {
      index = 0;
      ul.style.transition = "none";
      ul.style.transform = "translateY(0px)";
    }
  })
})();


// 5.轮播图动起来
;(function () {
  var ul = document.querySelector(".jd_banner ul");
  var points = document.querySelectorAll(".jd_banner ol li");
  var lis = ul.children;
  var liWidth = lis[0].offsetWidth;
  var index = 1;
  var timer = setInterval(function () {
    index++;
    ul.style.transition = "all .5s";
    ul.style.transform = "translateX("+ -index * liWidth +"px)";
  }, 2000);
  
  ul.addEventListener("transitionend", function () {
    if (index >=lis.length - 1) {
      index = 1;
      ul.style.transition = "none";
      ul.style.transform = "translateX("+ (-index * liWidth) +"px)";
    }
  
    if (index <= 0) {
      index = lis.length - 2;
      ul.style.transition = "none";
      ul.style.transform = "translateX("+ (-index * liWidth) +"px)";
    }
    //  同步小圆点
    points.forEach(function (v, i) {
      v.classList.remove("current");
    })
    points[index - 1].classList.add("current");
  });
  
//  手指滑动事件
  var startX = 0;
  var startTime = 0;
  ul.addEventListener("touchstart", function (ev) {
    console.log(ev);
   startX = ev.touches[0].clientX;
   startTime = new Date();
   clearInterval(timer);
  })
  ul.addEventListener("touchmove", function (ev) {
    var distanceX = ev.touches[0].clientX - startX;
    ul.style.transition = "none";
    ul.style.transform = "translateX("+ (-index * liWidth + distanceX) +"px)";
  })
  ul.addEventListener("touchend",function (ev) {
    var distanceX = ev.changedTouches[0].clientX - startX;
    var time = new Date() - startTime;
    if (distanceX > liWidth / 3 ||(time < 200 && distanceX > 50)) {
      index--;
    }else if (distanceX < - liWidth / 3 ||(time < 200 && distanceX < -50 )) {
      index++;
    }
    //归位
    ul.style.transition = "all .5s";
    ul.style.transform = "translateX("+ (-index * liWidth) +"px)";
    
  //  开启定时器
    timer = setInterval(function () {
      index++;
      ul.style.transition = "all .5s";
      ul.style.transform = "translateX("+ -index * liWidth +"px)";
    }, 2000);
  })
  
//  当屏幕宽度发生改变时，重新获取下宽度
  window.addEventListener("resize",function () {
    liWidth = lis[0].offsetWidth;
  //  根据index重新设置ul的位置
    ul.style.transition = "none";
    ul.style.transform = "translateX("+ (-index * liWidth) +"px)";
  })
})();
  
  
  
  
  
  


