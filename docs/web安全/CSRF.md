用户打开一个地址的时候，也对另一个地址发起了请求

比如 img url = "攻击者地址"，把攻击者地址作为图片外链上传到服务器

其他用户在加载这张图片的时候，浏览器会对图片地址发起请求

解决方法：
服务端在收到路由请求时，生成一个随机数，在渲染请求页面时把随机数埋入页面（一般埋入 form 表单内，<input type="hidden" name="_csrf_token" value="xxxx">）
服务端设置 setCookie，把该随机数作为 cookie 或者 session 种入用户浏览器
当用户发送 GET 或者 POST 请求时带上\_csrf_token 参数（对于 Form 表单直接提交即可，因为会自动把当前表单内所有的 input 提交给后台，包括\_csrf_token）
后台在接受到请求后解析请求的 cookie 获取\_csrf_token 的值，然后和用户请求提交的\_csrf_token 做个比较，如果相等表示请求是合法的。
