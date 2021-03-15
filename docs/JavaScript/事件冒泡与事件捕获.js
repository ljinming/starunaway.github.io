// 通过事件代理绑定 监听事件
const ul = document.getElementsByTagName('ul')[0];
ul.addEventListener('click', (e) => {
  const target = e.target;
  const lis = this.querySelector('li');
  const index = Array.prototype.indexOf.call(lis, target);
  console.log('index', target.innerHTML);
});

// addEventListener(事件,回调函数，是否冒泡：默认false，处于冒泡阶段；为true，处于捕获阶段)

// 全局拦截，根据权限阻止事件
window.addEventListener(
  'click',
  (e) => {
    if (noPermission) {
      e.stopPropagation();
    }
  },
  true
);
