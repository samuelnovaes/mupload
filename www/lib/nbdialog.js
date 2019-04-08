'use strict';

(function () {
	var bgComponent = function bgComponent(parent) {
		var el = document.createElement('div');
		Object.assign(el.style, {
			zIndex: '100000',
			position: 'fixed',
			top: '0',
			left: '0',
			width: '100vw',
			height: '100vh',
			backgroundColor: 'rgba(0, 0, 0, 0.1)'
		});
		parent.appendChild(el);
		return el;
	};

	var boxComponent = function boxComponent(parent) {
		var el = document.createElement('div');
		Object.assign(el.style, {
			padding: '16px',
			position: 'fixed',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
			width: '383px',
			maxWidth: 'calc(100% - 20px)',
			wordWrap: 'break-word',
			boxSizing: 'border-box',
			backgroundColor: '#f5f5f5',
			borderRadius: '3px',
			fontFamily: 'Arial, Helvetica, sans-serif',
			fontSize: '11pt',
			border: '1px solid #888',
			boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
		});
		parent.appendChild(el);
		return el;
	};

	var buttonComponent = function buttonComponent(parent) {
		var el = document.createElement('button');
		Object.assign(el.style, {
			padding: '6px',
			width: '80px',
			border: '1px solid #888',
			borderRadius: '2px',
			boxSizing: 'border-box',
			backgroundColor: 'rgba(0, 0, 0, 0)'
		});
		parent.appendChild(el);
		return el;
	};

	var okComponent = function okComponent(parent) {
		var el = buttonComponent(parent);
		el.innerText = 'OK';
		Object.assign(el.style, {
			float: 'right',
			backgroundColor: '#1976D2',
			borderColor: '#1976D2',
			color: '#fff'
		});
		return el;
	};

	var msgComponent = function msgComponent(parent) {
		var el = document.createElement('p');
		Object.assign(el.style, {
			marginTop: '0',
			maxHeight: '200px',
			overflow: 'auto'
		});
		parent.appendChild(el);
		return el;
	};

	var cancelComponent = function cancelComponent(parent) {
		var el = buttonComponent(parent);
		el.innerText = 'Cancel';
		Object.assign(el.style, {
			float: 'right',
			marginRight: '8px'
		});
		return el;
	};

	var inputComponent = function inputComponent(parent) {
		var el = document.createElement('input');
		el.type = 'text';
		Object.assign(el.style, {
			width: '100%',
			padding: '5px',
			boxSizing: 'border-box',
			marginBottom: '16px',
			border: '1px solid #888'
		});
		parent.appendChild(el);
		return el;
	};

	window._alert = function () {
		var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		var alertBg = bgComponent(document.body);
		var alertBox = boxComponent(alertBg);
		var alertMsg = msgComponent(alertBox);
		var alertOk = okComponent(alertBox);

		alertMsg.innerText = msg;
		alertOk.focus();

		return new Promise(function (resolve) {
			alertOk.onclick = function () {
				document.body.removeChild(alertBg);
				resolve();
			};
		});
	};

	window._confirm = function () {
		var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		var confirmBg = bgComponent(document.body);
		var confirmBox = boxComponent(confirmBg);
		var confirmMsg = msgComponent(confirmBox);
		var confirmOk = okComponent(confirmBox);
		var confirmCancel = cancelComponent(confirmBox);

		confirmMsg.innerText = msg;
		confirmOk.focus();

		return new Promise(function (resolve) {
			confirmOk.onclick = function () {
				document.body.removeChild(confirmBg);
				resolve(true);
			};
			confirmCancel.onclick = function () {
				document.body.removeChild(confirmBg);
				resolve(false);
			};
		});
	};

	window._prompt = function () {
		var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		var defaultText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

		var promptBg = bgComponent(document.body);
		var promptBox = boxComponent(promptBg);
		var promptMsg = msgComponent(promptBox);
		var promptInput = inputComponent(promptBox);
		var promptOk = okComponent(promptBox);
		var promptCancel = cancelComponent(promptBox);

		promptMsg.innerText = msg;
		promptInput.value = defaultText;
		promptInput.focus();

		return new Promise(function (resolve) {
			promptInput.onkeyup = function (e) {
				if (e.keyCode === 13) {
					document.body.removeChild(promptBg);
					resolve(promptInput.value);
				}
			};
			promptOk.onclick = function () {
				document.body.removeChild(promptBg);
				resolve(promptInput.value);
			};
			promptCancel.onclick = function () {
				document.body.removeChild(promptBg);
				resolve(null);
			};
		});
	};
})();
