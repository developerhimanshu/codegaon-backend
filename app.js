const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;

app.use(express.json())
app.use(cors())
const USERS = [];

const QUESTIONS = [
  {
    title: "Two Sum",
    description:
      "Given an array and a target, Return weather there exists two numbers whose sum is equal to target.",
    testCases: [
      {
        input: "arr = [1, 2, 4, 5], target = 7",
        output: "true",
      },
    ],
  },
  {
    title: "Three Sum",
    description:
      "Given an array and a target, Return weather there exists three numbers whose sum is equal to target.",
    testCases: [
      {
        input: "arr = [1, 2, 4, 5], target = 7",
        output: "true",
      },
    ],
  },
];

const submissions = [];

app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  //check if user already exists
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).send(err);
    }
    const userExists = USERS.some((user) => user.email === email);
    if (userExists) {
      return res.status(409).send("User already exists");
    }
    const newUser = {
      email,
      hash,
    };
    USERS.push(newUser);
  });
  //Create a new user
  // Return a success response to the client
  res.sendStatus(200);
});

app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const user = USERS.find((user) => user.email === email);
  if (!user || user.password !== password) {
    return res.status(409).send("Invalid email or password");
  }

  bcrypt.compare(password, user.hash, (err, result) => {
    if (result === true) {
      res.status(200).send("Successfully logged in.");
    }
  });
  const token = uuidv4();
  user.token = token;
  res.status(200).json({ token });
});

app.get("/questions", (req, res) => {
  // let questionHtml = "";
  // QUESTIONS.forEach((question) => {
  //   questionHtml += `<h2>${question.title}</h2>
  //   <h3> ${question.description}</h3>
  //   <p> Input:${question.testCases[0].input}</p>
  //   <p> Output:${question.testCases[0].output}</p><br />
  //   `;
  // });
  // console.log(questionHtml);
  // res.send(questionHtml);
  res.json(QUESTIONS);
});

app.get("/submissions", (req, res) => {
  const { questionIndex } = req.query;

  const submissionsForQuestion = submissions.filter(
    (submission) => submission.questionIndex === Number(questionIndex)
  );
  res.json(submissionsForQuestion);
});

app.post("/submisstions", (req, res) => {
  const { questionIndex, solution } = req.body;
  const isSolutionCorrect = Math.random() >= 0.5;

  const newSubmission = {
    question: QUESTIONS[questionIndex],
    solution,
    isSolutionCorrect,
  };

  submissions.push(newSubmission);
  res.json(newSubmission);
});

app.listen(port, () => {
  console.log("App is listening at port" + port);
});
