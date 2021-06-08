import Paginator from './paginator.js';

const first = document.getElementById('first');
const last = document.getElementById('last');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const display = document.getElementById('items');
const pageNum = document.getElementById('pageNum');
const pageLimit = document.getElementById('pageLimit');

const getTags = (tagList) => {
  return tagList.map(x => `<li>${x}</li>`).join('');
}


if (model === 'prove08') {
  Paginator.prototype.getItemHTML = (x) => {
    return `<div class='card'>
      <h3>${x.name}</h3>
      <h3>$${x.price}</h3>
      <img src='${x.imageUrl}' alt='${x.name}'>
      <p>${x.description}</p>      
      <ul>
        ${getTags(x.tags)}
      </ul>
      </div>`;
  }
} else {
  Paginator.prototype.getItemHTML = (x) => {
    return `<div class='card'>
      <h3><a href='${x.url}'>${x.name}</a></h3>                              
      </div>`;
  }
}

const paginator = new Paginator(display, pageNum, pageLimit, 3, baseURL);

paginator.fetchData();

first.addEventListener('click', paginator.toFirst.bind(paginator));
last.addEventListener('click', paginator.toLast.bind(paginator));
next.addEventListener('click', paginator.toNext.bind(paginator));
prev.addEventListener('click', paginator.toPrev.bind(paginator));

