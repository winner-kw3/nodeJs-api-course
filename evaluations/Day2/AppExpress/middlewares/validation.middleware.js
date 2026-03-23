const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (e) {
        return res.status(400).json({
            success: false,
            errors: e.errors.map(err => ({
                champ: err.path.join('.'),
                message: err.message
            }))
        });
    }
};

module.exports = { validate };