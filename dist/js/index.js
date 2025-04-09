/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Y: function() { return /* binding */ API_ADDRESS; },
  D: function() { return /* binding */ SHORT_API_ADDRESS; }
});

;// CONCATENATED MODULE: ./src/assets/script/modules/request.js
const fetchRequest = async (url, {
  method = 'get',
  callback,
  body,
  headers
}) => {
  try {
    const options = {
      method
    };
    if (body) options.body = JSON.stringify(body);
    if (headers) options.headers = headers;
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      if (callback) callback(null, data);
      return;
    }
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  } catch (err) {
    callback(err);
  }
};
/* harmony default export */ var request = (fetchRequest);
;// CONCATENATED MODULE: ./src/assets/script/modules/shopSessionData.js
const shopSessionData = {
  set: (field, value) => {
    const currentObj = JSON.parse(sessionStorage.getItem('shop'));
    const newObj = currentObj ? {
      ...currentObj,
      [field]: value
    } : {
      [field]: value
    };
    sessionStorage.setItem('shop', JSON.stringify(newObj));
  },
  get: field => {
    const currentObj = JSON.parse(sessionStorage.getItem('shop'));
    return currentObj[field];
  },
  clear: () => {
    sessionStorage.removeItem('shop');
  }
};
/* harmony default export */ var modules_shopSessionData = (shopSessionData);
;// CONCATENATED MODULE: ./src/assets/script/modules/headerAndFooter.js



const menuBtn = document.querySelector('.header__menu-button');
const menuBtnIcon = document.querySelector('.header__button-icon');
const menuContent = document.querySelector('.header__menu-box');
const menuOverlay = document.querySelector('.header__menu-overlay');
const headerCartLink = document.querySelector('.header__navigation-link_type_cart');
const headerCartCounter = document.querySelector('.header__cart-counter');
const categoriesHeader = document.getElementById('categories-header');
const categoriesFooter = document.getElementById('categories-footer');
const goodsCategories = ['Смартфоны', 'Ноутбуки', 'Ювелирные изделия', 'Одежда', 'Бытовая техника', 'Бытовая химия', 'Книги и журналы', 'Домашний текстиль', 'Электроника', 'Косметика'];
const onClickMenuCatalogItem = categoryName => modules_shopSessionData.set('category', categoryName);
const createMenuCatalogItem = (categoryName, position = 'header') => {
  if (position !== 'header' && position !== 'footer') return;
  const block = document.createElement('li');
  block.className = `navigation-block__item navigation-block__item_position_${position}`;
  const link = document.createElement('a');
  link.classList.add('navigation-block__link');
  link.href = 'catalog.html';
  link.innerText = categoryName;
  link.addEventListener('click', () => onClickMenuCatalogItem(categoryName));
  block.append(link);
  return block;
};
const renderHeaderAndFooterCatalogItemsList = () => {
  const headerElements = goodsCategories.map(categoryName => createMenuCatalogItem(categoryName, 'header'));
  const footerElements = goodsCategories.map(categoryName => createMenuCatalogItem(categoryName, 'footer'));
  categoriesHeader.append(...headerElements);
  categoriesFooter.append(...footerElements);
};

// Cart counter func
const setCartCounter = () => {
  request(API_ADDRESS + 'user', {
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        return;
      }
      const cartGoodsTotal = data.cart.reduce((acc, item) => acc + Number(item.count), 0);
      headerCartLink.setAttribute('aria-label', `Ссылка на вашу корзину. Количество товаров: ${cartGoodsTotal}`);
      headerCartCounter.textContent = `${cartGoodsTotal}`;
    }
  });
};
const setHeaderAndFooterMenus = () => {
  renderHeaderAndFooterCatalogItemsList();

  // Set cart counter
  setCartCounter();

  // Menu controls
  menuBtn.addEventListener('click', () => {
    menuBtnIcon.classList.toggle('header__button-icon_active');
    if (menuContent.classList.contains('header__menu-box_active')) {
      menuContent.style.height = '';
      menuContent.classList.remove('header__menu-box_active');
      menuOverlay.style.opacity = '0';
      setTimeout(() => menuOverlay.classList.remove('header__menu-overlay_active'), 400);
    } else {
      menuOverlay.classList.add('header__menu-overlay_active');
      menuOverlay.style.opacity = '1';
      menuContent.style.height = `${menuContent.scrollHeight}px`;
      menuContent.classList.add('header__menu-box_active');
    }
  });
  menuOverlay.addEventListener('click', e => {
    if (e.target === menuOverlay || e.target.classList.contains('navigation-block__link')) {
      menuBtnIcon.classList.remove('header__button-icon_active');
      menuContent.classList.remove('header__menu-box_active');
      menuContent.style.height = '';
      setTimeout(() => menuOverlay.classList.remove('header__menu-overlay_active'), 400);
    }
  });

  // Footer accordeon
  const accordeonBtnsArr = document.querySelectorAll('.navigation-block__accordeon-btn');
  const accordeonArrowsArr = document.querySelectorAll('.navigation-block__accordeon-arrow');
  const accordeonListsArr = document.querySelectorAll('.navigation-block__list_position_footer');
  accordeonBtnsArr.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      accordeonArrowsArr[index].classList.toggle('navigation-block__accordeon-arrow_active');
      accordeonListsArr[index].style.height = accordeonListsArr[index].classList.contains('navigation-block__list_active') ? '' : `${accordeonListsArr[index].scrollHeight}px`;
      accordeonListsArr[index].classList.toggle('navigation-block__list_active');
    });
  });

  // Close all on screen resize
  window.addEventListener('resize', () => {
    if (document.documentElement.scrollWidth > 640) {
      menuOverlay.classList.remove('header__menu-overlay_active');
      menuBtnIcon.classList.remove('header__button-icon_active');
      menuContent.classList.remove('header__menu-box_active');
      menuContent.style.height = '';
      accordeonListsArr.forEach(list => {
        list.classList.remove('navigation-block__list_active');
        list.style.height = '';
      });
      accordeonArrowsArr.forEach(arrow => {
        arrow.classList.remove('navigation-block__accordeon-arrow_active');
      });
    }
  });
};

