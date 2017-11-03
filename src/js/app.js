import $ from 'jquery';

var xhr = new XMLHttpRequest();
var imageList = $('.image-list');
var bigImgCont = $('.big-image');
var bigImg = $('.big-image__img');

xhr.open('GET', 'https://jsonplaceholder.typicode.com/photos', false);

xhr.send();

// Разбивка массива на двумерный массив с длинами size
function chunk(arr, size) {
  var result = [];
  for (var j = 0; j < arr.length; j += size) {
    result.push(arr.slice(j, j + size));
  }
  return result;
}

if (xhr.status !== 200) {
  alert(xhr.status + ': ' + xhr.statusText);
} else {

  var data = JSON.parse(xhr.response);
  var arrId = [];
  for (var i = 0; i < data.length / 10; i++) {
    arrId.push(data[i].id);
  }
  var chunkedArr = chunk(arrId, 5);

  var page = 0;


  // Вывод списка изображений
  function showList() {
    // $('.loader-clock').addClass('is-active');
    for (var i = 0; i < chunkedArr[page].length; i++) {
      var smallUrl = getSmallById(chunkedArr[page][i]);
      $(imageList).append(`<li class="image-list__item"><img src="${smallUrl}"></li>`);
      $('.loader-clock').removeClass('is-active');
    }
  }

  showList();

  // Следующий список изображений
  function prevPage() {
    page -= 1;
    $(imageList).html('');
    showList();
  }

  // Пред. список
  function nextPage() {
    page += 1;
    $(imageList).html('');
    showList();
  }

  // Кнопка на предыдущий список
  $('.prev-list').on('click', function(event) {
    event.stopPropagation();
    if (page > 0) {
      prevPage();
    }
  });

  // Кнопка на след. список
  $('.next-list').on('click', function(event) {
    event.stopPropagation();
    if (page < chunkedArr.length-1) {
      nextPage();
    }
  });


  function getBigBySmall(value) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].thumbnailUrl === value) {
        return data[i].url;
      }
    }
  }

  function getIdByBig(value) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].url === value) {
        return data[i].id;
      }
    }
  }

  function getBigById(value) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === value) {
        return data[i].url;
      }
    }
  }

  function getSmallById(value) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === value) {
        return data[i].thumbnailUrl;
      }
    }
  }

  // Просмотр большого изображения при клике на маленькое
  imageList.on('click', function(event) {
    event.preventDefault();
    var target = event.target;
    if (target.tagName !== 'IMG') return;
    $('.loader-clock').addClass('is-active');
    var imageSrc = $(target).attr('src');
    $(this).find('.image-list__item').removeClass('is-active');
    $(target).parent().addClass('is-active');
    $(this).parents('.gallery').find('.big-image').find(bigImg).attr('src', getBigBySmall(imageSrc));
    $('.loader-clock').removeClass('is-active');
  });

  // Скрыть оверлей
  $(window).click(function() {
    $('.overlay').hide();
  });


  // Вывод большого изображения на весь екран
  bigImgCont.on('click', function(event) {
    event.stopPropagation();
    $('.loader-clock').addClass('is-active');
    $(this).parents('.gallery').find('.overlay').show().find('.preview__img').attr('src', $(this).find(bigImg).attr('src'));
    $('.loader-clock').removeClass('is-active');
  });

  // Следующее большое изображение
  $('.btn-next').on('click', function(event) {
    event.stopPropagation();
    $('.loader-clock').addClass('is-active');
    var id = getIdByBig($(this).siblings('.preview__img').attr('src'));
    var nextId = id + 1;
    $(this).siblings('.preview__img').attr('src', getBigById(nextId));
    $(this).parents('.gallery').find(bigImg).attr('src', getBigById(nextId));
    $(this).parents('.gallery').find('.image-list__item').removeClass('is-active');
    var smallSrc = getSmallById(nextId);
    $(this).parents('.gallery').find('.image-list__item').find(`img[src = "${smallSrc}"]`).parent().addClass('is-active');
    if (id % 5 === 0) {
      nextPage();
      $(this).parents('.gallery').find('.image-list__item').find(`img[src = "${smallSrc}"]`).parent().addClass('is-active');
    }
    $('.loader-clock').removeClass('is-active');
  });

  // Пред. большое изображение
  $('.btn-prev').on('click', function(event) {
    event.stopPropagation();
    $('.loader-clock').addClass('is-active');
    var id = getIdByBig($(this).siblings('.preview__img').attr('src'));
    var prevId = id - 1;
    $(this).siblings('.preview__img').attr('src', getBigById(prevId));
    $(this).parents('.gallery').find(bigImg).attr('src', getBigById(prevId));
    $(this).parents('.gallery').find('.image-list__item').removeClass('is-active');
    var smallSrc = getSmallById(prevId);
    $(this).parents('.gallery').find('.image-list__item').find(`img[src = "${smallSrc}"]`).parent().addClass('is-active');
    if (id % 5 === 1) {
      prevPage();
      $(this).parents('.gallery').find('.image-list__item').find(`img[src = "${smallSrc}"]`).parent().addClass('is-active');
    }
    $('.loader-clock').removeClass('is-active');
  });

}

