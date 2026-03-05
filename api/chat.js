export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                  text: "Reply in the same language as the user (English or Tamil): " + message
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

    // Check API error
    if (data.error) {
      return res.status(500).json({
        reply: "Gemini API error",
        error: data.error.message
      });
    }

    // Extract AI text safely
    let reply = "No response";

    if (
      data &&
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      reply = data.candidates[0].content.parts[0].text;
    }

    res.status(200).json({ reply });

  } catch (error) {

    console.error("Server Error:", error);

    res.status(500).json({
      reply: "Server error",
      error: error.message
    });

  }
}
