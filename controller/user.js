const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const {User} = require('./../models')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)  
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
    }
}).single('image')

router.post('/user/register',upload, async (req, res) => {
    await User.create({
        firstname: req.body.firstname,
        age: req.body.age,
        image: req.file.path
    }).then(() => res.send("User created successfully"))
    .catch(error => res.send(error))
})

router.get('/getAll', async (req, res) => {
   await User.findAll().then(users => res.send(users)).catch(err => res.send(err));
})

router.put('/user/update/:id',upload, async (req, res) => {

    let id = req.params.id

    await User.update({firstname: req.body.firstname, age: req.body.age, image: req.file.path}, { where: { id: id }}).then((user) => {
        res.status(200).send(user)
    })
    .catch((err) => res.send(err));
})


router.get('/user/:id', async (req, res) => {

    let id = req.params.id
    let user = await User.findOne({ where: { id: id }})
    res.status(200).send(user)

})

module.exports = router;