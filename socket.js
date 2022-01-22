var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;


var db = {}
const fruits = ["apple", "orange", "cherry"];
net.createServer(function (sock) {
    var state = 0 //idle
    var current_key = null    
    sock.on('data', function (data) {
        console.log("round");
        switch(state){
            case 0:// call pet list
                if(data == 'HELLO'){
                    sock.write("hello from pet shop")
                    state = 1 //wait for key
                }
                if("OUT"){
                    
                }
                break
            case 1:// show list , wait feeding and registry
                if(data == 'SHOW'){
                    sock.write("dd")
                }
                else if(data == "FEED"){
                    state = 3               
                }
                else if(data == "REGISTRY"){
                    sock.write("register your pet")
                    state = 2 //wait for number
                }
                
                break
            case 2:// register state
                if(data == 'FEED'){
                    state = 3
                }
                else if(data == 'BYE'){
                    state = 0 //end                    
                }else{
                    // register pet and set hungry = 0
                    sock.write("" + (db[current_key] || 0))
                }
                break    
            case 3://feed state
                sock.write("your pet name")
                current_key = data
                state = 4
                break
            case 4://feeding
                if(data == 'BYE'){
                    state = 0 //end                    
                }
                else if(db[current_key] >= 10){
                    state = 5
                }
                else{
                    try{
                        let v = parseInt(data)
                        if(!db[current_key])
                            db[current_key] = 0
                        db[current_key] += v
                        sock.write("" + db[current_key])
                    }catch(e){
                        sock.write('INVALID')
                    }     
                }
                break  
            case 5:
                while(db[current_key]>0){
                    db[current_key] -= 1
                    if(db[current_key]>=10){
                        sock.write("full")
                    }
                    else if(db[current_key]>=5){
                        sock.write("ready to eat")
                    }
                    else if(db[current_key]==0){
                        sock.write("hungry")
                    }
                }
                state = 0
                break
        }
    });
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST + ':' + PORT);