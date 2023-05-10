const express = require('express');
const app = express();
const dotenv = require('dotenv');
const routerIndex = require('./src/routes/index.js');
const updateDataBase = require('./src/services/mongo/config.mongo.js');

dotenv.config();

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('views', "./views")
app.set('view engine', 'ejs')


app.listen(process.env.PORT || 8080
    , () => console.log(`Server running on port ${process.env.PORT || 8080}`));


updateDataBase().then(data => {
    try{
        app.set('productos', data.products);
        app.set('carts', data.carts);
    }catch(err){
        console.log(err);
    }
})


app.use(routerIndex);



module.exports = app;