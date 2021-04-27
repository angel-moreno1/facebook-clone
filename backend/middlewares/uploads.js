import multer from 'multer'
import path from 'path'

const store = multer.diskStorage(
    {
        destination: './uploads/',
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}${path.extname(file.originalname)}`)
        }
    }
)

const upload = multer({ storage: store })

export default upload