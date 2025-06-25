// 定义一个函数，用于获取系统时间并显示在网页上
function showTime() {
    // 获取当前时间
    var date = new Date();
    
    // 格式化时间为年-月-日 时:分:秒
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // 在月份前面填充0，使其长度为2
    var day = date.getDate().toString().padStart(2, '0'); // 在日期前面填充0，使其长度为2
    var hour = date.getHours().toString().padStart(2, '0'); // 在小时前面填充0，使其长度为2
    var minute = date.getMinutes().toString().padStart(2, '0'); // 在分钟前面填充0，使其长度为2
    var second = date.getSeconds().toString().padStart(2, '0'); // 在秒钟前面填充0，使其长度为2
    var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

    // 获取时间显示区域的元素
    var element = document.getElementById("time");

    // 将时间显示在网页上
    element.innerHTML = time;
}

// 每隔一秒调用一次showTime函数，实现时间的实时更新
setInterval(showTime, 1000);