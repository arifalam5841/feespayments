const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyparse = require("body-parser");
const hbs = require("hbs");
const cors = require("cors");
const { engine } = require("express-handlebars");
const { inflate } = require("zlib");
const publicfilepath = path.join(__dirname, "./public");
const partialspath = path.join(__dirname, "./partials");

app.use(
  cors({
    origin: "https://feespayments.vercel.app/", // Replace with your actual Vercel frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyparse.urlencoded({ extend: true }));
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For form-encoded data

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: path.join(__dirname, "views"),
    partialsDir: partialspath,
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(publicfilepath));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/admision", (req, res) => {
  res.render("admision");
});

app.post("/admision-done", (req, res) => {
  const name = req.body.studentname;
  const cast = req.body.cast;
  const lastschool = req.body.lastschool;
  const studing_class = req.body.classes;
  const fathername = req.body.father;
  const mothername = req.body.mothers;
  const feespaid = req.body.feespaid;

  // const intclass = Math.round(studing_class);
  const intfees = Math.round(feespaid);
  let datafilled;
  async function putingdata() {
    try {
      const jsondata = fs.readFileSync("studentdata.json");
      const parsedata = JSON.parse(jsondata);

      parsedata.push({
        name: name,
        school: lastschool,
        father: fathername,
        mother: mothername,
        feespaid: intfees,
        studingclass: studing_class,
        cast: cast,
      });

      const againjson = JSON.stringify(parsedata);
      datafilled = againjson;
      console.log(parsedata);

      res.render("info", {
        names: name,
        schools: lastschool,
        classs: studing_class,
        casts: cast,
        fathers: fathername,
        mothers: mothername,
        feess: feespaid,
      });

      // fs.writeFileSync("studentdata.json", againjson);
    } catch (error) {
      console.log(error);
    }
  }

  putingdata();
  fs.writeFileSync("studentdata.json", datafilled);
});

const usersFilePath = path.join(__dirname, "studentdata.json");

function loadUsers() {
  const data = fs.readFileSync(usersFilePath, "utf-8");
  return JSON.parse(data);
  // console.log(JSON.parse(data));
}

function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
}

app.get("/fees", (req, res) => {
  res.render("feespage");
});

app.post("/check-name", (req, res) => {
  const { name } = req.body;
  const users = loadUsers();

  const user = users.find((u) => u.name.toLowerCase() === name.toLowerCase());

  if (user) {
    res.json({ success: true, user });
  } else {
    res.json({ success: false, message: "Name not found in the database." });
  }
});

app.post("/pay-fees", (req, res) => {
  const { name, amount } = req.body;
  const users = loadUsers();

  const user = users.find((u) => u.name.toLowerCase() === name.toLowerCase());
  if (user) {
    const payment = parseInt(amount, 10);

    let toPay = 70000 - user.feespaid;
    if (isNaN(payment) || payment <= 0 || payment > toPay) {
      return res.json({ success: false, message: "Invalid payment amount." });
    }

    user.feespaid += payment;
    // user.toPay -= payment;

    saveUsers(users);
    res.json({ success: true, user });
  } else {
    res.json({ success: false, message: "Name not found." });
  }
});

app.post("/check-fee", (req, res) => {
  const { name } = req.body;

  const users = loadUsers();

  const user = users.find((u) => u.name.toLowerCase() === name.toLowerCase());

  if (user) {
    res.json({ fees: user.feespaid, success: true });
    // res.json({ user }); // or i could do this also where i am getting all the data of the user and then i can get any data of that user in the clien side
  } else {
    res.json({ message: "User not found", success: false });
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});

app.listen(port, () => {
  console.log("Today is school's holiday");
});
