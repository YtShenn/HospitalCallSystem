// 引入dialog模块
// var { remote } = require('electron');
// var dialog = remote.dialog;
const {dialog} = require ('@electron/remote');
//import { showMessageBox } from 'electron';


function getTime(){
  var date = new Date();

  // 格式化时间为yyyy-mm-dd hh:mm:ss的形式
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0'); // 在月份前面填充0，使其长度为2
  var day = date.getDate().toString().padStart(2, '0'); // 在日期前面填充0，使其长度为2
  var hour = date.getHours().toString().padStart(2, '0'); // 在小时前面填充0，使其长度为2
  var minute = date.getMinutes().toString().padStart(2, '0'); // 在分钟前面填充0，使其长度为2
  var second = date.getSeconds().toString().padStart(2, '0'); // 在秒钟前面填充0，使其长度为2
  var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

  return time;
}


var lstnum=1;

// 患者挂号信息获取
// 患者信息
function getFormData() {
    // 获取姓名
    var name = $('#name-input').val();
    // 获取身份证号
    var id = $('#id-input').val();
    // 获取选择的科室
    var department = $('#department-select').val();
    // 获取选择的医生编号
    var doctor = $('#doctor-select').val();
    // 返回一个对象，包含以上四个属性
    return {
        num: lstnum,
        name: name,
        id: id,
        department: department,
        doctor: doctor,
        state: "等待就诊",
        time: null
    };
}
  
// 点击挂号按钮，进行错误处理以及信息保存
$('#submit-button').on('click',function () {
    // 获取表单数据对象
    var formData = getFormData();
    // 定义一个正则表达式，匹配非数字的字符
    var regex = /\D/;
    
    // 如果姓名为空
    if (!formData.name) {
        // 抛出提示信息
        //alert('姓名不能为空！');
        dialog.showMessageBox ({
            message: '姓名不能为空！',
            buttons: ['确定'],
            type: 'error'
          });
        // 返回false，表示检查不通过
        return false;
      }
      // 如果身份证号为空
    else if (!formData.id) {
        // 抛出提示信息
        //alert('身份证号不能为空！');
        dialog.showMessageBox ({
            message: '身份证号不能为空！',
            buttons: ['确定'],
            type: 'error'
          });
        // 返回false，表示检查不通过
        return false;
      }
    else if(regex.test(formData.id)){
        dialog.showMessageBox ({
          message: '身份证号不能含有非数字字符！',
          buttons: ['确定'],
          type: 'error'
        });
        // 返回false，表示检查不通过
        return false;
    }
    // 如果检查通过
    else {
        lstnum++;
        // 在控制台打印表单数据对象（这里可以根据需要修改）
        //alert('挂号成功！');
        dialog.showMessageBox ({
            message: '挂号成功！您的号码为'+formData.num+'，请等待叫号。',
            buttons: ['确定'],
            type: 'info'
          });
        formData.time=getTime();
        // 生成id为a和b连接形成的字符串的表格的选择器
        var selector = "#" + formData.department + formData.doctor;

        // 创建一个新的表格行元素
        var tr = $("<tr></tr>");
        // 创建四个表格单元元素，分别存放变量a,b,c,d的值
        var td1 = $("<td></td>").text(formData.num);
        var td2 = $("<td></td>").text(formData.name);
        var td3 = $("<td></td>").text(formData.id);
        var td4 = $("<td></td>").text(formData.time);
        var td5 = $("<td></td>").text(formData.state);
        // 将表格单元元素添加到表格行元素中
        tr.append(td1, td2, td3, td4,td5);
        // 将表格行元素添加到表格中
        $(selector).append(tr);

        console.log(formData);
        if(formData.department== $('#doctor-department').val()&&formData.doctor== $('#doctor-id').val()) 
          $("#doc-start").prop("disabled", false);
        var count1 = $(selector+" tr").length-1;
        document.getElementById("x"+ formData.department + formData.doctor).innerHTML = count1;
        if(count1>0) document.getElementById(formData.department + formData.doctor).style.display = "table";
    }
 });