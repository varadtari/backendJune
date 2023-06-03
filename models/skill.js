const mongoose=require("mongoose")

const SkillSchema = new mongoose.Schema({
    skill_name: {
      type: String,
     // required: true,
      unique: true,
  },
  skill_level: {
    type: [{level:Number,name:String}],
   // required: true,
    
},
  dept: {
    type: String,
   // required: true,
  },

  
  
  });

  const Skill=mongoose.model("Skill",SkillSchema)
  exports.SkillSchema=SkillSchema
  exports.Skill=Skill