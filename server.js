require('dotenv').config();
const http = require('http')
const urlParser = require('url')
const fs = require('fs')
const utils = require('./utils.js')

const app = http.createServer((req,res) => {
    const url = urlParser.parse(req.url)
    const method = req.method
    console.log(url)
    if(method === "GET"){
        if(url.pathname === "/"){
            const html = fs.readFileSync('./view/home.html')
            res.writeHead(200,{
                "Content-Type": "text/html; charset=utf-8"
            })
            
            res.write(html)
            res.end() 
        }else if(url.pathname === "/bootstrap"){
            const bootstrap = fs.readFileSync('./assets/css/bootstrap.min.css')
            res.writeHead(200,{ "Content-Type": "text/css"})
            res.write(bootstrap)
            res.end()

        }else if(url.pathname === "/users"){
            const {students} = JSON.parse(fs.readFileSync('./Data/Students.json'))
                
            let ul = ""
            ul += students.map((student) =>  `
                <div class="card col text-center mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Student ${student.id}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${student.name}</h6>
                        <p class="card-text">Birth: ${utils.formatDate(student.birth)}</p>
                    </div>
                
                    <form method="GET" action="/delete">
                        <input type="hidden" name="id" value="${student.id}"/>
                        <div class="text-center">
                            <input class="btn btn-danger" type="submit" value="delete"/>
                        </div>
                    </form>
                </div>
                `)
            
            res.writeHead(200,{
                "Content-Type": "text/html; charset=utf-8"
            })
            res.write(`
                <html>
                    <head>
                        <link href="/bootstrap" rel="stylesheet" type="text/css" />
                    </head>
                    <body>
                        <nav class="nav bg-dark text-light shadow mb-3">
                            <a class="nav-link text-light" href="/">Home</a>
                            <a class="nav-link text-light" href="/users">Users</a>        
                        </nav>
                        <h1 class="text-center">Students</h1>
                        <div class="container justify-content-around">
                            <div class="row">
                                ${ul}
                            </div>
                        </div>
                        <div class="container mb-3">
                            <a class="btn btn-success" href="/">Create</a>
                        </div>
                    </body>
                </html>
            `)
            res.end()
        }else if(url.pathname === "/delete"){
            const students = JSON.parse(fs.readFileSync('./Data/Students.json'))
            const id = url.query.split("=")[1]
            const sizeStudents = students.students.length
            

            students.students = students.students.filter((student) => student.id != id)

            if(sizeStudents !== students.students.length){
                fs.writeFileSync("./Data/Students.json",JSON.stringify(students))
            } 

            res.writeHead(302,{
                "Location": `http://${process.env.APP_LOCALHOST}:${process.env.APP_PORT}/users`
            })
            res.end()
        }else{
            res.writeHead(404, {
                "Content-Type": "text/plain"
            })
            res.end("404")
        }
    }else if(method === "POST"){
        if(url.pathname === "/create"){
            const students = JSON.parse(fs.readFileSync('./Data/Students.json'))

            let body = ""
            req.on('data', data => {
                body += data
            })

            req.on("end", ()=> {
                const student = utils.createStudent(body, students.students)
                console.log(student)
                if (student.name && student.birth){
                    
                    students.students.push(student)
                    console.log(student)
                    fs.writeFileSync("./Data/Students.json",JSON.stringify(students),"utf-8")
                }
            })

            res.writeHead(302,{
                "Location": `http://${process.env.APP_LOCALHOST}:${process.env.APP_PORT}`
            })
            res.end()
        }
    }else{
        res.writeHead(404, {
            "Content-Type": "text/plain"
        })
        res.end("404")
    }
    
    


})

app.listen(process.env.APP_PORT, () => {
    console.log(`Server is listening on ${process.env.APP_LOCALHOST}:${process.env.APP_PORT}`)
})