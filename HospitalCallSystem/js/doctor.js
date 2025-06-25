//const {dialog} = require ('@electron/remote');
const fs = require('fs');

//初始设置按钮不可用
$("#doc-start").prop("disabled", true);
$("#doc-end").prop("disabled", true);

confirm = function(str){
    var options = {
      type: 'question',
      buttons: ["确认","取消"],
      defaultId: 0,
      cancelId:1,
      detail:'',
      message: str
    }
    var flag = dialog.showMessageBoxSync(null,options);
    if(flag==0){
        return true;
    }else{
        return false;
    }
}

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

// 点击开始就诊
$('#doc-start').on('click',function () {
    // 获取选择的医生编号
    var doc_dep = $('#doctor-department').val();
    var doc_id = $('#doctor-id').val();
    var selector = "#" + doc_dep + doc_id;

    var count = $(selector+" tr").length;
    if(count<=1){
        dialog.showMessageBox ({
            title: "提示",
            type: 'error',
            message: "待就诊列表为空！请等待病人挂号。",
            buttons: ['确定']
        });
    }
    else if($(selector+" tr:not(thead) td:eq(4)").text()=="正在就诊中"){
        dialog.showMessageBox ({
            title: "提示",
            type: 'error',
            message: "当前已在就诊中！请先结束就诊。",
            buttons: ['确定']
        });
    }
    else{
        $(selector+" tr:not(thead) td:eq(4)").text("正在就诊中");

        //设置叫号显示
        var p_num= $(selector+" tr:not(thead) td:eq(0)").text();
        var p_name=$(selector+" tr:not(thead) td:eq(1)").text();
        if(doc_dep=="B"){
            $("#output").text("请"+p_num+"号病人"+p_name+"到B超室"+doc_id+"机器处做B超！");
        }
        else{
            $("#output").text("请"+p_num+"号病人"+p_name+"到"+doc_dep+"诊室"+doc_id+"医生处就诊！");
        }
        //设置结束就诊为可使用
        $("#doc-end").prop("disabled", false);
        $("#doc-start").prop("disabled", true);
    }
});

//更换科室、编号选项后对按钮重新判断
$("#doctor-department").on('change',function() {
    //获取表格A中的行数
    var doc_dep = $('#doctor-department').val();
    var doc_id = $('#doctor-id').val();
    var selector = "#" + doc_dep + doc_id;

    var count = $(selector+" tr").length;
    if(count<=1){
        $("#doc-start").prop("disabled", true);
        $("#doc-end").prop("disabled", true);
    }
    
    else if($(selector+" tr:not(thead) td:eq(4)").text()=="正在就诊中"){
        $("#doc-start").prop("disabled", true);
        $("#doc-end").prop("disabled", false);
    }
    else{
        $("#doc-start").prop("disabled", false);
        $("#doc-end").prop("disabled", true);
    }
    
  });
$("#doctor-id").on('change',function() {
    //获取表格A中的行数
    var doc_dep = $('#doctor-department').val();
    var doc_id = $('#doctor-id').val();
    var selector = "#" + doc_dep + doc_id;

    var count = $(selector+" tr").length;
    if(count<=1){
        $("#doc-start").prop("disabled", true);
        $("#doc-end").prop("disabled", true);
    }
    
    else if($(selector+" tr:not(thead) td:eq(4)").text()=="正在就诊中"){
        $("#doc-start").prop("disabled", true);
        $("#doc-end").prop("disabled", false);
    }
    else{
        $("#doc-start").prop("disabled", false);
        $("#doc-end").prop("disabled", true);
    }
    
});

