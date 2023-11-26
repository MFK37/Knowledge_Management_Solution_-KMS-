
const express = require('express'); // server
const mysql = require('mysql'); //db
const bodyParser = require('body-parser'); // parser
const cors = require('cors');

const multer = require('multer') // For uploading Files !
const path = require('path') // For getting the path of the file !
const admzip = require('adm-zip');// For compress all the files to a single zip file 
const fs = require('fs');

const nodemailer = require('nodemailer');//
const session = require('express-session');//
const { Store } = require('express-session');//
const cookieParser = require("cookie-parser");//
const decompress = require("decompress"); // To unzip the files 




// Creating the file upload functions by multer middleware : 
const storage = multer.diskStorage({
    destination: (req, file, cb) => { // cb = CallBack Function , that will be called 
        cb(null, 'Files') // First arg is the errors , second is the destination of the file ..
    },
    filename: (req, file, cb) => {
        // console.log(file)
        // cb(null, Date.now() + path.extname(file.originalname))
        cb(null, file.originalname)
    },

});
const upload = multer({ storage: storage });

const app = express();

const store = new session.MemoryStore();


app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(cookieParser());

app.use(session({
    secret: 'secret-key',
    resave: false,
    key: "userid",
    saveUninitialized: false,
    cookie: {
        expires: 3000000,
    },
    store
}
))

var otp;
var userSession;
// app.use(express.static("./public"))

// Back - End 

const db = mysql.createPool({ // To db to db
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'university',
    // host: 'sql7.freesqldatabase.com',
    // user: 'sql7588558',
    // password: 'qhukcHZRPY',
    // database: 'sql7588558'
});

// app.use(bodyParser.urlencoded({ extended: true })); // utf-8
// app.use(cors());
app.use(express.json()); // its important to load the data , we should write it every time
app.get('/', (req, res) => {
    res.send("Hello, Nawaf! Welcome Back ");

})

// Start Nawaf Work .. 
app.post('/api/insert/file_header', upload.array('files'), (req, res) => { // To upload the data to the database by function "POST" 
    const Creator = req.session.user[0].user_name;
    const Creator_id = parseInt(req.session.user[0].user_id);

    const filename = req.body.filename;
    const fileBriefDesc = req.body.fileBriefDesc;
    const fileDesc = req.body.fileDesc;
    const tags = req.body.fileTags; // We should use the same name that we use in the client(Front-End)

    var date_ob = new Date();
    var date = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var hours = date_ob.getHours();
    var minutes = date_ob.getMinutes();
    var seconds = date_ob.getSeconds();

    var dateNow = year + "/" + month + "/" + date + " " + hours + ":" + minutes + ":" + seconds


    const query = "INSERT INTO file_header (name, brief_desc , description, tags, Creator , Creator_id, date) VALUES (?,?,?,?,?,?,?);"
    db.query(query, [filename, fileBriefDesc, fileDesc, tags, Creator, Creator_id, dateNow], (err, result) => { // db. execute
        if (err) {
            console.log('err to query', err);
            return res.send("Wrong")
        };
        const q2 = `UPDATE file_header SET header_id = ${result.insertId} WHERE file_id = ${result.insertId}`
        db.query(q2, (err, r) => {
            if (err) {
                console.log('err to query', err);
                return res.send("Wrong")
            };
            res.send("Inserted Successfully");
        })
    })
})


app.post('/api/insert/file_header/:title/:id', (req, res) => { // To upload New Release
    const title = req.params.title;
    const id = req.params.id;
    const Creator = req.session.user[0].user_name;
    const Creator_id = parseInt(req.session.user[0].user_id);
    const fileDesc = req.body.fileDesc; // We should use the same name that we use in the client(Front-End)
    const fileBriefDesc = req.body.fileBriefDesc;
    const tags = req.body.fileTags; // We should use the same name that we use in the client(Front-End)

    var date_ob = new Date();
    var date = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var hours = date_ob.getHours();
    var minutes = date_ob.getMinutes();
    var seconds = date_ob.getSeconds();

    var dateNow = year + "/" + month + "/" + date + " " + hours + ":" + minutes + ":" + seconds


    const query = `SELECT MAX(release_id) AS Highest_release from file_header WHERE header_id = ${id}`

    db.query(query, (err, result1) => {
        if (err) return console.log('err to query 1', err);
        const query2 = "INSERT INTO file_header (name, description, brief_desc , tags, Creator , release_id , header_id , Creator_id,date) VALUES (?,?,?,?,?,?,?,?,?);"
        db.query(query2, [title, fileDesc, fileBriefDesc, tags, Creator, result1[0].Highest_release + 1, id, Creator_id, dateNow], (err, result2) => {
            if (err) return console.log('err to query 2', err);
            console.log("Inserted the new release Successfully");
        })
    })
    res.send("Inserted Successfully");
})


