const express = require("express");
const  mainRouter  = require("./route/index");

const app = express()

app.use(express.json());

app.use('/api/v1',mainRouter)

// api/v1/user/signin
// api/v1/user/signup
// api/v1/user/course
app.listen(3000)






