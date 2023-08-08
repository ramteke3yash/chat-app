const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

let storedUsername = null;

app.get("/login", (req, res) => {
  res.send(
    '<form action="/store-username" method="POST">' +
      '<input type="text" name="username" >' +
      '<button type="submit">Submit</button></form>'
  );
});

app.post("/store-username", (req, res) => {
  const { username } = req.body;
  if (username) {
    storedUsername = username;
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app.get("/", (req, res) => {
  if (storedUsername) {
    res.send(
      `<h2>Welcome, ${storedUsername}!</h2>` +
        '<form action="/send-message" method="POST">' +
        '<input type="text" name="message" >' +
        '<button type="submit">Send</button></form>' +
        getMessages()
    );
  } else {
    res.redirect("/login");
  }
});

app.post("/send-message", (req, res) => {
  const { message } = req.body;
  if (message && storedUsername) {
    const data = `${storedUsername}: ${message}\n`;
    fs.appendFile("messages.txt", data, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      }
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

function getMessages() {
  const messages = fs.readFileSync("messages.txt", "utf8");
  const formattedMessages = messages
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((msg) => {
      const parts = msg.split(":");
      return `<p>${parts[0]}: ${parts[1]}</p>`;
    })
    .join("");

  return formattedMessages;
}

app.listen(3000);
