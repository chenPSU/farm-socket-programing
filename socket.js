var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;

var db = {}

net.createServer(function (sock) {
    var state = 0 //idle
    var current_key = null    
    sock.on('data', function (data) {
        console.log("round");
        switch(state){
            case 0:
                if(data == 'HELLO'){
                    sock.write('HELLOS')
                    state = 1 //wait for key
                }
                break
            case 1:
                console.log(1);
                current_key = data
                sock.write("" + (db[current_key] || 0))
                state = 2 //wait for number
                break
            case 2:
                console.log(2);
                if(data == 'BYE'){
                    sock.close()
                    state = 3 //end                    
                }else{
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
        }
    });
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST + ':' + PORT);