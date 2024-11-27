const express = require('express');
const router = express.Router();
const zod=require("zod");
require('dotenv').config();
const {User, Account}=require("../db");
const jwt= require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET;

const { authMiddleware } = require("../middleware")
const signupSchema=zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
    
})
router.post("/signup",async (req,res)=>{
    const {success}=signupSchema.safeParse(req.body);
    if (!success){
        return res.status(411).json({
            message:"Incorrect inputs",error: error.errors
        })
    }
    const existingUser =await User.findOne({
        username:req.body.username
    })
    if (existingUser){
        return res.status(411).json({
            message:"Email is already taken"
            
        })
    }
    const dbUser = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
    });
    const userId = dbUser._id;
    await Account.create({
        userId,
        balance: 1 + Math.random()*10000
    })
    const token = jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        message:"User created successfully",
        token: token
    })
})
const signinBody=zod.object({
    username:zod.string().email(),
    password:zod.string()
})
router.post("/signin",async (req,res)=>{
    const {success}=signinBody.safeParse(req.body)
    if (!success){
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    if (user){
        const token=jwt.sign({
            userId:user._id
        },JWT_SECRET);
        res.json({
            token:token
        })
        return;
    }
    res.status(411).json({
        message:"Error while logging in"
    })
})

const updateBody=zod.object({
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string(),
})
router.put("/me", authMiddleware, async (req,res)=>{
    const { success }=updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message:"Error while updating the information"
        })
    }
    await User.updateOne({ _id: req.userId}, req.body);

    res.json({
        message:"Updated successfully"
    })
})

router.get("/bulk", async (req,res)=>{
    const filter = req.query.filter || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const query={
        $or:[{
            firstName:{
                "$regex": filter, "$options": "i"
            }
        },{
            lastName:{
                "$regex": filter, "$options": "i"
            }
        }],
        _id: { "$ne": req.userId }
    };
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    const users = await User.find(query)
        .skip(skip)
        .limit(limit)
    res.json({
        user:users.map(user=>({
            username: user.username,
            firstName:user.firstName,
            lastName: user.lastName,
            _id: user._id
        })),
        totalPages:totalPages
    })
});
router.get("/me",authMiddleware,async (req,res)=>{
    const user= await User.findById(req.userId);
    res.json({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password

    })
});
module.exports = router;