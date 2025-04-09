import shopSessionData from './shopSessionData.js';
import fetchRequest from './request.js';
import { API_ADDRESS, SHORT_API_ADDRESS } from '../script.js';

// DOM nodes
const cartGoodsNumber = document.querySelector('.cart__goods-number');
const cartGoodsActions = document.querySelector('.cart__goods-actions');
const cartGoodsList = document.querySelector('.cart__goods-list');
const cartDelivery = document.querySelector('.cart__card_type_delivery');
const cartDeliveryInfo = document.querySelector('.cart__delivery-info');
const cardTotal = document.querySelector('.cart__card_type_total');
const cardTotalContainer = document.querySelector('.cart__total-container');

// Common logic
const beautifyNumber = (num) => new Intl.NumberFormat('fr-FR').format(num);

const textToNumber = (str) => str.split('').filter(x => Number.isInteger(+x)).join('').replace(/\s/g, '');

const handleClickCartItem = (productId) => shopSessionData.set('product' , productId);

const setHeaderCartCounter = (obj) => {
  const headerCartCounter = document.querySelector('.header__cart-counter');
  const cartGoodsTotal = obj.cart.reduce((acc, item) => acc + Number(item.count), 0);
  headerCartCounter.textContent = `${cartGoodsTotal}`;
};

const setCartGoodsNumber = (cartArr) => cartGoodsNumber.textContent = cartArr.reduce((acc, prod) => acc + Number(prod.count), 0) + '';
// ====================================================================================================


// Await element state
const renderAwaitState = (element) => {
  const awaitBlock = document.createElement('div');
  awaitBlock.classList.add('await');
  awaitBlock.insertAdjacentHTML('beforeend', `
    <span class="await-loader"></span>
  `);
  
  element.classList.add('await-container');
  element.append(awaitBlock);

  return awaitBlock;
};

const removeAwaitState = (element) => {
  element.parentElement.classList.remove('await');
  element.remove();
}
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
const calculateCartNumbers = (arr) => {
  const currentPrice = arr.reduce((acc, i) => ((Number(i.price) * Number(i.count)) + acc), 0);

  const count = arr.reduce((acc, i) => Number(i.count) + acc, 0);

  const oldPrice = arr.reduce((acc, i) => {
    const old = i.oldPrice ? (Number(i.oldPrice) * Number(i.count)) : (Number(i.price) * Number(i.count));
    return old + acc;
  }, 0);

  const discount = arr.reduce((acc, i) => {
    const dis = i.oldPrice ? ((Number(i.oldPrice) - Number(i.price)) * Number(i.count)) : 0;
    return dis + acc;
  }, 0);

  return {
    currentPrice,
    count,
    oldPrice,
    discount,
  };
};

const createTotalNumbersText = (obj) => ({
  currentPrice: beautifyNumber(obj.currentPrice) + ' ₽',
  count: `Товары, ${obj.count}  шт.`,
  oldPrice: `${beautifyNumber(obj.oldPrice)} ₽`,
  discount: `${beautifyNumber(obj.discount)} ₽`,
});

const renderCartTotalNumbers = (obj, topBlockCost, goodsCount, goodsCost, discountValue) => {  
  topBlockCost.textContent = obj.currentPrice;
  goodsCount.textContent = obj.count;
  goodsCost.textContent = obj.oldPrice;
  discountValue.textContent = obj.discount;
}
// ====================================================================================================


