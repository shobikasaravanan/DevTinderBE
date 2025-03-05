const auth = (req, res, next) => {
    console.log("let's authorize")
    const token = 'xyz'
    const isAuthorized = token === 'xyz';
    if(isAuthorized){
        console.log("Authorized token")
        // res.status("200").send('user authorized')
        next()
    } else {
        console.log("Authorization failed")
        res.status("401").send('unauthorized')
    }
}  

module.exports= {
    auth
}