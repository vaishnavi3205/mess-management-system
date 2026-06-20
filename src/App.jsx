import AppRoutes from "./routes/AppRoutes";
import { MessProvider } from "./context/MessContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <MessProvider>
        <AppRoutes />
      </MessProvider>
    </AuthProvider>
  );
}

export default App;