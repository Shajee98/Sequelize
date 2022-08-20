const user = require('./controller/user')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use("/images", express.static("./uploads/images"))
app.use('/users', user)
const db = require('./models/index.js')

db.sequelize.sync().then((res) => {
    app.listen(3000, () => {
        console.log('Listening on port 3000');
     })
})