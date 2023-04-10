import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { FaktsGuard, useFakts } from "./fakts";
import { buildFaktsRetrieveGrant } from "./fakts/FaktsContext";
import { FaktsProvider } from "./fakts/FaktsProvider";

export const Test = () => {
  const { fakts, load } = useFakts();

  return (
    <>
      {JSON.stringify(fakts)}
      <button
        onClick={() =>
          load(
            buildFaktsRetrieveGrant(
              {
                name: "Localhost",
                base_url: `http://localhost:8000/f/`,
              },
              { version: "dev", identifier: "github.io.jhnnsrs.fakts" }
            )
          ).catch((e) => alert(e))
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
