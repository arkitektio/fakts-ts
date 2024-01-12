import { useCallback, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Fakts, FaktsEndpoint, Manifest, useFakts } from "./fakts";
import { FaktsProvider } from "./fakts/FaktsProvider";
import { useLoadFakts } from "./fakts/hooks/useLoadFakts";






export const Test = () => {
  const { progress, loading, load, error, remove, fakts} = useLoadFakts();

  return (
    <>
      {JSON.stringify(fakts)}
      <button onClick={() => remove()}>Remove</button>
      <button
        onClick={() => load({
          url: `localhost:8010`,
          manifest: { version: "dev", identifier: "github.io.jhnnsrs.jj", scopes: ["*"]},
          requestPublic: true,
          requestedClientType: "website",
          requestedRedirectURIs: ["http://localhost:3000"],
      
        })}
      >
        {loading ? "Cancel" : "Load"} {progress}
      </button>
      {progress} {error}
       
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
