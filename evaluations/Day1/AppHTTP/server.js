const http = require('http');
const { getBooks, getBookById, addBook, deleteBook } = require('./modules/router');

const PORT = 3000;

function sendJson(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(e);
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Bienvenue sur le serveur');
        return;
    }

    if (req.method === 'GET' && url.pathname === '/books') {
        const result = getBooks();
        sendJson(res, result.status, result.body);
        return;
    }

    if (req.method === 'GET' && url.pathname.match(/^\/books\/(\d+)$/)) {
        const id = parseInt(url.pathname.split('/')[2], 10);
        const result = getBookById(id);
        sendJson(res, result.status, result.body);
        return;
    }

    if (req.method === 'POST' && url.pathname === '/books') {
        try {
            const body = await parseBody(req);
            const result = addBook(body);
            sendJson(res, result.status, result.body);
        } catch (e) {
            sendJson(res, 400, { success: false, error: 'Corps de requête invalide' });
        }
        return;
    }

    if (req.method === 'DELETE' && url.pathname.match(/^\/books\/(\d+)$/)) {
        const id = parseInt(url.pathname.split('/')[2], 10);
        const result = deleteBook(id);
        sendJson(res, result.status, result.body);
        return;
    }

    sendJson(res, 404, { success: false, error: 'Route non trouvée' });
});

server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
