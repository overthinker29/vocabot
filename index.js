
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var words = require('./words')
var app = express()
//var token = "EAAPZBXjOvZBmwBAMPkIKvyfxfPcY1ct4a8WnZBvB4hlLbWzLGaTdZBcZCqYZCbyeiUfDEY2Go77uI0UeXxBRap3JNb5sI43H77TOtIdbZABabgpN0VfTGXukV321ZAPwBDFi82imo2Nk2YjVmfgrZBPE74c0kLS5GVGymXVeVTmv8qAZDZD"
var token = "EAAPZBXjOvZBmwBAHmK8fjjFnVsIury78jZA5ZBRfXHiYsBW4d25weKRFeaMa9uxLYVPnhxrDUgvQZCTwuZAGU4uw3pcid1CNZAheqGsoXth1eDoJR4SZAC4yu9ExXME9tv2znouBYnijGmfpYuTYuSDzk29Y4fxLpCf4l5mmy4zFUQZDZD"

app.set('port', (process.env.PORT || 3001))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// for Facebook verification
app.post('/webhook/', function (req, res) {
    var messaging_events = req.body.entry[0].messaging
                
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i]
        // console.log("==========================================================");
        // console.log(event);
        // console.log("==========================================================");
        var sender = event.sender.id
        if(event.postback){
            fetchPostbackReply(sender, event.postback.payload)
        }
        else if (event.message && event.message.text) {
            fetchReply(sender, event.message)
        }
    }
    res.sendStatus(200)
})

function fetchPostbackReply(sender,payload){
    var response=[]
    switch(payload){
        case 'FIRST_MESSAGE':
            var image = "https://media.giphy.com/media/3o6Ztp9LqQSsIwzcL6/giphy.gif"
            response.push(getTextComponent("Hi there!\nI am Vocabot :)"));
            response.push(getImageComponent(image));
            response.push(getTextComponent("I am here to improve your vocabulary!"));
            setTimeout(sendDefaultReply.bind(this,sender),5000);
            break;
        case 'RANDOM_WORD':
            response = randomWord(sender)
            break;
        case 'ABOUT_ME':
            response.push(getTextComponent("I AM YOUR GOD!!\nBOW DOWN TO ME"));
            var image = "https://media.tenor.co/images/a8f97e0a451b640230e7a04e80262c30/raw"
            response.push(getImageComponent(image));
            response.push(getTextComponent("PS: Vaibhav here!\nNice to meet you"));
            response.push(getTextComponent("Check me out at vaibhavnachankar.com"));
            setTimeout(sendDefaultReply.bind(this,sender),5000);
            break;
        default:
            break
    }
    sendTextMessage(sender, response)
}

function randomWord(sender){
    var key = Math.floor((Math.random() * words.length-1) + 1);
    var image = words[key]['images'][Math.floor((Math.random() * words[key]['images'].length-1) + 1)]
    var response=[];
    response.push(getTextComponent(capitalize(words[key]['word'])+'\n'));
    
    response.push(getImageComponent(image));
    response.push(getTextComponent("def:\n"+capitalize(words[key]['def'])));
    setTimeout(sendDefaultReply.bind(this,sender),5000);
    return response   
}

function sendTextMessage(sender, response){
    for(var i in response){
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token:token},
            method: 'POST',
            json: {
                recipient: {id:sender},
                sender_action:"typing_on"
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending typing: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
        })


        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token:token},
            method: 'POST',
            json: {
                recipient: {id:sender},
                message: response[i],
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
        })


        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token:token},
            method: 'POST',
            json: {
                recipient: {id:sender},
                sender_action:"typing_off"
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending typing: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
        })

    }
}

function fetchReply(sender, message){
    if(message.quick_reply){
        response = getQuickReply(sender,message);
    }
    else{
        response = getDefaultReply();
    }
    sendTextMessage(sender, response)
}

function sendDefaultReply(sender){
    var response = []
    response = getDefaultReply();
    console.log("IN DEFAULT SEND",sender)
    sendTextMessage(sender, response)
}


function getDefaultReply(){
    var replyList = [
        {'title':'Show a random word','payload':'WORD'},
        {'title':'Too bored! :(','payload':'IGNORE'},
    ]
    var messages = [
        'Why don\'t you learn a new word today?',
        'Don\'t be shy.\nYou can do this!'
    ]
    var replyText = messages[Math.floor((Math.random() * messages.length-1) + 1)]
    var response=[];
    response.push(quickReplyComponent(replyText,replyList))
    return response;
}


function getQuickReply(sender, message){
    var quickReply = message.quick_reply;
    var response = []
    switch(quickReply.payload){
        case 'WORD':
            response = randomWord(sender)
            break;
        default:
            response = getDefaultQuickReply(sender)
            break;
    }
    return (response);
}


function getDefaultQuickReply(sender){
    var response = []
    var replyList = [
        {'title':'Give me a Word','payload':'WORD'},
        {'title':'Naaah!','payload':'IGNORE'},
    ]

    var response = [];
    var messages = [
        'That was rude :|',
        'Whatever!'
    ]
    var replyText = messages[Math.floor((Math.random() * messages.length-1) + 1)]

    response.push(quickReplyComponent(replyText,replyList))
    response.push(getImageComponent('http://media0.giphy.com/media/M3qYJt4TnyDL2/giphy.gif'))
    setTimeout(sendDefaultReply.bind(this,sender),5000);
    return response;
}

function quickReplyComponent(text,replyList){
    var quickReplies = [];
    for(var i in replyList){
        quickReplies.push({
            "content_type":"text",
            "title":replyList[i]['title'],
            "payload":replyList[i]['payload']
        })
    }
    return {
        "text":text,
        "quick_replies":quickReplies
    }
}


function getTextComponent(text){
    return {"text":text}
}

function getImageComponent(url){
    return { 
        attachment:{
            type:"image",
            payload:{
                url:url
            }
        }
    }
}


function capitalize(s)
{
    return s[0].toUpperCase() + s.slice(1);
}


// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
