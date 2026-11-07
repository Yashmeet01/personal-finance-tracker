import Greeting from "./components/Greeting";
import Counter from "./components/Counter";

function App() {
  return (
    <div>
      <h1>Personal Finance Tracker</h1>
      <Greeting name="Yashmeet" />
      <Greeting name="Dude" />
      <Counter />
    </div>
  );
}

export default App;