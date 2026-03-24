const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books API',
      version: '1.0.0',
      description: 'API de gestion de livres',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      schemas: {
        Book: {
          type: 'object',
          required: ['title', 'author'],
          properties: {
            id:        { type: 'integer'},
            title:     { type: 'string'},
            author:    { type: 'string'},
            year:      { type: 'integer'},
            available: { type: 'boolean'},
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean'},
            error:   { type: 'string'},
          },
        },
      },
    },
    paths: {
      '/books': {
        get: {
          summary: 'Récupérer tous les livres',
          tags: ['Books'],
          responses: {
            200: {
              description: 'Liste des livres',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Book' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Ajouter un livre',
          tags: ['Books'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'author'],
                  properties: {
                    title:     { type: 'string'},
                    author:    { type: 'string'},
                    year:      { type: 'integer'},
                    available: { type: 'boolean'},
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Livre créé avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Book' },
                },
              },
            },
            400: {
              description: 'Données invalides',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },

      '/books/{id}': {
        get: {
          summary: 'Récupérer un livre par ID',
          tags: ['Books'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID du livre',
            },
          ],
          responses: {
            200: {
              description: 'Livre trouvé',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Book' },
                },
              },
            },
            404: {
              description: 'Livre non trouvé',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        delete: {
          summary: 'Supprimer un livre',
          tags: ['Books'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer'},
              description: 'ID du livre à supprimer',
            },
          ],
          responses: {
            200: {
              description: 'Livre supprimé avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Livre non trouvé',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;