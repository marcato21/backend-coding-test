'use strict';

const express = require('express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./docs/swagger_out.json')

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);

    app.listen(port, () => console.log(`App started and listening on port ${port}`));

    app.use('/doc', swaggerUi.serve)
    app.get('/doc', swaggerUi.setup(swaggerFile))
    require('./src/app')(app)

});