// Terms checkbox logic
const checkTermsAcception = (checkbox, button) => {
  button.disabled = !checkbox.checked;
  if (!checkbox.checked) {
    button.classList.add('button__disabled');
  } else if(checkbox.checked && button.classList.contains('button__disabled')) {
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
  if (arr.every((i) => i[`${prop}`] === false)) {
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

  const checkedProductNodes = checkedLabelNodes.map((chbx) => chbx.closest('.cart__goods-item'));

  const calculateNumbers = (node) => {
    const priceNode = Array.from(node.lastElementChild.previousElementSibling.children);
    const counterNode = Array.from(node.lastElementChild.previousElementSibling.previousElementSibling.children);
    const count = Number(counterNode[1].textContent);

    let currentPrice = 0;
    let oldPrice = 0;

    priceNode.forEach(i => {
      if(i.classList.contains('cart__goods-price')) {
        currentPrice += Number(textToNumber(i.textContent)) * count;
      } else if(i.classList.contains('cart__goods-discount')) {
        oldPrice += Number(textToNumber(i.textContent)) * count;
      }
    });

    const discount = oldPrice ? (oldPrice - currentPrice) : 0;
    if (!oldPrice) oldPrice += currentPrice;
    
    return {
      currentPrice,
      count,
      oldPrice,
      discount,
    };
  };

  const newValues = checkedProductNodes
    .map(i => calculateNumbers(i))
    .reduce((acc, i) => {
      acc.currentPrice += i.currentPrice;
      acc.count += i.count;
      acc.oldPrice += i.oldPrice;
      if (i.discount) acc.discount += i.discount;
      return acc;
    },
      {
        currentPrice: 0,
        count: 0,
        oldPrice: 0,
        discount: 0,
      }
    );

  const newValuesText = createTotalNumbersText(newValues);
  renderCartTotalNumbers(newValuesText, topBlockCost, goodsCount, goodsCost, discountValue);
};

const changeAllCheckboxes = (arr, boolean) => arr.forEach((checkbox) => checkbox.checked = boolean);

const selectAllCheckboxAction = (isChecked, checkboxesArr) => {
  if (isChecked) {
    changeAllCheckboxes(checkboxesArr, true);
  } else {
    changeAllCheckboxes(checkboxesArr, false);
  }
};

const isAllSelected = (arr, prop) => arr.every((i) => i[`${prop}`] === true);

const setSelectAllCheckbox = (selectAllCheckbox, arr) => {
  selectAllCheckbox.checked = isAllSelected(arr, 'checked')
};

const requestOnCheckboxChange = (
  reqArr,
  requestType,
  checkboxType,
  elementsArr,
  selectAllCheckbox,
  deleteSelectedButton,
  topBlockCost,
  goodsCount,
  goodsCost,
  discountValue,
) => {
  if (requestType !== 'checkbox') return;
  if (checkboxType !== 'regular' && checkboxType !== 'all') return;

  const elementsAwaitArr = elementsArr.map((el) => renderAwaitState(el));
  const currentCardTotal = renderAwaitState(cardTotal);

  fetchRequest(API_ADDRESS + 'user/cart', {
    method: 'PATCH',
    body: { id: reqArr, type: requestType },
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        alert('Произошла ошибка');
        elementsAwaitArr.forEach((el) => removeAwaitState(el));
        removeAwaitState(currentCardTotal);
        return;
      }
      elementsAwaitArr.forEach((el) => removeAwaitState(el));
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
  })
}

const handleSelectAll = (target, deleteSelectedButton, topBlockCost, goodsCount, goodsCost, discountValue) => {
  const allProductCheckboxesArr = getAllProductCheckboxesArr();
  const allProductsNodesArr = allProductCheckboxesArr.map((cbx) => cbx.closest('.cart__goods-item'));
  const allProductsIdentifiers = allProductsNodesArr.map((node) => node.dataset.productid);

  const reqBody = allProductsIdentifiers.reduce((acc, id) => {
    acc.push({id, value: target.checked});
    return acc;
  }, [])

  requestOnCheckboxChange(
    reqBody,
    'checkbox',
    'all',
    allProductsNodesArr,
    target,
    deleteSelectedButton,
    topBlockCost,
    goodsCount,
    goodsCost,
    discountValue,
  );
};
// ====================================================================================================


// Deletion logic
const deleteProductsRequest = (
  deleteSelectedButton,
  selectAllCheckbox,
  goodsNodesArr,
  deliveryNodesArr,
  IdArr,
  topBlockCost,
  goodsCount,
  goodsCost,
  discountValue,
) => {
  fetchRequest(API_ADDRESS + 'user/cart', {
    method: 'DELETE',
    body: { identifiers: IdArr },
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        alert('Произошла ошибка');
        goodsNodesArr.forEach((node) => node.classList.remove('cart__goods-item_status_await'));
        deliveryNodesArr.forEach((node) => node.classList.remove('cart__delivery-product_status_await'));
        return;
      }

      goodsNodesArr.forEach((node) => node.remove());
      deliveryNodesArr.forEach((node) => node.remove());
      setHeaderCartCounter(data);
      setCartGoodsNumber(data.cart);

      const allProductCheckboxesArr = getAllProductCheckboxesArr();
      setDelButtonDisable(allProductCheckboxesArr, deleteSelectedButton, checked);
      setSelectAllCheckbox(selectAllCheckbox, allProductCheckboxesArr);
      setNewPricesOnCheckboxChange(allProductCheckboxesArr, topBlockCost, goodsCount, goodsCost, discountValue);
    }
  })
}

