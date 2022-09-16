'use strict';

// Const express = require('express');
// Const app = express();
const port = 8010;
const logger = require('./logger/logger')

// Const bodyParser = require('body-parser');
// Const jsonParser = bodyParser.json();

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./docs/swagger_out.json')

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);

    app.listen(port, () => {
        logger.info(`Server started and running on port ${port}`)
    });

    app.use('/doc', swaggerUi.serve)
    app.get('/doc', swaggerUi.setup(swaggerFile), () => {
        logger.info('Accessing endpoint GET /doc')
    })
    require('./src/app')(app)

});