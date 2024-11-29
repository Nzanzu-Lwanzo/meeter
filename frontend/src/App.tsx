import Room from "./pages/Room";
import Call from "./pages/Call";
import Register from "./pages/Register";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAppContext } from "./contexts/AppContext";
import { SocketContextProvider } from "./contexts/SocketContext";

function App() {
  const { auth } = useAppContext();

  return (
    <>
      <SocketContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/call/:id" Component={Room} />
            <Route path="/" element={<Call />} />
            <Route
              path="/register"
              element={auth ? <Navigate to="/" /> : <Register />}
            />
          </Routes>
        </BrowserRouter>
      </SocketContextProvider>
    </>
  );
}

export default App;
