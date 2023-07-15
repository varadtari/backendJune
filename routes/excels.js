const { Excel, ExcelSchema } = require("../models/excel");
const { Format, FormatSchema } = require("../models/format");
const express = require("express");
const { SkillSchema } = require("../models/skill");
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");







router.post("/insert", async (req, res) => {
  //app.use(bodyParser.urlencoded({extended:false}));
  const fileData=req.body.data; 
  console.log("backend",fileData);
 // fileData=XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
  try {
    //const Excel=new ExcelModel({fileData:fileData});
  Excel.insertMany(fileData,(err,data)=>{
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
router.post("/addskill", async (req, res) => {
  
  const Skill=req.body.skill;
  const Level=req.body.level; 
  console.log("backend",fileData);

  try {
  
  Excel.insertMany(fileData,(err,data)=>{
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

router.put("/updateUser/:userId",async (req, res) => {
  try {
    const user=await Excel.findByIdAndUpdate(req.params.userId,{...req.body},{new:true})
    if(!user) return res.status(404).send("User not found")
    res.send("User updated")  
} catch (error) {
  
}})
router.get("/", async (req, res) => {
  console.log("test");
  
  try {
    const excelData = await Excel.find();
    res.send({status:true,data:excelData});
  } catch (error) {
    res.send({status:false,error})
  }
});

router.get("/bydept", async (req, res) => {
  try {
    const excelData = await Excel.find({ Dept: req.query.dept });
  res.send({status:true,data:excelData});
  } catch (error) {
    
    res.send({status:false,error})
  }
});



router.get("/filter", async (req, res) => {
  try {
    let temp = {};
  const { query } = req;
  if (query.dept) {
    temp.Dept = query.dept;
  }
  
  if (query.fromDate && query.toDate) {
    temp.DateJoin = {
      $gte: new Date(new Date(req.query.fromDate).setHours(0o0, 0o0, 0o0)),
      $lt: new Date(new Date(req.query.toDate).setHours(23, 59, 59)),
    };
  }
  console.log("test", temp);
  const excelData = await Excel.find(temp);
  //   console.log("test1",genres)
  res.send({status:true,data:excelData});
    
  } catch (error) {
    res.send({status:false,error})
  }
  
}); 


router.get("/bydate", async (req, res) => {
  console.log("test", req);
  const genres = await Excel.find({
    DateJoin: {
      $gte: new Date(new Date(req.query.fromDate).setHours(0o0, 0o0, 0o0)),
      $lt: new Date(new Date(req.query.toDate).setHours(23, 59, 59)),
    },
  });
  //   console.log("test1",genres)
  res.send(genres);
});



// router.delete("/deleteskill/:id", async (req, res) => {
//   try {
//     const id= req.params.id;
//     const column=ExcelSchema.find()
//     console.log("skilld",column);
//           tempData=await Excel.deleteMany({_id:id});
//   res.send({status:true,data:tempData})
//   } catch (error) {
//     res.send({status:false,error})
//   }
// })


router.delete('/deleteSkill/:rowId/:columnId', (req, res) => {
  const rowId = req.params.rowId;
  const columnId = req.params.columnId;
    const collection = Excel;
    collection.updateOne(
      { _id: ObjectId(rowId) },
      { $pull: { skills: { _id: ObjectId(columnId) } } }, 
      (error, result) => {
        if (error) {
          console.error('Error deleting object from column', error);
          res.status(500).json({ error: 'Failed to delete object from column' });
        } else {
          res.json({ message: 'Object deleted from column successfully' });
        }

        
      }
    );
  });


  router.delete('/api/excels/:userId/:skillIndex', async (req, res) => {
  try {
    const userId = req.params.userId;
    const skillIndex = parseInt(req.params.skillIndex);

    // Fetch the user data from the database
    const user = await Excel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the skillIndex is valid
    if (skillIndex < 0 || skillIndex >= user.skills.length) {
      return res.status(400).json({ message: 'Invalid skill index' });
    }

    // Remove the skill at the specified index
    user.skills.splice(skillIndex, 1);

    // Save the updated user data
    await user.save();

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put("/check/:id", (req, res) => {
  const id = req.params.id;
  console.log("check",id);
  console.log("body",req.body)
  const { hasCheckbox } = req.body;

  Excel.findByIdAndUpdate(
    id,
    { hasCheckbox },
    { new: true },
    (err, updatedData) => {
      if (err) {
        console.error("Error updating checkbox state:", err);
        res.status(500).json({ error: "Failed to update checkbox state" });
      } else {
        console.log("Checkbox state updated successfully:", updatedData);
        res.json(updatedData);
      }
    }
  );
})




// router.put('/check/:id', (req, res) => {
//   // Extract the id from the request parameters
//   const id = req.params.id;

//   // Extract the employeeSignatures data from the request body
//   const { employeeSignatures } = req.body;

//   // Perform the necessary operations to save the employeeSignatures data
//   // to the database or perform any other relevant actions
//   // Example: Assuming you have a MongoDB collection named "excels",
//   // you can save the data as follows:
//   Excel.findOneAndUpdate(
//     { _id: id }, // Assuming you have a unique identifier field in your database documents
//     { employeeSignatures },
//     { new: true } // To return the updated document
//   )
//     .then((updatedDocument) => {
//       // Return a success response with the updated document
//       res.status(200).json(updatedDocument);
//     })
//     .catch((error) => {
//       // Return an error response if any error occurs
//       res.status(500).json({ error: 'An error occurred while saving the employee signatures.' });
//     });
// });

router.post('/format', async (req, res) => {
  // const { error } = validate(req.body); 
   // if (error) return res.status(400).send(error.details[0].message);
 
   const formatData=req.body.data;
   try {
     //const Excel=new ExcelModel({fileData:fileData});
   Format.insertMany(formatData,(err,data)=>{
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










module.exports = router;
