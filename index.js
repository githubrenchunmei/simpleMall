require('babel-register');
const app = require('./config/express');
const config = require('./config/config');
const mongoose = require('./config/mongoose');

const index=require('./router/index');
const users=require('./router/users');


mongoose.connect();

app.use('/', index);
app.use('/users', users);

app.listen(config.PORT, () => {
    console.log(`serve started on port ${config.PORT}`)
});