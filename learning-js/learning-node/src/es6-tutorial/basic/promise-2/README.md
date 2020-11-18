
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
https://appdividend.com/2018/08/28/node-async-await-example-tutorial/



Now, let us take a simple example of Promise.

But before that, please check your Node.js version. My version is v9.8.0. So, I can use the async-await feature. If your Node.js has not the latest version, then please update to the newest version.

Now, create a project folder.

mkdir node-examples
Go into the project folder.

cd node-examples
Now, create a package.json file using the following command.

npm init -y
Install the nodemon server using the following command.

npm install nodemon --save
Create a new file called server.js inside the root. Write the following code inside it.

// server.js

function square(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.pow(x, 2));
    }, 2000);
  });
}

square(10).then(data => {
  console.log(data);
});
Next step is to start the nodemon server using the following command.