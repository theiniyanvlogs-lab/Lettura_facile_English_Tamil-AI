export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const { message } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: "Reply in the same language as the user: " + message }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini Full Response:", data);

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.status(200).json({ reply });

  } catch (error) {

    res.status(500).json({
      reply: "Gemini API error",
      error: error.message
    });

  }

}
