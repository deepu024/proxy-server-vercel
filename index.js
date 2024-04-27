const express = require('express');
const httpProxy = require('http-proxy');
const { config } = require('dotenv');

config();

const app = express();
const PORT = 8000;

const BUCKET_URL = process.env.BUCKER_URL;

const proxy = httpProxy.createProxy();

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];
    const resolvesTo = `${BUCKET_URL}/${subdomain}`;

    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on('proxyReq', (proxyReq, req, res) => {
    const path = req.url;
    if (path === '/')
        proxyReq.path += 'index.html'
});

app.listen(PORT, () => console.log('listening on port ' + PORT));
