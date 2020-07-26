'use strict';

(function () {
  var pictureAll = document.querySelector('.pictures');
  var bigPictureCancle = document.querySelector('.big-picture__cancel');
  var bigPhoto = document.querySelector('.big-picture');

  var renderBigPhoto = function (photo) {
    document.querySelector('.big-picture__img').querySelector('img').src = photo.url;
    document.querySelector('.likes-count').textContent = photo.likes;
    document.querySelector('.comments-count').textContent = photo.comments.length;
    document.querySelector('.social__comment').querySelector('img').src = photo.url;
    document.querySelector('body').classList.add('modal-open');
    document.querySelector('.social__caption').textContent = photo.description;

    var socialComments = document.querySelector('.social__comments');

    socialComments.innerHTML = '';
    window.data.createComment();

    for (var commentCount = 0; commentCount < photo.comments.length; commentCount++) {
      document.querySelector('.social__comments').appendChild(window.data.renderComment(photo.comments[commentCount]));
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

  pictureAll.addEventListener('click', function (evt) {
    var pictureLink = evt.target.closest('a');
    var dataId = pictureLink.dataset.id;
    renderBigPhoto(window.data.photos[dataId]);
    bigPictureOpen();
  });

  pictureAll.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      var pictureLink = evt.target.closest('a');
      var dataId = pictureLink.dataset.id;
      renderBigPhoto(window.data.photos[dataId]);
      bigPictureOpen();
    }
  });
})();
