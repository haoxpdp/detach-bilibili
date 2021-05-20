$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    options.xhrFields = {        
        withCredentials:  true    
    }
});

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
var initPageSize = 10;
var initPageNum = 1;

var data = [];

$(document).ready(function() {
    getUrl(initPageNum, initPageSize)
});



function getUrl(pageNum, pageSize) {
    var feedUrl = "https://api.live.bilibili.com/relation/v1/feed/feed_list?pagesize=" + pageSize + "&page=" + pageNum;
    var data = [];
    var totalSize;
    $.ajax({
        type: "get",
        url: feedUrl,
        headers: {
            "cookie": "_uuid=" + uuid
        },
        success: function(response) {
            console.log(response)
            data = response.data.list;
            totalSize = response.data.results;
            console.log(totalSize)
        }
    });
}

function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}