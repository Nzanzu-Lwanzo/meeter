import Room from "./pages/Room";
import Call from "./pages/Call";
import Register from "./pages/Register";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAppContext } from "./contexts/AppContext";
import { SocketContextProvider } from "./contexts/SocketContext";
import { SnackbarProvider } from "notistack";

function App() {
  const { auth } = useAppContext();

  return (
    <>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
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
      </SnackbarProvider>
    </>
  );
}

export default App;
