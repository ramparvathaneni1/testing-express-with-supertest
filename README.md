[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# Testing Node with Jest and Supertest

By the end of this lesson, you will be able to:

* Explain the importance of testing Node.js APIs with Jest and Supertest.
* Create a new Node.js project and install the necessary dependencies.
* Write a simple Node.js API using Express.js.
* Use Jest and Supertest to write unit tests for a Node.js API.
* Test multiple API endpoints and handle responses.
* Understand the different types of tests for Node.js applications.

## Intro to JavaScript Testing with Jest and Supertest

Testing is an essential part of software development, and it's crucial to have a comprehensive test suite to ensure that
your code is working as intended. To test our code in Node, we will use two primary libraries: one to run the tests and
a second one to help us with making http requests to apis, these libraries are Jest and Supertest. Testing your Node.js
APIs with Jest and Supertest is a straightforward and efficient way to write unit and integration tests that cover all
your API endpoints.

Jest is a popular testing framework for JavaScript that provides a simple and intuitive API for writing tests. It comes
with built-in support for assertions, mocking, and code coverage, making it a great choice for testing Node.js
applications.

Supertest is an HTTP testing library for Node.js that allows you to test your API endpoints by sending HTTP requests and
asserting the response. It provides an easy-to-use API for making requests and handling responses, making it a great
choice for testing your Node.js APIs.

### Setting up the app

To follow along with this lesson, you can create a new Node.js project and install the necessary dependencies. Here are
the steps to get started:

1. Open your terminal.
2. To access the `mef` directory, please navigate to it from your home directory using the command `cd ~/mef`.
3. Fork the repository
   named [testing-express-with-supertest](https://git.generalassemb.ly/ModernEngineering/testing-express-with-supertest)
   on the GitHub website.
4. Click the "Fork" button in the upper right corner of the repository page. This will create a copy of the repository
   under your own GitHub account.
5. After forking, you'll have your own copy of the repository under your GitHub account.
    - Copy the URL of your forked repository, which will look
      like: `https://github.com/YourUsername/testing-express-with-supertest.git`.
6. Now clone the repository using the SSH URL.
7. To switch your current directory from `mef` to `testing-express-with-supertest`, execute the command: `cd
   testing-express-with-supertest`.
8. You have two options for installing dependencies: you can use the `npm install` command to install all the dependencies
   listed in the `package.json`, or you can specify individual packages by running `npm install express jest supertest`.

### Writing the API

Let's start by creating a simple API that we can test. Create a new file called `app.js` and add the following code:

```js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

```

This creates a new Express.js app that responds with "Hello World!" when we make a GET request to the root
endpoint ('/'). We can test this API by running the app and making a request to the endpoint using a tool like curl.

To start the app, add the following code to the end of the app.js file:

```js
const PORT = process.env.PORT || 3000;

server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
module.exports = {app, server} // this is so we can stop the server programmatically 
```

This starts the app and listens on port `3000` by default. If you want to specify a different port, you can set the PORT
environment variable before starting the app.

To test the API, run the following command in your terminal:

```bash
nodemon app.js
```

This will start the app, and you should see the message "Server listening on port 3000" in your console. Now, open a new
terminal window and run the following command to make a GET request to the root endpoint:

```bash
curl http://localhost:3000/
```

You should see the message "Hello World!" in your console, which means the API is working correctly.

Setting up the tests
First, create a new directory called tests in your project directory. Inside this directory, create a new file called
app.test.js. This is where we will write our tests.

Open `app.test.js` and add the following code:

```js
const request = require('supertest');
const {app, server} = require('../app');

describe('Test the root path', () => {
    test('It should respond with "Hello World!"', async () => {
        const response = await request(app).get('/');
        expect(response.text).toBe('Hello World!');
        expect(response.statusCode).toBe(200);
    });
});

afterAll(done => {
    // Closing the connection allows Jest to exit successfully.
    server.close()
    done()
})
```

Let's go through this code line by line:

* We start by importing Supertest and our Express.js app (app).
* We use the describe function to group our tests under a common name.
* We use the test function to write our test case. In this case, we are testing the root endpoint ('/').
* We use the request function from Supertest to make a GET request to the endpoint.
* We use the expect function from Jest to assert that the response body is equal to "Hello World!" and that the status
  code is 200.

## Running the tests

go to your package.json and find the field under `scripts` that says `test` change that to run jest

```js
"test"
:
"jest"
```

To run the tests, open a terminal window and run the following command (__NOTE: You'll need to stop your server for the
tests to run correctly on port 3000__):

```bash
npm run test
```

This will run all the tests in the tests directory and display the results in the console. If everything is working
correctly, you should see a message like this:

```vbnet
Test the root path
  ✓ It should respond with "Hello World!" (10 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

Congratulations, you've just written your first test for a Node.js API using Jest and Supertest!

## Adding more endpoints

Let's expand on our API and add a few more endpoints to test. Open app.js and add the following code:
first add our bodyparser middleware to get access to `req.body`

```js
app.use(express.json());
// do this before all routes
```

then add our endpoints:

```js
app.post('/users', (req, res) => {
    const {name, email} = req.body;
    res.json({name, email});
});

app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const {name, email} = req.body;
    res.json({id, name, email});
});