app.get('/api/get/file_header', (req, res) => { // To get all File header data
    const query = "SELECT * FROM file_header;"
    db.query(query, (err, result) => {
        if (err) return console.log("There's an error");
        // console.log("I'm here !!!");
        res.send(result);
    })
})
app.get('/api/get/file_header/release', (req, res) => { // To get all File header data
    const query = "SELECT * FROM file_header WHERE release_id = 1;"
    db.query(query, (err, result) => {
        if (err) return console.log("There's an error");
        res.send(result);
    })
})

app.get('/api/get/file_header/search/:filename', (req, res) => { // To get the searched keyword and send it back to the Front-End
    const filename = req.params.filename;
    const query = `SELECT * FROM file_header WHERE (name LIKE '%${filename}%' OR description LIKE '%${filename}%' 
    OR tags LIKE '%${filename}%') AND release_id = 1;` // i do it like this so the new Versions will not appear , it will appear only in the main File .
    db.query(query, (err, result) => {
        if (err) return console.log("There's an error", err);
        // console.log(result);
        res.send(result);
    })

})


// Get a specific element ! 

app.get('/api/get/file_header/:id', (req, res) => { // To get a single data
    const id = req.params.id;
    // const query = `SELECT s.user_name,s.entity_name , f.* FROM file_header as f,users as s WHERE f.header_id = ${id} and f.release_id > 1 ;`
    const query = `SELECT * FROM file_header WHERE header_id = ${id} and release_id > 1 ;`

    db.query(query, (err, result) => {
        if (err) return console.log("There's an error in file id get function");
        // console.log(result);
        res.send(result);
    })

})

app.get('/api/get/file_header/:id/:version_id', (req, res) => { // To get a single data
    const id = req.params.id;
    const version_id = req.params.version_id;
    // const superUserQuery = "SELECT name,entity_name FROM superuser where superUser_id = 1";
    // const query = `SELECT * FROM file_header WHERE file_id = ${id};`
    // const query = `SELECT s.user_name,s.entity_name , f.* FROM file_header as f, users as s WHERE f.file_id = ${id} and f.release_id = ${version_id};`
    const query = `SELECT f.* FROM file_header as f WHERE f.header_id = ${id} and f.release_id = ${version_id};`

    db.query(query, (err, result) => {
        if (err) return console.log("There's an error in version id get function");
        // console.log(result);
        res.send(result);
    })

})

app.get('/api/get/Myuploads', (req, res) => { // To get all the uploaded files

    const Creator_id = req.session.user[0].user_id;

    const query = `SELECT * FROM file_header WHERE Creator_id = ${Creator_id};`

    db.query(query, (err, result) => {
        if (err) return console.log("There's an error in My Uploads !! get function");
        res.send(result);
    })
})

app.get('/api/get/Profile_uploads/:Creator_id', (req, res) => { // To get all the uploaded files

    const Creator_id = req.params.Creator_id;

    const query = `SELECT * FROM file_header WHERE Creator_id = ${Creator_id};`

    db.query(query, (err, result) => {
        if (err) return console.log("There's an error in My Uploads !! get function");
        res.send(result);
    })
})


// Test For uploading files !
app.post('/api/upload', upload.array('files'), (req, res) => { // To uplaod a file or img , etc.. upload.array('files')

    const zip = new admzip(); // package to zip files
    console.log(req.files) // just to see the file information
    if (req.files.length === 0) return console.log("Erororr in list");
    req.files.forEach(file => { // For loop to each file element come from the front end
        console.log(file.path)
        zip.addLocalFile(file.path) // or addLocalFile .., to add it locale in the server of local computer
        fs.unlink(file.path, (err) => { if (err) return console.log("ErooRRR !! ", err) });
    })
    const filePath = "Files/" + Date.now() + "output.zip" // this will be the src .. , IT's important to change it bc we can have two users upload it the same time
    fs.writeFile(filePath, zip.toBuffer(), (err) => {
        console.log("Error to wrtie file ! ", err)
    });

    const query = 'INSERT INTO file (name) VALUES (?);'
    db.query(query, filePath, (err, result) => {
        if (err) return console.log("There's an error");
    })
    res.send("File Uploaded !")
})
app.get('/files/:id', (req, res) => { // To download a file or img , etc..

    const id = req.params.id;
    const query = 'SELECT name FROM file WHERE fileID = ?;'
    db.query(query, id, (err, result) => {
        if (err) return console.log("ERROR IN UPLOADING A FILE !", err)
        console.log(result)
        res.download(`${result[0].name}`)
    })
})

