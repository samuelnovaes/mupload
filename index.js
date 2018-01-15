let express = require('express')
let formidable = require('formidable')
let path = require('path')
let fs = require('fs-extra')
let ip = require('ip')
let app = express()

app.use(express.static(path.join(__dirname, 'static')))

app.post('/', (req, res) => {
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

app.listen(8080, () => {
	console.log(`http://${ip.address()}:8080`)
})
