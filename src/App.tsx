import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.min.css";


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
