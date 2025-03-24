import "./index.css"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Finance } from "./Pages/Finance/Finance";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Finance />} />
      </Routes>
    </BrowserRouter>
  )
}
