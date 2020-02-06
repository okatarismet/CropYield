// module.exports = (req,res,next) =>{
//     req.form.complete(function(err, fields, files) {
//         if (err) { next(err); }
//         else {
//         console.log(fields);
//         console.log('---------------');
//         console.log(files);
//         res.redirect(req.url);
//         }
//         });
//     const token = req.get('token')
//     if(!token){
//         console.log('Your header has to contain Authorization field!')
//         return res.status(400).json({
//             message: "Your body has to contain 'token' field!"
//         });
//     }
//     if(token == "black55"){
//         console.log("Auth succesful");
//         next();
//     }else{
//         console.log('Auth failed!')
//         return res.status(401).json({
//             message: "Auth failed"
//         });
//     }
// }