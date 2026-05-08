const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");

require("dotenv").config();

const {
  GoogleGenerativeAI
} = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());



// SERVE STATIC FILES
app.use(
  express.static(
    path.join(__dirname, "public")
  )
);



// Gemini Setup
const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );



// Home Route
app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );
});



// Chat Route
app.post("/chat", async (req, res) => {

  try {

    const { message } = req.body;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt: message,
        stream: false
      }
    );

    res.json({
      reply: response.data.response
    });

  } catch(error) {

    console.log(error);

    res.status(500).json({
      reply: "Error"
    });
  }
});



app.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );
});