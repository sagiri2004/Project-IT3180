import React, { useState } from "react";
import { Button } from "@mui/material";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1 class="text-3xl font-bold underline">Hello world!</h1>;
      <Button variant="contained" onClick={() => setCount(count + 1)}>
        Log in
      </Button>
    </div>
  );
}

export default App;
