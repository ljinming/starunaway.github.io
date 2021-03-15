const img = document.querySelectorAll('img');
const num = img.length;
let n = 0;

function lazyLoad() {
  let seeHeight = window.innerHeight;
  let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  for (let i = n; i < num; i++) {
    // 进入可视区域内
    if (img[i].offsetTop < seeHeight + scrollTop) {
      if (!img.src) {
        img.src = '真实的URL';
      }
    }
  }
}

// IntersectionObserver 观察进入可是区域

var io = new IntersectionObserver((entries) => {
  // entries[0].intersectionRatio  // 在可视区域内的范围
}, option);
io.observe(document.getElementById('example'));

// preload: 讲资源率先加载，等到需要的时候再去使用
// prefetch: 未来可能用到，浏览器在空闲的时候去加载
//  -- dns-prefetch  对于DNS在幕后进行解析为IP地址
//  -- prerender 对于将要进行加载的网页进行预执行，并且加载很多资源（会耗费带框）慎用
// preconnect HTTP发送请求前的操作进行预操作，比如说解析DNS、建立SSL，建立TCP握手

// 在A页面通往B页面的时候，preload会失效，而prefetch并不会失效。
// preload可以用as来指明加载的类型，从而设置优先级，但是prefetch却不可以
