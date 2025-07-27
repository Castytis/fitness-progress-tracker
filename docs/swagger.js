const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      openapi: '3.0.0',
      title: 'Fitness Tracker API',
      version: '1.0.0',
      description: 'API documentation for the Fitness Tracker',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: { supportedSubmitMethods: [] },
    })
  );
};

module.exports = setupSwagger;
