function generateActions(messages) {

  if (!messages || messages.length ===0) {
    return ["No action items found."];
  }

  let actions = [];

  messages.forEach((msg) => {

    if (msg.user === "System") return;

    const text = (msg.text || "").toLowerCase();

    if (
      text.includes("complete") ||
      text.includes("completed")
    ) {
      actions.push(
        `${msg.user} → Complete assigned work`
      );
    }

    if (text.includes("deadline")) {
      actions.push(
        `${msg.user} → Review project deadline`
      );
    }

    if (
      text.includes("screen") ||
      text.includes("share screen")
    ) {
      actions.push(
        `${msg.user} → Arrange screen sharing`
      );
    }

    if (
      text.includes("submit")
    ) {
      actions.push(
        `${msg.user} → Submit the assigned task`
      );
    }

    if (
      text.includes("review")
    ) {
      actions.push(
        `${msg.user} → Review the assigned work`
      );
    }

  });

  actions = [...new Set(actions)];

  if (actions.length === 0) {
    return ["No action items found."];
  }

  return actions;
}

function ActionItems({ messages }) {

  const actions = generateActions(messages);

 return (
  <div className="ai-card">

    <h2 className="ai-title">
      ✅ AI Action Items
    </h2>

    {actions.length > 0 ? (

      <ul className="action-list">

        {actions.map((item, index) => (

          <li key={index}>
            {item}
          </li>

        ))}

      </ul>

    ) : (

      <div className="ai-content">
        No action items found.
      </div>

    )}

  </div>
);
}

export { generateActions };

export default ActionItems;