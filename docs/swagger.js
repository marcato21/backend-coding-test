const swaggerAutogen = require('swagger-autogen')()

const output = './docs/swagger_out.json'
const endpoints = ['./src/app.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "Xendit Conding Exercise",
        description: "The goal of these exercises are to assess your proficiency in software engineering that is related to the daily work that we do at Xendit."
    },
    host: "localhost:8010",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Health",
            "description": "Check Health"
        },
        {
            "name": "Rides",
            "description": "Get Rides data & Create new Rides data"
        }
    ]
}

swaggerAutogen(output, endpoints, doc)