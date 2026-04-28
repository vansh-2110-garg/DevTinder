const adminAuth = (req,res,next)=>{
    console.log("admin auth check");
    const token="abc";
    const isAdminAuthorized= token==="abc";
    if(!isAdminAuthorized){
        res.status(401).send("not authorized");
    } else{
        next();
    }
}
const userAuth = (req,res,next)=>{
    console.log("user auth check");
    const token="xyz";
    const isUserAuthorized= token==="xyz";
    if(!isUserAuthorized){
        res.status(401).send("not authorized");
    } else{
        next();
    }
}

module.exports={
    adminAuth,
    userAuth,
};