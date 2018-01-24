let form = document.getElementById('form')
let status = document.getElementById('status')
let fileList = document.getElementById('file-list')
let disabled = false

form.onsubmit = e => {
	if(!disabled){
		disabled = true
		let data = new FormData(form)
		axios.post('/upload', data, {
			onUploadProgress: e => {
				let progress = parseInt(((e.loaded / e.total) * 100))
				status.innerText = `Uploading ${progress}%`
			}
		})
		.then(response => {
			disabled = false
			status.innerText = `Uploaded`
			reload()
		})
		.catch(err => {
			disabled = false
			status.innerText = `Error: ${err.response.data}`
		})
		form.elements.files.value = null
	}
	e.preventDefault()
}

function remove(file){
	if(!disabled){
		disabled = true
		status.innerText = `Deleting ...`
		axios.delete(`/delete/${file}`)
		.then(() => {
			disabled = false
			status.innerText = `Deleted`
			reload()
		})
		.catch(err => {
			disabled = false
			status.innerText = `Error: ${err.response.data}`
		})
	}
}

function reload(){
	axios.get('/files')
	.then(response => {
		fileList.innerHTML = ''
		response.data.forEach(item => {
			fileList.innerHTML += `<p><button onclick="remove('${item}')">Delete</button>&emsp;<a href="/download/${item}">${item}</a></p>`
		})
	})
	.catch(err => {
		status.innerText = `Error: ${err.response.data}`
	})
}

reload()
