export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const { message } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ reply: "Gemini API key missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512
          }
        })
      }
    );

    const data = await response.json();

    console.log("Gemini Full Response:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({
        reply: "Gemini API error",
        error: data.error.message
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.status(200).json({ reply });

  } catch (error) {

    console.error("Server Error:", error);

    res.status(500).json({
      reply: "Server error",
      error: error.message
    });

  }

}