const deleteSelectedProducts = (
  deleteSelectedButton,
  selectAllCheckbox,
  topBlockCost,
  goodsCount,
  goodsCost,
  discountValue,
) => {
  const allProductCheckboxesArr = getAllProductCheckboxesArr();
  const selelctedProductsNodes = allProductCheckboxesArr.filter((cbx) => cbx.checked).map((cbx) => cbx.closest('.cart__goods-item'));
  const selelctedProductsNodesArr = Array.from(selelctedProductsNodes);
  const selelctedProductsIdentifiers = selelctedProductsNodesArr.map((node) => node.dataset.productid);
  const selectedProductsDeliveryCardsArr = Array.from(document.querySelectorAll('.cart__delivery-product')).filter((li) => selelctedProductsIdentifiers.includes(li.dataset.productid));

  selelctedProductsNodesArr.forEach((node) => node.classList.add('cart__goods-item_status_await'));
  selectedProductsDeliveryCardsArr.forEach((node) => node.classList.add('cart__delivery-product_status_await'));
  deleteProductsRequest(
    deleteSelectedButton,
    selectAllCheckbox,
    selelctedProductsNodesArr,
    selectedProductsDeliveryCardsArr,
    selelctedProductsIdentifiers,
    topBlockCost,
    goodsCount,
    goodsCost,
    discountValue,
  );
};

const handleDeleteSelectedProducts = (
  deleteSelectedButton,
  selectAllCheckbox,
  topBlockCost,
  goodsCount,
  goodsCost,
  discountValue,
) => {
  if (confirm('Удалить выбранные товары?')) return deleteSelectedProducts(
    deleteSelectedButton,
    selectAllCheckbox,
    topBlockCost,
    goodsCount,
    goodsCost,
    discountValue,
  );
  return;
}
// ====================================================================================================


// Counter logic
const handleCounterChange = (
  target,
  otherBtn,
  obj,
  type,
  counterValue,
  currentElement,
  topBlockCost,
  goodsCount,
  goodsCost,
  discountValue,
) => {
  if (type !== 'increase' && type !== 'decrease') return;

  const currentElementAwait = renderAwaitState(currentElement);
  const currentCardTotal = renderAwaitState(cardTotal);

  fetchRequest(API_ADDRESS + 'user/cart', {
    method: 'PATCH',
    body: { id: obj.id, type},
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

      const newProductData = data.cart.find((product) => product.id === obj.id);
      counterValue.textContent = newProductData.count;

      setHeaderCartCounter(data);
      setCartGoodsNumber(data.cart);
      const allProductCheckboxesArr = getAllProductCheckboxesArr();
      setNewPricesOnCheckboxChange(allProductCheckboxesArr, topBlockCost, goodsCount, goodsCost, discountValue);

      if (((newProductData.count + '') === '1' && type === 'decrease')
      || (newProductData.count === newProductData.maxCount && type === 'increase')) {
        target.disabled = true;
        target.classList.add('counter__btn_type_disabled');

        otherBtn.disabled = false;
        if (otherBtn.classList.contains('counter__btn_type_disabled')) {
          otherBtn.classList.remove('counter__btn_type_disabled')
        }

        return;
      }

      target.disabled = false;
      if (target.classList.contains('counter__btn_type_disabled')) {
        target.classList.remove('counter__btn_type_disabled')
      }

      otherBtn.disabled = false;
      if (otherBtn.classList.contains('counter__btn_type_disabled')) {
        otherBtn.classList.remove('counter__btn_type_disabled')
      }
    }
  })
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
  deleteSelectedButton.addEventListener('click', ({target}) => handleDeleteSelectedProducts(
    target,
    selectAllCheckbox,
    topBlockCost,
    goodsCount,
    goodsCost,
    discountValue,
  ));
  setDelButtonDisable (data, deleteSelectedButton, 'isCheckedForOrder');

  selectAllCheckbox.addEventListener('change', ({ target }) => handleSelectAll(
    target,
    deleteSelectedButton,
    topBlockCost,
    goodsCount,
    goodsCost,
    discountValue,
  ));

  cartGoodsActions.append(selectAllLabel, deleteSelectedButton);

  return { selectAllCheckbox, deleteSelectedButton};
};

