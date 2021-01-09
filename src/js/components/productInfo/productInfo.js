import { camelCase } from 'lodash';
import { openInModal } from '../modal';
import { data } from '../../data/data';
import { mobSlider } from './productInfoSlider';
import productInfoTemplate from '../../../templates/productInfoTemplate.hbs';
import {
  fetchFavouritesAPI,
  fetchOwnCallsAPI,
  addInFavoritesAPI,
  removeFromFavoritesAPI,
} from './favoritesAPI';
import { createMarkupFavoritesGoodsList } from '../favorites-myGoodsList/favorites-myGoodsList';

const refs = {
  dotsRef: '',
  activeListRef: '',
  maxImgRef: '',
  minImgListRef: '',
  minImgRef: '',

  favoritesRef: '',
  favoritesIconRef: '',
  favoritesTextRef: '',
  productInfoButton: '',
  dealerTel: '',
};

const fetchFavourites = () => {
  fetchFavouritesAPI()
    .then(favorites => {
      data.user.favorites = favorites;

      // console.log('data.favorites после перезагрузки:', data.user.favorites);
    })
    .catch(error => console.log(error));
};

const fetchOwnCalls = () => {
  fetchOwnCallsAPI()
    .then(ownCalls => {
      data.user.ownCalls = ownCalls;
      // console.log('data.ownCalls после перезагрузки:', data.user.ownCalls);
    })
    .catch(error => console.log(error));
};

//=============== открытие информации о товаре =================
function openProductInfo(card) {
  const price = card.price.toLocaleString();
  // console.log(price);
  openInModal(productInfoTemplate({ ...card, price }), removeEventListeners);

  refs.dotsRef = document.querySelector('.dots');
  refs.activeListRef = document.querySelector('.productInfo__action-list');
  refs.maxImgRef = document.querySelector('.productInfo__imgMax');
  refs.minImgListRef = document.querySelector('.productInfo__list-imgMin');
  refs.minImgRef = document.querySelector('.productInfo__item-imgMin');
  refs.favoritesRef = document.querySelector('.favorites-js');
  refs.favoritesIconRef = refs.favoritesRef.querySelector('svg');
  refs.favoritesTextRef = refs.favoritesRef.querySelector('span');
  refs.productInfoButton = document.querySelector('.productInfo__button');
  refs.dealerTel = document.querySelector('.dealerTel');

  mobSlider(refs.dotsRef);
  isAuth(refs.activeListRef);

  if (findCardInFavoritesById(card)) {
    changeFavoriteBtnOnActive();
  }

  refs.maxImgRef.setAttribute('src', card.imageUrls[0]);
  refs.minImgRef &&
    refs.minImgRef.classList.add('productInfo__item-imgMin--active');

  refs.minImgListRef.addEventListener('click', onMinImgClick);
  refs.favoritesRef.addEventListener('click', onFavoritesClick.bind(card));
  refs.productInfoButton.addEventListener('click', getDealerInfo);
}
function getDealerInfo(event) {
  const id = event.target.dataset.id;
  const category = event.target.dataset.category;
  const adv = data.categoriesList[camelCase(category)].find(
    item => item._id === id,
  );
  refs.dealerTel.textContent = adv.phone;
}

function onMinImgClick(event) {
  if (event.target.nodeName === 'UL') return;
  if (event.target.nodeName === 'LI') {
    refs.maxImgRef.setAttribute('src', event.target.dataset.url);
    changeAciveIMG(event.target);
    return;
  }

  refs.maxImgRef.setAttribute('src', event.target.src);
  const imgItem = event.target.closest('li');

  changeAciveIMG(imgItem);
}

function changeAciveIMG(nextActiveIMG) {
  const currentActiveIMG = refs.minImgListRef.querySelector(
    '.productInfo__item-imgMin--active',
  );
  if (currentActiveIMG) {
    currentActiveIMG.classList.remove('productInfo__item-imgMin--active');
    nextActiveIMG.classList.add('productInfo__item-imgMin--active');
  }
}

function onFavoritesClick() {
  if (!findCardInFavoritesById(this)) {
    addInFavoritesAPI(this._id, this)
      .then(response => {
        data.user.favorites = [...data.user.favorites, this];
        changeFavoriteBtnOnActive();

        // console.log('data после добавления:', data.user.favorites);
      })
      .catch(error => console.log(error));
    return;
  }

  const idx = data.user.favorites.indexOf(findCardInFavoritesById(this));

  removeFromFavoritesAPI(this._id)
    .then(response => {
      data.user.favorites.splice(idx, 1);
      changeFavoriteBtnOnInactive();
      // console.log('data после удаления:', data.user.favorites);
      // console.log(document.querySelector('.favorites-myGoods'));
      if (document.querySelector('.favorites-myGoods')) {
        createMarkupFavoritesGoodsList(
          'Избранное',
          data.user.favorites,
          'В избранном пока пусто',
        );
      }
    })
    .catch(error => console.log(error));
}

function changeFavoriteBtnOnActive() {
  refs.favoritesTextRef.textContent = 'В избранном';
  refs.favoritesRef.classList.add('productInfo__action-item--active');
  refs.favoritesIconRef.classList.add(
    'productInfo__action-item--favorite-icon--active',
  );
}

function changeFavoriteBtnOnInactive() {
  refs.favoritesTextRef.textContent = 'В избранное';
  refs.favoritesRef.classList.remove('productInfo__action-item--active');
  refs.favoritesIconRef.classList.remove(
    'productInfo__action-item--favorite-icon--active',
  );
}

function findCardInFavoritesById(card) {
  const targetCard = data.user.favorites.find(item => item._id === card._id);
  return targetCard;
}

function isAuth(activeListRef) {
  if (data.auth.isAuth) {
    activeListRef.classList.add('productInfo__action-list--isAuth');
  }
}

function removeEventListeners() {
  refs.minImgListRef.removeEventListener('click', onMinImgClick);
  refs.favoritesRef.removeEventListener('click', onFavoritesClick);
}

export { openProductInfo, fetchFavourites, fetchOwnCalls };
