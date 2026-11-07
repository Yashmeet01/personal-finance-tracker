import { useState } from "react";

function NameForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (name === "") {
      setMessage("Please enter your name");
    } else {
      setMessage("Hello, " + name + "!");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="submit">Submit</button>
      <p>{message}</p>
    </form>
  );
}

export default NameForm;