const User = require('../models/userModel');
const bcrypt = require('bcrypt');
// const randomstring = require('randomstring');

let message

const securePassword = async (password) =>{
    try{
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch(error){
        console.log(error.message);
    }
}

const loadLogin = async(req,res)=>{
    try{
        res.render('login',{message});
    }
    catch(error){
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try{  
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email});
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                if(userData.is_admin === 0){
                    res.render('login',{message:'Email and password is incorrect'});
                }else{
                    req.session.auser_id = userData._id;
                    res.redirect('/admin/home');
                }
            }else{
                res.render('login',{message:'Email and password is incorrect'});
            }
        }else{
            res.render('login',{message:'Email and Password is incorrect'});
        }
    }
    catch(error){
        console.log(error.message);
    }
}

const loadDashbord = async (req,res)=>{
    try{
        const userData = await User.findById({ _id: req.session.auser_id})
        res.render('home',{admin:userData});
    }
    catch(error){
        console.log(error.message);
    }
}

const adminLogout = async (req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin')
    }catch(error){
        console.log(error.message);
    }
}

// const adminDashbord = async(req,res)=>{
//     try{
//         const userData = await User.find({is_admin:0})
//         res.render('dashboard',{useres:userData})

//     }catch(error){
//         console.log(error.message);
//     }
// }

const newUserLoad = async(req,res)=>{
    try{
        res.render('newuser')

    }catch(error){
        console.log(error.message);
    }
}



//Adduser section staring
const addUser = async(req,res)=>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const password = req.body.password;
        const spassword = await  securePassword(password);
        const user = new User({
        name:name,
        email:email,
        mobile:mobile,
        password:spassword,
        is_admin:0,
     });
     const userData = await user.save();
     if(userData){
        res.redirect('/admin/dashbord')

     }else{
        res.render('newuser',{message:'somthing wrong'});
     }
    }catch(error){
        console.log(error.message);
    }
}
//end of  add user section 


//Edit section is start
const editUserLoad = async(req,res)=>{
    try{
        const id = req.query.id;
        const userData = await User.findById({_id:id});
        
        if(userData){
            res.render('edit-user',{user:userData})
        }else{
            res.redirect('/admin/dashboard')
        }
    }catch(error){
        console.log(error.message);
    }
}
//end of the edit section


//update section is start
const updateUser = async(req,res)=>{
    try{
        const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile}})
        res.redirect('/admin/dashboard')
    }catch(error){
        console.log(error.message);
    }
}

//Delete section is start
const deleteUser = async(req,res)=>{
    try{
        const id = req.query.id
        await User.deleteOne({_id:id});
        res.redirect('/admin/dashboard');

    }catch(error){
        console.log(error.messgae);
    }
}


//user serach section start
const adminDashbord = async (req, res) => {
    try {
      var search ='';
      if (req.query.Search){
        //   console.log(req.query.Search);
          search = req.query.Search
      }
      
      // const userData = await User.find({ is_admin: 0, });
      const userData = await User.find({
          is_admin:0,
          $or:[
              { name:{$regex :'.*'+search+'.*',$options:'i'}},
              { email:{$regex :'.*'+search+'.*',$options:'i'}},
          ]
      })
      console.log(userData);
      res.render("dashboard", { useres: userData });
    } catch (error) {
      console.log(error.message);
    }
  };

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashbord,
    adminLogout,
    adminDashbord,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUser,
    deleteUser,  
}