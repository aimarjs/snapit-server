const restify = require('restify');
const restifyPlugins = require('restify-plugins');
const corsMiddleware = require('restify-cors-middleware');
// const restifyErrors = require('restify-errors');
const mongoose = require('mongoose');
const config = require('./app/config');
const routes = require('./app/routes');

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['']
});

const server = restify.createServer({
    name: config.name,
    version: config.version
});

server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

server.pre(cors.preflight);
server.use(cors.actual);

routes(server);

server.listen(config.port, function () {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db.uri, { useNewUrlParser: true });

    const db = mongoose.connection;

    db.on('error', (err) => {
        console.error(err);
        process.exit(1);
    });

    db.once('open', () => {
        // require('./app/routes')(server)
        console.log('%s listening at %s', server.name, config.base_url);
    });
});
