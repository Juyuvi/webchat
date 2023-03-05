var clientIdList = new Array()









const http = require('http').createServer().listen(8080, console.log("servidor iniciado, ouvindo a porta 8080!"))
const server = require("websocket").server



const socket = new server({"httpServer": http})

socket.on("request", (req)=>{
    const connection = req.accept(null, req.origin)
    connection.on('open', connectionHandler)
    connection.on('message', messageHandler)

    // connection.close(1000, "username unavailable")

    const clientId = idGenNumber();

    clientIdList.push({"clientId": clientId,"connection": connection})
    connection.send(JSON.stringify({
        "tag": "connected",
        "clientId": clientId
    }))
})



function idGenNumber(){

    let result = ''
    const characters = '0123456789'
    let counter = 0
    for(let i = 0; i < 7; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
      result = parseInt(result)
    }
    return result
}

function findClientIndexByUserID(userID){
  index = -1 // retorna -1 se não encontrado
  for(let i = 0; i < clientIdList.length; i++){
    if (clientIdList[i].userID == userID){
      index = i
    }
  }
  return index
  
}

function findClientIndexByClientId(clientId){
  index = -1 // retorna -1 se não encontrado
  
  for(let i = 0; i < clientIdList.length; i++){
    if (clientIdList[i].clientId == clientId){
      index = i
    }
    
  }
  return index
  
}

function connectionHandler(){
  
}


function messageHandler(message){
  const msg = JSON.parse(message.utf8Data)


  switch (msg.tag){
    case "connect":
      console.log("conectado com sucesso. ID do User:'" + msg.userID + "'. clientID: '" + msg.clientId + "'.")
      break

    case "userIDInform":

      if ((findClientIndexByUserID(msg.userID) == -1 ) && (msg.userID != "")){
        console.log("Conectado com sucesso. ID do User:'" + msg.userID + "'. clientID: '" + msg.clientId + "'.")
        index = findClientIndexByClientId(msg.clientId)
        clientIdList[index].userID = msg.userID
      }
      else{
        index = findClientIndexByClientId(msg.clientId)
        clientIdList[index].connection.close(1000, "username unavailable")
      }
      break

    case "sendmsg":
      sender = clientIdList[findClientIndexByClientId(msg.clientId)]

      if ((findClientIndexByUserID(msg.user) == -1) || (sender.userID == msg.user)){
        

        senderPayload = {
          "tag": "error",
          "error": "Usuário inexistente"
        }

        sender.connection.send(JSON.stringify(senderPayload))
      }

      else{
        
        receiver = clientIdList[findClientIndexByUserID(msg.user)]
  
        receiverPayload = {
          "tag": "receive",
          "content": sender.userID + " -> Eu: " + msg.content
        }
        senderPayload = {
          "tag": "receive",
          "content": "Eu -> " + receiver.userID + ": " + msg.content
        }
  
        receiver.connection.send(JSON.stringify(receiverPayload))
        sender.connection.send(JSON.stringify(senderPayload))
      }
      break
      

  }

}


//console.log(idGenNumber())