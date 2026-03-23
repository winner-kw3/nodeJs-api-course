

const { readDB, writeDB } = require('./db');


function getBooks() {
    try {
        const books = readDB().books;
        return { status: 200, body: { success: true, count: books.length, data: books } };
    } catch (e) {
        return { status: 500, body: { success: false, error: 'Erreur interne' } };
    }
}

function getBookById(id) {
    try {
        const books = readDB().books;
        const book = books.find((b) => b.id === id);
        if (!book) {
            return { status: 404, body: { success: false, error: 'Livre introuvable' } };
        }
        return { status: 200, body: { success: true, data: book } };
    } catch (e) {
        return { status: 500, body: { success: false, error: 'Erreur interne' } };
    }
}

function addBook({ title, author, year }) {
    try {
        if (!title || !author || !year) {
            return { status: 400, body: { success: false, error: 'Les champs title, author et year sont requis' } };
        }
        const db = readDB();
        const newId = db.books.length > 0 ? Math.max(...db.books.map(b => b.id)) + 1 : 1;
        const newBook = { id: newId, title, author, year, available: true };
        db.books.push(newBook);
        writeDB(db);
        return { status: 201, body: { success: true, data: newBook } };
    } catch (e) {
        return { status: 500, body: { success: false, error: 'Erreur interne' } };
    }
}

function deleteBook(id) {
    try {
        const db = readDB();
        const bookIndex = db.books.findIndex((b) => b.id === id);
        if (bookIndex === -1) {
            return { status: 404, body: { success: false, error: 'Livre introuvable' } };
        }
        db.books.splice(bookIndex, 1);
        writeDB(db);
        return { status: 200, body: { success: true, message: 'Livre supprimé' } };
    } catch (e) {
        return { status: 500, body: { success: false, error: 'Erreur interne' } };
    }
}

module.exports = {
    getBooks,
    getBookById,
    addBook,
    deleteBook
};