;// CONCATENATED MODULE: ./src/assets/script/modules/timer.js
// Promo timer
const createTimerAppearance = timer => {
  const title = document.createElement('p');
  title.classList.add('block-one__text');
  title.textContent = 'До конца акции:';
  const mainBlock = document.createElement('div');
  mainBlock.classList.add('block-one__timer');
  const createTimerItemBlock = typeClass => {
    const itemBlock = document.createElement('div');
    itemBlock.classList.add('block-one__timer-item', typeClass);
    const value = document.createElement('p');
    value.classList.add('block-one__timer-value');
    const parameter = document.createElement('p');
    parameter.classList.add('block-one__timer-parameter');
    itemBlock.append(value, parameter);
    itemBlock.value = value;
    itemBlock.parameter = parameter;
    return itemBlock;
  };
  const dayBlock = createTimerItemBlock('block-one__timer-item_type_days');
  const hourBlock = createTimerItemBlock('block-one__timer-item_type_hours');
  const minBlock = createTimerItemBlock('block-one__timer-item_type_minutes');
  mainBlock.append(dayBlock, hourBlock, minBlock);
  timer.append(title, mainBlock);
  return {
    title,
    mainBlock,
    dayNum: dayBlock.value,
    dayParam: dayBlock.parameter,
    hourNum: hourBlock.value,
    hourParam: hourBlock.parameter,
    minNum: minBlock.value,
    minParam: minBlock.parameter
  };
};
const timer = (timer, deadline, gmt) => {
  const {
    title,
    mainBlock,
    dayNum,
    dayParam,
    hourNum,
    hourParam,
    minNum,
    minParam
  } = createTimerAppearance(timer);
  const getTimeRemaining = () => {
    const dateStop = new Date(`${deadline} GMT${gmt}:00`).getTime();
    const dateNow = Date.now();
    const timeRemaining = dateStop - dateNow;
    const seconds = Math.floor(timeRemaining / 1000 % 60);
    const minutes = Math.floor(timeRemaining / 1000 / 60 % 60);
    const hours = Math.floor(timeRemaining / 1000 / 60 / 60 % 24);
    const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);
    return {
      timeRemaining,
      seconds,
      minutes,
      hours,
      days
    };
  };
  const start = () => {
    const timer = getTimeRemaining();
    const setOptions = unit => ({
      style: 'unit',
      unit,
      unitDisplay: 'long',
      maximumSignificantDigits: '2'
    });
    const daysText = new Intl.NumberFormat('ru', setOptions('day'));
    const hoursText = new Intl.NumberFormat('ru', setOptions('hour'));
    const minText = new Intl.NumberFormat('ru', setOptions('minute'));
    const secText = new Intl.NumberFormat('ru', setOptions('second'));
    dayNum.textContent = timer.days < 10 ? '0' + timer.days : timer.days;
    dayParam.textContent = daysText.format(timer.days).slice(2).trim();
    hourNum.textContent = timer.hours < 10 ? '0' + timer.hours : timer.hours;
    hourParam.textContent = hoursText.format(timer.hours).slice(2).trim();
    minNum.textContent = timer.minutes < 10 ? '0' + timer.minutes : timer.minutes;
    minParam.textContent = minText.format(timer.minutes).slice(2).trim();
    const intervalId = setTimeout(start, 1000);
    if (timer.timeRemaining < 86400000) {
      dayNum.textContent = timer.hours < 10 ? '0' + timer.hours : timer.hours;
      dayParam.textContent = hoursText.format(timer.hours).slice(2).trim();
      hourNum.textContent = timer.minutes < 10 ? '0' + timer.minutes : timer.minutes;
      hourParam.textContent = minText.format(timer.minutes).slice(2).trim();
      minNum.textContent = timer.seconds < 10 ? '0' + timer.seconds : timer.seconds;
      minParam.textContent = secText.format(timer.seconds).slice(2).trim();
    }
    if (timer.timeRemaining <= 0) {
      clearTimeout(intervalId);
      dayNum.textContent = '00';
      hourNum.textContent = '00';
      minNum.textContent = '00';
      title.remove();
      mainBlock.remove();
    }
  };
  start();
};
const setTimer = gmt => {
  const timerBlock = document.querySelector('[data-timer-deadline]');
  return timerBlock ? timer(timerBlock, timerBlock.dataset.timerDeadline, gmt) : null;
};
/* harmony default export */ var modules_timer = (setTimer);
;// CONCATENATED MODULE: ./src/assets/script/modules/catalogPage.js



const cardsListNode = document.querySelector('.products-block__list');
const setCategoryHeader = category => {
  const headerNode = document.querySelector('.products-block__header_page_catalog');
  if (headerNode) headerNode.textContent = category;
};
const onProductCardClick = productId => modules_shopSessionData.set('product', productId);
const renderCardSkeleton = () => {
  const skeletonBody = document.createElement('li');
  skeletonBody.classList.add('products-block__skeleton', 'skeleton');
  return skeletonBody;
};
const renderProductCard = obj => {
  const card = document.createElement('li');
  card.classList.add('products-block__item');
  const wrapperLink = document.createElement('a');
  wrapperLink.classList.add('products-block__link', 'product-card');
  wrapperLink.href = 'product.html';
  const ariaLabelText = obj.discount ? `Карточка товара: ${obj.title}. Старая цена ${obj.price} рублей. Новая цена ${Math.round(obj.price * (1 - obj.discount * 0.01))} рублей. Скидка ${obj.discount}%` : `Карточка товара: ${obj.title}. Цена ${obj.price} рублей.`;
  wrapperLink.ariaLabel = ariaLabelText;
  wrapperLink.insertAdjacentHTML('afterbegin', `
    <div class="product-card__image-container">
      <picture>
        <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/avif">
        <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/webp">
        <img class="product-card__image" src="${SHORT_API_ADDRESS}${obj.image}" alt="Изображение товара" width="428" height="295">
      </picture>
      ${obj.discount ? `<p class="profitable__discount-marker discount-marker discount-marker_position_bottom-left">-${obj.discount}%</p>` : ''}
    </div>

    <div class="product-card__price-block">
      <p class="product-card__price">${Math.round(obj.price * (1 - obj.discount * 0.01))} ₽</p>
      ${obj.discount ? `<p class="product-card__price-old">${obj.price} ₽</p>` : ''}
    </div>
     
    <h4 class="product-card__product-name">${obj.title}</h4>
  `);
  wrapperLink.addEventListener('click', () => onProductCardClick(obj.id));
  card.append(wrapperLink);
  return card;
};
const renderLoadingCards = () => {
  const skeletonsArr = [];
  for (let i = 0; i < 12; i++) {
    skeletonsArr.push(renderCardSkeleton());
  }
  cardsListNode.append(...skeletonsArr);
};
const renderGoods = goodsArr => {
  cardsListNode.innerHTML = '';
  const cardsArr = goodsArr.map(product => renderProductCard(product));
  cardsListNode.append(...cardsArr);
};
const renderCatalogPage = () => {
  renderLoadingCards();
  const category = modules_shopSessionData.get('category');
  setCategoryHeader(category);
  request(API_ADDRESS + 'goods/category/Cмартфоны', {
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        return;
      }
      renderGoods(data);
    }
  });
};
/* harmony default export */ var catalogPage = (renderCatalogPage);
;// CONCATENATED MODULE: ./src/assets/script/modules/productPage.js





