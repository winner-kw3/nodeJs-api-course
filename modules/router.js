
const { readDB, writeDB} = require('./db');

const getBooks = (req, res) => {
    try{
    const books = readDB().books;
    res.json({
        success: true,
        count: books.length,
        data: books
    }); }
    catch (e) {
        res.status(500).json({ success: false, error: 'Erreur interne' });
    }
}

const getBookById = (req, res) => {
    try{
    const id = parseInt(req.params.id, 10);
    const books = readDB().books;
    const book = books.find((b) => b.id === id);
    if (!book) {
        return res.status(404).json({ success: false, error: 'Livre introuvable' });
    }
    res.json({ success: true, data: book }); }
    catch (e) {
        res.status(500).json({ success: false, error: 'Erreur interne' });
    }
}

const addBook = (req, res) => {
    try {
    const { title, author, year } = req.body;
    if (!title || !author || !year) {
        return res.status(400).json({ success: false, error: 'Les champs title, author et year sont requis' });
    }
    const db = readDB();
    const newId = Math.max(...db.books.map(b => b.id)) + 1 ;
    const newBook = {
        id: newId,
        title,
        author,
        year,
        available: true
    };
    db.books.push(newBook);
    writeDB(db);
    res.status(201).json({ success: true, data: newBook });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Erreur interne' });}
}

const deleteBook = (req, res) => {
    try {
    const id = parseInt(req.params.id, 10);
    const db = readDB();
    const bookIndex = db.books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
        return res.status(404).json({ success: false, error: 'Livre introuvable' });
    }
    db.books.splice(bookIndex, 1);
    writeDB(db);
    res.json({ success: true, message: 'Livre supprimé' });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Erreur interne' });
    }
    
}


module.exports = {
    getBooks,
    getBookById,
    addBook,
    deleteBook
};