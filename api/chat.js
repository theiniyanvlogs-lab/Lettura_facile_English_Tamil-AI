export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant. Answer clearly and support English, Tamil, and Italian."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.status(500).json({
        reply: "OpenAI API error",
        debug: data
      });
    }

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {

    res.status(500).json({
      reply: "Server error",
      error: error.message
    });

  }

}
