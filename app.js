const express = require("express");
const bodyParse = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public")); //for static files
app.use(bodyParse.urlencoded({extended :true}));

app.get("/", (req,res) =>{
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", (req,res) => {
    
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    console.log(firstName, lastName, email);

    const data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }

    //to send it it the server (mailchamp)
    const post_jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/f7ee0325eb";


    //set up the options
    const options = {
        method : "POST",
        auth : "me:918b500ed179471160007a1fdee62087-us21"
    };



    //set up the request
    const post_request = https.request(url, options, (response)=>{
        response.on("data", (chunk) => {
            console.log(JSON.parse(chunk));
            const jsonChunk = JSON.parse(chunk);
            console.log("================");
            
            if(response.statusCode === 200){
                const error_code = jsonChunk.errors[0];
                console.log(error_code);

                if (!error_code) {

                    res.sendFile(__dirname + "/success.html");
               }
               else {
                    res.sendFile(__dirname + "/failure.html");
               }
            } else{
                res.send("Key problem");
            }
        })

    })

    post_request.write(post_jsonData);
    post_request.end();

})

app.post("/failure",(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server running on port 3000");
})




