let form = document.getElementById('form')
let status = document.getElementById('status')
let fileList = document.getElementById('file-list')
let btn = document.getElementById('btn')

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
		btn.disabled = false
		status.innerText = `Uploaded`
		reload()
	})
	.catch(err => {
		btn.disabled = false
		status.innerText = `Error: ${err.response.data}`
	})
	e.preventDefault()
}

function remove(e){
	let file = e.target.dataset.file
	e.target.disabled = true
	status.innerText = `Deleting ...`
	axios.delete(`/delete/${file}`)
	.then(() => {
		e.target.disabled = false
		status.innerText = `Deleted`
		reload()
	})
	.catch(err => {
		e.target.disabled = false
		status.innerText = `Error: ${err.response.data}`
	})
}

function reload(){
	axios.get('/files')
	.then(response => {
		fileList.innerHTML = ''
		response.data.forEach(item => {
			fileList.innerHTML += `<p><button data-file="${item}" onclick="remove(event)">Delete</button>&emsp;<a href="/download/${item}">${item}</a></p>`
		})
	})
	.catch(err => {
		status.innerText = `Error: ${err.response.data}`
	})
}

reload()
