const fetchURL = "/proveAssignments/10/fetchAll";
const postURL = "/proveAssignments/10/insert";
const display = document.getElementById('items');
const hname = document.getElementById('name');
const identity = document.getElementById('identity');
const powers = document.getElementById('powers');
const csrf = document.getElementById("_csrf");
const add = document.getElementById('addbtn');
const form = document.getElementById('myForm');

function loadPage(items) {  
  hname.value = "";
  identity.value = "";
  powers.value = "";
  display.innerHTML = items.map(x => {
    return `<div class='card'>
    <h3 class='hero'>${x.name}</h3>        
    <p>
      Identity: ${ x.identity ? x.identity : '' }
      <br>
      Powers: ${ x.powers ? x.powers : '' }
    </p>    
    </div>`;
  })
  .join('');
}

function fetchData() {
  fetch(fetchURL)
  .then(result => {
    return result.json();
  })
  .then(res => {     
    loadPage(res.avengers);        
  })
  .catch(err => console.log(err));
}

function postData() { 
  fetch(postURL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: hname.value,
      identity: identity.value,
      powers: powers.value,
      _csrf: csrf.value
    })        
  })
  .then(result => {    
    return result.json();
  })
  .then(res => {             
    loadPage(res.avengers);        
  })
  .catch(err => console.log(err));
}

add.addEventListener('click', postData);
fetchData();