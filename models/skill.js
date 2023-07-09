const mongoose=require("mongoose")
const { Excel, ExcelSchema } = require("../models/excel");

const SkillSchema = new mongoose.Schema({
    skill_name: {
      type: String,
     required: true,
      unique:true,
  },
  skill_level: {
    type: [{level:String,name:String}],
   required: true,
    
},
  Dept: {
     type:String,
    ref: 'Excel'
   // required: true,
  },
 
});

  const Skill=mongoose.model("Skill",SkillSchema)
  exports.SkillSchema=SkillSchema
  exports.Skill=Skill