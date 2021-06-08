
export default class Paginator {
 constructor(display, pageNum, pageLimit, lastPage, baseURL) {
  this.page = 1;
  this.display = {items: display, pageNum: pageNum, pageLimit: pageLimit};
  this.last = lastPage;

  this.baseURL = baseURL;  
 }

 fetchData() {
  fetch(this.baseURL + `?page=${this.page}`, {
    method: 'GET'       
  })
  .then(result => {
    return result.json();
  })
  .then(resData => {
    this.last = parseInt(resData.pageCount);
    this.page = parseInt(resData.page);
    this.clearPage();    
    this.loadPage(resData.items);
  })
  .catch(err => console.log(err));
 }

 clearPage() {
  while(this.display.items.lastElementChild)
    this.display.items.removeChild(this.display.items.lastElementChild);
 }

 loadPage(items) {    
  this.display.pageNum.innerHTML = this.page;
  this.display.pageLimit.innerHTML = this.last;
  let html = items.map(x => this.getItemHTML(x)).join('');
  this.display.items.innerHTML = html;
 }

 toFirst() {
  this.page = 1;
  this.fetchData();
 }

 toLast() {
  this.page = this.last;
  this.fetchData();
 }

 toNext() {
  this.page = Math.min(this.last, this.page + 1);
  this.fetchData();
 }

 toPrev() {
  this.page = Math.max(1, this.page - 1);
  this.fetchData();
 }
}