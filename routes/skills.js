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
  
    let skill = new Skill({...req.body});
    skill = await skill.save();
    
    res.send(skill);
  });
  
module.exports = router;