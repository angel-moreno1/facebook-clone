export default (error, _req, res, _next) => {
    if(error.MongooseError) {
        return res.status(400).send({ message: 'mongoose error', error: err });
    }
    if(error.code === 11000){
        return res.status(400).json({ message: 'mongoose error', error })
    }
    if(error) {
        return res.status(400).json({ message: 'was an error', error })
    }
}