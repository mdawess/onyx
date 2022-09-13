// Everything runs throught this file

// External Imports
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { json } from 'body-parser';
import { createHttpTerminator } from 'http-terminator';

// Internal Imports
import createApolloServer from './graphql/createApolloServer';
import { CORS_CONFIG } from './lib/config';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/typeDefs';


const main = async () => {
    // Configure Express server
    const app = express();
    const port = process.env.PORT || 8000;

    // Adding CORS to allow cross-origin requests
    // ie. running backend and frontend on the same machine
    app.use(cors());
    app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))

    app.use(json({ limit: "16mb" }));

    // Express server endpoints
    app.get('/', (_, res) => {
        res.send('Hello, Onyx!');
    });

    app.get('/healthcheck', (_, res) => {
        res.status(200).send('Server is healthy!');
    });

    app.listen(port, () => {
        console.log(`Onyx jobs API is running on ${port}.`);
      });

    const httpServer = http.createServer(app);
    const httpTerminator = createHttpTerminator({ server: httpServer });

    // Create Apollo Server with the connection to the db
    const apolloServer = createApolloServer();

    // Start Apollo Server
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        // Adds CORS to stop errors when running frontend and backend on the same machine   
        cors: CORS_CONFIG,
        path: "/graphql"
      });
}

// Runs the server with a catch block to handle errors
void main().catch(async err => {
    console.error('Error starting server:', err);
    await createApolloServer().stop();
});

