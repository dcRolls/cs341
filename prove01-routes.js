const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  
  if (url === '/') {
    res.write('<html>'); //send html back
    res.write('<head><title>Prove 01</title></head>');
    res.write('<body>')
    res.write('<h1>Welcome to Prove 01</h1>')
    res.write('<p>Add a user name using the input below.</p>')
    res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Submit</button></form>');  //send the user to /create-user
    res.write('<form action="/users" method="GET"><button type="submit">View Users</button></form>');  //send the user to /users
    res.write('</body>');
    res.write('</html>'); //send html back
    return res.end(); //send  
  }
  
  if (url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }); //listen for data event, call the function when data comes in
    return req.on('end', () => { //listen for the end of data streaming (all data in)
      const parseBody = Buffer.concat(body).toString(); //add all pieces together into a string
      const user = parseBody.split('=')[1]; //get item after the equal sign, which is the 'message' value
      console.log(user);
            
      fs.appendFile('userlist.txt', user + ',', (err) => {
        res.statusCode = 302;
        res.setHeader('Location', '/'); //redirect back to start page
        return res.end();
      });      
    });        
  }

  if (url.indexOf('/users') > -1 && method === 'GET') { //return dummy list
    return fs.readFile('userlist.txt', (err, data) => {
      const userlist = data.toString().split(",").map(x => x==='' ? '' : `<li>${x.replace('+', ' ')}</li>`).join('');            
      res.write('<html>'); //send html back
      res.write('<head><title>Prove 01</title></head>');
      res.write('<body>');
      res.write('<h2>User List</h2>');
      res.write(`<ul>${userlist}</ul>`);
      res.write('</body>');  
      res.write('</html>'); //send html back
      res.end(); //send  
    });          
  }

  //if we get here, it's a 404
  res.setHeader('Content-Type', 'text/html'); //state what type of data is coming back
  res.write('<html>'); //send html back
  res.write('<head><title>Oops</title></head>');
  res.write('<body><h1>404 - Page not found!</h1></body>');  
  res.statusCode = 404;
  res.end(); //send
}

exports.handler = requestHandler; 