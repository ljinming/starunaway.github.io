timers: setTimeout setInterval 的回调
I/O callbacks： 上一次执行的时候未完成的 io callback
idle，prepare ,内部使用
poll ：获取新的 io 事件
check ：执行 setImmediate 回调
close callbacks： socket 的 close 事件回调
