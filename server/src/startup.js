import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import OpticsAgent from 'optics-agent';
import bodyParser from 'body-parser';
import { createServer } from 'http';

app.use(
    '/graphql',
    (req, resp, next) => {
        if (config.persistedQueries) {
            // eslint-disable-next-line no-param-reassign
            req.body.query = invertedMap[req.body.id];
        }
        next();
    },
);
let OPTICS_API_KEY;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (OPTICS_API_KEY) {
    app.use('/graphql', OpticsAgent.middleware());
}

app.use('/graphql', graphqlExpress((req) => {
    // Get the query, the same way express-graphql does it
    // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
    const query = req.query.query || req.body.query;
    if (query && query.length > 2000) {
        // None of our app's queries are this long
        // Probably indicates someone trying to send an overly expensive query
        throw new Error('Query too large.');
    }

    // let user;
    // if (req.user) {
    //     // We get req.user from passport-github with some pretty oddly named fields,
    //     // let's convert that to the fields in our schema, which match the GitHub
    //     // API field names.
    //     user = {
    //         login: req.user.username,
    //         html_url: req.user.profileUrl,
    //         avatar_url: req.user.photos[0].value,
    //     };
    // }


    let opticsContext;
    if (OPTICS_API_KEY) {
        opticsContext = OpticsAgent.context(req);
    }

    return {
        schema,
        context: {
            // user,
            Lessons: new Lessons(),
            opticsContext,
        },
    };
}));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}));

const server = createServer(app);

server.listen(port, () => console.log( // eslint-disable-line no-console
    `API Server is now running on http://localhost:${port}`,
));