// DOM nodes
const productTitle = document.querySelector('.product__title');
const productContent = document.querySelector('.product__content');
const renderProduct = obj => {
  productTitle.textContent = obj.title;
  productContent.insertAdjacentHTML('beforeend', `
    <div class="product__image-container">
      <picture>
        <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/avif">
        <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/webp">
        <img class="product__image" src="${SHORT_API_ADDRESS}${obj.image}" alt="Фотография ${obj.title}" 
         width="757" height="427">
      </picture>
      ${obj.discount ? `<p class="profitable__discount-marker discount-marker discount-marker_position_top-right" aria-label="Скидка">-${obj.discount}%</p>` : ''}
      
    </div>

    <div class="product__info material-card">

      <div class="product__price-block">
        ${obj.discount ? `<p class="product__price" aria-label="Новая цена">${Math.round(obj.price * (1 - obj.discount * 0.01))} ₽</p>
             <p class="product__price-old" aria-label="Старая цена">${obj.price} ₽</p>` : `<p class="product__price" aria-label="Цена">${obj.price} ₽</p>`}
        <p class="product__credit">В кредит от 5600 ₽</p>
      </div>

      <div class="product__actions-block">
        <button class="product__buy-btn button" type="button">Добавить в корзину</button>
        <button class="product__favorites-btn" type="button" aria-label="Добавить в избранное">
          <svg width="33" height="33" viewBox="0 0 33 33" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2908_1178)">
              <path d="M22.6875 4.125C20.295 4.125 17.9987 5.23875 16.5 6.99875C15.0012 5.23875 12.705 4.125 10.3125 4.125C6.0775 
              4.125 2.75 7.4525 2.75 11.6875C2.75 16.885 7.425 21.12 14.5062 27.555L16.5 29.3563L18.4937 27.5413C25.575 21.12 
              30.25 16.885 30.25 11.6875C30.25 7.4525 26.9225 4.125 22.6875 4.125ZM16.6375 25.5062L16.5 25.6437L16.3625 
              25.5062C9.8175 19.58 5.5 15.6613 5.5 11.6875C5.5 8.9375 7.5625 6.875 10.3125 6.875C12.43 6.875 14.4925 8.23625 
              15.2212 10.12H17.7925C18.5075 8.23625 20.57 6.875 22.6875 6.875C25.4375 6.875 27.5 8.9375 27.5 11.6875C27.5 15.6613 
              23.1825 19.58 16.6375 25.5062Z" fill="currentColor"/>
            </g>
            <defs>
              <clipPath id="clip0_2908_1178">
                <rect width="33" height="33" fill="none"/>
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <div class="product__delivery-block">
        <div class="product__delivery">
          <p class="product__delivery-subtitle">Доставка</p>
          <p class="product__delivery-text">1-3 января</p>   
        </div>
        <div class="product__seller">
          <p class="product__delivery-subtitle">Продавец</p>
          <p class="product__delivery-text">ShopOnline</p>   
        </div>
      </div>

      <button class="product__subscribe" type="button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 13.586V10C19 6.783 16.815 4.073 13.855 3.258C13.562 2.52 12.846 2 12 2C11.154 2 10.438 2.52 10.145 3.258C7.185 4.074 5 6.783 5 10V13.586L3.293 15.293C3.19996 15.3857 3.12617 15.4959 3.07589 15.6172C3.0256 15.7386 2.99981 15.8687 3 16V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H20C20.2652 19 20.5196 18.8946 20.7071 18.7071C20.8946 18.5196 21 18.2652 21 18V16C21.0002 15.8687 20.9744 15.7386 20.9241 15.6172C20.8738 15.4959 20.8 15.3857 20.707 15.293L19 13.586ZM19 17H5V16.414L6.707 14.707C6.80004 14.6143 6.87383 14.5041 6.92412 14.3828C6.9744 14.2614 7.00019 14.1313 7 14V10C7 7.243 9.243 5 12 5C14.757 5 17 7.243 17 10V14C17 14.266 17.105 14.52 17.293 14.707L19 16.414V17ZM12 22C12.6193 22.0008 13.2235 21.8086 13.7285 21.4502C14.2335 21.0917 14.6143 20.5849 14.818 20H9.182C9.38566 20.5849 9.76648 21.0917 10.2715 21.4502C10.7765 21.8086 11.3807 22.0008 12 22V22Z" fill="currentColor"/>
        </svg><span class="product__subscribe-text">Узнать о снижении цены</span>
      </button>

    </div>

    <div class="product__description">
      <h3 class="product__description-title">Описание:</h3>
      <p class="product__description-text">${obj.description}</p>
    </div>
  `);
};
const handleAddToCart = (obj, btn) => {
  request(API_ADDRESS + 'user', {
    method: 'POST',
    body: {
      id: obj.id,
      image: obj.image,
      title: obj.title,
      price: obj.discount ? String(Math.round(Number(obj.price) * (1 - Number(obj.discount) * 0.01))) : Math.round(obj.price),
      oldPrice: obj.discount ? String(Math.round(Number(obj.price))) : null,
      extra: obj.extra || null,
      count: '1',
      isCheckedForOrder: true,
      maxCount: obj.count
    },
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        alert('Произошла ошибка');
        btn.classList.remove('product__buy-btn_status_await');
        btn.disabled = false;
      }
      alert('Товар добавлен');
      btn.classList.remove('product__buy-btn_status_await');
      btn.disabled = false;
      setCartCounter();
    }
  });
};
const setAddToCartBtnControl = obj => {
  const addToCartBtn = document.querySelector('.product__buy-btn');
  addToCartBtn.addEventListener('click', () => {
    addToCartBtn.classList.add('product__buy-btn_status_await');
    addToCartBtn.disabled = true;
    handleAddToCart(obj, addToCartBtn);
  });
};
// ====================================================================================================

// Skeletons
const setTitleSkeleton = () => {
  productTitle.classList.add('product__skeleton', 'product__skeleton_title', 'skeleton');
};
const renderProductSkeleton = () => {
  const imageSkeleton = document.createElement('div');
  imageSkeleton.classList.add('product__skeleton', 'product__skeleton_image', 'skeleton');
  const infoSkeleton = document.createElement('div');
  infoSkeleton.classList.add('product__skeleton', 'product__skeleton_info', 'skeleton');
  const descriptionSkeleton = document.createElement('div');
  descriptionSkeleton.classList.add('product__skeleton', 'product__skeleton_description', 'skeleton');
  productContent.append(imageSkeleton, infoSkeleton, descriptionSkeleton);
};
const renderSkeletons = () => {
  setTitleSkeleton();
  renderProductSkeleton();
};
const removeSkeletons = () => {
  productTitle.classList.remove('product__skeleton', 'product__skeleton_title', 'skeleton');
  productContent.innerHTML = '';
};
// ====================================================================================================

// Render page

const renderProductPage = () => {
  renderSkeletons();
  const productID = modules_shopSessionData.get('product');
  request(API_ADDRESS + 'goods/' + productID, {
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        alert('Произошла ошибка');
      }
      removeSkeletons();
      renderProduct(data);
      setAddToCartBtnControl(data);
    }
  });
};
/* harmony default export */ var productPage = (renderProductPage);
;// CONCATENATED MODULE: ./src/assets/script/modules/cartPage.js




// DOM nodes
const cartGoodsNumber = document.querySelector('.cart__goods-number');
const cartGoodsActions = document.querySelector('.cart__goods-actions');
const cartGoodsList = document.querySelector('.cart__goods-list');
const cartDelivery = document.querySelector('.cart__card_type_delivery');
const cartDeliveryInfo = document.querySelector('.cart__delivery-info');
const cardTotal = document.querySelector('.cart__card_type_total');
const cardTotalContainer = document.querySelector('.cart__total-container');

// Common logic
const beautifyNumber = num => new Intl.NumberFormat('fr-FR').format(num);
const textToNumber = str => str.split('').filter(x => Number.isInteger(+x)).join('').replace(/\s/g, '');
const handleClickCartItem = productId => modules_shopSessionData.set('product', productId);
const setHeaderCartCounter = obj => {
  const headerCartCounter = document.querySelector('.header__cart-counter');
  const cartGoodsTotal = obj.cart.reduce((acc, item) => acc + Number(item.count), 0);
  headerCartCounter.textContent = `${cartGoodsTotal}`;
};
const setCartGoodsNumber = cartArr => cartGoodsNumber.textContent = cartArr.reduce((acc, prod) => acc + Number(prod.count), 0) + '';
// ====================================================================================================

