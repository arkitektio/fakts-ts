import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { FaktsGuard, useFakts } from "./fakts";
import { FaktsProvider } from "./fakts/FaktsProvider";

export const Test = () => {
  const { fakts, load } = useFakts();

  return (
    <>
      {JSON.stringify(fakts)}
      <button
        onClick={() =>
          load({
            endpoint: `localhost:8000`,
            manifest: { version: "dev", identifier: "github.io.jhnnsrs.fakts" },
            introspectTimeout: 1,
          }).catch((e) => alert(e))
        }
      >
        bububsusb
      </button>
    </>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <FaktsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Test />} />
          </Routes>
        </Router>
      </FaktsProvider>
    </div>
  );
}

export default App;
