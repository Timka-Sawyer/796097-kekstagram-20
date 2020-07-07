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
var bigPhoto = document.querySelector('.big-picture');



var effects = document.querySelectorAll('.effects__radio');
var effectSecondPart = 'none';
var imgClass = document.querySelector('.img-upload__preview');


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
      description: 'Крутая фота',
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

var createComment = function () {
  var commentBox = document.createElement('li');
  var commentImg = document.createElement('img');
  var commentText = document.createElement('p');

  commentBox.classList.add('social__comment');
  commentImg.classList.add('social__picture');
  commentText.classList.add('social__text');

  commentBox.appendChild(commentImg);
  commentBox.appendChild(commentText);

  return commentBox;
};

var renderComment = function (photoObj) {
  var commentElement = createComment();

  commentElement.querySelector('.social__picture').src = photoObj.avatar;
  commentElement.querySelector('.social__picture').alt = photoObj.name;
  commentElement.querySelector('.social__text').textContent = photoObj.message;
  return commentElement;
};

var renderBigPhoto = function (photo) {
  document.querySelector('.big-picture__img').querySelector('img').src = photo.url;
  document.querySelector('.likes-count').textContent = photo.likes;
  document.querySelector('.comments-count').textContent = photo.comments.length;
  document.querySelector('.social__comment').querySelector('img').src = photo.url;
  document.querySelector('body').classList.add('modal-open');
  document.querySelector('.social__caption').textContent = photo.description;

  var socialComments = document.querySelector('.social__comments');

  socialComments.innerHTML = '';
  createComment();
  for (var commentCount = 0; commentCount < photo.comments.length; commentCount++) {
    document.querySelector('.social__comments').appendChild(renderComment(photo.comments[commentCount]));
  }

  bigPhoto.classList.remove('hidden');
  document.querySelector('.social__comment-count').classList.add('hidden');
  document.querySelector('.comments-loader').classList.add('hidden');
};

//renderBigPhoto(photos[0]);

var uploadPhoto = document.querySelector('#upload-file');
var windowEdit = document.querySelector('.img-upload__overlay');
var windowEditClose = document.querySelector('#upload-cancel');

var openPopup = function () {
  windowEdit.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  windowEdit.classList.add('hidden');

  document.removeEventListener('keydown', onPopupEscPress);
  document.querySelector('body').classList.remove('modal-open');
};

var onPopupEscPress = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closePopup();
  }
};

uploadPhoto.addEventListener('change', function () {
  openPopup();

  windowEditClose.addEventListener('click', function () {
    closePopup();
  });

  windowEditClose.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      closePopup();
    }
  });
});

// НАСТРОЙКА РАЗМЕРА
var scaleSmall = document.querySelector('.scale__control--smaller');
var scaleBig = document.querySelector('.scale__control--bigger');
var scaleValue = document.querySelector('.scale__control--value');
var realScaleValue = 50;

scaleValue.value = realScaleValue + '%';
imgClass.style.transform = 'scale(0.55)';

scaleSmall.addEventListener('click', function () {
  if (realScaleValue > 25) {
    realScaleValue -= 25;
    scaleValue.value = realScaleValue + '%';
    imgClass.style.transform = 'scale(' + realScaleValue / 100 + ')';
  }
});

scaleBig.addEventListener('click', function () {
  if (realScaleValue < 100) {
    realScaleValue += 25;
    scaleValue.value = realScaleValue + '%';
    imgClass.style.transform = 'scale(' + realScaleValue / 100 + ')';
  }
});

// ВЫБОР ФИЛЬТРА
var imgEffectChange = function (effectsElement) {
  imgClass.classList.remove('effects__preview--' + effectSecondPart);
  effectSecondPart = effectsElement.value;
  if (effectsElement.value !== 'none') {
    imgClass.classList.add('effects__preview--' + effectSecondPart);
  }
};

effects[0].onclick = function () {
  imgEffectChange(effects[0]);
};
effects[1].onclick = function () {
  imgEffectChange(effects[1]);
};
effects[2].onclick = function () {
  imgEffectChange(effects[2]);
};
effects[3].onclick = function () {
  imgEffectChange(effects[3]);
};
effects[4].onclick = function () {
  imgEffectChange(effects[4]);
};
effects[5].onclick = function () {
  imgEffectChange(effects[5]);
};

var effectPin = document.querySelector('.effect-level__pin');
console.log(effectPin);
console.log(effectPin.style.left);
effectPin.style.left = '80%';
console.log(effectPin.style.left);


//effectPin.addEventListener('mouseup',)