app.get(`/api/getFileContent/:id`, (req, res) => {
    // const zip = new admzip(); // package to zip files
    const id = req.params.id;
    const arr = [];
    // const hid = req.params.header_id;

    // console.log(dateNow);

    // const id = "50";
    const query = `SELECT name FROM file WHERE fileID = ${id};`
    var fileName = ""
    var extenstion = "";
    db.query(query, (err, result) => {
        if (err) {
            console.log("Errooo in the query !")
            return res.send("There's no file !")
        }
        fileName = result[0].name.toString();
        // console.log(fileName);
        decompress(`${fileName}`, "dist")
            .then((files) => {
                // console.log(files);
                files.map((val) => {
                    extenstion = val.path.split('.')[1];
                    if (extenstion === "png" || extenstion === "pdf" || extenstion === "jpeg" || extenstion === "gif" || extenstion === "tiff" || extenstion === "jpg" || extenstion === "ico" || extenstion === "zip" || extenstion === "rar" || extenstion === "mp4" || extenstion === "mp3" || extenstion === "svg") {
                        arr.push({ 'path': val.path, 'data': "Sorry , We don't support this type of files yet." });
                    }
                    else {
                        arr.push({ 'path': val.path, 'data': val.data.toString() });
                    }
                })
                res.send(arr)
            })
            .catch((error) => {
                console.log(error);
            });
    })


})

// End Nawaf Work !

// Start Mansour Work .. 
app.get("/api/give_permission/:user_id", (req, res) => {
    // const id = req.body.id;
    var id = req.params.user_id;
    var role = "Superuser";
    var sqlRole = `SELECT user_role from users where user_id = "${id}"`;
    var sql = `UPDATE users SET user_role = "${role}" WHERE user_id = "${id}"`;

    db.query(sqlRole, (err, result) => {
        if (err) throw (err);

        var currentRole = result[0].user_role;
        console.log(result[0].user_role);

        if (currentRole == 'User') {
            db.query(sql, (err, result) => {
                if (err) throw (err);
                console.log('Success!');
                res.send("Success")
            })
        } else console.log("Error!");
    })
})

app.get("/api/remove_permission/:user_id", (req, res) => {
    // const id = req.body.id;
    var id = req.params.user_id;
    var role = "User";
    var sqlRole = `SELECT user_role from users where user_id = "${id}"`;
    var sql = `UPDATE users SET user_role = "${role}" WHERE user_id = "${id}"`;

    db.query(sqlRole, (err, result) => {
        if (err) throw (err);

        var currentRole = result[0].user_role;
        console.log(result[0].user_role);

        if (currentRole == 'Superuser') {
            db.query(sql, (err, result) => {
                if (err) throw (err);
                console.log('Success!');
                res.send("Success")
            })
        } else console.log("Mansour la y986!");
    })
})

app.get("/api/delete_users/:user_id", (req, res) => {
    const id = req.params.user_id;
    var sqlRole = `SELECT user_role from users where user_id = "${id}"`;
    var sql = `DELETE FROM users WHERE user_id = "${id}"`;

    db.query(sqlRole, (err, result) => {
        if (err) throw (err);

        var currentRole = result[0].user_role;
        console.log(result[0].user_role);

        if (currentRole != 'Admin') {
            db.query(sql, (err, result) => {
                if (err) throw (err);
                console.log('Success!');
                res.send("Success")
            })
        } else console.log("Mansour la y986!");
    })
})

