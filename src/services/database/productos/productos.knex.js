const knexConfig = require('../config');
const knex = require('knex')(knexConfig);
const productos = require('../../productos.services');

productsToSql = productos
console.log(productsToSql)