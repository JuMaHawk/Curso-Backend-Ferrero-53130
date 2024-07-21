export const authorization = (role) => {
    return async (req, res, next) => {
        if (req.user !== role) {
            return res.status(403).send({message:"No tenes los permisos necesarios para acceder"});
        }
        next();
    }
}