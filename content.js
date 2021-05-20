$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    options.xhrFields = {        
        withCredentials:  true    
    }
});


var initPageSize = 10;
var startPage = 1;
var isOpen = false;
var data = [];


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


$(document).ready(function() {
    createLeftFlex();
    appendNavContainer();

    getRoom(startPage, initPageSize)

    $("a#plugin-master").hover(
        function(e) { console.log(data) },
        function(e) { console.log(data) }
    )
    $("a#plugin-master").click(function(e) {
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
            });
            console.log(data.length + ":" + totalSize)
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
        '" >master</a> '
    console.log(div)
    $("body").append(div);
}

function appendNavContainer() {
    var menu =
        '<div class="menu-wrap">' +
        '<button class="close-button" id="close-button">Close Menu</button>' +
        '<nav class="menu">' +
        '<div class="icon-list">' +
        '<a href="#"><i class="fa fa-fw fa-bell-o"></i><span>Alerts</span></a>' +
        '</div>' +
        '</nav>' +
        '<div class="morph-shape" id="morph-shape" data-morph-open="M-7.312,0H15c0,0,66,113.339,66,399.5C81,664.006,15,800,15,800H-7.312V0z;M-7.312,0H100c0,0,0,113.839,0,400c0,264.506,0,400,0,400H-7.312V0z">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 800" preserveAspectRatio="none">' +
        '<path d="M-7.312,0H0c0,0,0,113.839,0,400c0,264.506,0,400,0,400h-7.312V0z"/>' +
        '</svg>' +
        '</div>' +
        '</div>';
    $("body").append(menu);
}