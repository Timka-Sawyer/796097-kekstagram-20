'use strict';

/*
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

var renderPhoto = function (photo, pictureId) {
  var photoElement = photoTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.tabindex = 0;
  photoElement.dataset.id = pictureId;

  return photoElement;
};

var fragment = document.createDocumentFragment();

for (var i = 0; i < photos.length; i++) {
  fragment.appendChild(renderPhoto(photos[i], i));
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

  document.querySelector('.social__comment-count').classList.add('hidden');
  document.querySelector('.comments-loader').classList.add('hidden');
};

var onBigPictureEscPress = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    bigPictureClose();
  }
};

var bigPictureClose = function () {
  bigPhoto.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureEscPress);
  document.querySelector('body').classList.remove('modal-open');
};

var bigPictureOpen = function () {
  bigPhoto.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
  document.addEventListener('keydown', onBigPictureEscPress);
  bigPictureCancle.addEventListener('click', bigPictureClose);
};

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
  imgClass.classList.remove(EFFECT_CLASS_FIRST_PART + effectSecondPart);
  effectSecondPart = evt.target.value;

  if (evt.target.value === EFFECT_DEFAULT_CLASS) {
    effectLevel.classList.add('hidden');
  }

  if (evt.target.value !== EFFECT_DEFAULT_CLASS) {
    effectLevel.classList.remove('hidden');
    imgClass.classList.add(EFFECT_CLASS_FIRST_PART + effectSecondPart);
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
  var pinPosition = effectPin.offsetLeft;
  var onePercent = barWidth / 100;
  var pinPercents = pinPosition / onePercent;

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
      if (!LETTER_RANGE.test(hashtagArr[count])) {
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
*/

/*
var pictureAll = document.querySelector('.pictures');

pictureAll.addEventListener('click', function (evt) {
  var pictureLink = evt.target.closest('a');
  var dataId = pictureLink.dataset.id;
  renderBigPhoto(photos[dataId]);
  bigPictureOpen();
});

pictureAll.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    var pictureLink = evt.target.closest('a');
    var dataId = pictureLink.dataset.id;
    renderBigPhoto(photos[dataId]);
    bigPictureOpen();
  }
});
*/
