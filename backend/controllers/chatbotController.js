const getQuery = async (req, res) => {
  try {
    const { userQuery } = req.body;

    console.log("UserQuer:", userQuery);
    // Send user query to Flask chatbot server
    const response = await fetch("http://127.0.0.1:8080/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userQuery: userQuery }),
    });

    // console.log("Raw response from Flask server:", response);

    const data = await response.json();
    res.json({ botResponse: data.response });
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    res.status(500).json({ error: "Failed to get chatbot response" });
  }
};

export { getQuery };
