const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ULTRIS 1 API',
      version: '1.0.0',
      description: 'ULTRIS 1 Production API - Enterprise-grade tool access platform',
      contact: {
        name: 'ULTRIS Support',
        url: 'https://ultris1.com',
        email: 'support@ultris1.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
        description: 'Development',
      },
      {
        url: 'https://api.ultris1.com/api/v1',
        description: 'Production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            tier: { type: 'string', enum: ['free', 'coss', 'elite', 'founder'] },
            role: { type: 'string', enum: ['user', 'admin', 'superadmin'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Tool: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            displayName: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            requiredTier: { type: 'string' },
            isActive: { type: 'boolean' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
