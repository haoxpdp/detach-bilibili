$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    options.xhrFields = {        
        withCredentials:  true    
    }
});


var initPageSize = 10;
var startPage = 1;
var isOpen = false;
var data = [];
var totalCnt = -1;

// js将数字转换成万 并且保留两位小数
const keepTwoDecimalFull = (num) => {
    if (num > 10000) {
        let result = num / 10000;
        result = Math.floor(result * 100) / 100;
        var s_x = result.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        s_x += '万';
    } else {
        s_x = num;
    }
    return s_x
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}

var uuid = getCookie("_uuid");


var showMaster = uuid != undefined && uuid.length > 0;


while (!showMaster) {
    Thread.sleep(2000);
    uuid = getCookie("_uuid");
    showMaster = uuid != undefined && uuid.length > 0;
}

var isOnRoomList;
$(document).ready(function() {
    createLeftFlex();
    appendNavContainer();
    getRoom(startPage, initPageSize)
    // $("#menu-wrap").hide();
    $("#menu-wrap").hover(function() {}, function() {
        // $("#menu-wrap").fadeOut();
    })
    $("#plugin-master").hover(
        function(e) { $("#menu-wrap").fadeIn(); },
        function(e) { if (!isOnRoomList) {} }
    )
    $("#show-more").click(function(e) {
        getRoom(startPage, initPageSize);
    })

    $("#reset-room").click(function(e) {
        data = [];
        startPage = 1;
        $(".room-list").html("");
        getRoom(startPage, initPageSize);
    })

    var div = $(".room-list"); // 获取目标div元素

    $(".room-list").scroll(_.throttle(function() {
        console.log(this.scrollTop + this.offsetHeight);
        console.log(this.scrollHeight);
        console.log(this.scrollHeight - (this.scrollTop+this.offsetHeight));
        console.log("----------------")
        if(this.scrollHeight - (this.scrollTop+this.offsetHeight)<100){
            console.log("执行")
            if(totalCnt!=-1 && totalCnt == data.length){
                console.log("到底了")
                $('#scroll-tip').fadeIn(500, function(){
                    setTimeout(function(){
                            $('#scroll-tip').fadeOut(500);
                    }, 2000);
                });
            }else{
                getRoom(startPage, initPageSize);
            }
        }
    }, 100)); // 500ms为延迟时间，可以根据实际需要进行调整

});



function getRoom(pageNum, pageSize) {
    var feedUrl = "https://api.live.bilibili.com/relation/v1/feed/feed_list?pagesize=" + pageSize + "&page=" + pageNum;
    var tmpData = [];
    var totalSize;

   $.ajax({
            type: "get",
            url: feedUrl,
            headers: {
                "cookie": "_uuid=" + uuid
            },
            success: function(response) {
                tmpData = response.data.list;
                totalSize = response.data.results;
                if (data.length >= totalSize) {
                    return;
                }
                
                tmpData.forEach(element => {
                    data.push(element);
                    creatRank(element)
                });
                if (data.length < totalSize) {
                    startPage += 1;
                }
                if(totalCnt == -1){
                    totalCnt = totalSize;
                }
            }
        });

}


function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}


function createLeftFlex() {
    var div = '<a id = "plugin-master" style="' +
        'z-index: 101;' +
        'left: 0;' +
        'top: 30%;' +
        'position:fixed;' +
        'margin-top: -36px;' +
        'width: 28px;' +
        'height: 52px;' +
        'transition: all .3s;' +
        'font-size: 12px;' +
        'color: #505050;' +
        'background: #fff;' +
        'border: 1px solid #e7e7e7;' +
        'box-shadow: 0 6px 10px 0 #e7e7e7;' +
        'border-radius: 0 2px 2px 0;' +
        'padding: 8px 7px;' +
        'line-height: 14px;' +
        'writing-mode: vertical-lr;' +
        '" >master</a> ' +
        // '<div id="bili-search">\n' +
        // '<div class="bili-search-area">\n' +
        // '  <input id="bili-search-Input" type="text" autocomplete="off">\n' +
        // '</div>\n' +
        '<ul style=""></ul>'
    $("body").append(div);
}

function appendNavContainer() {
    var menu =
        '<div id="menu-wrap">' +
        '<div id="reset-room" class="change-btn"><i class="bilifont bili-icon_caozuo_huanyihuan"></i></div>' +
        '<div class="room-list">' +
        '<div id="scroll-tip" style="display:none; position:fixed; top:50%; left:140px; transform: translate(-50%,-50%); z-index:1500; width:200px; height:80px; background-color:#fff; border-radius:5px; text-align:center; padding-top:20px; box-shadow:0 2px 4px rgba(0,0,0,0.2);">'+
            '到底了'+
        '</div>'+
        '</div>';
    $("body").append(menu);
}

function creatRank(ele) {
        
    $(".room-list").append(createLiveRoomDiv(ele));
}

function createLiveRoomDiv(ele) {
  var liveRoomDiv = '<a target="_blank" href ="'+ele.link+'"><div class="live-room" style="box-shadow: 1px 1px 3px #ccc; margin: 5px;margin-left:10%; padding: 15px; height: 80px; max-width: 80%;">';
  liveRoomDiv += '<div class="cover-wrap" style="position: relative; display: inline-block; width: 30%; height: 100%; border-right: 1px dashed #ccc; padding-right: 10px; margin-right: 10px;">'; // 添加代码：添加封面容器，设置边框样式和内外边距
  liveRoomDiv += '<img src="' + ele.cover + '" class="cover" style="max-width: 100%; height: auto;">';
  liveRoomDiv += '</div>';
  liveRoomDiv += '<div class="info" style="display: inline-block; width: 60%;">'; // 修改代码：改为 inline-block 格式化
  liveRoomDiv += '<h4 class="title" style="font-size: 12px; margin: 0 0 2px; font-weight: normal; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"><img width="12" height="12" src="https://s1.hdslb.com/bfs/static/jinkela/long/images/live.gif" data-v-0ea4a50e="">' + ele.title + '</h4>'; // 修改代码：去掉 text-align: right
  liveRoomDiv += '<p class="uname" style="font-size: 10px; margin: 0 0 3px; color: #666; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">' + ele.uname + '</p>';
  liveRoomDiv += '<p class="online" style="font-size: 9px; margin: 0; color: #999;"><i class="fas fa-eye"></i> ' + keepTwoDecimalFull(ele.online) + '</p>';
  liveRoomDiv += '</div>';
  liveRoomDiv += '</div></a>';
  return liveRoomDiv;
}


