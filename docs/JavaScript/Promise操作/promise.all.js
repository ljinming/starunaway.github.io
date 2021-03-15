function promiseAll(promiseArr) {
  if (!Array.isArray(promiseArr)) {
    throw new Error('not a array');
  }
  return new Promise((resolve, reject) => {
    let result = [];
    let count = 0;
    const len = promiseArr.length;
    for (let i = 0; i < len; i++) {
      // promiseArr 可以是一个非promise，使用Promise.resolve 直接返回一个resolve的promise
      Promise.resolve(promiseArr[i])
        .then((value) => {
          count++;
          result[i] = value; // 保证promise 结果有序
          if (count === length) {
            resolve(result);
          }
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}

<div class='time'>
  距结束
  <span class='text'>15</span>
  天
  <span class='text'>08</span>
  时
  <span class='text'>30</span>
  分
  <span class='text'>30</span>
  秒
</div>;


$(".time").innerHtml = "
距结束
<span class='text'>25</span>
天
<span class='text'>18</span>
时
<span class='text'>30</span>
分
<span class='text'>30</span>
秒
"


setInterval(()=>{
	this.setState({time:11})
},1000)

function setState(){
	//... 一堆逻辑


	document.innerHtml = ""
}

