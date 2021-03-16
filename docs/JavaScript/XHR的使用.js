let xhr;

if (window.XMLHttpRequest) {
  xhr = new window.XMLHttpRequest();
} else {
  xhr = new window.ActiveXObject();
}

xhr.open('METHOD', 'URL', true /* 是否异步，true 开启异步，fasle 同步*/);

xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send('param=s1&key=s2');

xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
  }
};
