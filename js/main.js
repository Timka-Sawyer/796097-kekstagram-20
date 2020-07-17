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
var SCALE_STEP = 25;
var SCALE_MIN_VALUE = 25;
var SCALE_MAX_VALUE = 100;
var SCALE_DEFAULT_VALUE = 100;


var photoListElement = document.querySelector('.pictures');
var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
var bigPhoto = document.querySelector('.big-picture');
var scaleSmall = document.querySelector('.scale__control--smaller');
var scaleBig = document.querySelector('.scale__control--bigger');
var scaleValue = document.querySelector('.scale__control--value');
var effectSecondPart = 'none';
var imgClass = document.querySelector('.img-upload__preview');
var effectLevel = document.querySelector('.img-upload__effect-level');
var effectLevelDepth = document.querySelector('.effect-level__depth');
var imgUploadEffects = document.querySelector('.img-upload__effects');
var levelBar = document.querySelector('.effect-level__line');
var uploadPhoto = document.querySelector('#upload-file');
var overlayEdit = document.querySelector('.img-upload__overlay');
var overlayEditClose = document.querySelector('#upload-cancel');
var hashtagArr = null;
var hashtag = document.querySelector('.text__hashtags');
var letterRange = /[^a-zA-Zа-яёА-ЯЁ0-9]+/g;
var effectPin = document.querySelector('.effect-level__pin');
var effectPinValue = document.querySelector('.effect-level__value');

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
  bigPhoto.classList.add('hidden');
};

renderBigPhoto(photos[0]);

var defaultUploadValue = function () {
  uploadPhoto.value = '';
};

var openPopup = function () {
  overlayEdit.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
  document.addEventListener('keydown', onPopupEscPress);
  overlayEditClose.addEventListener('click', closePopup);
  overlayEditClose.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      closePopup();
    }
  });
};

var closePopup = function () {
  overlayEdit.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
  document.querySelector('body').classList.remove('modal-open');
  defaultUploadValue();
};

var onPopupEscPress = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closePopup();
  }
};

// ВЫБОР ФИЛЬТРА
var setEffectValue = function (value) {
  effectPinValue.value = value;
  effectPin.style.left = value + '%';
  effectLevelDepth.style.width = value + '%';
};

var onImgEffectChange = function (evt) {
  imgClass.classList.remove('effects__preview--' + effectSecondPart);
  effectSecondPart = evt.target.value;

  if (evt.target.value === 'none') {
    effectLevel.classList.add('hidden');
  }

  if (evt.target.value !== 'none') {
    effectLevel.classList.remove('hidden');
    imgClass.classList.add('effects__preview--' + effectSecondPart);
    setEffectValue(100);
  }
};

var isOriginElement = function (arr) {
  var seen = {};

  for (var count = 0; count < arr.length; count++) {
    var item = arr[count].toLowerCase();
    if (!seen[item]) {
      seen[item] = 1;
    }
  }
  return Object.keys(seen).length === arr.length;
};

effectLevel.classList.add('hidden');
uploadPhoto.addEventListener('change', openPopup);
imgUploadEffects.addEventListener('change', onImgEffectChange);

// НАСТРОЙКА ФИЛЬТРА
effectPin.addEventListener('mouseup', function () {
  var minSliderPosition = levelBar.offsetLeft - effectPin.offsetWidth;
  var maxSliderPosition = minSliderPosition + levelBar.offsetWidth;
  var barWidth = maxSliderPosition - minSliderPosition;
  var pinCor = effectPin.offsetLeft;
  var onePercent = barWidth / 100;
  var pinPercents = pinCor / onePercent;

  setEffectValue(pinPercents);
});

// НАСТРОЙКА РАЗМЕРА

scaleValue.value = SCALE_DEFAULT_VALUE + '%';
imgClass.style.transform = 'scale(1.0)';

scaleSmall.addEventListener('click', function () {
  if (SCALE_DEFAULT_VALUE > SCALE_MIN_VALUE) {
    SCALE_DEFAULT_VALUE -= SCALE_STEP;
    scaleValue.value = SCALE_DEFAULT_VALUE + '%';
    imgClass.style.transform = 'scale(' + SCALE_DEFAULT_VALUE / 100 + ')';
  }
});

scaleBig.addEventListener('click', function () {
  if (SCALE_DEFAULT_VALUE < SCALE_MAX_VALUE) {
    SCALE_DEFAULT_VALUE += SCALE_STEP;
    scaleValue.value = SCALE_DEFAULT_VALUE + '%';
    imgClass.style.transform = 'scale(' + SCALE_DEFAULT_VALUE / 100 + ')';
  }
});

hashtag.addEventListener('input', function () {
  hashtagArr = hashtag.value.split(' ');
  hashtag.setCustomValidity('');

  if (!hashtagArr) {
    hashtag.setCustomValidity('');
  } else if (hashtagArr.length > 5) {
    hashtag.setCustomValidity('Максимальное число ХэшТегов – 5');
  } else {
    for (var count = 0; count < hashtagArr.length; count++) {
      hashtag.setCustomValidity('');
      if (hashtagArr[count][0] !== '#') {
        hashtag.setCustomValidity('ХэшТег должен начинаться с #');
      }
      if (hashtagArr[count].length > 20) {
        hashtag.setCustomValidity('Хэштег не должен превышать 20 символов');
      }
      if (!letterRange.test(hashtagArr[count])) {
        hashtag.setCustomValidity('Хэштег содержит недопустимый символ');
      }
      if (hashtagArr[count][0] === '#' && hashtagArr[count].length < 2) {
        hashtag.setCustomValidity('Хэштег не должен состоять только из решётки');
      }
      if (!isOriginElement(hashtagArr)) {
        hashtag.setCustomValidity('Хэштеги не должны повторяться');
      }
    }
  }
});