const renderCartItem = (
  selectAllCheckbox,
  deleteSelectedButton,
  obj,
  topBlockCost,
  goodsCount,
  goodsCost,
  discountValue,
) => {

  if (!topBlockCost) topBlockCost = document.querySelector('.cart__total-cost');
  if (!goodsCount) goodsCount  = document.querySelector('.cart__text_content_goods-count');
  if (!goodsCost) goodsCost  = document.querySelector('.cart__text_content_goods-cost');
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
  productCheckbox.setAttribute('aria-label', `Выбрать товар ${obj.title} для покупки.`)
  productCheckbox.addEventListener('change', ({target}) => {
    const arr = [{ id: obj.id, value: target.checked}];
    const elementsArr = [cartGoodsItem];
    return requestOnCheckboxChange(
    arr,
    'checkbox',
    'regular',
    elementsArr,
    selectAllCheckbox,
    deleteSelectedButton,
    topBlockCost,
    goodsCount,
    goodsCost,
    discountValue,
  )});

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
  minusButton.disabled = (obj.count + '') === '1';
  if ((obj.count + '') === '1') {
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

  minusButton.addEventListener('click', ({target}) => {handleCounterChange(
    target,
    plusButton,
    obj,
    'decrease',
    counterValue,
    cartGoodsItem,
    topBlockCost,
    goodsCount,
    goodsCost,
    discountValue,
  )});

  plusButton.addEventListener('click', ({target}) => {handleCounterChange(
    target,
    minusButton,
    obj,
    'increase',
    counterValue,
    cartGoodsItem,
    topBlockCost,
    goodsCount,
    goodsCost,
    discountValue,
  )});

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

const renderCartItemsList = (
  arr,
  topBlockCost,
  goodsCount,
  goodsCost,
  discountValue,
) => {
  const {
    selectAllCheckbox,
    deleteSelectedButton,
  } = renderCartListTop(arr, topBlockCost, goodsCount, goodsCost, discountValue);

  const cartGoods = arr.map((product) => {
    return renderCartItem(
      selectAllCheckbox,
      deleteSelectedButton,
      product,
      topBlockCost,
      goodsCount,
      goodsCost,
      discountValue,
    );
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
  itemSkeletonBody.append(
    skeletonCheckbox,
    skeletonImage,
    skeletonInfo,
    skeletonPrice,
  );
  itemSkeleton.append(itemSkeletonBody);

  return itemSkeleton;
};

const renderCartItemsListSkeleton = () => {
  const skeletonsList = [];

  for (let i = 0; i < 3; i++) {
    skeletonsList.push(renderCartItemSkeleton())
  }

  cartGoodsList.append(...skeletonsList);
};
// ====================================================================================================


// Delivery list render
const renderCartDeliveryTop = () => {
  cartDelivery.firstElementChild.insertAdjacentHTML('beforeend', `
    <button class="cart__change-delivery cart__text cart__text_weight_bold cart__text_color_blue" type="button">Изменить</button>  
  `);
}

const renderCartDeliveryText = () => {
  cartDeliveryInfo.insertAdjacentHTML('afterbegin', `
    <p class="cart__delivery-point">Пункт выдачи</p>
    <p class="cart__delivery-address cart__text cart__text_color_black">г. Москва (Московская область), улица Павлика Морозова, д. 48, (Пункт выдачи), Ежедневно 10:00-21:00</p>
    <p class="cart__delivery-price">Стоимость доставки</p>
    <p class="cart__delivery-cost cart__text cart__text_color_black">Бесплатно</p>             
    <p class="cart__delivery-date cart__text cart__text_color_black cart__text_weight_bold">10-13 февраля</p>
  `);
};

const renderCartDeliveryItem = (obj) => {
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

const renderCartDeliveryGalery = (arr) => {
  const cartDeliveryList = document.createElement('ul');
  cartDeliveryList.classList.add('cart__delivery-list');

  const deliveryItems = arr.map((itemObj) => renderCartDeliveryItem(itemObj));
  cartDeliveryList.append(...deliveryItems);
  cartDeliveryInfo.append(cartDeliveryList);
};

const renderCartDelivery = (arr) => {
  renderCartDeliveryTop();
  renderCartDeliveryText();
  renderCartDeliveryGalery(arr);
};

const renderCartDeliverySkeleton = () => {
  const skeletonInfoTopLeft = document.createElement('div');
  skeletonInfoTopLeft.classList.add(
    'cart__skeleton',
    'cart__skeleton_delivery-subtitle',
    'cart__skeleton_delivery-subtitle_top',
    'skeleton'
  );
  
  const skeletonInfoBottomLeft = document.createElement('div');
  skeletonInfoBottomLeft.classList.add(
    'cart__skeleton',
    'cart__skeleton_delivery-subtitle',
    'cart__skeleton_delivery-subtitle_bottom',
    'skeleton'
  );

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
const renderCartTotal = (obj) => {
  removeEmptyCartTotal();

  const checkedProducts = obj.cart.filter((i) => i.isCheckedForOrder)

  if (!checkedProducts.length) renderEmptyCartTotal();

  const {
    currentPrice,
    count,
    oldPrice,
    discount,
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
    discountValue,
  }
};

const renderCartTotalSkeleton = () => {
  const skeletonGroup = document.createElement('div');
  skeletonGroup.classList.add('cart__skeleton', 'cart__skeleton_total');

  const titleSkeleton = document.createElement('div');
  titleSkeleton.classList.add(
    'cart__skeleton',
    'cart__skeleton_total-title',
    'skeleton'
  );

  const topInfoSkeleton = document.createElement('div');
  topInfoSkeleton.classList.add(
    'cart__skeleton',
    'cart__skeleton_total-info-top',
    'skeleton'
  );

  const bottomInfoSkeleton = document.createElement('div');
  bottomInfoSkeleton.classList.add(
    'cart__skeleton',
    'cart__skeleton_total-info-bottom',
    'skeleton'
  );

  const buttonSkeleton = document.createElement('div');
  buttonSkeleton.classList.add(
    'cart__skeleton',
    'cart__skeleton_total-button',
    'skeleton'
  );

  skeletonGroup.append(
    titleSkeleton,
    topInfoSkeleton,
    bottomInfoSkeleton,
    buttonSkeleton,
  );
  cardTotal.append(skeletonGroup);
};
// ====================================================================================================


// Skeletons
const renderSkeletons = () => {
  renderCartItemsListSkeleton();
  renderCartDeliverySkeleton();
  renderCartTotalSkeleton();
};

const removeSkeletons = () => {
  cartGoodsList.innerHTML = '';
  cartDeliveryInfo.innerHTML = '';
  const cartTotalSkeleton = document.querySelector('.cart__skeleton_total');
  cartTotalSkeleton.remove();
}
// ====================================================================================================


// Render page
const renderCartPage = () => {
  renderSkeletons();

  fetchRequest(API_ADDRESS + 'user', {
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        alert('Произошла ошибка');
        return;
      }
      
      removeSkeletons();

      if (!data.cart.length) {
        renderEmptyCart();
        return;
      }

      const {
        topBlockCost,
        goodsCount,
        goodsCost,
        discountValue,
      } = renderCartTotal(data);

      renderCartItemsList(
        data.cart,
        topBlockCost,
        goodsCount,
        goodsCost,
        discountValue,
      );

      renderCartDelivery(data.cart);
      setCartGoodsNumber(data.cart);
    }
  });
}

export default renderCartPage;
