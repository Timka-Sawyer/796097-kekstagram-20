'use strict';

(function () {

  var SCALE_STEP = 25;
  var SCALE_MIN_VALUE = 25;
  var SCALE_MAX_VALUE = 100;
  var SCALE_DEFAULT_VALUE = 100;
  var EFFECT_DEFAULT_CLASS = 'none';
  var EFFECT_CLASS_FIRST_PART = 'effects__preview--';
  var LETTER_RANGE = /[#^a-zA-Zа-яёА-ЯЁ0-9]+/g;

  var effectSecondPart = EFFECT_DEFAULT_CLASS;
  var scaleSmall = document.querySelector('.scale__control--smaller');
  var scaleBig = document.querySelector('.scale__control--bigger');
  var scaleValue = document.querySelector('.scale__control--value');
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
  var effectPin = document.querySelector('.effect-level__pin');
  var effectPinValue = document.querySelector('.effect-level__value');

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
})();
