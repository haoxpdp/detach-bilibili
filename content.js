$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    options.xhrFields = {        
        withCredentials:  true    
    }
});


var initPageSize = 10;
var startPage = 1;
var isOpen = false;
var data = [];

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
    $("#menu-wrap").hide();
    $("#menu-wrap").hover(function() {}, function() {
        $("#menu-wrap").fadeOut();
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
            console.log(response)
            tmpData = response.data.list;
            totalSize = response.data.results;
            console.log(totalSize)
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
        '</div>' +
        '<div id="show-more">显示更多</div>' +
        '</div>';
    $("body").append(menu);
}

function creatRank(ele) {
    console.log(ele)
    // var div = '<div class="live-rank">' +
    //     '<a href="' + ele.link + '" target="_blank" class="live-rank-item"><div class="rank-face">' +
    //     '<!----><img src="' + ele.cover + '@55w_55h_1c_100q.webp" alt="">' +
    //     '<div class="txt"><p>' + ele.uname + '</p><p class="p2">' + ele.title + '</p></div></div>' +
    //     '<div class="count"><i class="bilifont bili-icon_xinxi_renqi"></i>' + keepTwoDecimalFull(ele.online) + '</div></a>' +
    //     '</div>'
        
    $(".room-list").append(createLiveRoomDiv(ele));
}

function createLiveRoomDiv(ele) {
  var liveRoomDiv = '<a target="_blank" href ="'+ele.link+'"><div class="live-room" style="box-shadow: 1px 1px 3px #ccc; margin: 5px;margin-left:10%; padding: 15px; height: 80px; max-width: 80%;">';
  liveRoomDiv += '<img src="' + ele.cover + '" class="cover" style="max-width: 30%; height: auto;">';
  liveRoomDiv += '<div class="info" style="margin-left: 5px; width: 70%;padding-left:15%;padding-right:15%">';
  liveRoomDiv += '<h4 class="title" style="font-size: 12px; margin: 0 0 2px; font-weight: normal; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; text-align: right;"><img width="12" height="12" src="https://s1.hdslb.com/bfs/static/jinkela/long/images/live.gif" data-v-0ea4a50e="">' + ele.title + '</h4>'; // 修改代码：添加 text-align: right;
  liveRoomDiv += '<p class="uname" style="font-size: 10px; margin: 0 0 3px; color: #666; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; text-align: right;">' + ele.uname + '</p>'; // 修改代码：添加 text-align: right;
  liveRoomDiv += '<p class="online" style="font-size: 9px; margin: 0; color: #999; text-align: right;"></i> ' +keepTwoDecimalFull( ele.online )+ '</p>'; // 修改代码：添加 text-align: right;
  liveRoomDiv += '</div>';
  liveRoomDiv += '</div></a>';
  return liveRoomDiv;
}


