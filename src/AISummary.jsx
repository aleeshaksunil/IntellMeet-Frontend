function generateSummary(messages) {

  if (!messages || messages.length === 0) {
    return "No discussion available.";
  }

  let summary = "";

  messages.forEach((msg) => {

    if (msg.user === "System") return;

    const text = (msg.text || "").toLowerCase();

    if (text.includes("deadline")) {
      summary += "• Deadline discussed.\n";
    }

    else if (
      text.includes("complete") ||
      text.includes("completed")
    ) {
      summary += "• Task assignment discussed.\n";
    }

    else if (
      text.includes("screen") ||
      text.includes("share screen")
    ) {
      summary += "• Screen sharing discussed.\n";
    }

    else if (
      text.includes("meeting") ||
      text.includes("discussion")
    ) {
      summary += "• General meeting discussion.\n";
    }

    else {
      summary += `• ${msg.user} discussed: ${msg.text}\n`;
    }

  });

  return summary.trim();

}

function AISummary({ messages }) {

  const summary = generateSummary(messages);

  return (

    <div className="ai-card">

      <h2 className="ai-title">
        🤖 AI Meeting Summary
      </h2>

      <div className="ai-content">
        {summary}
      </div>

    </div>

  );

}

export { generateSummary };

export default AISummary;