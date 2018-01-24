#!/usr/bin/env node

let express = require('express')
let formidable = require('formidable')
let path = require('path')
let fs = require('fs-extra')
let ip = require('ip')
let session = require('express-session')
let os = require('os')
let md5 = require('md5')
let helmet = require('helmet')
let compression = require('compression')
let serveStatic = require('serve-static')

let app = express()

//Directories and files

let home = os.homedir()
let dir = path.join(home, '.mupload')
let uploads = path.join(dir, 'files')
let passfile = path.join(dir, 'password')
let views = path.join(__dirname, 'views')
let assets = path.join(__dirname, 'static')

//Init

fs.ensureDirSync(uploads)
if(!fs.pathExistsSync(passfile)){
	fs.writeFileSync(passfile, md5('admin'))
}
let password = fs.readFileSync(passfile, 'utf-8')

//APP

app.use(helmet())

app.use(session({
	secret: password,
	resave: false,
	saveUninitialized: true
}))

app.use(serveStatic(assets))

app.get('/', auth, (req, res) => {
	res.sendFile(path.join(views, 'index.html'))
})

app.get('/password', auth, (req, res) => {
	res.sendFile(path.join(views, 'password.html'))
})

app.post('/password', auth, (req, res) => {
	let form = new formidable.IncomingForm()
	form.parse(req, async (err, fields, files) => {
		let {current, newpass, confirm} = fields
		if(md5(current) != password){
			res.status(422).send('Wrong current password')
		}
		else if(newpass.length < 5){
			res.status(400).send('password must be at least 5 characters')
		}
		else if(newpass != confirm){
			res.status(400).send('Passwords don\'t match')
		}
		else {
			try {
				await fs.writeFile(passfile, md5(newpass))
			}
			catch(err){
				res.status(500).send(err.message)
			}
			try {
				password = req.session.password = await fs.readFile(passfile, 'utf-8')
			}
			catch(err){
				res.status(500).send(err.message)
			}
		}
		res.end()
	})
})

app.post('/upload', auth, (req, res) => {
	let form = new formidable.IncomingForm()
	form.multiples = true
	form.uploadDir = uploads
	form.parse(req, async (err, fields, files) => {
		if(err) return res.status(500).send(err.message)
		let fileList = Array.isArray(files.files) ? files.files : [files.files]
		for(let i in fileList){
			let file = fileList[i]
			if(file.name){
				try {
					await fs.rename(file.path, path.join(uploads, file.name))
				}
				catch(err){
					res.status(500).send(err.message)
				}
			}
			else {
				try {
					await fs.remove(file.path)
					res.status(400).send('No file chosen')
				}
				catch(err){
					res.status(500).send(err.message)
				}
			}
		}
		res.end()
	})
})

app.get('/files', auth, (req, res) => {
	fs.readdir(uploads, (err,files) => {
		if(err) return res.status(500).send(err.message)
		res.json(files)
	})
})

app.get('/download/:file', auth, (req, res) => {
	let file = path.join(uploads, req.params.file)
	fs.pathExists(file, (err, exists) => {
		if(err) return res.status(500).send(err.message)
		if(exists) res.download(file)
		else res.status(500).send('File does not exists')
	})
})

app.delete('/delete/:file', auth, (req, res) => {
	let file = path.join(uploads, req.params.file)
	fs.remove(file, err => {
		if(err) return res.status(500).send(err.message)
		res.end()
	})
})

app.post('/auth', (req, res) => {
	let form = new formidable.IncomingForm()
	form.parse(req, (err, fields, files) => {
		if(err) return res.status(500).send(err.message)
		req.session.password = md5(fields.password)
		res.redirect('/')
	})
})

app.get('/logout', auth, (req, res) => {
	delete req.session.password
	res.redirect('/')
})

app.listen(8080, () => {
	console.log(`http://${ip.address()}:8080`)
})

function auth(req, res, next){
	if(req.session.password == password){
		next()
	}
	else {
		res.sendFile(path.join(views, 'auth.html'))
	}
}
