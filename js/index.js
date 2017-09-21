$(function () {
  $('.buycar').mouseenter(function () {
    $('.carlist').slideDown();
  });
  $('.buycar').mouseleave(function () {
    $('.carlist').stop(true);
    $('.carlist').slideUp();
  })

  //导航栏开始
  //第一层ajax请求开始
  $.ajax({
    url: 'http://192.168.70.88:9900/api/nav',
    success: function (data) {

      for (var i = 0; i < data.length; i++) {
        $('.navlist>ul').append(template('navTemplate', data[i]));
      }

      //第二层ajax请求开始
      var dataList = [];
      for (var k = 0; k < $('.navlist>ul>li').length - 2; k++) {
        (function (k) {
          $.ajax({
            url: 'http://192.168.70.88:9900/api/nav',
            data: {
              type: $('.navlist>ul>li').eq(k).attr('type')
            },
            success: function (data) {
              // console.log(data);
              dataList[k] = data;

            },
            dataType: 'json'
          })
        })(k)
      }
      //第二层ajax请求结束；
      $('.navtop .navlist li').on('mouseenter', function () {
        if (dataList[$(this).attr('index') - 1]) {
          $('#nav .navdetail ul').html(template('navDetailTemplate', dataList[$(this).attr('index') - 1]));
          $('#nav .navdetail').slideDown();
        } else {
          $('#nav .navdetail').stop(true).slideUp();
        }
      });
      $('#nav').on('mouseleave', function () {
        $('#nav .navdetail').stop(true).slideUp();
      });
      $('.navLogo').on('mouseenter', function () {
        $('#nav .navdetail').stop(true).slideUp();
      });
      $('.search').on('mouseenter', function () {
        $('#nav .navdetail').stop(true).slideUp();
      });


    },
    dataType: 'json'
  });
  //第一层ajax请求结束

  $('.search-inp').focus(function () {
    $('.placehold').hide();
    $('.search-result').show();
  })
  $('.search-inp').blur(function () {
    $('.placehold').show();
    $('.search-result').hide();
  })
  //导航栏结束

  //轮播图开始
  $.ajax({
    url: 'http://192.168.70.88:9900/api/items',
    success: function (data) {
      $('#slide .slideItems ul').html(template('itemTemplate', data));
      $('#slide .slideItems').on('mouseenter', 'li', function () {
        var $this = $(this);
        $('#slide .itemBox').empty();
        $.ajax({
          url: 'http://192.168.70.88:9900/api/items',
          data: {
            type: $this.attr('type')
          },
          dataType: 'json',
          success: function (data) {
            // console.log(data);
            var index = Math.ceil(data.length / 6);
            for (var i = 0; i < index; i++) {
              $('#slide .itemBox').append('<ul></ul>');
            }
            for (var j = 0; j < data.length; j++) {
              $('#slide .itemBox ul').eq(Math.floor(j / 6)).append(template('itemDetailTemplate', data[j]));
            }
          }
        });
        $('#slide .itemBox').show();

      });
      $('#slide .items').on('mouseleave', function () {
        $('#slide .itemBox').hide();
      });
    },
    dataType: 'json'
  });


  //滚动轮播图开始
  var imgIndex = 0;
  var timeId = null;
  function slideMoveRight() {
    imgIndex++;
    if (imgIndex >= $('.lunbo .slideBox').length) {
      imgIndex = 0;
    }
    $('.lunbo .slideBox').removeClass('showSlide').eq(imgIndex).css('opacity', '0').addClass('showSlide');
    $('.lunbo .showSlide').animate({
      "opacity": "1"
    }, 500);
    // console.log(imgIndex);
  }
  timeId = setInterval(slideMoveRight, 2500);
  $('.lunbo .rightIcon').on('click', function () {
    slideMoveRight();
  });
  $('.lunbo .leftIcon').on('click', function () {
    imgIndex--;
    if (imgIndex < 0) {
      imgIndex = $('.lunbo .slideBox').length - 1;
    }
    $('.lunbo .slideBox').removeClass('showSlide').eq(imgIndex).css('opacity', '0').addClass('showSlide');
    $('.lunbo .showSlide').animate({
      "opacity": "1"
    }, 500);
    // console.log(imgIndex);
  });

  $('.lunbo').on('mouseenter', function () {
    clearInterval(timeId);
  })
  $('.lunbo').on('mouseleave', function () {
    timeId = setInterval(slideMoveRight, 2500);
  })
  $.ajax({
    url: 'http://192.168.70.88:9900/api/lunbo',
    success: function (data) {
      $('.lunbo').append(template('slideTemplate', data));
    },
    dataType: 'json'
  })

  //滚动轮播图结束
  //轮播图结束

  //智能硬件开始
  $.ajax({
    url: 'http://192.168.70.88:9900/api/hardware',
    dataType: 'json',
    success: function (data) {
      // console.log(data);
      $('#intelHard .intelRight').html(template('intelTemplate', data));
    }

  })
  //智能硬件结束

  //搭配、配件、周边开始
  function matchAll(titleName, idName) {
    $.ajax({
      url: 'http://192.168.70.88:9900/api/product',
      data: {
        toptitle: titleName
      },
      dataType: 'json',
      success: function (data) {
        // console.log(data);
        $('#' + idName).append(template('templateBox1', data));
        $('#' + idName + ' .top-list ul li:eq(0)').addClass('current');
        $('#' + idName + ' .top-list ul li').on('mouseenter', function () {
          var $this = $(this);
          $('#' + idName + ' .top-list ul li').removeClass('current');
          $this.addClass('current');
          $.ajax({
            url: 'http://192.168.70.88:9900/api/product',
            data: {
              key: $this.attr('key')
            },
            dataType: 'json',
            success: function (data) {
              // console.log(data);
              $('#' + idName + ' .matchBox .matchRight').html(template('templateBox2', data));
            }
          })
        })
      }
    })
  }
  //搭配开始
  matchAll('match', 'match');

  //搭配结束

  //配件开始
  matchAll('accessories', 'accessories');

  //配件结束

  //周边开始
  matchAll('around', 'around');

  //周边结束

  //搭配、配件、周边结束

  //推荐开始
  function recomm(data) {
    $('<ul></ul>').html(template('recommendTemplate', data)).addClass("recommendGoods clearfix").appendTo('#recommend .allGoods');
    $('#recommend .allGoods').animate({ 'left': -goodsWidth * (pageIndex) }, 500);
    pageIndex++;
    if (pageIndex > 1) {
      $('#recommend .last').removeClass('disabled');
    }
    $.ajax({
      url: 'http://192.168.70.88:9900/api/recommend',
      data: {
        page: pageIndex + 1
      },
      dataType: 'json',
      success: function (data) {
        datas = data;
        if (data == false) {
          $('#recommend .next').addClass('disabled');
        }
      }
    })
  }

  var pageIndex = 1;
  var datas;
  var goodsWidth = $('#recommend .goodsList').width();
  $.ajax({
    url: 'http://192.168.70.88:9900/api/recommend',
    data: {
      page: pageIndex
    },
    dataType: 'json',
    success: function (data) {
      // console.log(data);
      $('#recommend .recommendGoods').html(template('recommendTemplate', data));


      $('#recommend .next').on('click', function () {
        if ($(this).hasClass('disabled')) {
          return;
        }
        if (datas && datas != false) {
          recomm(datas);
        } else {
          $.ajax({
            url: 'http://192.168.70.88:9900/api/recommend',
            data: {
              page: pageIndex + 1
            },
            dataType: 'json',
            success: function (data) {
              if (data != false) {
                recomm(data);
              }
            }
          })
        }
      })
      $('#recommend .last').on('click', function () {
        if ($(this).hasClass('disabled')) {
          return;
        }
        pageIndex--;
        $('#recommend .allGoods').animate({ 'left': -goodsWidth * (pageIndex - 1) }, 500);
        $('#recommend .next').removeClass('disabled');
        if (pageIndex <= 1) {
          $(this).addClass('disabled');
        }
      })



    }
  })


  //推荐结束
  //热评产品开始

  $.ajax({
    url: 'http://192.168.70.88:9900/api/hotcomment',
    dataType: 'json',
    success: function (data) {
      // console.log(data);
      $('#hotProduct .products').html(template('hotPtemplate', data));
    }
  })

  //热评产品结束

  //内容开始
  $.ajax({
    url: 'http://192.168.70.88:9900/api/content',
    dataType: 'json',
    success: function (data) {
      // console.log(data);
      $('#content .subcontent>ul').html(template('neirongtemplate', data));
      // var picIndex=0;
      var picWid = $('#content .contentslide').width();
      $('#content .subcontent>ul>li').eq(0).addClass('orangecolor');
      $('#content .subcontent>ul>li').eq(1).addClass('greencolor');
      $('#content .subcontent>ul>li').eq(2).addClass('redcolor');
      $('#content .subcontent>ul>li').eq(3).addClass('bluecolor');
      for (var i = 0; i < $('#content .subcontent>ul>li').length; i++) {
        (function (i) {
          var picIndex = 0;
          $('#content .subcontent>ul>li').eq(i).find('.right').on('click', function () {
            if (picIndex < 3) {
              picIndex++;
              $(this).parent().find('.slidebox').animate({
                'left': -picIndex * picWid
              }, 300);
              $(this).parent().find('.smallbar').children('li').removeClass('active').eq(picIndex).addClass('active');
            }
          });
          $('#content .subcontent>ul>li').eq(i).find('.left').on('click', function () {
            if (picIndex > 0) {
              picIndex--;
              $(this).parent().find('.slidebox').animate({
                'left': -picIndex * picWid
              }, 300);
              $(this).parent().find('.smallbar').children('li').removeClass('active').eq(picIndex).addClass('active');
            }
          });
          $('#content .subcontent>ul>li').eq(i).find('li').each(function(index){
            $(this).attr('index', index);
          })
          $('#content .subcontent>ul>li').eq(i).find('li').on('click', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            picIndex = $(this).attr('index');
            // console.log(picIndex);
            $(this).parent().parent().find('.slidebox').animate({
              'left': -picIndex * picWid
            }, 300);
          })
        })(i);
      }

    }
  })
  //内容结束

  //视频开始

  $.ajax({
    url: 'http://192.168.70.88:9900/api/video',
    dataType: 'json',
    success: function (data) {
      // console.table(data);
      $('#video .videocontent>ul').html(template('videotemplate', data));
    }
  })

  //视频结束


})