app.post("/api/edit_users", (req, res) => {
    const id = req.body.user_id;
    const user = req.body.username;
    const user_pass = req.body.password;
    const pn = req.body.phone_number;
    const email = req.body.email;
    console.log("IDDD L ", id);

    var sql = `UPDATE users SET user_name = "${user}",user_password = "${user_pass}",phone_number = ${pn}, email = "${email}" WHERE user_id = "${id}"`;

    db.query(sql, (err, result) => {
        if (err) throw (err);
        console.log('Success!');
        res.send();
    })
})

app.post("/api/edit_file/:id", (req, res) => {
    const id = req.params.id;
    // const name = req.body.name;
    // const description = req.body.description;
    // const tags = req.body.tags;
    // const query2 = "INSERT INTO file_header (name, description, tags, Creator , release_id , header_id) VALUES (?,?,?,?,?,?);"

    const filename = req.body.filename; // We should use the same name that we use in the client(Front-End)
    const fileDesc = req.body.fileDesc; // We should use the same name that we use in the client(Front-End)
    const tags = req.body.fileTags;
    // const q2 = `UPDATE file_header SET header_id = ${result.insertId} WHERE file_id = ${result.insertId}`

    var sql = `UPDATE file_header SET name = "${filename}", description = "${fileDesc}" , tags = "${tags}" WHERE file_id = ${id}`;

    db.query(sql, (err, result) => {
        if (err) return console.log("ERRR !", err);

        // console.log('Success on updating file Header !');
    })
    res.send("Updated Successfully");

})

app.get("/api/edit_release", (req, res) => {
    const fileid = req.body.id;
    const description = req.body.description;
    const tags = req.body.tags;
    var sql = `UPDATE file_header SET description = "${description}",tags = "${tags}" WHERE file_id = "${fileid}"`;

    db.query(sql, (err, result) => {
        if (err) throw (err);

        console.log('Success!');
    })
})

app.get("/api/getUserinfo/:user_id", (req, res) => {
    const id = req.params.user_id;
    var sql = `SELECT * FROM users WHERE user_id = ${id}`;

    db.query(sql, (err, result) => {
        if (err) throw (err);
        res.send(result);
    })
})

app.get("/api/getAlluserinfo", (req, res) => {
    // const id = req.body.id;
    var sql = "SELECT * FROM users";

    db.query(sql, (err, result) => {
        if (err) throw (err);
        res.send(result);
    })
})


// End Mansour Work

// Start Mohammed Work .. 

// const { METHODS } = require('http');//

// const MemoryStore = require('memorystore')(session)
// const { Store } = require('express-session');

// const db = mysql.createPool({
//     host: "sql7.freesqldatabase.com",
//     user: "sql7588558",
//     password: "qhukcHZRPY",
//     database: "sql7588558"
//   });

var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'kmsproject.is499@hotmail.com',
        pass: 'kmsprojectis499'
    }
});




app.get('/hello', (req, res) => {

    let sql = 'Select * from users where user_id = "1111111111"';

    db.query(sql, (err, result) => {
        if (err) throw err;

        req.session.user = result;

        // console.log(req.session);

        // console.log(req.sessionID)

        req.session.save(function (err) {
            if (err) return next(err)
            res.send()
        })

        store.set(req.sessionID, req.session, (er) => {
            console.log("added")
        })

        store.get(req.sessionID, (er, rs) => {
            console.log(rs + "Dsds")
        })

        res.end();
        // res.end("<h1 style = \"text-align: center\" >Hello Moha </h1>");
    })
})

app.get("/api/login", (req, res) => {
    if (req.session.user) {
        res.send({ isLoggedIn: true, user: req.session.user })
    } else {
        res.send({ isLoggedIn: false })
    }
})

app.post("/api/login", (req, res) => {
    console.log(req.session.isLoggedIn)
    if (req.session.isLoggedIn) {
        res.send(req.session)
        return;
    }

    const userid = req.body.userid
    const password = req.body.password

    var sql = 'Select * from users where user_id = "' + userid + '" and user_password = "' + password + '" ';

    db.query(sql, [userid, password], (err, result) => {
        if (err) console.log(err);

        if (result.length != 0) {
            req.session.user = result;
            req.session.correctCredentials = true;
            req.session.isLoggedIn = false;

            var email = result[0].email;

            req.session.otp = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
            console.log(req.session.otp + req.session.user[0].user_name);

            var mailOptions = {
                from: 'kmsproject.is499@hotmail.com',
                to: email,
                subject: 'KMS verification code',
                text: "Dear " + req.session.user[0].user_name + "\nDo not share this code with anyone, you will not be asked by the employees of KMS for this code\n"
                    + "Remember that you are responible for all the operations carried out " + "\nYour OTP is : " + req.session.otp
            };


            // transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });

            res.send(req.session)
        }
        else {
            console.log("Incorrect ID or Password");
            res.send("Wrong")
        }
    })
})
// app.get("/api/logindata", (req1, res1) => {
//     res1.send(req.session);
// })

