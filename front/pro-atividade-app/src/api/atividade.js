import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:5000/api/',
});

//tenho que usar/importar essa api dentro do App.js
//todas as funções do crud vão chamar a api
