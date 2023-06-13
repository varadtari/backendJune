const { Skill } = require("../models/skill");
const express = require("express");
const router = express.Router();
router.get("/", async (req, res) => {
    
    try {
      const skillData = await Skill.find();
      console.log("skilldata",skillData);
      res.send({status:true,data:skillData});
      
    } catch (error) {
      res.send({status:false,error})
    }
  });

  router.post('/', async (req, res) => {
   // const { error } = validate(req.body); 
    // if (error) return res.status(400).send(error.details[0].message);
  
    const fileData=req.body.data;
    try {
      //const Excel=new ExcelModel({fileData:fileData});
    Skill.insertMany(fileData,(err,data)=>{
      if(err){
          console.log(err);
      }else{
          console.log(data);
      }
  })
    
    res.send("Inserted DATA");
    } catch (error) {
      res.send(error);
    }
  
    
  
  });
  
  router.get("/:id", async (req, res) => {
    try {
      const tempData= await Skill.find({dept:req.params.id})
    res.send({status:true,data:tempData})
    } catch (error) {
      res.send({status:false,error})
    }
    
  })
module.exports = router;