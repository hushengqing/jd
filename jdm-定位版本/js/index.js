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

// 功能1: 页面滚动, 需要动态设置头部透明度
;(function() {

  /*
  * 思路:
  * 1. 监听 scroll 事件
  * 2. 获取 卷去高度 scrollTop
  * 3. 动态计算透明度
  *    0 => 0
  *    600 => 0.9
  *    如果在 600内, 等比例计算, scrollTop/600 = opacity/0.9
  *    如果 > 600, 直接透明度 0.9
  * */
  var header = document.querySelector(".jd_header");
  window.addEventListener("scroll", function() {
    // 获取页面卷去高度
    //var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    var scrollTop = window.pageYOffset;
    var opacity = 0;
    // 动态计算透明度
    if ( scrollTop > 600 ) {
      opacity = 0.9;
    }
    else {
      opacity = scrollTop / 600 * 0.9;
    }
    // 设置给头部
    header.style.backgroundColor = "rgba(222, 24, 27, " + opacity + ")";
  })
})();


// 功能2: 动态设置秒杀产品 ul 的宽度
;(function() {

  // 思路:
  // 1. 获取 ul
  // 2. 获取 所有的 li, 得到有多少个 li
  // 3. 获取 li 的宽度
  // 4. 计算 ul 的宽度, 设置给 ul
  var ul = document.querySelector(".seckill_product ul");
  var lis = ul.children;
  var liWidth = lis[0].offsetWidth;

  ul.style.width = lis.length * liWidth + "px";
})();


// 功能3: 倒计时功能
;(function() {

  var spans = document.querySelectorAll(".seckill_title .time span:nth-child(2n+1)");

  // 思路:
  // 1. 倒计时的时间 = 秒杀时间 - 当前时间    (时间戳 ms)
  // 2. 转换成 时分秒
  // 3. 将时间设置给对应的 span
  // 4. 添加定时器, 让他动起来

  // 一进入页面需要调用一次
  setTime();

  var timer = setInterval(setTime, 1000);

  function setTime() {
    var now = new Date();
    // (1) new Date(时间戳)
    // (2) new Date(字符串)   new Date("2018-6-18 12:00:00")
    //     在 ios 里面 safari 浏览器, 不支持带 - 的日期格式, 支持 /
    //     new Date("2018/6/18 12:00:00")
    // (3) new Date(年, 月, 日, 时, 分, 秒);  需要注意: 月份从 0开始
    //     new Date(2018, 5, 18, 12, 0, 0 );
    var seckillTime = new Date("2018/6/16 12:42:00");

    var time = parseInt( (seckillTime - now) / 1000 ); // 转换成秒

    // 如果时间到了, 或者是过去的时间, 清除定时器
    if ( time <= 0 ) {
      time = 0;
      clearInterval( timer );
    }

    var hours = parseInt( time / 3600  ); // 一小时 = 3600秒
    var minites = parseInt( time / 60 ) % 60; // 一分钟 = 60秒, 总的分钟数对60取余
    var seconds = time % 60;

    console.log( hours + ":" + minites + ":" + seconds );

    // 将时分秒设置给对应的 span
    spans[0].innerHTML = addZero( hours );
    spans[1].innerHTML = addZero( minites );
    spans[2].innerHTML = addZero( seconds );
  }

  // 给小于10的数字前面 + 0
  function addZero ( n ) {
    return n < 10 ? "0" + n : n;
  }
})();


