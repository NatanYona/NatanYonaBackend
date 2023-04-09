const knexConfig = require('../config');
const knex = require('knex')(knexConfig);

knex.schema.createTable('products', table => {
    table.increments('id'),
    table.string('name').notNullable(),
    table.string('thumbnail'),
    table.float('price')
}).then(()=> {
    console.info('table created');
}).catch(err => {
    console.error(err)
}).finally(()=>{
    knex.destroy();
});

knex.schema.createTable('chatlogs', table => {
    table.string('author'),
    table.string('text')
}).then(()=> {
    console.info('table created');
}).catch(err => {
    console.error(err)
}).finally(()=>{
    knex.destroy();
});