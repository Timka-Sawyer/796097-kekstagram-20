'use strict';

var COUNT = 25;
var COMMENTS_NAMES = ['Альпака', 'Капибара', 'Енот', 'Тануки', 'Хомяк', 'Суслик'];
var COMMENTS_MESSAGE = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var photoListElement = document.querySelector('.pictures');
var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');


var getRandomInLimit = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getArrayRandElement = function (arr) {
  var rand = getRandomInLimit(0, arr.length - 1);
  return arr[rand];
};

var generateCommentsArray = function (count) {
  var result = [];

  for (var i = 0; i < count; i++) {
    result.push({
      avatar: 'img/avatar-' + getRandomInLimit(1, 6) + '.svg',
      message: getArrayRandElement(COMMENTS_MESSAGE),
      name: getArrayRandElement(COMMENTS_NAMES),
    });
  }
  return result;
};

var createPhotoArray = function () {
  var photoArray = [];
  var randomCountLengthComments = getRandomInLimit(1, 6);

  for (var i = 0; i < COUNT; i++) {
    photoArray.push({
      url: 'photos/' + (i + 1) + '.jpg',
      description: 'Случайная фотография',
      likes: getRandomInLimit(15, 200),
      comments: generateCommentsArray(randomCountLengthComments)
    });
  }
  return photoArray;
};

var photos = createPhotoArray();

var renderPhoto = function (photo) {
  var photoElement = photoTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;

  return photoElement;
};

var fragment = document.createDocumentFragment();

for (var i = 0; i < photos.length; i++) {
  fragment.appendChild(renderPhoto(photos[i]));
}

photoListElement.appendChild(fragment);