// Await element state
const renderAwaitState = element => {
  const awaitBlock = document.createElement('div');
  awaitBlock.classList.add('await');
  awaitBlock.insertAdjacentHTML('beforeend', `
    <span class="await-loader"></span>
  `);
  element.classList.add('await-container');
  element.append(awaitBlock);
  return awaitBlock;
};
const removeAwaitState = element => {
  element.parentElement.classList.remove('await');
  element.remove();
};
// ====================================================================================================

// Empty cart logic
const renderEmptyCartTotal = () => {
  cardTotalContainer.classList.add('hidden');
  cardTotal.insertAdjacentHTML(`beforeend`, `
    <div class="cart__total-empty">
      <p class="cart__empty-header">Товары отсутствут</p>
      <p class="cart__text">Добавьте новые товары в корзину, или активируйте уже имеющиеся.</p>
      <a class="cart__empty-link" href="catalog.html">Перейти в каталог</a>
    </div>
  `);
};
const renderEmptyCartProductsList = () => {
  cartDelivery.classList.add('hidden');
  cartGoodsList.insertAdjacentHTML(`beforeend`, `
    <p class="cart__text">Ваша корзина пуста</p>
  `);
};
const renderEmptyCart = () => {
  renderEmptyCartProductsList();
  renderEmptyCartTotal();
};
const removeEmptyCartTotal = () => {
  const totalEmptyBlock = document.querySelector('.cart__total-empty');
  if (totalEmptyBlock) {
    totalEmptyBlock.remove();
  }
  if (cardTotalContainer.classList.contains('hidden')) {
    cardTotalContainer.classList.remove('hidden');
  }
};
// ====================================================================================================

// Total card logic
const calculateCartNumbers = arr => {
  const currentPrice = arr.reduce((acc, i) => Number(i.price) * Number(i.count) + acc, 0);
  const count = arr.reduce((acc, i) => Number(i.count) + acc, 0);
  const oldPrice = arr.reduce((acc, i) => {
    const old = i.oldPrice ? Number(i.oldPrice) * Number(i.count) : Number(i.price) * Number(i.count);
    return old + acc;
  }, 0);
  const discount = arr.reduce((acc, i) => {
    const dis = i.oldPrice ? (Number(i.oldPrice) - Number(i.price)) * Number(i.count) : 0;
    return dis + acc;
  }, 0);
  return {
    currentPrice,
    count,
    oldPrice,
    discount
  };
};
const createTotalNumbersText = obj => ({
  currentPrice: beautifyNumber(obj.currentPrice) + ' ₽',
  count: `Товары, ${obj.count}  шт.`,
  oldPrice: `${beautifyNumber(obj.oldPrice)} ₽`,
  discount: `${beautifyNumber(obj.discount)} ₽`
});
const renderCartTotalNumbers = (obj, topBlockCost, goodsCount, goodsCost, discountValue) => {
  topBlockCost.textContent = obj.currentPrice;
  goodsCount.textContent = obj.count;
  goodsCost.textContent = obj.oldPrice;
  discountValue.textContent = obj.discount;
};
// ====================================================================================================

// Terms checkbox logic
const checkTermsAcception = (checkbox, button) => {
  button.disabled = !checkbox.checked;
  if (!checkbox.checked) {
    button.classList.add('button__disabled');
  } else if (checkbox.checked && button.classList.contains('button__disabled')) {
    button.classList.remove('button__disabled');
  }
};
// ====================================================================================================

// Products checkboxes logic
const getAllProductCheckboxesArr = () => {
  const allProductCheckboxes = document.querySelectorAll('.cart__product-checkbox');
  return Array.from(allProductCheckboxes);
};
const setDelButtonDisable = (arr, deleteSelectedButton, prop) => {
  if (arr.every(i => i[`${prop}`] === false)) {
    deleteSelectedButton.disabled = true;
    deleteSelectedButton.classList.add('cart__delete-btn_disabled');
    return;
  }
  deleteSelectedButton.disabled = false;
  if (deleteSelectedButton.classList.contains('cart__delete-btn_disabled')) {
    deleteSelectedButton.classList.remove('cart__delete-btn_disabled');
  }
};
const setNewPricesOnCheckboxChange = (arr, topBlockCost, goodsCount, goodsCost, discountValue) => {
  const checkedLabelNodes = arr.filter(chbx => chbx.checked === true);
  if (!checkedLabelNodes.length) {
    renderEmptyCartTotal();
    return;
  }
  removeEmptyCartTotal();
  const checkedProductNodes = checkedLabelNodes.map(chbx => chbx.closest('.cart__goods-item'));
  const calculateNumbers = node => {
    const priceNode = Array.from(node.lastElementChild.previousElementSibling.children);
    const counterNode = Array.from(node.lastElementChild.previousElementSibling.previousElementSibling.children);
    const count = Number(counterNode[1].textContent);
    let currentPrice = 0;
    let oldPrice = 0;
    priceNode.forEach(i => {
      if (i.classList.contains('cart__goods-price')) {
        currentPrice += Number(textToNumber(i.textContent)) * count;
      } else if (i.classList.contains('cart__goods-discount')) {
        oldPrice += Number(textToNumber(i.textContent)) * count;
      }
    });
    const discount = oldPrice ? oldPrice - currentPrice : 0;
    if (!oldPrice) oldPrice += currentPrice;
    return {
      currentPrice,
      count,
      oldPrice,
      discount
    };
  };
  const newValues = checkedProductNodes.map(i => calculateNumbers(i)).reduce((acc, i) => {
    acc.currentPrice += i.currentPrice;
    acc.count += i.count;
    acc.oldPrice += i.oldPrice;
    if (i.discount) acc.discount += i.discount;
    return acc;
  }, {
    currentPrice: 0,
    count: 0,
    oldPrice: 0,
    discount: 0
  });
  const newValuesText = createTotalNumbersText(newValues);
  renderCartTotalNumbers(newValuesText, topBlockCost, goodsCount, goodsCost, discountValue);
};
const changeAllCheckboxes = (arr, boolean) => arr.forEach(checkbox => checkbox.checked = boolean);
const selectAllCheckboxAction = (isChecked, checkboxesArr) => {
  if (isChecked) {
    changeAllCheckboxes(checkboxesArr, true);
  } else {
    changeAllCheckboxes(checkboxesArr, false);
  }
};
const isAllSelected = (arr, prop) => arr.every(i => i[`${prop}`] === true);
const setSelectAllCheckbox = (selectAllCheckbox, arr) => {
  selectAllCheckbox.checked = isAllSelected(arr, 'checked');
};
const requestOnCheckboxChange = (reqArr, requestType, checkboxType, elementsArr, selectAllCheckbox, deleteSelectedButton, topBlockCost, goodsCount, goodsCost, discountValue) => {
  if (requestType !== 'checkbox') return;
  if (checkboxType !== 'regular' && checkboxType !== 'all') return;
  const elementsAwaitArr = elementsArr.map(el => renderAwaitState(el));
  const currentCardTotal = renderAwaitState(cardTotal);
  request(API_ADDRESS + 'user/cart', {
    method: 'PATCH',
    body: {
      id: reqArr,
      type: requestType
    },
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        alert('Произошла ошибка');
        elementsAwaitArr.forEach(el => removeAwaitState(el));
        removeAwaitState(currentCardTotal);
        return;
      }
      elementsAwaitArr.forEach(el => removeAwaitState(el));
      removeAwaitState(currentCardTotal);
      const allProductCheckboxesArr = getAllProductCheckboxesArr();
      if (checkboxType === 'all') {
        selectAllCheckboxAction(selectAllCheckbox.checked, allProductCheckboxesArr);
      }
      if (checkboxType === 'regular') {
        setSelectAllCheckbox(selectAllCheckbox, allProductCheckboxesArr);
      }
      setDelButtonDisable(allProductCheckboxesArr, deleteSelectedButton, 'checked');
      setNewPricesOnCheckboxChange(allProductCheckboxesArr, topBlockCost, goodsCount, goodsCost, discountValue);
    }
  });
};
const handleSelectAll = (target, deleteSelectedButton, topBlockCost, goodsCount, goodsCost, discountValue) => {
  const allProductCheckboxesArr = getAllProductCheckboxesArr();
  const allProductsNodesArr = allProductCheckboxesArr.map(cbx => cbx.closest('.cart__goods-item'));
  const allProductsIdentifiers = allProductsNodesArr.map(node => node.dataset.productid);
  const reqBody = allProductsIdentifiers.reduce((acc, id) => {
    acc.push({
      id,
      value: target.checked
    });
    return acc;
  }, []);
  requestOnCheckboxChange(reqBody, 'checkbox', 'all', allProductsNodesArr, target, deleteSelectedButton, topBlockCost, goodsCount, goodsCost, discountValue);
};
// ====================================================================================================

