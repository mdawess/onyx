// Everything runs throught this file

// External Imports
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import { createHttpTerminator } from 'http-terminator';
const bodyParser = require('body-parser');

// Internal Imports
import createApolloServer from './graphql/createApolloServer';
import { CORS_CONFIG } from './lib/config';

const createHandler = (event: any, context: any, callback: any) => {

    const apolloServer = createApolloServer();

    const handler = apolloServer.createHandler({
        expressAppFromMiddleware(middleware) {
            const app = express();
            dotenv.config()
            const port = process.env.PORT || 8000;

            app.use(cors(CORS_CONFIG));
            app.use(middleware);
            app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))

            const httpServer = http.createServer(app);
            const httpTerminator = createHttpTerminator({ server: httpServer });


            app.use(json({ limit: "16mb" }));
            app.use(bodyParser.json());

            // Begin: Express Server Endpoints

            app.get('/test', (_, res) => {
                res.send('Hello, Onyx!');
            });
        
            app.get('/healthcheck', (_, res) => {
                res.status(200).send('Server is healthy!');
            });
        
            app.get('/error', (req, res) => {
                return { error: 'Error' };
            });
            
            return app;
        },
        expressGetMiddlewareOptions: {
            cors: CORS_CONFIG,
            path: "/" 
        }
    });
    if (!event.requestContext || event === '') {
        event.requestContext = context;
    }
    return handler(event, context, callback);
    
}

export const handler = createHandler;