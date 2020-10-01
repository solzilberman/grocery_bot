var express = require('express');
var bodyParser = require('body-parser');
const http = require('http');
var app = express();
var axios = require('axios');
var { SID, AUTH } = require("./config")

const accountSid = SID;
const authToken = AUTH;
const client = require('twilio')(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/message", function (request, response) {

    console.log(request.body.Body);
    var food = request.body.Body
    //response.send("<Response><Message>Hello</Message></Response>")
    if (food != "!list") {
        let res_string = "Added " + food + " to your list! 🍔"
        var date = new Date();
        let url = 'https://timeblocker-4dede.firebaseio.com/food_list_' + date.toDateString() + '.json'
        client.messages
            .create({
                body: res_string,
                from: '+12055743043',
                to: '+18472085541'
            })
            .then(message => axios.post(url, { "food": food }).then(res => console.log("added to db")));
    } else {
        let res_string = "Here are todays groceries..."
        var date = new Date();
        // let url = 'https://timeblocker-4dede.firebaseio.com/food_list_' + date.toDateString() + '.json'
        axios.get("https://timeblocker-4dede.firebaseio.com/food_list_Wed%20Sep%2030%202020.json")
            .then(res => {
                let gs = Object.values(res.data);
                let ls = "";
                for (let i = 0; i < gs.length; i++) {
                    ls += " " + gs[i].food
                }
                console.log(ls)
                let ret_s = "Here is todays list: " + ls
                client.messages
                    .create({
                        body: ret_s,
                        from: '+12055743043',
                        to: '+18472085541'
                    })

            })
    }


});




app.get("/", function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
});
const PORT = 3333;
http.createServer(app).listen(PORT, () => {
    console.log(`Express server listening on port ` + PORT);
});