// Deletion logic
const deleteProductsRequest = (deleteSelectedButton, selectAllCheckbox, goodsNodesArr, deliveryNodesArr, IdArr, topBlockCost, goodsCount, goodsCost, discountValue) => {
  request(API_ADDRESS + 'user/cart', {
    method: 'DELETE',
    body: {
      identifiers: IdArr
    },
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        alert('Произошла ошибка');
        goodsNodesArr.forEach(node => node.classList.remove('cart__goods-item_status_await'));
        deliveryNodesArr.forEach(node => node.classList.remove('cart__delivery-product_status_await'));
        return;
      }
      goodsNodesArr.forEach(node => node.remove());
      deliveryNodesArr.forEach(node => node.remove());
      setHeaderCartCounter(data);
      setCartGoodsNumber(data.cart);
      const allProductCheckboxesArr = getAllProductCheckboxesArr();
      setDelButtonDisable(allProductCheckboxesArr, deleteSelectedButton, checked);
      setSelectAllCheckbox(selectAllCheckbox, allProductCheckboxesArr);
      setNewPricesOnCheckboxChange(allProductCheckboxesArr, topBlockCost, goodsCount, goodsCost, discountValue);
    }
  });
};
const deleteSelectedProducts = (deleteSelectedButton, selectAllCheckbox, topBlockCost, goodsCount, goodsCost, discountValue) => {
  const allProductCheckboxesArr = getAllProductCheckboxesArr();
  const selelctedProductsNodes = allProductCheckboxesArr.filter(cbx => cbx.checked).map(cbx => cbx.closest('.cart__goods-item'));
  const selelctedProductsNodesArr = Array.from(selelctedProductsNodes);
  const selelctedProductsIdentifiers = selelctedProductsNodesArr.map(node => node.dataset.productid);
  const selectedProductsDeliveryCardsArr = Array.from(document.querySelectorAll('.cart__delivery-product')).filter(li => selelctedProductsIdentifiers.includes(li.dataset.productid));
  selelctedProductsNodesArr.forEach(node => node.classList.add('cart__goods-item_status_await'));
  selectedProductsDeliveryCardsArr.forEach(node => node.classList.add('cart__delivery-product_status_await'));
  deleteProductsRequest(deleteSelectedButton, selectAllCheckbox, selelctedProductsNodesArr, selectedProductsDeliveryCardsArr, selelctedProductsIdentifiers, topBlockCost, goodsCount, goodsCost, discountValue);
};
const handleDeleteSelectedProducts = (deleteSelectedButton, selectAllCheckbox, topBlockCost, goodsCount, goodsCost, discountValue) => {
  if (confirm('Удалить выбранные товары?')) return deleteSelectedProducts(deleteSelectedButton, selectAllCheckbox, topBlockCost, goodsCount, goodsCost, discountValue);
  return;
};
// ====================================================================================================

// Counter logic
const handleCounterChange = (target, otherBtn, obj, type, counterValue, currentElement, topBlockCost, goodsCount, goodsCost, discountValue) => {
  if (type !== 'increase' && type !== 'decrease') return;
  const currentElementAwait = renderAwaitState(currentElement);
  const currentCardTotal = renderAwaitState(cardTotal);
  request(API_ADDRESS + 'user/cart', {
    method: 'PATCH',
    body: {
      id: obj.id,
      type
    },
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        alert('Произошла ошибка');
        removeAwaitState(currentElementAwait);
        removeAwaitState(currentCardTotal);
        return;
      }
      removeAwaitState(currentElementAwait);
      removeAwaitState(currentCardTotal);
      const newProductData = data.cart.find(product => product.id === obj.id);
      counterValue.textContent = newProductData.count;
      setHeaderCartCounter(data);
      setCartGoodsNumber(data.cart);
      const allProductCheckboxesArr = getAllProductCheckboxesArr();
      setNewPricesOnCheckboxChange(allProductCheckboxesArr, topBlockCost, goodsCount, goodsCost, discountValue);
      if (newProductData.count + '' === '1' && type === 'decrease' || newProductData.count === newProductData.maxCount && type === 'increase') {
        target.disabled = true;
        target.classList.add('counter__btn_type_disabled');
        otherBtn.disabled = false;
        if (otherBtn.classList.contains('counter__btn_type_disabled')) {
          otherBtn.classList.remove('counter__btn_type_disabled');
        }
        return;
      }
      target.disabled = false;
      if (target.classList.contains('counter__btn_type_disabled')) {
        target.classList.remove('counter__btn_type_disabled');
      }
      otherBtn.disabled = false;
      if (otherBtn.classList.contains('counter__btn_type_disabled')) {
        otherBtn.classList.remove('counter__btn_type_disabled');
      }
    }
  });
};
// ====================================================================================================

