const mongoose=require("mongoose")

const ExcelSchema = new mongoose.Schema({
    "SL NO": {
      type: Number,
     // required: true,
      // unique: true,
  },
  DOJ: {
    type: String,
    //required: true,
  },
  DateJoin:{
    type:Date
   },
  "EMP CODE": {
      type: Number,
      //required: true,
      unique:true,
  },
  "EMPLOYEE NAME": {
    type: String,
    //required: true,
  },
  
  "FATHER NAME": {
    type: String,
    //required: true,
  },
  EDUCATION: {
    type: String,
    //required: true,
  },
 
  Dept: {
    type: String,
   // required: true,
  },
  CONTRACTOR: {
    type: String,
    //required: true,
  },
  TRAINER: {
    type: String,
    //required: true,
  },
  skills: {
    type: [{level:String,skill:String,approve:Boolean,approve2:Boolean}],
   required: true,
    
},
 hasCheckbox:{
  type:Boolean
 },
 createdAt: {
  type: Date,
  default: Date.now,
},



  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
  
  );

  const Excel=mongoose.model("Excel",ExcelSchema)
  exports.ExcelSchema=ExcelSchema
  exports.Excel=Excel