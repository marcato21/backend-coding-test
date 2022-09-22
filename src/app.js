'use strict';

const express = require('express');
const app = express();
const logger = require('../logger/logger')

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = (db) => {
    app.get('/health', async (req, res, next) => {
        // #swagger.tags = ['Health']
        // #swagger.description = 'Check Health.'
        logger.info('Accessing endpoint GET /health')
        logger.info('Response: \'Healthy\'')

        res.send(await 'Healthy').catch(next)
    });

    app.post('/rides', jsonParser, async (req, res) => {
        // #swagger.tags = ['Rides']
        // #swagger.description = 'Create new Rides data.'
        logger.info('Accessing endpoint POST /rides')
        const startLatitude = Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName = req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;

        logger.info(`Request Body: ${JSON.stringify(req.body)}`)

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            logger.error(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            }))
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            logger.error(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            }))
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            logger.error(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            }))
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            logger.error(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            }))
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            logger.error(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            }))
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        const values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];
        
        await db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, async function (err) {
            if (err) {
                logger.error(JSON.stringify({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                }))
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            await db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, async function (err, rows) {
                if (err) {
                    logger.error(JSON.stringify({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    }))
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }

                logger.info('Rides successfully created.')
                logger.info(`Response Body: ${JSON.stringify(rows)}`)
                
                res.send(await rows);
            });
        });
    });

    app.get('/rides', async (req, res, next) => {
        // #swagger.tags = ['Rides']
        // #swagger.description = 'Get All Rides data.'
        logger.info('Accessing endpoint GET /rides')

        let {page} = req.query
        const {limit} = req.query

        let queryBuilder = 'SELECT * FROM Rides'
        
        if (limit >= 1) {
            queryBuilder = queryBuilder.concat(` LIMIT ${limit} `) 
        }

        if (page >= 1) {
            page = (page - 1) * limit
            queryBuilder = queryBuilder.concat(` OFFSET ${page} `)
        }

        logger.info(queryBuilder)

        await db.all(queryBuilder, async function (err, rows) {
            if (err) {
                logger.error(JSON.stringify({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                }))
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                logger.error(JSON.stringify({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                }))
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            logger.info('Rides successfully retrieved.')
            logger.info(`Response Body: ${JSON.stringify(rows)}`)

            res.send(await rows);
        })
            .catch(next)
    });

    app.get('/rides/:id', async (req, res) => {
        // #swagger.tags = ['Rides']
        // #swagger.description = 'Get Rides data using id as reference'
        logger.info(`Accessing endpoint GET /rides/${req.params.id}`)
        await db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, async function (err, rows) {
            if (err) {
                logger.error(JSON.stringify({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                }))
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                logger.error(JSON.stringify({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                }))
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            logger.info(`Rides with id: ${req.params.id} successfully retrieved.`)
            logger.info(`Response Body: ${JSON.stringify(rows)}`)

            res.send(await rows);
        });
    });

    return app;
};
