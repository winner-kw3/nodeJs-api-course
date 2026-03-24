
const { z } = require("zod");


const addBookSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  auteur: z.string().min(1, "L'auteur est requis"),
  annee: z
    .number({ invalid_type_error: "L'année doit être un nombre" })
    .int("L'année doit être un entier")
    .optional(),
  genre: z.string().optional(),
});


const updateBookSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").optional(),
  auteur: z.string().min(1, "L'auteur est requis").optional(),
  annee: z
    .number({ invalid_type_error: "L'année doit être un nombre" })
    .int("L'année doit être un entier")
    .optional(),
  genre: z.string().optional(),
});

module.exports = {
  addBookSchema,
  updateBookSchema,
};