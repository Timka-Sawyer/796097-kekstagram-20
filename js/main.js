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

var scaleSmall = document.querySelector('.scale__control--smaller');
var scaleBig = document.querySelector('.scale__control--bigger');
var scaleValue = document.querySelector('.scale__control--value');
var realScaleValue = 50;

var effectSecondPart = 'none';
var imgClass = document.querySelector('.img-upload__preview');
var effectLevel = document.querySelector('.img-upload__effect-level');
var effectLevelDepth = document.querySelector('.effect-level__depth');
var imgUploadEffects = document.querySelector('.img-upload__effects');

var hashtagValid = true;
var hashtagArr;
var hashtag = document.querySelector('.text__hashtags');
var hashtagForm = document.querySelector('.img-upload__form');
var imgSubmit = document.querySelector('.img-upload__submit');
var re = /^#[a-zA-Zа-яА-я0-9]{1,19}$/;

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

// ВЫБОР ФИЛЬТРА
var imgEffectChange = function (evt) {
  imgClass.classList.remove('effects__preview--' + effectSecondPart);
  effectSecondPart = evt.target.value;
  effectLevel.classList.add('hidden');
  if (evt.target.value !== 'none') {
    effectLevel.classList.remove('hidden');
    imgClass.classList.add('effects__preview--' + effectSecondPart);
    effectPinValue.value = 100;
    effectPin.style.left = '100%';
    effectLevelDepth.style.width = '100%';
  }
};
effectLevel.classList.add('hidden');
imgUploadEffects.addEventListener('change', imgEffectChange);

// НАСТРОЙКА ФИЛЬТРА

effectPin.addEventListener('mouseup', function () {
  var levelBar = document.querySelector('.effect-level__line');
  var barWidth = levelBar.getBoundingClientRect().width;
  var pinCor = effectPin.offsetLeft;
  var onePercent = barWidth / 100;
  var pinPercents = pinCor / onePercent;

  effectPinValue.value = pinPercents;
  effectPin.style.left = pinPercents + '%';
  effectLevelDepth.style.width = pinPercents + '%';
});

// Хэштеги
var strCmp = function () {
  for (var c = 0; c < hashtagArr.length - 1; c++) {
    for (var j = 1 + c; j < hashtagArr.length; j++) {
      if (hashtagArr[c] === hashtagArr[j]) {
        return 1;
      }
    }
  }
  hashtagValid = true;
  return 0;
};

var isValid = function () {
  if (hashtagArr.length > 5 || strCmp()) {
    hashtagValid = false;
    hashtag.setCustomValidity('ХэшТегов должно быть не больше пяти и не должны повторяться');
  } else {
    for (var count = 0; count < hashtagArr.length; count++) {
      if (!re.test(hashtagArr[count]) && hashtagArr[count]) {
        hashtagValid = false;
      } else {
        hashtagValid = true;
      }
    }
    if (hashtagValid === false) {
      hashtag.setCustomValidity('Заполните ХэшТеги правильно');
    } else {
      hashtagForm.submit();
    }
  }
};

// НАСТРОЙКА РАЗМЕРА
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

hashtag.addEventListener('input', function () {
  hashtagArr = hashtag.value.split(' ');
});

imgSubmit.addEventListener('click', isValid);
