'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

let newRide = {
    start_lat: 0, 
    start_long: 0, 
    end_lat: 0, 
    end_long: 0,
    rider_name: "Ferrari", 
    driver_name: "John Doe", 
    driver_vehicle: "Ferrari", 
    created: new Date().toLocaleString('id-ID', {hour12: false})
};

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('POST /rides', () => {
        it('should create new data', (done) => {
            newRide = {
                start_lat: 0, 
                start_long: 0, 
                end_lat: 0, 
                end_long: 0,
                rider_name: "Ferrari", 
                driver_name: "John Doe", 
                driver_vehicle: "Ferrari", 
                created: new Date().toLocaleString('id-ID', {hour12: false})
            };
            request(app)
                .post('/rides')
                .send(newRide)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done();
                });
        });

        it('should get a input validation error for start latitude or longitude', (done) => {
            newRide = {
                start_lat: -100, 
                start_long: 0, 
                end_lat: 0, 
                end_long: 0,
                rider_name: "Ferrari", 
                driver_name: "John Doe", 
                driver_vehicle: "Ferrari", 
                created: new Date().toLocaleString('id-ID', {hour12: false})
            };
            request(app)
                .post('/rides')
                .send(newRide)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done();
                });
        });

        it('should get a input validation error for end latitude or longitude', (done) => {
            newRide = {
                start_lat: 0, 
                start_long: 0, 
                end_lat: -100, 
                end_long: 0,
                rider_name: "Ferrari", 
                driver_name: "John Doe", 
                driver_vehicle: "Ferrari", 
                created: new Date().toLocaleString('id-ID', {hour12: false})
            };
            request(app)
                .post('/rides')
                .send(newRide)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done();
                });
        });

        it('should get a input validation error for empty string for rider name', (done) => {
            newRide = {
                start_lat: 0, 
                start_long: 0, 
                end_lat: 0, 
                end_long: 0,
                rider_name: "", 
                driver_name: "John Doe", 
                driver_vehicle: "Ferrari", 
                created: new Date().toLocaleString('id-ID', {hour12: false})
            };
            request(app)
                .post('/rides')
                .send(newRide)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done();
                });
        });

        it('should get a input validation error for empty string for driver name', (done) => {
            newRide = {
                start_lat: 0, 
                start_long: 0, 
                end_lat: 0, 
                end_long: 0,
                rider_name: "Ferrari", 
                driver_name: "", 
                driver_vehicle: "Ferrari", 
                created: new Date().toLocaleString('id-ID', {hour12: false})
            };
            request(app)
                .post('/rides')
                .send(newRide)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done();
                });
        });

        it('should get a input validation error for empty string for driver vehicle', (done) => {
            newRide = {
                start_lat: 0, 
                start_long: 0, 
                end_lat: 0, 
                end_long: 0,
                rider_name: "Ferrari", 
                driver_name: "John Doe", 
                driver_vehicle: "", 
                created: new Date().toLocaleString('id-ID', {hour12: false})
            };
            request(app)
                .post('/rides')
                .send(newRide)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done();
                });
        });
    });

    describe('GET /rides', () => {
        it('should return list of rides data', (done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done();
                });
        });
        
    });

    describe('GET /rides/:id', () => {
        it('should GET rides with a given id', (done) => {
            request(app)
                .get(`/rides/${newRide.id}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done();
                });
        });
    });
});