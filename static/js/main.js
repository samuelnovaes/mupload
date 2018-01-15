let form = document.getElementById('form')
let status = document.getElementById('status')
let btn = document.getElementById('btn')
form.onsubmit = e => {
	btn.disabled = true
	let data = new FormData(form)
	axios.post('/', data, {
		onUploadProgress: e => {
			let progress = parseInt(((e.loaded / e.total) * 100))
			status.innerText = `Uploaded ${progress}%`
		}
	})
	.then(response => {
		status.innerText = `Uploaded`
		btn.disabled = false
	})
	.catch(err => {
		status.innerText = `Error: ${err.response.data}`
		btn.disabled = false
	})
	e.preventDefault()
}
