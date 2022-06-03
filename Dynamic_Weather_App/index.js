const fs = require("fs")
const http = require("http")
const requests = require("requests")

const home = fs.readFileSync("home.html","utf-8")
console.log(home)

const replace_values = (home,val)=>{
    var temp = home.replace("{%temp_city%}",val.name)
    temp = temp.replace("{%temp_country%}",val.sys.country)
    temp = temp.replace("{%temp_degree%}",val.main.temp)
    temp = temp.replace("{%temp_min%}",val.main.temp_min)
    temp = temp.replace("{%temp_max%}",val.main.temp_max)
    temp = temp.replace("{%status%}",val.weather[0].main)
    return temp
}

const server = http.createServer((req,res)=>{

    if(req.url=="/")
    {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=259788d9d71f3648bdfb380c49d5a8b3")
        .on("data",(chunk)=>{
            //console.log(chunk)
            var obj = JSON.parse(chunk)
            console.log(obj)
            var arr = [obj]
            var f = arr.map((val)=>{

                var temp_file = replace_values(home,val)  
                return temp_file

            }).join("")

            //console.log(f)
            // res.end(final)
            res.write(f)
            //res.end()
        })
        .on("end",()=>{
            
            console.log("Completely fetched")
            res.end()
            
        })
        .on("error",(err)=>{
            console.log("Connection lost with API : ",err)
        })
    }
    else
    {
        res.writeHead(404,{"Content-type" : "text/html"})
        res.write("<html><body><h1 style='text-align:center;'>404 Error</h1></body></html>")
        res.end()
    }
    
})

server.listen(8000,"127.0.0.1",()=>{
    console.log("Listening at port : 8000")
})
