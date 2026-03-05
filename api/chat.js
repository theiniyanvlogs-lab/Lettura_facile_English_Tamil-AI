export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const { message } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

    let reply = "No response";

    if (data?.candidates?.length > 0) {

      const parts = data.candidates[0].content.parts;

      if (parts && parts.length > 0) {
        reply = parts.map(p => p.text || "").join("");
      }

    }

    res.status(200).json({ reply });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: "Gemini API error",
      error: error.message
    });

  }
}