// 点击结束就诊
$('#doc-end').on('click',function () {
    // 获取选择的医生编号
    var doc_dep = $('#doctor-department').val();
    var doc_id = $('#doctor-id').val();
    var selector = "#" + doc_dep + doc_id;

    var end_time=getTime();

    if(doc_dep!="B"){   //不是B超室的医生
        //首先询问是否做B超
        var result = confirm("该病人是否需要做B超？");//window.confirm("该病人是否需要做B超？");
        
        // 选择了“是”
        if (result) {
            //选择人最少的B超室
            // 定义一个空数组，用来存放每个表格的表格项数和id
            var array = [];
            // 遍历三个表格，分别获取它们的表格项数和id，并将它们作为一个对象添加到数组中
            $("#B01, #B02, #B03").each(function() {
                // 获取当前表格的表格项数，即所有表格单元元素的个数
                var count = $(this).find("td").length;
                // 获取当前表格的id
                var id = $(this).attr("id");
                // 创建一个对象，包含count和id两个属性
                var obj = {count: count, id: id};
                // 将对象添加到数组中
                array.push(obj);
            });
            // 对数组进行排序，按照count属性从小到大排列
            array.sort(function(a, b) {
                return a.count - b.count;
            });
            // 获取数组中第一个元素的id属性，即表格项数最少的那个表格的id
            var minId = "#"+array[0].id;


            // 创建一个新的表格行元素
            var tr = $("<tr></tr>");
            // 创建三个表格单元元素，分别存放一些示例内容
            var td1 = $("<td></td>").text($(selector+" tr:not(thead) td:eq(0)").text());
            var td2 = $("<td></td>").text($(selector+" tr:not(thead) td:eq(1)").text());
            var td3 = $("<td></td>").text($(selector+" tr:not(thead) td:eq(2)").text());
            var td4 = $("<td></td>").text(end_time);
            var td5 = $("<td></td>").text("等待就诊");
            // 将表格单元元素添加到表格行元素中
            tr.append(td1, td2, td3, td4, td5);
            console.log(tr);
            // 将表格行元素添加到目标表格中
            $(minId).append(tr);
            //修改排队人数
            var count2 = $(minId+" tr").length-1;
            document.getElementById("x"+ array[0].id).innerHTML = count2;
            if(count2>0) document.getElementById(array[0].id).style.display = "table";
        }
      
    }

    //第一位病人计入文档
    // 选择表格第一行，使用:first选择器
    var fst = $(selector+" tr:not(thead):eq(1)");
    // 获取内容
    var text = "";
    var index = 0;
    fst.find("td").not(":last").each(function() {
        if(index<1)
            text += $(this).text() + "\t";
        else text += $(this).text() + "\t";
        index++;
    });
    text += end_time+"\n";

    //文件名
    var filename;
    if(doc_dep=="B"){
        filename = "B超室"+doc_id+"号机器检查记录.txt"
    }
    else{
        filename = doc_dep+"科室"+doc_id+"医生就诊记录.txt"
    }

    // 写入文件，文件存在与不存在时操作不同
    // 定义要写入的内容1
    var head_con = "编号\t姓名\t证件号\t"+"\ \ \ \ \ \ \ \ \ "+"就诊时间\t"+"\t"+"\ \ \ \ \ \ \ \ "+"结束时间\n";//\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ 就诊时间\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \t结束时间\n";
    // 使用fs模块的access方法判断文件是否存在
    fs.access(filename, fs.constants.F_OK, function (err) {
        if (err) {
            // 如果出错，说明文件不存在，使用writeFile方法创建文件并写入内容1
            fs.writeFile(filename, head_con+text, "utf8", function (err) {
                if (err) {
                    // 如果出错，打印错误信息
                    console.error(err.message);
                } else {
                    // 如果成功，打印提示信息
                    console.log("文件不存在，已创建文件并写入内容1");
                }
            });
        }  
        else{
            // 如果成功，说明文件存在，使用appendFile方法追加内容2
            fs.appendFile(filename, text, "utf8", function (err) {
                if (err) {
                    // 如果出错，打印错误信息
                    console.error(err.message);
                } else {
                    // 如果成功，打印提示信息
                    console.log("文件存在，已追加内容2");
                }
            });
        }   
    });

   
    console.log(fst);
    fst.remove();
    //结束就诊按钮设为不可用
    $("#doc-end").prop("disabled", true);
    if($(selector+" tr").length>1) $("#doc-start").prop("disabled", false);
    //修改排队人数
    var count1 = $(selector+" tr").length-1;
    document.getElementById("x"+ doc_dep + doc_id).innerHTML = count1;
    if(count1<=0) document.getElementById(doc_dep + doc_id).style.display = "none";
});


// 点击查看记录
$('#record').on('click',function () {
    // 获取选择的医生编号
    var doc_dep = $('#doctor-department').val();
    var doc_id = $('#doctor-id').val();
    var filename;
    if(doc_dep=="B") filename = "B超室"+doc_id+"号机器检查记录.txt"
    else filename = doc_dep+"科室"+doc_id+"医生就诊记录.txt";

    // 引入path模块和app模块
    const path = require('path');
    const { app } = require ('@electron/remote');
    const { shell } = require ('@electron/remote');

    // 获取exe文件所在的目录
    const exeDir = app.getAppPath();
    
    // 拼接绝对路径
    const txtAbsolutePath = path.join(exeDir, filename);


    fs.access(filename, fs.constants.F_OK, function (err) {
        if (err) {
            // 如果出错，说明文件不存在，弹窗
            dialog.showMessageBox ({
                title: "提示",
                type: 'error',
                message: "未查询到您的坐诊记录！请对至少一位患者结束诊断后重试。",
                buttons: ['确定']
            });
        }  
        else{
            shell.openPath(filename);
        }
    });
});