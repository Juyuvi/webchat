let clientId
let selfID




btnConnect = document.getElementById("btnConnect")
selfIDform = document.getElementById("selfID")
mensagemForm = document.getElementById("mensagem")
btnEnviarMsg = document.getElementById("enviarMsg")
receiverIdForm = document.getElementById("userID")
msgDisplay = document.getElementById("msgs")
msgInterface = document.getElementById("msgInterface")
warningDiv = document.getElementById("warningDiv")


btnEnviarMsg.addEventListener("click", sendMsg)



msgInterface.classList.add("hidden")





selfIDform.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      btnConnect.click();
    }
  });

  mensagemForm.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      btnEnviarMsg.click();
    }
  });



btnConnect.addEventListener('click', () => {
    socket = new WebSocket("ws://192.168.15.9:8080")
    
    
    tempSelfID = selfIDform.value
    selfID = tempSelfID
    
    btnConnect.disabled = true
    btnConnect.innerHTML = "conectado"
    selfIDform.disabled = true
    selfIDform.readonly = "readonly"
    msgInterface.classList.remove("hidden")

    socket.onmessage = onMessage
    socket.onopen = function(event){}
    socket.onclose = onClose
    socket.onerror = () => {
        returnDisconnected("Erro de conexão")
    }
})

function sendUserID(){
    let payload = {
        "tag": "userIDInform",
        "clientId": clientId,
        "userID": selfID
    }

    console.log(selfID)

    socket.send(JSON.stringify(payload))
}


function fillWarnDiv(warn){
    warningDiv.innerHTML = "<div class='alert alert-danger alert-dismissible fade show' id='userWarn' role='alert'> <strong>"+ warn +"</strong> <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"
}

 function cleanWarnDiv(){
    warningDiv.innerHTML = ""
 }


function onMessage(msg){
    const data = JSON.parse(msg.data)

    switch(data.tag){

        case 'connected':
                cleanWarnDiv()
                clientId = data.clientId
                sendUserID()
                break

        case "receive":
            
            const node = document.createElement("p")
            const textnode = document.createTextNode(data.content)
            node.appendChild(textnode)
            document.getElementById("chatBox").appendChild(node)
            break

        case "error":
            fillWarnDiv(data.error)
            break
            
    }
}

function onClose(reason){
    
    if (reason.reason == "username unavailable"){
        returnDisconnected("Nome de usuário indisponível")
        
    }
}



function returnDisconnected(warn){
    fillWarnDiv(warn)
    btnConnect.disabled = false
    btnConnect.innerHTML = "Conectar"
    selfIDform.disabled = false
    selfIDform.readonly = ""
    msgInterface.classList.add("hidden")
}

function sendMsg() {
    
    let txt = mensagemForm.value
    let user = receiverIdForm.value

    document.getElementById("mensagem").value = ""

    const payload = {
        "tag": "sendmsg",
        "clientId": clientId,
        'user': user,
        'content': txt
    }
    console.log("supostamente enviado")
    socket.send(JSON.stringify(payload))
    


}