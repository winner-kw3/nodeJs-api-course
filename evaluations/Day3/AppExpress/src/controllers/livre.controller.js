const livreService = require('../services/livre.service');

const getBooks = async (req, res) => {
    try {
        const books = await livreService.getAllBooks();
        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Erreur interne' });
    }
};

const getBookById = async (req, res) => {
    try {
        const id = req.params.id;
        const book = await livreService.getBookById(id);
        if (!book) {
            return res.status(404).json({ success: false, error: 'Livre introuvable' });
        }
        res.json({ success: true, data: book });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Erreur interne' });
    }
};

const addBook = async (req, res) => {
    try {
        const { titre, auteur, annee, genre } = req.body;
        if (!titre || !auteur) {
            return res.status(400).json({ success: false, error: 'Les champs titre et auteur sont requis' });
        }
        const newBook = await livreService.addBook({ titre, auteur, annee, genre });
        res.status(201).json({ success: true, data: newBook });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Erreur interne' });
    }
};

const updateBook = async (req, res) => {
    try {
        const id = req.params.id;
        const { titre, auteur, annee, genre } = req.body;
        const updatedBook = await livreService.updateBook(id, { titre, auteur, annee, genre });
        if (!updatedBook) {
            return res.status(404).json({ success: false, error: 'Livre introuvable' });
        }
        res.json({ success: true, data: updatedBook });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Erreur interne' });
    }
};

const deleteBook = async (req, res) => {
    try {
        const id = req.params.id;
        await livreService.deleteBook(id);
        res.json({ success: true, message: 'Livre supprimé' });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Erreur interne' });
    }
};


const borrowBook = async (req, res) => {
    try {
        const id = req.params.id;
        const book = await livreService.borrowBook(id);
        res.json({ success: true, message: 'Livre emprunté', data: book });
    } catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }
};


const returnBook = async (req, res) => {
    try {
        const id = req.params.id;
        const book = await livreService.returnBook(id);
        res.json({ success: true, message: 'Livre retourné', data: book });
    } catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }
};

module.exports = {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook
};