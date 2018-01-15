let form = document.getElementById('form')
let status = document.getElementById('status')
let btn = document.getElementById('btn')
let fileList = document.getElementById('file-list')

form.onsubmit = e => {
	btn.disabled = true
	let data = new FormData(form)
	axios.post('/upload', data, {
		onUploadProgress: e => {
			let progress = parseInt(((e.loaded / e.total) * 100))
			status.innerText = `Uploading ${progress}%`
		}
	})
	.then(response => {
		status.innerText = `Uploaded`
		btn.disabled = false
		reload()
	})
	.catch(err => {
		status.innerText = `Error: ${err.response.data}`
		btn.disabled = false
	})
	e.preventDefault()
}

function reload(){
	fileList.innerHTML = ''
	axios.get('/files')
	.then(response => {
		response.data.forEach(item => {
			fileList.innerHTML += `<li><a href="/download/${item}">${item}</a></li>`
		})
	})
	.catch(err => {
		status.innerText = `Error: ${err.response.data}`
	})
}

reload()
