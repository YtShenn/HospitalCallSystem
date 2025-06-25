const {dialog} = require ('@electron/remote');

const { ipcRenderer } = require('electron')
const openWindowBtn = document.getElementById('openWindowBtn')
$('#btn-enter').on('click',function () {
    
    ipcRenderer.send('openWindow');
    dialog.showMessageBox ({
        title: "使用方法",
        type: 'info',
        message: "如果您是医生：\n"+
        "\ \ \ \ 在右侧\'医生操作区\'可以选择自己所属科室和自己的编号，若此时自己名下有病人候诊，点击\'开始\'开始就诊并发出叫号通知，"+
        "点击\'结束\'结束就诊,在弹出的窗口内选择是否需要做B超，点击\'查看就诊记录\'可以看到自己的就诊记录。\n\n"+
        "如果您是患者：\n"+
        "\ \ \ \ 在右侧\'患者操作区\'正确输入个人信息，之后选择自己要去的科室和想看的医生编号，点击\'挂号\'，若成功则会收到窗口提示并被"+
        "告知自己的看病编号。在右上角叫号窗口可以看到叫号信息。可以在左侧点击各个科室查看不同医生的患者排队信息，决定挂哪个医生的号。",
        buttons: ['确定']
    });
    
})

$('#btn-exit').on('click',function () {
    
    ipcRenderer.send('closeWindow');
    
})
