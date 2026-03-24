const swaggerJsdoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Bibliothèque',
      version: '1.0.0',
      description: 'Documentation API avec auth JWT + refresh token',
    },
    servers: [
      {
        url: 'http://localhost:3000',
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
            id: { type: 'integer' },
            nom: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
        Livre: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            titre: { type: 'string' },
            auteur: { type: 'string' },
            annee: { type: 'integer' },
            genre: { type: 'string' },
            disponible: { type: 'boolean' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Non authentifié',
        },
        ForbiddenError: {
          description: 'Accès refusé',
        },
      },
    },

    paths: {
      
      '/api/auth/register': {
        post: {
          summary: 'Inscription utilisateur',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nom', 'email', 'password'],
                  properties: {
                    nom: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Utilisateur créé' },
            400: { description: 'Données invalides' },
          },
        },
      },

      '/api/auth/login': {
        post: {
          summary: 'Connexion utilisateur',
          tags: ['Auth'],
          responses: {
            200: { description: 'Login réussi (JWT + cookie)' },
            401: { $ref: '#/components/responses/UnauthorizedError' },
          },
        },
      },

      '/api/auth/refresh': {
        post: {
          summary: 'Refresh token via cookie',
          tags: ['Auth'],
          responses: {
            200: { description: 'Token rafraîchi' },
            401: { description: 'Refresh token invalide' },
          },
        },
      },

      '/api/auth/logout': {
        post: {
          summary: 'Déconnexion',
          tags: ['Auth'],
          responses: {
            200: { description: 'Déconnexion réussie' },
          },
        },
      },

      '/api/auth/me': {
        get: {
          summary: 'Utilisateur courant',
          tags: ['Auth'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Utilisateur connecté',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },

      
      '/api/livres': {
        get: {
          summary: 'Liste des livres',
          tags: ['Livres'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Liste des livres',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Livre' },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
        post: {
          summary: 'Créer un livre (admin)',
          tags: ['Livres'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Livre' },
              },
            },
          },
          responses: {
            201: { description: 'Livre créé' },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            403: { description: 'Réservé aux admins' },
          },
        },
      },

      '/api/livres/{id}': {
        get: {
          summary: 'Détail livre',
          tags: ['Livres'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Livre trouvé' },
            404: { description: 'Livre non trouvé' },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },

        put: {
          summary: 'Modifier livre (admin)',
          tags: ['Livres'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Livre modifié' },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            403: { description: 'Admin uniquement' },
          },
        },

        delete: {
          summary: 'Supprimer livre (admin)',
          tags: ['Livres'],
          security: [{ bearerAuth: [] }],
          responses: {
            204: { description: 'Livre supprimé' },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
    },
  },
  apis: [], 
});

module.exports = swaggerSpec;