const fetch = require('node-fetch');
const URL = "https://pokeapi.co/api/v2/pokemon";

exports.getPokemon = (skip, limit) => {      
  return fetch(URL + `?offset=${skip}&limit=${limit}`, { method: "Get" })
    .then(res => res.json())
    .then(data => data);     
}

