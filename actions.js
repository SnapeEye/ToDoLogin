///////////////////////////////////////////////////////////////////
// BLOCK THAT STARTS ON EVERY TIME THE PAGE REFRESHES
///////////////////////////////////////////////////////////////////

// Hide all 3 blocks
document.getElementById('registration').style.display = 'none';
document.getElementById('signIn').style.display = 'none';
document.getElementById('toDo').style.display = 'none';

// Create connection object to MySQL
var http = createConnectionObject();
if (http == null)
	alert('Error while creatin connectionObject.')

// Get the mode that must be displayed right now
var mode = localStorage.getItem('mode');

// Check for logged in user
var current_user = getLoggedUser();

// If a user is already logged in
if (current_user != null)
	mode = 'toDo';

// If no block detected or it's our first run
if (mode === null) {
	initRegisterWorkspace(); // Registration page initializes
}
else { //or we initialize the block we need
	switch(mode) {
		case "registration":
			initRegisterWorkspace();
			break;
		case "signIn":
			initSignInWorkspace();
			break;
		case "toDo":
			initToDoWorkspace();
			break;
		default:
			localStorage.removeItem('mode');
			alert("Error acquired!\n Page will be reloaded.")
			refresh();
	}
}


///////////////////////////////////////////////////////////////////
// INITIALIZE METHODS (3 MODES: REGISTRATION, SIGN IN AND TODO LIST)
///////////////////////////////////////////////////////////////////

// Initialize 'Registration' block of components
function initRegisterWorkspace() {
	document.title = 'Registration';
	var block = document.getElementById('registration');
	block.style.display = "block";

}

// Initialize 'Sign In' block of components
function initSignInWorkspace() {
	document.title = 'Sign In';
	var block = document.getElementById('signIn');
	block.style.display = "block";
}

// Initialize 'ToDo' block of components
function initToDoWorkspace() {
	document.title = 'To Do List';
	var block = document.getElementById('toDo');
	block.style.display = "block";

	var obj = getLoggedUser();
	document.getElementById('loggedUserName').innerHTML = obj.fname + ' ' + obj.lname;

	initList(obj);
}

///////////////////////////////////////////////////////////////////
// ADDITIONAL METHODS
///////////////////////////////////////////////////////////////////

// Change the mode of the page to display
function rebuild(mode) {
	localStorage.setItem('mode',mode);
	refresh();
}

// Refreshes the page
function refresh() {
	// scroll it!
	location.reload();
}

// Checks for logged in user
function getLoggedUser() {
	var string = localStorage.getItem('loggedUser');
	var user = JSON.parse(string);
	return user;
}

function setLoggedUser(user) {
	var string = JSON.stringify(user);
	localStorage.setItem('loggedUser',string);
}

///////////////////////////////////////////////////////////////////
// BLOCK OF METHODS RELATED TO ACTION WITH MYSQL DATA STORING
///////////////////////////////////////////////////////////////////

// Creates connection object
function createConnectionObject() {
	var request_type;
	var browser = navigator.appName;
	if(browser == "Microsoft Internet Explorer") {
		request_type = new ActiveXObject("Microsoft.XMLHTTP");
	}else{
		request_type = new XMLHttpRequest();
	}
	return request_type;
}

///////////////////////////////////////////////////////////////////
// LOG IN PART
///////////////////////////////////////////////////////////////////

// Sign in to an account
function signIn(mail,pass) {
	var email = encodeURI(mail);
	var psw = encodeURI(pass);

	var nocache = 0;
	nocache = Math.random();

	http.open('GET', '/login.php?email='+email+'&psw='+psw+'&nocache = '+nocache, true);
	http.onreadystatechange = signInReply;
	http.send(null);
}
// Reaction on signIn 'over' state
function signInReply() {
	if(http.readyState == 4 && http.status == 200) { 
		var response = JSON.parse(http.responseText);
		if(response == '0') {
			alert('Login failed! Verify user and password.');
		} else {
			setLoggedUser(response);
			rebuild('toDo');
		}
	}
}

///////////////////////////////////////////////////////////////////
// REGISTRATION PART
///////////////////////////////////////////////////////////////////

// Sign Up in ToDo system
function signUp(email,psw,fname,lname) {
	var nocache = 0;
	nocache = Math.random();

	http.open('GET', '/registration.php?email='+email+'&psw='+psw+'&fname='+fname+'&lname='+lname+'&nocache = '+nocache, true);
	http.onreadystatechange = signUpReply;
	http.send(null);
}
// Reaction on signUp 'over' state
function signUpReply() {
	if(http.readyState == 4 && http.status == 200) { 
		var response = http.responseText;
		if(response == 'exists') {
			alert('Registeration failed! User with such e-mail already exists.');
		} else if (response == 'success') {
			alert('Success');
			rebuild('signIn');
		} else {
			alert('Error acquired. Try again!');
		}
	}
}

