import AppRoutes from "./routes/AppRoutes";
import { MessProvider } from "./context/MessContext";

function App() {
  return (
    <MessProvider>
      <AppRoutes />
    </MessProvider>
  );
}

export default App;