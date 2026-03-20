const http = require('http');
const { readDB, writeDB } = require('./modules/db');

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
        try {
            const books = readDB().books;
            sendJson(res, 200, { success: true, count: books.length, data: books });
        } catch (e) {
            sendJson(res, 500, { success: false, error: 'Erreur interne' });
        }
        return;
    }
    
    if (req.method === 'GET' && url.pathname.match(/^\/books\/(\d+)$/)) {
        try {
            const id = parseInt(url.pathname.split('/')[2], 10);
            const books = readDB().books;
            const book = books.find(b => b.id === id);
            if (!book) {
                sendJson(res, 404, { success: false, error: 'Livre introuvable' });
                return;
            }
            sendJson(res, 200, { success: true, data: book });
        } catch (e) {
            sendJson(res, 500, { success: false, error: 'Erreur interne' });
        }
        return;
    }
    
    if (req.method === 'POST' && url.pathname === '/books') {
        try {
            const body = await parseBody(req);
            const { title, author, year } = body;
            if (!title || !author || !year) {
                sendJson(res, 400, { success: false, error: 'Les champs title, author et year sont requis' });
                return;
            }
            const db = readDB();
            const newId = db.books.length > 0 ? Math.max(...db.books.map(b => b.id)) + 1 : 1;
            const newBook = { id: newId, title, author, year, available: true };
            db.books.push(newBook);
            writeDB(db);
            sendJson(res, 201, { success: true, data: newBook });
        } catch (e) {
            sendJson(res, 500, { success: false, error: 'Erreur interne' });
        }
        return;
    }
    
    if (req.method === 'DELETE' && url.pathname.match(/^\/books\/(\d+)$/)) {
        try {
            const id = parseInt(url.pathname.split('/')[2], 10);
            const db = readDB();
            const bookIndex = db.books.findIndex(b => b.id === id);
            if (bookIndex === -1) {
                sendJson(res, 404, { success: false, error: 'Livre introuvable' });
                return;
            }
            db.books.splice(bookIndex, 1);
            writeDB(db);
            sendJson(res, 200, { success: true, message: 'Livre supprimé' });
        } catch (e) {
            sendJson(res, 500, { success: false, error: 'Erreur interne' });
        }
        return;
    }
    
    sendJson(res, 404, { success: false, error: 'Route non trouvée' });
});

server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
