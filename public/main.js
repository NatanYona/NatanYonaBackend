const socket = io();

if(getParameterByName('username') == '' || getParameterByName('username') == null){
    window.location.replace("/login.html");
}

let messages = []

function sendNewMessage(){
    const message = document.querySelector('#message').value;
    const username = getParameterByName('username');
    if(!message || !username){
        alert('Flaco te faltan datos');
        return
    }
    const messageObject = {
        author:{
            name: "",
            id: socket.id,
            lastName: '',
            age: "",
            username: username,
            avatar: ""
        },
        text: message
    }
    socket.emit('NEW_MESSAGE_TO_SERVER', messageObject);
    document.querySelector('#message').value = '';
}

function updateMessages(data){
    let messagesToHtml = ''
    data.forEach(i => {
        messagesToHtml = messagesToHtml + `<li><b class="text-primary fs-bold">${i.author.username}: </b><b class="text-warning">${Date()}</b>: <i class="text-success">${i.text}</i></li>`
    })
    document.querySelector('#messagesList').innerHTML = messagesToHtml;
}

//format message format 

socket.on('UPDATE_DATA', (data) => {
    messages = data
    updateMessages(data)
    console.log(data)
});

socket.on('NEW_MESSAGE_FROM_SERVER', (data) => {
    messages.push(data)
    updateMessages(messages)
});

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}