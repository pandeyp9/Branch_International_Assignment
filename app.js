const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

dotenv.config({ path: "./.env" });

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Database Connected");
});
mongoose.connection.on("error", (err) => {
  console.log("Error in database connection", err);
});

app.use("/", require("./routes/indexRoutes"));

require("./models/AgentModel");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