// 功能4: 京东快报
;(function() {
  /*
  * 思路分析:
  * 1. 往上移动的是 ul
  * 2. 每次移动距离, 一个 li 的高度, transform: translateY(-30px);
  * */
  var ul = document.querySelector( ".jd_news .info ul" );
  var lis = ul.children;
  var liHeight = lis[0].offsetHeight;

  var index = 0; // 计数器
  setInterval(function() {

    //if ( index >= lis.length - 1 ) {
    //  index = 0;
    //  // 并且瞬间归位
    //  ul.style.transition = "none";
    //  ul.style.webkitTransition = "none";
    //  ul.style.transform = "translateY(0px)";
    //  ul.style.webkitTransform = "translateY(0px)";
    //}

    // 浏览器会维护一个样式队列, 等 js 执行完了, 一次性进行渲染, 只会触发一次回流和重绘
    // 浏览器为了保证获取性操作的准确性, 在用户执行获取性操作时, 会强制刷新 浏览器渲染队列
    //ul.offsetWidth;

    index++;
    ul.style.transition = "all .5s";
    ul.style.webkitTransition = "all .5s";
    ul.style.transform = "translateY(-" + index * liHeight + "px)";
    ul.style.webkitTransform = "translateY(-" + index * liHeight + "px)";

  }, 1000);


  // 当盒子完全抵达最后一个假的li的时候, 瞬间切换成第一个的位置
  ul.addEventListener("transitionend", function() {

    if ( index >= lis.length - 1 ) {
      index = 0;
      // 不需要有动画
      ul.style.transition = "none";
      ul.style.webkitTransition = "none";
      ul.style.transform = "translateY(0px)";
      ul.style.webkitTransform = "translateY(0px)";
    }

  })



})();

