const express = require("express");
const dbConnection = require("./config/db");
const routes = require("./routes/reviews");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(cors({origin:true,Credentials:true}))

//Db Connection
dbConnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",(req,res)=>res.send("Hellow Server is Running...."));
app.use("/api/reviews",routes)

const PORT = 8090; // Changed port to 8090

app.listen(PORT,() => console.log(`Server running on PORT ${PORT}`));