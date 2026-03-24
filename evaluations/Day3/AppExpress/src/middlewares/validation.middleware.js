const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: e.issues.map(issue => ({
                    champ: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }
        next(e);
    }
};

module.exports = { validate };