// Cart list render
const renderCartListTop = (data, topBlockCost, goodsCount, goodsCost, discountValue) => {
  const selectAllLabel = document.createElement('label');
  selectAllLabel.classList.add('cart__goods-all', 'cart__text', 'cart__text_weight_bold', 'cart__text_color_black');
  selectAllLabel.setAttribute('for', 'all');
  const selectAllCheckbox = document.createElement('input');
  selectAllCheckbox.classList.add('cart__all-checkbox', 'checkbox');
  selectAllCheckbox.setAttribute('name', 'all');
  selectAllCheckbox.id = 'all';
  selectAllCheckbox.type = 'checkbox';
  selectAllCheckbox.checked = isAllSelected(data, 'isCheckedForOrder');
  selectAllLabel.append(selectAllCheckbox);
  selectAllLabel.insertAdjacentHTML('beforeend', `Выбрать все`);
  const deleteSelectedButton = document.createElement('button');
  deleteSelectedButton.classList.add('cart__goods-clearall', 'cart__delete-btn');
  deleteSelectedButton.type = 'button';
  deleteSelectedButton.setAttribute('aria-label', 'Удалить выбранные товары из корзины');
  deleteSelectedButton.insertAdjacentHTML('beforeend', `
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_217_1895)">
       <path d="M19.0214 5.35355L19.1679 5.5H19.375H23.25V7H6.75V5.5H10.625H10.8321L10.9786 5.35355L12.0821 4.25H17.9179L19.0214 5.35355ZM10 25.75C8.90114 25.75 8 24.8489 8 23.75V9.25H22V23.75C22 24.8489 21.0989 25.75 20 25.75H10Z" fill="currentColor" stroke="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_217_1895">
          <rect width="30" height="30" fill="currentColor"/>
        </clipPath>
      </defs>
    </svg>
  `);
  deleteSelectedButton.addEventListener('click', ({
    target
  }) => handleDeleteSelectedProducts(target, selectAllCheckbox, topBlockCost, goodsCount, goodsCost, discountValue));
  setDelButtonDisable(data, deleteSelectedButton, 'isCheckedForOrder');
  selectAllCheckbox.addEventListener('change', ({
    target
  }) => handleSelectAll(target, deleteSelectedButton, topBlockCost, goodsCount, goodsCost, discountValue));
  cartGoodsActions.append(selectAllLabel, deleteSelectedButton);
  return {
    selectAllCheckbox,
    deleteSelectedButton
  };
};
const renderCartItem = (selectAllCheckbox, deleteSelectedButton, obj, topBlockCost, goodsCount, goodsCost, discountValue) => {
  if (!topBlockCost) topBlockCost = document.querySelector('.cart__total-cost');
  if (!goodsCount) goodsCount = document.querySelector('.cart__text_content_goods-count');
  if (!goodsCost) goodsCost = document.querySelector('.cart__text_content_goods-cost');
  if (!discountValue) discountValue = document.querySelector('.cart__text_content_discount-value');
  const cartGoodsItem = document.createElement('li');
  cartGoodsItem.classList.add('cart__goods-item');
  cartGoodsItem.setAttribute('data-productid', obj.id);
  const checkboxLabel = document.createElement('label');
  checkboxLabel.classList.add('cart__goods-product');
  checkboxLabel.for = 'product';
  const productCheckbox = document.createElement('input');
  productCheckbox.classList.add('cart__product-checkbox', 'checkbox');
  productCheckbox.name = 'product';
  productCheckbox.id = 'product';
  productCheckbox.type = 'checkbox';
  productCheckbox.checked = obj.isCheckedForOrder;
  productCheckbox.setAttribute('aria-label', `Выбрать товар ${obj.title} для покупки.`);
  productCheckbox.addEventListener('change', ({
    target
  }) => {
    const arr = [{
      id: obj.id,
      value: target.checked
    }];
    const elementsArr = [cartGoodsItem];
    return requestOnCheckboxChange(arr, 'checkbox', 'regular', elementsArr, selectAllCheckbox, deleteSelectedButton, topBlockCost, goodsCount, goodsCost, discountValue);
  });
  checkboxLabel.append(productCheckbox);
  cartGoodsItem.append(checkboxLabel);
  const cartGoodsPicture = document.createElement('a');
  cartGoodsPicture.classList.add('cart__goods-picture', 'cart__img-container');
  cartGoodsPicture.href = 'product.html';
  cartGoodsPicture.insertAdjacentHTML('beforeend', `
    <picture>
      <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/avif">
      <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/webp">
      <img class="cart__goods-image" src="${SHORT_API_ADDRESS}${obj.image}" alt="Изображение товара ${obj.title}" width="130" height="130">
    </picture>
  `);
  cartGoodsPicture.addEventListener('click', () => handleClickCartItem(obj.id));
  cartGoodsItem.append(cartGoodsPicture);
  const cartProductInfo = document.createElement('div');
  cartProductInfo.classList.add('cart__product-info');
  const cartProductName = document.createElement('a');
  cartProductName.classList.add('cart__product-name');
  cartProductName.href = 'product.html';
  cartProductName.textContent = obj.title;
  cartProductName.addEventListener('click', () => handleClickCartItem(obj.id));
  cartProductInfo.append(cartProductName);
  cartProductInfo.insertAdjacentHTML('beforeend', `
    <div class="cart__product-about">
      <p class="cart__text">${obj.extra.propOne[0] + ': ' + obj.extra.propOne[1]}</p>
      <p class="cart__text">${obj.extra.propTwo[0] + ': ' + obj.extra.propTwo[1]}</p>
    </div>
  `);
  cartGoodsItem.append(cartProductInfo);
  const counter = document.createElement('div');
  counter.classList.add('cart__goods-counter', 'counter');
  const counterValue = document.createElement('p');
  counterValue.classList.add('counter__value');
  counterValue.ariaLabel = 'Текущее количество товара';
  counterValue.textContent = obj.count;
  const minusButton = document.createElement('button');
  minusButton.classList.add('counter__btn', 'counter__btn_type_minus');
  minusButton.type = 'button';
  minusButton.ariaLabel = `Убавить количество товара на 1. Текуще количество ${obj.count}.`;
  minusButton.textContent = '-';
  minusButton.disabled = obj.count + '' === '1';
  if (obj.count + '' === '1') {
    minusButton.classList.add('counter__btn_type_disabled');
  }
  const plusButton = document.createElement('button');
  plusButton.classList.add('counter__btn', 'counter__btn_type_plus');
  plusButton.type = 'button';
  plusButton.ariaLabel = `Увеличить количество товара на 1. Текуще количество ${obj.count}.`;
  plusButton.textContent = '+';
  plusButton.disabled = obj.count === obj.maxCount;
  if (obj.count === obj.maxCount) {
    plusButton.classList.add('counter__btn_type_disabled');
  }
  minusButton.addEventListener('click', ({
    target
  }) => {
    handleCounterChange(target, plusButton, obj, 'decrease', counterValue, cartGoodsItem, topBlockCost, goodsCount, goodsCost, discountValue);
  });
  plusButton.addEventListener('click', ({
    target
  }) => {
    handleCounterChange(target, minusButton, obj, 'increase', counterValue, cartGoodsItem, topBlockCost, goodsCount, goodsCost, discountValue);
  });
  counter.append(minusButton, counterValue, plusButton);
  cartGoodsItem.append(counter);
  cartGoodsItem.insertAdjacentHTML('beforeend', `
    <div class="cart__goods-right">
      <p class="cart__goods-price">${beautifyNumber(Math.round(Number(obj.price)))} ₽</p>
      ${obj.oldPrice ? `<p class="cart__goods-discount">${beautifyNumber(Math.round(Number(obj.oldPrice)))} ₽</p>` : ''}
      <p class="cart__goods-credit">В кредит от 5600 ₽</p>
    </div>
  `);
  const deleteProductButton = document.createElement('button');
  deleteProductButton.classList.add('cart__goods-delete', 'cart__delete-btn');
  deleteProductButton.type = 'button';
  deleteProductButton.ariaLabel = 'Удалить товар';
  deleteProductButton.insertAdjacentHTML('beforeend', `
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_217_1895)">
       <path d="M19.0214 5.35355L19.1679 5.5H19.375H23.25V7H6.75V5.5H10.625H10.8321L10.9786 5.35355L12.0821 4.25H17.9179L19.0214 5.35355ZM10 25.75C8.90114 25.75 8 24.8489 8 23.75V9.25H22V23.75C22 24.8489 21.0989 25.75 20 25.75H10Z" fill="currentColor" stroke="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_217_1895">
          <rect width="30" height="30" fill="currentColor"/>
        </clipPath>
      </defs>
    </svg>
  `);
  cartGoodsItem.append(deleteProductButton);
  return cartGoodsItem;
};
const renderCartItemsList = (arr, topBlockCost, goodsCount, goodsCost, discountValue) => {
  const {
    selectAllCheckbox,
    deleteSelectedButton
  } = renderCartListTop(arr, topBlockCost, goodsCount, goodsCost, discountValue);
  const cartGoods = arr.map(product => {
    return renderCartItem(selectAllCheckbox, deleteSelectedButton, product, topBlockCost, goodsCount, goodsCost, discountValue);
  });
  cartGoodsList.append(...cartGoods);
};
const renderCartItemSkeleton = () => {
  const itemSkeleton = document.createElement('li');
  itemSkeleton.classList.add('cart__skeleton', 'cart__skeleton_item-skeleton');
  const itemSkeletonBody = document.createElement('div');
  itemSkeletonBody.classList.add('cart__skeleton', 'cart__skeleton_item-skeleton-body');
  const skeletonCheckbox = document.createElement('div');
  skeletonCheckbox.classList.add('cart__skeleton', 'cart__skeleton_item-skeleton-checkbox', 'skeleton');
  const skeletonImage = document.createElement('div');
  skeletonImage.classList.add('cart__skeleton', 'cart__skeleton_item-skeleton-image', 'skeleton');
  const skeletonInfo = document.createElement('div');
  skeletonInfo.classList.add('cart__skeleton', 'cart__skeleton_item-skeleton-info');
  const skeletonDescriprionTop = document.createElement('div');
  skeletonDescriprionTop.classList.add('cart__skeleton', 'cart__skeleton_item-skeleton-description', 'skeleton');
  const skeletonDescriprionBottom = document.createElement('div');
  skeletonDescriprionBottom.classList.add('cart__skeleton', 'cart__skeleton_item-skeleton-description', 'skeleton');
  const skeletonPrice = document.createElement('div');
  skeletonPrice.classList.add('cart__skeleton', 'cart__skeleton_item-skeleton-price', 'skeleton');
  skeletonInfo.append(skeletonDescriprionTop, skeletonDescriprionBottom);
  itemSkeletonBody.append(skeletonCheckbox, skeletonImage, skeletonInfo, skeletonPrice);
  itemSkeleton.append(itemSkeletonBody);
  return itemSkeleton;
};
const renderCartItemsListSkeleton = () => {
  const skeletonsList = [];
  for (let i = 0; i < 3; i++) {
    skeletonsList.push(renderCartItemSkeleton());
  }
  cartGoodsList.append(...skeletonsList);
};
// ====================================================================================================

