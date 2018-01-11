let express = require('express')
let path = require('path')
let multipart = require('connect-multiparty')
let fs = require('fs-extra')
let app = express()

app.use(express.static(path.join(__dirname, 'static')))
app.use(multipart())

app.post('/upload', (req, res) => {
	let arquivo = req.files.arquivo
	fs.copy(arquivo.path, path.join(__dirname, 'uploads', arquivo.originalFilename), err => {
		if(err) throw err
		fs.unlink(arquivo.path, err => {
			if(err) throw err
			delete req.files.arquivo
			res.send('Arquivo enviado!')
		})
	})
})

app.listen(80, ()=>{
	console.log('Abra a URL http://localhost:80 no seu navegador!')
})
