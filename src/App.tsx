import { useState } from "react";
import "./App.css";
import { FaktsGuard } from "./fakts";
import { FaktsProvider } from "./fakts/FaktsProvider";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <FaktsProvider></FaktsProvider>
    </div>
  );
}

export default App;
