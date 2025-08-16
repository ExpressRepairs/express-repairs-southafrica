import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // loads HF_TOKEN from .env

const app = express();
app.use(express.json());

// Allow frontend to access this server (CORS)
import cors from "cors";
app.use(cors());

app.post("/erso", async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ reply: "No question provided." });

    const prompt = `
You are ERSO, a professional appliance repair assistant for Express Repairs South Africa.
Answer in the language the user types (English, Afrikaans, Zulu, Sepedi, Xhosa, Tswana, Tsonga).
Question: ${question}
`;

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: prompt })
        });
        const data = await response.json();
        res.json({ reply: data[0]?.generated_text || "" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: "Error contacting Hugging Face API." });
    }
});

app.listen(3000, () => console.log("ERSO server running on http://localhost:3000"));
