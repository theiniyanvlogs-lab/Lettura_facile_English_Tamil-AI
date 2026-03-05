export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ reply: "Gemini API key missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
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
                {
                  text: "Reply in the same language as the user: " + message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini Full Response:", JSON.stringify(data, null, 2));

    // Handle Gemini API errors
    if (data.error) {
      return res.status(500).json({
        reply: "Gemini API error",
        error: data.error.message
      });
    }

    let reply = "No response";

    if (data?.candidates?.length > 0) {

      const parts = data.candidates[0]?.content?.parts;

      if (parts && parts.length > 0) {
        reply = parts.map(p => p.text || "").join("");
      }

    }

    return res.status(200).json({ reply });

  } catch (error) {

    console.error("Server Error:", error);

    return res.status(500).json({
      reply: "Server error",
      error: error.message
    });

  }

}
