import { validationResult } from "express-validator";

export function file(name, type) {
    return (req, res, next) => {
        let error;
        if (!req.files) {
            error = {
                msg: "file not found",
                param: name,
                location: "body"
            };
        } else {
            const file = req.files[name];
            if (!file) {
                error = {
                    msg: "file not found",
                    param: name,
                    location: "body"
                };
            } else if (!file.mimetype.includes(type)) {
                error = {
                    msg: "invalid file format",
                    param: name,
                    location: "body"
                };
            }
        }
        if (!error) return next();
        if (typeof req.fileErrors == 'object') {
            req.fileErrors.push(error);
        } else {
            req.fileErrors = [error];
        }
        return next();
    }
}

export function validate(req, res, next) {
    const result = validationResult(req);
    let errors = result.array().concat(req.fileErrors || []);
    if (errors.length !== 0) {
        return res.status(422).json({ errors });
    }
    next();
}