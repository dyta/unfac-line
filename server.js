/*eslint-disable */
const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

// create Express app
const app = express();

app.use(express.json());

app.use(serveStatic(path.join(__dirname, 'dist')))

// listen on port
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening on ${port}`)
})