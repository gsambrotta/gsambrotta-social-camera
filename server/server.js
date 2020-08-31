const app = require('express')()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const routes = require('./routes/index')
require('dotenv').config({ path: './env.env' })

const port = 3000

server.listen(port)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', routes)
server.on('listening', () => {
  console.info(`🚀server is running on port ${port}  ✊🏾✊🏾✊🏾`)
})
