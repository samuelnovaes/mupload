#!/usr/bin/env node

let express = require('express')
let formidable = require('formidable')
let path = require('path')
let fs = require('fs-extra')
let ip = require('ip')
let session = require('express-session')
let os = require('os')
let app = express()

//Directories and files
let home = os.homedir()
let dir = path.join(home, '.mupload')
let uploads = path.join(dir, 'files')
let passfile = path.join(dir, 'password.js')
let views = path.join(__dirname, 'views')
let assets = path.join(__dirname, 'static')

async function main(){
	await fs.ensureDir(uploads)
	let exists = await fs.exists(passfile)
	if(!exists){
		await fs.writeFile(passfile, "module.exports = 'admin'")
	}
	let password = require(passfile)

	app.use(session({
		secret: password,
		resave: false,
		saveUninitialized: true
	}))

	app.use(express.static(assets))

	app.get('/', auth, (req, res) => {
		res.sendFile(path.join(views, 'index.html'))
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
						res.status(500).send('No file chosen')
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
		form.parse(req, async (err, fields, files) => {
			if(err) return res.status(500).send(err.message)
			req.session.password = fields.password
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
		let pass = req.session.password
		if(pass == password){
			next()
		}
		else {
			res.sendFile(path.join(views, 'auth.html'))
		}
	}
}

main()
