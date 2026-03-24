const prisma = require("../db/prisma");


async function getAllBooks() {
  return await prisma.livre.findMany();
}


async function getBookById(id) {
  return await prisma.livre.findUnique({ where: { id: Number(id) } });
}


async function addBook({ titre, auteur, annee, genre }) {
  return await prisma.livre.create({
    data: {
      titre,
      auteur,
      annee: annee ? Number(annee) : null,
      genre,
      disponible: true
    }
  });
}


async function deleteBook(id) {
  return await prisma.livre.delete({ where: { id: Number(id) } });
}



async function borrowBook(id) {
  const book = await prisma.livre.findUnique({
    where: { id: Number(id) }
  });

  if (!book) {
    throw new Error("Livre non trouvé");
  }

  if (!book.disponible) {
    throw new Error("Livre déjà emprunté");
  }

  return await prisma.livre.update({
    where: { id: Number(id) },
    data: { disponible: false }
  });
}


async function returnBook(id) {
  const book = await prisma.livre.findUnique({
    where: { id: Number(id) }
  });

  if (!book) {
    throw new Error("Livre non trouvé");
  }

  if (book.disponible) {
    throw new Error("Ce livre est déjà disponible");
  }

  return await prisma.livre.update({
    where: { id: Number(id) },
    data: { disponible: true }
  });
}

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  deleteBook,
  borrowBook,
  returnBook
};
