const settings = {
    server: {
        host: process.env.SERVER_HOST || 'localhost',
        port: process.env.SERVER_PORT || 8080
    },
    client: { 
        host: process.env.CLIENT_HOST || 'localhost',
        port: process.env.CLIENT_PORT || 3000
    }
};

module.exports = settings;