//定位板轮播图
;(function() {

  // onload 事件等待图片加载完, li 才有高度, 将来设置给 ul
  window.addEventListener("load", function() {
    // 获取 li 的高度, 设置给 ul
    var ul = document.querySelector(".jd_banner ul");
    var lis = ul.children;
    var liHeight = lis[0].offsetHeight;
    var width = lis[0].offsetWidth; // 获取一个li的宽度
    var points = document.querySelectorAll(".jd_banner ol li");

    // 控制定时器的时间
    var interval = 4000;

    // 设置给ul
    ul.style.height = liHeight + "px";

    // 三个最关键的位置, 将三个关键位置的索引初始化好
    var prev = lis.length - 1;
    var now = 0;
    var next = 1;

    // 将三张图片, 根据三个关键位置存的下标, 将图片移动过来
    lis[prev].style.transform = "translateX(" + (-width) +"px)";
    lis[now].style.transform = "translateX(0px)";
    lis[next].style.transform = "translateX(" + width + "px)";


    // 显示下一张图片
    function showNext() {
      // 1. 将 prev 里面存的索引 所对应图片放到牌堆 (不需要过渡)
      lis[prev].style.transition = "none";
      lis[prev].style.transform = "translateX(" + 2 * width + "px)";

      // 2. 更新三个关键位置所存的图片索引
      prev = now;
      now = next;
      next++;

      // 如果 next 超过了最大值, 说明没图片了, 应该重新从 0 开始, 下一张应该是第0张了
      if ( next > lis.length - 1 ) {
        next = 0;
      }

      // 3. 将三张图片, 根据三个关键位置存的下标, 把图片移动过来
      // 添加过渡
      lis[prev].style.transition = "all .5s";
      lis[now].style.transition = "all .5s";
      lis[next].style.transition = "all .5s";

      lis[prev].style.transform = "translateX(" + (-width) +"px)";   // 0
      lis[now].style.transform = "translateX(0px)";  // 1
      lis[next].style.transform = "translateX(" + width + "px)";  // 2

      // 4. 设置小圆点, 根据 now 设置即可, 让now索引的小圆点添加 current类, 其他的移除current
      points.forEach(function( v, i ) {
        v.classList.remove("current");
      })
      points[ now ].classList.add("current");
    }

    // 显示上一张图片
    function showPrev() {
      // 1. 将 next 里面存的索引 所对应图片放到牌堆 (不需要过渡)
      lis[next].style.transition = "none";
      lis[next].style.transform = "translateX(" + 2 * width + "px)";

      // 2. 更新三个关键位置所存的图片索引
      next = now;
      now = prev;
      prev--;

      // 如果 prev 小于 0, 说明已经没有更小索引的图片了, 需要更新成最后一张的索引
      if (prev < 0) {
        prev = lis.length - 1;
      }

      // 3. 将三张图片, 根据三个关键位置存的下标, 把图片移动过来
      // 添加过渡
      // prev 不需要动画
      lis[prev].style.transition = "none";
      lis[now].style.transition = "all .5s";
      lis[next].style.transition = "all .5s";

      lis[prev].style.transform = "translateX(" + (-width) +"px)";   // 0
      lis[now].style.transform = "translateX(0px)";  // 1
      lis[next].style.transform = "translateX(" + width + "px)";  // 2

      // 4. 设置小圆点, 根据 now 设置即可, 让now索引的小圆点添加 current类, 其他的移除current
      points.forEach(function( v, i ) {
        v.classList.remove("current");
      })
      points[ now ].classList.add("current");
    }

    var timer = setInterval(showNext, interval);


    /*
    * touchstart:
    * 1. 记录开始时间(实现快滑),
    * 2. 记录开始位置(将来计算移动的距离)
    * 3. 清除定时器
    * */
    var startTime = 0;
    var startX = 0;
    ul.addEventListener("touchstart", function( e ) {
      startTime = new Date();
      startX = e.touches[0].clientX;
      clearInterval(timer);
    });

    /*
    * touchmove
    * 获取移动的位置, 让 三张 位置对应的图片, 跟着手指一起移动
    * */
    ul.addEventListener("touchmove", function( e ) {
      var distanceX = e.touches[0].clientX - startX;

      // 移动的时候, 不需要过渡
      lis[prev].style.transition = "none";
      lis[now].style.transition = "none";
      lis[next].style.transition = "none";

      // 需要在原来位置的基础上移动 distanceX 的距离
      lis[prev].style.transform = "translateX(" + (-width+distanceX) +"px)";
      lis[now].style.transform = "translateX(" + distanceX +"px)";
      lis[next].style.transform = "translateX(" + (width+distanceX) + "px)";

    });

    /*
    * touchend
    * 1. 根据滑动的距离, 判断是否满足切换的条件, 如果满足, 切换, 如果不满足, 归位
    * 2. 重新开启定时器
    * */
    ul.addEventListener("touchend", function( e ) {
      var distanceX = e.changedTouches[0].clientX - startX; // 移动的距离
      var time = new Date() - startTime; // 求得滑动的时间

      // 满足条件的两种情况
      // (1) 距离超过 1/3, 就可以切换
      // (2) 时间 < 200ms, 距离大于 50, 也可以切换

      if ( distanceX > width / 3 || (time < 200 && distanceX > 50) ) {
        // 需要切换, 往右滑, 显示上一张
        showPrev();
      }
      else if ( distanceX < -width / 3 || ( time < 200 && distanceX < -50 )) {
        // 需要切换, 往左滑, 显示下一张
        showNext();
      }
      else {
        // 需要让三张图片回到原来的位置
        // 添加动画, 进行归位
        lis[prev].style.transition = "all .5s";
        lis[now].style.transition = "all .5s";
        lis[next].style.transition = "all .5s";

        lis[prev].style.transform = "translateX(" + (-width) +"px)";
        lis[now].style.transform = "translateX(0px)";
        lis[next].style.transform = "translateX(" + width + "px)";
      }
      // 重新开启定时器
      timer = setInterval(showNext, interval);
    });

    // 1. 屏幕变化时, 需要更新用来计算的 width
    // 2. ul 的高度是被 li 撑开的, li改变高度, ul 也要动态设置高度
    window.addEventListener("resize", function() {
      width = lis[0].offsetWidth;
      ul.style.height = lis[0].offsetHeight + "px";

      // 需要根据三个位置的索引, 设置三张图片的位置, 不需要动画
      lis[prev].style.transition = "none";
      lis[now].style.transition = "none";
      lis[next].style.transition = "none";

      lis[prev].style.transform = "translateX(" + (-width) +"px)";
      lis[now].style.transform = "translateX(0px)";
      lis[next].style.transform = "translateX(" + width + "px)";
    })

  })
  
  
})();




