const mongoose=require("mongoose")


const FormatSchema = new mongoose.Schema({
    FORMAT_NO: {
      type: String,
     
      
  },
 
 
});

  const Format=mongoose.model("Format",FormatSchema)
  exports.FormatSchema=FormatSchema
  exports.Format=Format