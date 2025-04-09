import shopSessionData from './shopSessionData.js';
import { setCartCounter } from './headerAndFooter.js';
import fetchRequest from './request.js';
import { API_ADDRESS, SHORT_API_ADDRESS } from '../script.js';


// DOM nodes
const productTitle = document.querySelector('.product__title');
const productContent = document.querySelector('.product__content');

const renderProduct = (obj) => {
  productTitle.textContent = obj.title;


  productContent.insertAdjacentHTML('beforeend', `
    <div class="product__image-container">
      <picture>
        <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/avif">
        <source srcset="${SHORT_API_ADDRESS}${obj.image}" type="image/webp">
        <img class="product__image" src="${SHORT_API_ADDRESS}${obj.image}" alt="Фотография ${obj.title}" 
         width="757" height="427">
      </picture>
      ${
        obj.discount
        ? `<p class="profitable__discount-marker discount-marker discount-marker_position_top-right" aria-label="Скидка">-${obj.discount}%</p>`
        : ''
      }
      
    </div>

    <div class="product__info material-card">

      <div class="product__price-block">
        ${
          obj.discount
          ? `<p class="product__price" aria-label="Новая цена">${Math.round(obj.price * (1 - obj.discount * 0.01))} ₽</p>
             <p class="product__price-old" aria-label="Старая цена">${obj.price} ₽</p>`
          : `<p class="product__price" aria-label="Цена">${obj.price} ₽</p>`
        }
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
  fetchRequest(API_ADDRESS + 'user', {
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
}

const setAddToCartBtnControl = (obj) => {
  const addToCartBtn = document.querySelector('.product__buy-btn');
  addToCartBtn.addEventListener('click', () => {
    addToCartBtn.classList.add('product__buy-btn_status_await');
    addToCartBtn.disabled = true;
    handleAddToCart(obj, addToCartBtn);
  });
}
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
}
// ====================================================================================================


// Render page

const renderProductPage = () => {
  renderSkeletons();

  const productID = shopSessionData.get('product');

  fetchRequest(API_ADDRESS + 'goods/' + productID, {
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
}

export default renderProductPage;
