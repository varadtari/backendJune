const { Excel, ExcelSchema } = require("../models/excel");
const express = require("express");
const { SkillSchema } = require("../models/skill");
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

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
      $gte: new Date(new Date(req.query.fromDate).setHours(00, 00, 00)),
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
      $gte: new Date(new Date(req.query.fromDate).setHours(00, 00, 00)),
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


router.delete('/:rowId/:columnId', (req, res) => {
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










module.exports = router;
