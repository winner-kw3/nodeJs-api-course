const express = require("express");
const router = express.Router();
const livreController = require("../controllers/livre.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { addBookSchema, updateBookSchema } = require("../schemas/livre.schema");


router.get("/", livreController.getBooks);                        
router.get("/:id", livreController.getBookById);                  
router.post("/", authMiddleware, validate(addBookSchema), livreController.addBook);        
router.put("/:id", authMiddleware, validate(updateBookSchema), livreController.updateBook);   
router.delete("/:id", authMiddleware, adminMiddleware, livreController.deleteBook); 
router.post("/:id/emprunter", authMiddleware, livreController.borrowBook);   
router.post("/:id/retourner", authMiddleware, livreController.returnBook);   

module.exports = router;

