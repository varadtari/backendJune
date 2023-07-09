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
  readyForValidation: {
    type: Boolean,
    //required: true,
  },
  validated: {
    type: Boolean,
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

  skills: {
    type: [{level:String,skill:String}],
   required: true,
    
},
  });

  const Excel=mongoose.model("Excel",ExcelSchema)
  exports.ExcelSchema=ExcelSchema
  exports.Excel=Excel