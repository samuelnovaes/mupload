let express = require('express')
let formidable = require('formidable')
let path = require('path')
let fs = require('fs-extra')
let ip = require('ip')
let session = require('express-session')
let app = express()
let password

fs.readFile(path.join(__dirname, 'password.txt'), 'utf-8', (err, data) =>{
	if(err) throw err
	password = data.trim()

	app.use(session({
		secret: password,
		resave: false,
		saveUninitialized: true
	}))

	app.use(express.static(path.join(__dirname, 'static')))

	app.get('/', auth, (req, res) => {
		res.sendFile(path.join(__dirname, 'views', 'index.html'))
	})

	app.post('/upload', auth, (req, res) => {
		let form = new formidable.IncomingForm()
		form.multiples = true
		form.uploadDir = path.join(__dirname, 'uploads')
		form.parse(req, async (err, fields, files) => {
			if(err) res.status(500).send(err.message)
			let fileList = Array.isArray(files.files) ? files.files : [files.files]
			for(let i in fileList){
				let file = fileList[i]
				if(file.name){
					try {
						await fs.rename(file.path, path.join(__dirname, 'uploads', file.name))
					}
					catch(err){
						res.status(500).send(err.message)
					}
				}
				else {
					fs.remove(file.path)
					res.status(500).send('No file chosen')
				}
			}
			res.end()
		})
	})

	app.get('/files', auth, (req, res) => {
		fs.readdir(path.join(__dirname, 'uploads'), (err,files) => {
			if(err) res.status(500).send(err.message)
			res.json(files)
		})
	})

	app.get('/download/:file', auth, (req, res) => {
		let file = path.join(__dirname, 'uploads', req.params.file)
		fs.pathExists(file, (err, exists) => {
			if(err) res.status(500).send(err.message)
			if(exists) res.download(file)
			else res.status(500).send('File does not exists')
		})
	})

	app.post('/auth', (req, res) => {
		let form = new formidable.IncomingForm()
		form.parse(req, async (err, fields, files) => {
			if(err) res.status(500).send(err.message)
			req.session.password = fields.password
			res.redirect('/')
		})
	})

	fs.ensureDir(path.join(__dirname, 'uploads'), err => {
		if(err) throw err
		app.listen(8080, () => {
			console.log(`http://${ip.address()}:8080`)
		})
	})
})

function auth(req, res, next){
	let pass = req.session.password
	if(pass == password){
		next()
	}
	else {
		res.sendFile(path.join(__dirname, 'views', 'auth.html'))
	}
}
