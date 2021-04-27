import jtw from 'jsonwebtoken';

const isAuth = (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if(token) {
        jtw.verify(
            token,
            'some',
            (err, decode) => {
                if(err) {
                    res.status(401).send({ message: 'Invalid Token' });
                }else {
                    req.user = decode;
                    next();
                }
            }
        );
    }else {
        res.status(401).json({ error: 'no token' });
    }
};

export default isAuth;