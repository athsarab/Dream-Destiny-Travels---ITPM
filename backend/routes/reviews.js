const express = require("express");

const router = express.Router();

const Review = require("../models/review");

router.get("/test", (req, res) => res.send("Review routes working"));

router.post("/",(req,res) => {
    Review.create(req.body)
    .then(()=> res.json({msg:"Employee added succesfully"}))
    .catch(()=> res.status(400).json({msg:"Employee adding faild"}));
});

router.get("/",(req,res)=>{
    Review.find()
    .then((Review)=>res.json(Review))
    .catch((err)=>res.status(400).json({msg:"No reviews"}))
});

// router.get("/:id",(req,res)=>{
//     Review.findById(req.params.id)
//     .then((Review)=>res.json(employees))
//     .catch(()=>res.status(400).json({msg:"cannot find this"}))
// });

router.put("/:id", (req, res) => {
    Review.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json({ msg: "Updated Successfully" }))
        .catch(() => res.status(400).json({ msg: "Update Failed" }));
});

router.delete("/:id", (req, res) => {
    Review.findByIdAndDelete(req.params.id)
        .then(() => res.json({ msg: "Deleted successfully" }))
        .catch(() => res.status(400).json({ msg: "Cannot be deleted" }));
});


module.exports = router;