// Delivery list render
const renderCartDeliveryTop = () => {
  cartDelivery.firstElementChild.insertAdjacentHTML('beforeend', `
    <button class="cart__change-delivery cart__text cart__text_weight_bold cart__text_color_blue" type="button">Изменить</button>  
  `);
};
const renderCartDeliveryText = () => {
  cartDeliveryInfo.insertAdjacentHTML('afterbegin', `
    <p class="cart__delivery-point">Пункт выдачи</p>
    <p class="cart__delivery-address cart__text cart__text_color_black">г. Москва (Московская область), улица Павлика Морозова, д. 48, (Пункт выдачи), Ежедневно 10:00-21:00</p>
    <p class="cart__delivery-price">Стоимость доставки</p>
    <p class="cart__delivery-cost cart__text cart__text_color_black">Бесплатно</p>             
    <p class="cart__delivery-date cart__text cart__text_color_black cart__text_weight_bold">10-13 февраля</p>
  `);
};
const renderCartDeliveryItem = obj => {
  const cartDeliveryProduct = document.createElement('li');
  cartDeliveryProduct.classList.add('cart__delivery-product');
  cartDeliveryProduct.setAttribute('data-productid', obj.id);
  const deliveryLink = document.createElement('a');
  deliveryLink.classList.add('cart__delivery-link', 'cart__img-container');
  deliveryLink.href = 'product.html';
  deliveryLink.insertAdjacentHTML('beforeend', `
    <picture>
      <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/avif">
      <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/webp">
      <img class="cart__delivery-picture" src="${SHORT_API_ADDRESS}${obj.image}" alt="Изображение товара" width="80" height="80">
    </picture>                
  `);
  deliveryLink.addEventListener('click', () => handleClickCartItem(obj.id));
  cartDeliveryProduct.append(deliveryLink);
  return cartDeliveryProduct;
};
const renderCartDeliveryGalery = arr => {
  const cartDeliveryList = document.createElement('ul');
  cartDeliveryList.classList.add('cart__delivery-list');
  const deliveryItems = arr.map(itemObj => renderCartDeliveryItem(itemObj));
  cartDeliveryList.append(...deliveryItems);
  cartDeliveryInfo.append(cartDeliveryList);
};
const renderCartDelivery = arr => {
  renderCartDeliveryTop();
  renderCartDeliveryText();
  renderCartDeliveryGalery(arr);
};
const renderCartDeliverySkeleton = () => {
  const skeletonInfoTopLeft = document.createElement('div');
  skeletonInfoTopLeft.classList.add('cart__skeleton', 'cart__skeleton_delivery-subtitle', 'cart__skeleton_delivery-subtitle_top', 'skeleton');
  const skeletonInfoBottomLeft = document.createElement('div');
  skeletonInfoBottomLeft.classList.add('cart__skeleton', 'cart__skeleton_delivery-subtitle', 'cart__skeleton_delivery-subtitle_bottom', 'skeleton');
  const skeletonInfoTopRight = document.createElement('div');
  skeletonInfoTopRight.classList.add('cart__skeleton', 'cart__skeleton_delivery-description', 'skeleton');
  const skeletonGallery = document.createElement('div');
  skeletonGallery.classList.add('cart__skeleton', 'cart__skeleton_delivery-gallery');
  const skeletonPictureOne = document.createElement('div');
  skeletonPictureOne.classList.add('cart__skeleton', 'cart__skeleton_delivery-picture', 'skeleton');
  const skeletonPicturetwo = document.createElement('div');
  skeletonPicturetwo.classList.add('cart__skeleton', 'cart__skeleton_delivery-picture', 'skeleton');
  skeletonGallery.append(skeletonPictureOne, skeletonPicturetwo);
  cartDeliveryInfo.prepend(skeletonInfoTopLeft, skeletonInfoBottomLeft, skeletonInfoTopRight, skeletonGallery);
};
// ====================================================================================================

