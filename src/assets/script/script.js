import { setHeaderAndFooterMenus } from './modules/headerAndFooter.js';
import setTimer from './modules/timer.js';
import renderCatalogPage from './modules/catalogPage.js';
import renderProductPage from './modules/productPage.js';
import renderCartPage from './modules/cartPage.js';

export const SHORT_API_ADDRESS = 'https://comet-sphenoid-diamond.glitch.me/';
export const API_ADDRESS = `${SHORT_API_ADDRESS}api/`;

const pageUrl = window.location.pathname;
const currentPage = pageUrl.match(/index|catalog|product|cart/) ? pageUrl.match(/index|catalog|product|cart/)[0] : 'index';

setHeaderAndFooterMenus();

switch (currentPage) {
  case 'index':
    window.addEventListener('DOMContentLoaded', () => setTimer('+03'));
    break;
  case 'catalog':
    renderCatalogPage();
    break;
  case 'product':
    renderProductPage();
    break;
  case 'cart':
    renderCartPage();
    break;  
}
