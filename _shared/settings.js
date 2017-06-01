const settings = {
    ws: {
        host: process.env.WS_HOST || 'localhost',
        port: process.env.WS_PORT || 3000
    }
};

module.exports = settings;
