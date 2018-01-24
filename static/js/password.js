let form = document.getElementById('form')
let status = document.getElementById('status')
let disabled = false

form.onsubmit = function(e){
	if(!disabled){
		disabled = true
		let data = new FormData(form)
		axios.post('/password', data)
		.then(response => {
			disabled = false
			document.body.innerHTML = 'Password changed successfully<br><a href="/">Home page</a>'
		})
		.catch(err => {
			disabled = false
			status.innerText = `Error: ${err.response.data}`
		})
	}
	e.preventDefault()
}
