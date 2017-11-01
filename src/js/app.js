import $ from 'jquery';

var xhr = new XMLHttpRequest();
var imageList = $('.image-list');
var bigImgCont = $('.big-image');
var bigImg = $('.big-image__img');

xhr.open('GET', 'https://jsonplaceholder.typicode.com/photos', false);

xhr.send();

if (xhr.status !== 200) {
  alert( xhr.status + ': ' + xhr.statusText ); //
} else {

  var data = JSON.parse(xhr.response);
  for(var i = 0; i < data.length/400; i++) {
    var smallUrl = data[i].thumbnailUrl;
    $(imageList).append(`<li class="image-list__item"><img src="${smallUrl}"></li>`);
  }

  function getBigBySmall(value) {
    for(var j = 0; j < data.length; j++) {
      if(data[j].thumbnailUrl === value) {
        return data[j].url;
      }
    }
  }

  imageList.on('click', function(event) {
    event.preventDefault();
    var target = event.target;
    if (target.tagName !== 'IMG') return;
    var imageSrc = $(target).attr('src');
    console.log($(this).find('.image-list__item').find('img'));
    if($(this).find('.image-list__item').find('.is-active').hasClass('.is-active')) {
      $(this).find('.image-list__item').find('img').removeClass('is-active');
    } else {
      $(target).addClass('is-active');
      console.log(this);
    }
    $(this).siblings('.big-image').find(bigImg).attr('src', getBigBySmall(imageSrc));

  });

  $(window).click(function() {
    $('.overlay').hide();
  });

  bigImgCont.on('click', function(event) {
    event.stopPropagation();
    $(this).parents('.gallery').find('.overlay').show().find('.preview__img').attr('src', $(this).find(bigImg).attr('src'));
  });

}