// })
app.get("/api/session_data", (req, res) => {
    console.log(req.session.user)
    res.send(req.session)
})

app.get("/api/login_status", (req, res) => {
    console.log(req.session.isLoggedIn)
    res.send(req.session.correctCredentials);
})

app.get("/api/delete_session", (req, res) => {
    console.log("Request received")

    res.clearCookie("userid")
    req.session.destroy();
    console.log(req.session)

    res.end();
})

app.post("/api/verification", (req, res) => {
    const verCode = parseInt(req.body.verCode);
    console.log(typeof verCode)



    console.log(req.session.otp + "this is the otp")

    if (verCode === req.session.otp) {
        // if (verCode === 1111) {

        req.session.isLoggedIn = true;

        const data = {
            user: req.session.user,
            auth: true
        }

        console.log("Welcome")
        console.log(data)
        res.send(data);
    } else {
        res.send(false);
    }

    console.log(verCode);
})

// Nawaf Function 
app.get("/api/Home_status", (req, res) => {
    const data = {
        user: req.session.user,
        isLoggedIn: req.session.isLoggedIn,
        // auth: true
    }
    console.log(data, " Home Status..")
    console.log("Welcome in Home Status")
    res.send(data);
})
// End Nawaf Function

app.post("/api/change_password", (req, res) => {
    const id = req.session.user[0].user_id;
    const currentPass = req.body.currentPass;
    const newPass = req.body.newPass;

    console.log(id)

    var sql = `SELECT user_password from users where user_id = "${id}"`;
    var sql2 = `UPDATE users SET user_password = "${newPass}" WHERE user_id = "${id}"`;

    db.query(sql, (err, result) => {
        if (err) throw err;

        if (result.length != 0) {
            console.log(currentPass + "dsadasd" + result[0].user_password)

            if (currentPass == result[0].user_password) {
                db.query(sql2, (err2, result2) => {
                    console.log("Updated")
                    res.send();
                })
            }
            else {
                console.log("Password is incorrect11")
            }
        }
        else {
            console.log("Password is incorrect")
        }

    })

    console.log(newPass);
})

app.post("/api/edit_email", (req, res) => {
    const id = req.session.user[0].user_id;
    const currentPass = req.body.currentPass
    const newEmail = req.body.newEmail

    console.log(id)

    var sql = `SELECT user_password from users where user_id = "${id}"`;
    var sql2 = `UPDATE users SET email = "${newEmail}" WHERE user_id = "${id}"`;

    db.query(sql, (err, result) => {
        if (err) throw err;

        if (result.length != 0) {
            console.log(currentPass + "dsadasd" + result[0].user_password)

            if (currentPass == result[0].user_password) {
                db.query(sql2, (err2, result2) => {
                    console.log("Updated")
                    res.send();
                })
            }
            else {
                console.log("Password is incorrect11")
            }
        }
        else {
            console.log("Password is incorrect")
        }

    })
})

app.post("/api/edit_phonenumber", (req, res) => {
    const id = req.session.user[0].user_id;
    const currentPass = req.body.currentPass
    const pn = req.body.phone_number;

    console.log(id)

    var sql = `SELECT user_password from users where user_id = "${id}"`;
    var sql2 = `UPDATE users SET phone_number = "${pn}" WHERE user_id = "${id}"`;

    db.query(sql, (err, result) => {
        if (err) throw err;

        if (result.length != 0) {
            console.log(currentPass + "dsadasd" + result[0].user_password)

            if (currentPass == result[0].user_password) {
                db.query(sql2, (err2, result2) => {
                    console.log("Updated")
                    res.send();
                })
            }
            else {
                console.log("Password is incorrect11")
            }
        }
        else {
            console.log("Password is incorrect")
        }

    })
})


// app.get("/api/view_requests_admin", (req, res) => { Old Function .. 
//     var id = "1111111111";

//     // const verCode = req.body.verCode

