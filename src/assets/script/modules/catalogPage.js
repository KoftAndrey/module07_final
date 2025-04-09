import shopSessionData from './shopSessionData.js';
import fetchRequest from './request.js';
import { API_ADDRESS, SHORT_API_ADDRESS } from '../script.js';

const cardsListNode = document.querySelector('.products-block__list');

const setCategoryHeader = (category) => {
  const headerNode = document.querySelector('.products-block__header_page_catalog');
  if (headerNode) headerNode.textContent = category;
};

const onProductCardClick = (productId) => shopSessionData.set('product' , productId); 

const renderCardSkeleton = () => {
  const skeletonBody = document.createElement('li');
  skeletonBody.classList.add('products-block__skeleton', 'skeleton');

  return skeletonBody;
}

const renderProductCard = (obj) => {
  const card = document.createElement('li');
  card.classList.add('products-block__item');

  const wrapperLink = document.createElement('a');
  wrapperLink.classList.add('products-block__link', 'product-card');
  wrapperLink.href = 'product.html';

  const ariaLabelText = obj.discount
    ? `Карточка товара: ${obj.title}. Старая цена ${obj.price} рублей. Новая цена ${Math.round(obj.price * (1 - obj.discount * 0.01))} рублей. Скидка ${obj.discount}%`
    : `Карточка товара: ${obj.title}. Цена ${obj.price} рублей.`;

  wrapperLink.ariaLabel = ariaLabelText;

  wrapperLink.insertAdjacentHTML('afterbegin', `
    <div class="product-card__image-container">
      <picture>
        <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/avif">
        <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/webp">
        <img class="product-card__image" src="${SHORT_API_ADDRESS}${obj.image}" alt="Изображение товара" width="428" height="295">
      </picture>
      ${
        obj.discount
          ? `<p class="profitable__discount-marker discount-marker discount-marker_position_bottom-left">-${obj.discount}%</p>`
          : ''
        }
    </div>

    <div class="product-card__price-block">
      <p class="product-card__price">${Math.round(obj.price * (1 - obj.discount * 0.01))} ₽</p>
      ${
        obj.discount
        ? `<p class="product-card__price-old">${obj.price} ₽</p>`
        : ''
      }
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
}

const renderGoods = (goodsArr) => {
  cardsListNode.innerHTML = '';

  const cardsArr = goodsArr.map(product => renderProductCard(product));

  cardsListNode.append(...cardsArr);
};

const renderCatalogPage = () => {
  renderLoadingCards();

  const category = shopSessionData.get('category');
  setCategoryHeader(category);
  
  fetchRequest(API_ADDRESS + 'goods/category/Cмартфоны', {
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        return;
      }
      renderGoods(data);
    }
  });
}

export default renderCatalogPage;