// Total card render
const renderCartTotal = obj => {
  removeEmptyCartTotal();
  const checkedProducts = obj.cart.filter(i => i.isCheckedForOrder);
  if (!checkedProducts.length) renderEmptyCartTotal();
  const {
    currentPrice,
    count,
    oldPrice,
    discount
  } = calculateCartNumbers(checkedProducts);
  const topBlock = document.createElement('div');
  topBlock.classList.add('cart__total-top');
  const topBlockHeader = document.createElement('p');
  topBlockHeader.classList.add('cart__total-header');
  topBlockHeader.innerText = 'Итого:';
  const topBlockCost = document.createElement('p');
  topBlockCost.classList.add('cart__total-cost');
  topBlockCost.textContent = beautifyNumber(currentPrice) + ' ₽';
  topBlock.append(topBlockHeader, topBlockCost);
  const infoBlock = document.createElement('div');
  infoBlock.classList.add('cart__total-info');
  const goodsBlock = document.createElement('div');
  goodsBlock.classList.add('cart__flex', 'cart__flex_type_goods');
  const goodsCount = document.createElement('p');
  goodsCount.classList.add('cart__text', 'cart__text_content_goods-count');
  goodsCount.textContent = `Товары, ${count}  шт.`;
  const goodsCost = document.createElement('p');
  goodsCost.classList.add('cart__text', 'cart__text_content_goods-cost');
  goodsCost.textContent = `${beautifyNumber(oldPrice)} ₽`;
  goodsBlock.append(goodsCount, goodsCost);
  const discountBlock = document.createElement('div');
  discountBlock.classList.add('cart__flex', 'cart__flex_type_discount');
  const discountTitle = document.createElement('p');
  discountTitle.classList.add('cart__text');
  discountTitle.textContent = 'Скидка';
  const discountValue = document.createElement('p');
  discountValue.classList.add('cart__text', 'cart__text_content_discount-value');
  discountValue.textContent = `${beautifyNumber(discount)} ₽`;
  discountBlock.append(discountTitle, discountValue);
  infoBlock.append(goodsBlock, discountBlock);
  infoBlock.insertAdjacentHTML('beforeend', `
    <div class="cart__flex cart__total-delivery">
      <p class="cart__text">Доставка</p>
      <p class="cart__text">Бесплатно</p>
    </div>
  `);
  cardTotalContainer.append(topBlock, infoBlock);
  cardTotalContainer.insertAdjacentHTML('beforeend', `
    <div class="cart__total-point">
      <div class="cart__flex cart__flex_type_late-flex">
        <p class="cart__text cart__text_weight_bold cart__text_color_black">Доставка:</p>
        <p class="cart__delivery-type cart__text cart__text_weight_bold cart__text_color_blue">Пункт выдачи</p>
      </div>
      <p class="cart__text">Ежедневно 10:00 - 21:00</p>
      <p class="cart__text">г. Москва (Московская область), улица Павлика Морозова, д. 48</p>
    </div>
    <div class="cart__flex cart__flex_type_late-flex">
      <p class="cart__text cart__text_weight_bold cart__text_color_black">Дата:</p>
      <p class="cart__total-date cart__text cart__text_weight_bold cart__text_color_blue">10-13 февраля</p>
    </div>
    <div class="cart__flex cart__flex_type_late-flex">
      <p class="cart__text cart__text_weight_bold cart__text_color_black">Оплата:</p>
      <p class="cart__total-payment cart__text cart__text_weight_bold cart__text_color_blue">Картой</p>
    </div>
  `);
  const orderButton = document.createElement('button');
  orderButton.classList.add('cart__order-btn', 'button');
  orderButton.type = 'button';
  orderButton.innerText = 'Заказать';
  cardTotalContainer.append(orderButton);
  const termsLabel = document.createElement('label');
  termsLabel.classList.add('cart__total-terms', 'cart__flex');
  const termsCheckbox = document.createElement('input');
  termsCheckbox.classList.add('checkbox');
  termsCheckbox.type = 'checkbox';
  termsCheckbox.checked = true;
  termsCheckbox.addEventListener('change', e => checkTermsAcception(e.target, orderButton));
  termsLabel.append(termsCheckbox);
  termsLabel.insertAdjacentHTML('beforeend', `
    <span class="cart__text"><a href="#" class="cart__text cart__text_color_black cart__text_type_link">Согласен с условиями</a> правил пользования торговой площадкой и правилами возврата</span>
  `);
  cardTotalContainer.append(termsLabel);
  return {
    topBlockCost,
    goodsCount,
    goodsCost,
    discountValue
  };
};
const renderCartTotalSkeleton = () => {
  const skeletonGroup = document.createElement('div');
  skeletonGroup.classList.add('cart__skeleton', 'cart__skeleton_total');
  const titleSkeleton = document.createElement('div');
  titleSkeleton.classList.add('cart__skeleton', 'cart__skeleton_total-title', 'skeleton');
  const topInfoSkeleton = document.createElement('div');
  topInfoSkeleton.classList.add('cart__skeleton', 'cart__skeleton_total-info-top', 'skeleton');
  const bottomInfoSkeleton = document.createElement('div');
  bottomInfoSkeleton.classList.add('cart__skeleton', 'cart__skeleton_total-info-bottom', 'skeleton');
  const buttonSkeleton = document.createElement('div');
  buttonSkeleton.classList.add('cart__skeleton', 'cart__skeleton_total-button', 'skeleton');
  skeletonGroup.append(titleSkeleton, topInfoSkeleton, bottomInfoSkeleton, buttonSkeleton);
  cardTotal.append(skeletonGroup);
};
// ====================================================================================================

// Skeletons
const cartPage_renderSkeletons = () => {
  renderCartItemsListSkeleton();
  renderCartDeliverySkeleton();
  renderCartTotalSkeleton();
};
const cartPage_removeSkeletons = () => {
  cartGoodsList.innerHTML = '';
  cartDeliveryInfo.innerHTML = '';
  const cartTotalSkeleton = document.querySelector('.cart__skeleton_total');
  cartTotalSkeleton.remove();
};
// ====================================================================================================

// Render page
const renderCartPage = () => {
  cartPage_renderSkeletons();
  request(API_ADDRESS + 'user', {
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        alert('Произошла ошибка');
        return;
      }
      cartPage_removeSkeletons();
      if (!data.cart.length) {
        renderEmptyCart();
        return;
      }
      const {
        topBlockCost,
        goodsCount,
        goodsCost,
        discountValue
      } = renderCartTotal(data);
      renderCartItemsList(data.cart, topBlockCost, goodsCount, goodsCost, discountValue);
      renderCartDelivery(data.cart);
      setCartGoodsNumber(data.cart);
    }
  });
};
/* harmony default export */ var cartPage = (renderCartPage);
;// CONCATENATED MODULE: ./src/assets/script/script.js





const SHORT_API_ADDRESS = 'https://comet-sphenoid-diamond.glitch.me/';
const API_ADDRESS = `${SHORT_API_ADDRESS}api/`;
const pageUrl = window.location.pathname;
const currentPage = pageUrl.match(/index|catalog|product|cart/)[0];
setHeaderAndFooterMenus();
switch (currentPage) {
  case 'index':
    window.addEventListener('DOMContentLoaded', () => modules_timer('+03'));
    break;
  case 'catalog':
    catalogPage();
    break;
  case 'product':
    productPage();
    break;
  case 'cart':
    cartPage();
    break;
}
/******/ })()
;