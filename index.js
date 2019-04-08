#!/usr/bin/env node

const express = require('express')
const Bundler = require('parcel-bundler')
const compression = require('compression')
const path = require('path')
const ip = require('ip')
const fs = require('fs-extra')
const os = require('os')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const { promisify } = require('util')
const prettyFileIcons = require('pretty-file-icons')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bundler = new Bundler(path.join(__dirname, 'www', 'index.html'))
const root = path.join(os.homedir(), '.mupload')
const filesDir = path.join(root, 'files')
const passFile = path.join(root, 'password')
const port = process.env.PORT || 8080

const upload = multer({
	storage: multer.memoryStorage()
})

app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/auth', async (req, res) => {
	try {
		const password = await fs.readFile(passFile, 'utf-8')
		if (hash(req.body.password) == password) {
			const token = await promisify(jwt.sign)({ exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) }, password)
			res.send(token)
		}
		else res.sendStatus(401)
	}
	catch (err) {
		res.status(500).send(err.message)
	}
})

app.get('/files', auth, async (req, res) => {
	try {
		const files = await fs.readdir(filesDir)
		res.json(files)
	}
	catch (err) {
		res.status(500).send(err.message)
	}
})

app.get('/files/:file', auth, async(req, res) => {
	try {
		const file = path.join(filesDir, req.params.file)
		if(await fs.pathExists(file)) res.sendFile(file)
		else res.status(500).send('File does not exists')
	}
	catch(err){
		res.status(500).send(err.message)
	}
})

app.get('/files/:file/icon', async (req, res) => {
	try {
		res.sendFile(require.resolve(`pretty-file-icons/svg/${prettyFileIcons.getIcon(req.params.file, 'svg')}`))
	}
	catch(err){
		res.status(500).send(err.message)
	}
})

app.delete('/files/:file', auth, async (req, res) => {
	try {
		const file = path.join(filesDir, req.params.file)
		await fs.remove(file)
		io.emit('refresh')
		res.end()
	}
	catch (err) {
		res.status(500).send(err.message)
	}
})

app.post('/files', auth, upload.array('files'), async (req, res) => {
	try {
		for (const file of req.files) {
			await fs.writeFile(path.join(filesDir, file.originalname), file.buffer)
		}
		io.emit('refresh')
		res.end()
	}
	catch (err) {
		res.status(500).send(err.message)
	}
})

app.put('/password', auth, async (req, res) => {
	try {
		const password = await fs.readFile(passFile, 'utf-8')
		if (hash(req.body.current) != password) res.status(500).send('Wrong current password')
		else if (req.body.newpass.length < 5) res.status(500).send('Password must be at least 5 characters')
		else {
			await fs.writeFile(passFile, hash(req.body.newpass))
			res.end()
		}
	}
	catch (err) {
		res.status(500).send(err.message)
	}
})

if (process.env.NODE_ENV == 'development') app.use(bundler.middleware())
else app.use(express.static(path.join(__dirname, 'dist')))

listen()

async function auth(req, res, next) {
	try {
		const token = req.get('x-access-token')
		const password = await fs.readFile(passFile, 'utf-8')
		try {
			await jwt.verify(token, password)
			next()
		}
		catch (err) {
			res.sendStatus(401)
		}
	}
	catch (err) {
		res.status(500).send(err.message)
	}
}

async function listen() {
	try {
		await fs.ensureDir(filesDir)
		if (!await fs.pathExists(passFile)) await fs.writeFile(passFile, hash('admin'))
		http.listen(8080, () => {
			console.log(`http://${ip.address()}:${port}`)
		})
	}
	catch (err) {
		throw err
	}
}

function hash(text) {
	return crypto.createHash('sha512').update(text).digest('base64')
}