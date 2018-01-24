let form = document.getElementById('form')
let status = document.getElementById('status')

form.onsubmit = function(e){
	let data = new FormData(form)
	axios.post('/password', data)
	.then(response => {
		document.body.innerHTML = 'Password changed successfully<br><a href="/">Home page</a>'
	})
	.catch(err => {
		status.innerText = `Error: ${err.response.data}`
	})
	e.preventDefault()
}
