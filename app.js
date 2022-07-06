const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const shortid = require("shortid");
const app = express();

mongoose.connect("mongodb+srv://admin-raunak:raunak7061110706@cluster0.u14hi.mongodb.net/linkDB");
const listSchema = new mongoose.Schema({
  full: { type: String, required: true },
  short: { type: String, required: true},
  clicks: { type: Number, required: true, default: 0 },
});
const List = mongoose.model('List', listSchema);
//set engine for ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("index");
});
app.get('/:customRouteName', function(req, res){
    const customRouteName = req.params.customRouteName;
    res.render(customRouteName);
});
app.post("/", function (req, res) {
  const long_link = req.body.name1;
  const short_link = req.body.name2;
  const list = new List({full: long_link, short: short_link});
  list.save();
  res.send("Link Successfully Created!!!")
});
app.post("/short", function(req, res){
    const short_link = req.body.name2;
    List.findOne({short: short_link}, function(error, list){
        if(error){
            res.send(error);
        }else{
            // res.redirect(list);
            if(list == null){
                res.send("Wrong link. Please check and try again");
            }else{
                res.redirect(list.full);
            }
        }
    }) 
})
app.post("/delete", function(req, res){
  const short_link = req.body.name3;
  List.findOne({short: short_link}, function(error, list){
    if(error){
        res.send(error);
    }else{
        if(list == null){
            res.send("No such short URL found!!!");
        }else{
          List.deleteOne({short: short_link}).then(function(){
            res.send("Data deleted");
          }).catch(function(error){
                res.send("No such data found");
              });
        }
    }
})
});
let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port, function () {
  console.log("Server is running at port 3000.");
});