///////////////////////////////////////////////////////////////////
// CANCEL CURRENT WORK SESSION
///////////////////////////////////////////////////////////////////
// Sign out from current user's session
function signOut() {
	updateBase();
	document.getElementById('loggedUserName').innerHTML = '';
	localStorage.removeItem('loggedUser');
	localStorage.removeItem('currentList');
	localStorage.setItem('mode','signIn');
	refresh();
}

// Update database with current data from To Do List when signing out
function updateBase() {
	var string = localStorage.getItem('currentList');
	var user = getLoggedUser();
	var nocache = 0;
	nocache = Math.random();

	http.open('GET', '/updatelistdata.php?id='+user.id+'&data='+string+'&nocache = '+nocache, true);
	http.onreadystatechange = updateBaseReply;
	http.send(null);
}
//
function updateBaseReply() {
	if(http.readyState == 4 && http.status == 200) { 
		var response = http.responseText;
		if(response == 'success') {
			alert('Data saved. Goodbye!');
		} else {
			
			alert('Error! Failed to save data: ' + response)
		}
	}
}

///////////////////////////////////////////////////////////////////
// BLOCK OF METHODS RELATED TO ACTIONS WITH TODO LIST
///////////////////////////////////////////////////////////////////

// Init current user's ToDo List
function initList(user) {
	// Add a "checked" symbol when clicking on a list item
	var list = document.querySelector('ul');
	list.addEventListener('click', function(ev) {
  		if (ev.target.tagName === 'LI') {
    	ev.target.classList.toggle('checked');
  		}
	}, false);

	var mas = JSON.parse(localStorage.getItem('currentList'));
	if (mas != null) {
		for (var i = 0; i < mas.length; i++) {
			newElement(mas[i].text,mas[i].checked)
		}
	} else {
		var nocache = 0;
		nocache = Math.random();

		http.open('GET', '/getlistdata.php?id='+user.id+'&nocache = '+nocache, true);
		http.onreadystatechange = initListReply;
		http.send(null);
	}
}
// Reaction on initList 'over' state
function initListReply() {
	if(http.readyState == 4 && http.status == 200) { 
		var response = http.responseText;
		if(response == '0') {
			alert('Load data error. Please, reloging!');
		} else if (response != '') {
			var mas = JSON.parse(response);
			for (var i = 0; i < mas.length; i++) {
				newElement(mas[i].text,mas[i].checked);
			}
		}
	}
}

// Creates new element in ToDo List
function newElement(value,state) {
	// Create ListItem element with input value
	var li = document.createElement("li");
	li.onclick = function() {
		var mas = JSON.parse(localStorage.getItem('currentList'));
		for (var i = 0; i < mas.length; i++) {
			if (mas[i].text == value) {
				if (mas[i].checked == 'true')
					mas[i].checked = 'false';
				else
					mas[i].checked = 'true';

				break;
			}
		}

		localStorage.setItem('currentList',JSON.stringify(mas));
	}
	var node = document.createTextNode(value);
	li.appendChild(node);

	// Check it's valid state
	if (value == '') {
		alert("You must write something!");
		return;
	}
	else {
	    document.getElementById("myUL").appendChild(li);
	}
	
	// Clean input space
	document.getElementById("myInput").value = "";

	// Create close button into new element
	var button_close = document.createElement("BUTTON");
	var txt = document.createTextNode("\u00D7");
	button_close.className = "close";
	button_close.appendChild(txt);
	li.appendChild(button_close);

	// Checking for clicked state
	if (state == 'true') {
		li.classList.add('checked');
	}

	// Make 'onclick' action to new button
	var buttons_close = document.getElementsByClassName("close");

	buttons_close[buttons_close.length-1].onclick = function() {
		var tmp = [];
		var mas = JSON.parse(localStorage.getItem('currentList'));
		for (var i = 0; i < mas.length; i++) {
			if (mas[i].text == value)
				continue;
			tmp.push(mas[i]);
		}
		mas = tmp;
		localStorage.setItem(JSON.stringify(tmp));

		var parent = this.parentElement;
		parent.style.display = 'none';
		}

	var obj = {
		text: value,
		checked: state
	}

	var mas = JSON.parse(localStorage.getItem('currentList'));
	if (mas != null)
		mas.push(obj);
	else {
		mas = [];
		mas.push(obj);
	}
	localStorage.setItem('currentList',JSON.stringify(mas));
}