import "./index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import MapComponent from "./components/MapComponent.tsx"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MapComponent />
    </StrictMode>
)
