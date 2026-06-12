import { useState } from "react";
import Login from "./Login";
import MockInterview from "./MockInterview";

function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {started ? (
        <MockInterview />
      ) : (
        <Login onStart={() => setStarted(true)} />
      )}
    </>
  );
}

export default App;