//     const sql = `SELECT * FROM university.requests`;

//     db.query(sql, (err, result) => {
//         if (err) {
//             console.log("Error")
//             throw err;
//         }

//         if (result.length == 0)
//             res.send("No requests available");
//         else {
//             var d = JSON.parse(JSON.stringify(result[0]))
//             res.send(d)
//         }
//     })
// })

app.get("/api/view_requests_superuser/:user_id", (req, res) => {
    // var id = "1111111111";
    const id = req.params.user_id;

    // const verCode = req.body.verCode

    const sql = `SELECT * FROM requests WHERE initiator_id = "${id}"`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log("Error")
            throw err;
        }

        // if (result.length == 0)
        //     res.send("No requests available");
        // else
        res.send(result)
    })
})

app.post("/api/create_requests", (req, res) => {
    var user_id = req.body.user_id;
    var initiator_name = req.body.user_name;
    var file_id = req.body.file_id;
    var description = req.body.desc;

    // const verCode = req.body.verCode 

    const sql = `INSERT INTO requests(initiator_id, initiator_name, file_id, request_description)
            VALUES("${user_id}", "${initiator_name}", "${file_id}", "${description}")`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log("Error")
            throw err;
        }
        res.send("inserted");
        console.log("Request created")
    })
})

app.get("/api/accept_requests/:req_id", (req, res) => {
    var request_id = req.params.req_id;

    console.log("accept reachded" + request_id)

    var file_id;

    const sql = `UPDATE requests
                 SET request_status = "Accepted"
                 WHERE request_id = ${request_id}`;

    var getFileID = `SELECT file_id FROM requests WHERE request_id = ${request_id}`

    db.query(sql, (err, result) => {
        if (err) {
            console.log("Error")
            throw err;
        }
        if (result.length == 0) {
            res.send("EMPTY")
            return;
        }

        db.query(getFileID, (error, file_res) => {
            if (error) {
                console.log("Error")
                throw err;
            }
            if (file_res.length == 0) {
                console.log("EMPTY")
                return;
            }
            file_id = file_res[0].file_id;

            var delfile = `DELETE FROM file
                           WHERE fileID = ${file_id}`

            var delheader = `DELETE FROM file_header
                             WHERE file_id = ${file_id}`

            console.log("This is the file id " + file_id);

            db.query(delfile, (delErr, delRes) => {
                if (delErr) {
                    console.log(delErr)
                    throw err;
                }
                if (delRes.length == 0) {
                    console.log("EMPTY")
                    return;
                }

                console.log("FILE DELETED SUCSSESFULLY")
            })

            db.query(delheader, (delErr, delRes) => {
                if (delErr) {
                    console.log(delErr)
                    throw err;
                }
                if (delRes.length == 0) {
                    console.log("EMPTY")
                    return;
                }

                console.log("FILE HEADER DELETED SUCSSESFULLY")

                res.send(true)
            })
        })
    })
})


app.post("/api/reject_requests", (req, res) => {
    var request_id = req.body.req_id; // gathered from sesstion
    var feedback = req.body.feedback;

    console.log(request_id + "hello " + feedback)

    var feedback_statement = `, request_feedback = "${feedback}"`;
    var update_statement = `request_status = "Rejected"`

    if (feedback.replace(" ", "").length != 0)
        update_statement += feedback_statement;

    const sql = `UPDATE requests
                 SET ${update_statement}
                 WHERE request_id = ${request_id}`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log("Error")
            throw err;
        }
        if (result.length == 0) {
            res.send("EMPTY")
            return;
        }
        res.send(result)
    })
})


app.get("/api/view_requests_admin", (req, res) => {
    var id = req.session.user[0].user_id;
    console.log("idid")
    // const verCode = req.body.verCode

    const sql = "SELECT * FROM requests WHERE request_status = 'Pending' ";

    db.query(sql, (err, result) => {
        if (err) {
            console.log("Error")
            throw err;
        }

        // if (result.length === 0)
        //     res.send("No requests available");
        // else {
        res.send(result)
    })
})

app.get("/api/get_feedback/:req_id", (req, res) => {
    var req_id = req.params.req_id;

    var sql = `SELECT request_feedback from requests WHERE request_id = ${req_id}`

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.send(result)

    })
})



// End Mohammed Work



app.listen(3001, () => { // Opening the server on port ..
    console.log('listening on port 3001');
})
