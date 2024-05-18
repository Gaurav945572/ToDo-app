const jwt = require("jsonwebtoken");
let {jwtPassword} = require("../config");


function UserMiddleware(req,res,next){
    let token=  req.headers.authorization; //Bearer bgdkgogj456etksngkdnhykernykeynketneyreruoryudgw
    let arr = token.split(" ");
    const jwtToken = arr[1];
    const decodeToken = jwt.verify(jwtToken,jwtPassword);
    let decodedUsername = decodeToken.username;
    if(decodedUsername){
        req.username = decodedUsername; //this will send the data to next middleware
        next();
    }
    else{
        res.status(404).json({
            "message":"wrong token",
        })
    }
}


module.exports = {UserMiddleware};