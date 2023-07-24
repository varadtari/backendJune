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
  const fileData = req.body.data;

  try {
    // Create an array to store unique data
    const uniqueData = [];

    for (const rowData of fileData) {
      // Check if the document with the same "EMP CODE" already exists in the database
      const existingDocument = await Excel.findOne({ "EMP CODE": rowData["EMP CODE"] });

      if (!existingDocument) {
        // If the document does not exist, add it to the uniqueData array
        uniqueData.push(rowData);
      } else {
        // If the document already exists, skip inserting it
        console.log(`Skipping duplicate entry with EMP CODE: ${rowData["EMP CODE"]}`);
      }
    }

    // Insert the unique data into the database using insertMany
    Excel.insertMany (uniqueData,{ ordered: false }, async(err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error inserting data");
      } else {
        console.log(data);
        const sortedData = await Excel.find({ _id: { $in: data.map(doc => doc._id) } }).sort({ createdAt: -1 }).exec();

        res.send(sortedData);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
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



// router.delete("/delete/:id", async (req, res) => {
//   const objectId = req.params.id;

//   try {
//     // Find the object by its _id and delete it
//     const deletedObject = await Excel.findByIdAndDelete(objectId);

//     if (!deletedObject) {
//       return res.status(404).json({ message: "Object not found" });
//     }

//     return res.status(200).json({ message: "Object deleted successfully" });
//   } catch (err) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });
router.delete("/delete", async (req, res) => {
  const objectIds = req.body.ids; // Assuming you pass the array of IDs in the request body as "ids"

  try {
    // Find the objects by their _ids and delete them
    const deletedObjects = await Excel.deleteMany({ _id: { $in: objectIds } });

    if (!deletedObjects || deletedObjects.deletedCount === 0) {
      return res.status(404).json({ message: "Objects not found" });
    }

    return res.status(200).json({ message: "Objects deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/updateUser4/:userId",async (req, res) => {
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


//  router.get('/format', (req, res) => {
//   // Retrieve the format number from the database
//   Format.findOne({}, (err, format) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       res.json({ formatNumber: format ? format.FORMAT_NO : null });
//     }
//   });
// });
router.get('/format', (req, res) => {
  // Retrieve the last format number from the database
  Format.findOne({})
    .sort({ _id: -1 }) // Sort by _id in descending order
    .limit(1) // Limit the result to one document
    .exec((err, format) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ formatNumber: format ? format.FORMAT_NO : null });
      }
    });
});

router.put("updateUser/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const { skills } = req.body;

    // Find the user by ID
    const user = await Excel.findByid(userid);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the skills field of the user
    user.skills = skills;

    // Save the updated user to the database
    await user.save();

    return res.json({ message: "Skills updated successfully" });
  } catch (error) {
    console.error("Error updating skills:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const excelData = await Excel.find().sort({ _id: -1 }); // Fetch all Excel data from the database, sorted by _id in descending order
    res.json(excelData); // Return the fetched data as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching Excel data from the database." });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Use your ExcelModel to find and delete the row with the specified _id
    await Excel.findByIdAndDelete(id);
    res.status(200).json({ message: "Row deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the row.", error: error.message });
  }
});
router.get('/departments', async (req, res) => {
  try {
    // Fetch all unique departments from the Excel model
    const departments = await Excel.distinct('Dept').exec();

    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put("/check", async (req, res) => {
  try {
    const { employeeSignatures } = req.body;

    // Use bulkWrite to perform multiple updates in a single API call
    const bulkOps = employeeSignatures.map(({ id, hasCheckbox }) => ({
      updateOne: {
        filter: { _id: id },
        update: { hasCheckbox },
      },
    }));

    // Perform bulk write operations to update the database
    await Excel.bulkWrite(bulkOps);

    return res.status(200).json({ success: true, message: "Checkbox state updated successfully." });
  } catch (error) {
    console.error("Error updating checkbox state:", error);
    return res.status(500).json({ success: false, message: "An error occurred while updating checkbox state." });
  }
});







module.exports = router;