app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    res.json({id});
});
```

This adds three new endpoints:

- `/users` - accepts a POST request with a JSON body containing a name and an email property, and responds with the same
  data.
- `/users/:id` - accepts a PUT request with a JSON body containing a name and an email property, and responds with the
  updated data and the id parameter from the URL.
- `/users/:id` - accepts a DELETE request and responds with the id parameter from the URL.

Writing more tests
Now that we have more endpoints, let's write tests for them. Open app.test.js and add the following code:

```js
describe('Test the users endpoints', () => {
    test('It should create a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({name: 'John Doe', email: 'john.doe@example.com'});
        expect(response.body).toEqual({name: 'John Doe', email: 'john.doe@example.com'});
    });
// more tests here
})

```

This test creating a new user lets run npm run test and see if our tests pass.

We can also test the other endpoints and the final code looks like this

```js
// app.test.js
const request = require('supertest');
const {app, server} = require('../app');

describe('Test the root path', () => {
    test('It should respond with "Hello World!"', async () => {
        const response = await request(app).get('/');
        expect(response.text).toBe('Hello World!');
        expect(response.statusCode).toBe(200);
    });
});

describe('Test the users endpoints', () => {
    test('It should create a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({name: 'John Doe', email: 'john.doe@example.com'});
        expect(response.body).toEqual({name: 'John Doe', email: 'john.doe@example.com'});
        expect(response.statusCode).toBe(200);
    });

    test('It should update a user', async () => {
        const response = await request(app)
            .put('/users/123')
            .send({name: 'Jane Doe', email: 'jane.doe@example.com'});
        expect(response.body).toEqual({id: '123', name: 'Jane Doe', email: 'jane.doe@example.com'});
        expect(response.statusCode).toBe(200);
    });

    test('It should delete a user', async () => {
        const response = await request(app).delete('/users/123');
        expect(response.body).toEqual({id: '123'});
        expect(response.statusCode).toBe(200);
    });
});

afterAll(done => {
    // Closing the connection allows Jest to exit successfully.
    server.close()
    done()
})


```

```js
// app.js

const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/users', (req, res) => {
    const {name, email} = req.body;
    res.json({name, email});
});

app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const {name, email} = req.body;
    res.json({id, name, email});
});

app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    res.json({id});
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
module.exports = {app, server}
```

### Conclusion

Testing Node.js APIs with Jest and Supertest is essential for ensuring the robustness and reliability of your web
applications. With the right tools and knowledge, writing unit tests for your API endpoints becomes straightforward and
efficient. By following the steps outlined in this lesson, you'll be well on your way to creating a comprehensive test
suite that covers all your API endpoints and helps you identify bugs and side-effects before they become a problem.
