import fetchRequest from './request.js';
import { API_ADDRESS } from '../script.js';
import shopSessionData from './shopSessionData.js';

const menuBtn = document.querySelector('.header__menu-button');
const menuBtnIcon = document.querySelector('.header__button-icon');
const menuContent = document.querySelector('.header__menu-box');
const menuOverlay = document.querySelector('.header__menu-overlay');
const headerCartLink = document.querySelector('.header__navigation-link_type_cart');
const headerCartCounter = document.querySelector('.header__cart-counter');
const categoriesHeader = document.getElementById('categories-header');
const categoriesFooter = document.getElementById('categories-footer');

const goodsCategories = [
  'Смартфоны',
  'Ноутбуки',
  'Ювелирные изделия',
  'Одежда',
  'Бытовая техника',
  'Бытовая химия',
  'Книги и журналы',
  'Домашний текстиль',
  'Электроника',
  'Косметика',
];

const onClickMenuCatalogItem = (categoryName) => shopSessionData.set('category', categoryName);

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
}

const renderHeaderAndFooterCatalogItemsList = () => {
  const headerElements = goodsCategories.map((categoryName) => createMenuCatalogItem(categoryName, 'header'));
  const footerElements = goodsCategories.map((categoryName) => createMenuCatalogItem(categoryName, 'footer'));

  categoriesHeader.append(...headerElements);
  categoriesFooter.append(...footerElements);
};


// Cart counter func
const setCartCounter = () => {
  fetchRequest(API_ADDRESS + 'user', {
    callback: (err, data) => {
      if (err) {
        console.warn(err);
        return;
      }
      const cartGoodsTotal = data.cart.reduce((acc, item) => acc + Number(item.count), 0);
      headerCartLink.setAttribute('aria-label', `Ссылка на вашу корзину. Количество товаров: ${cartGoodsTotal}`)
      headerCartCounter.textContent = `${cartGoodsTotal}`;
    }
  })
}

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
  
      accordeonListsArr[index].style.height = 
        accordeonListsArr[index].classList.contains('navigation-block__list_active') ? '' :
        `${accordeonListsArr[index].scrollHeight}px`;
  
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

}

export {
  setHeaderAndFooterMenus,
  setCartCounter,
};
