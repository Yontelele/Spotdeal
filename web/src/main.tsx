import App from "./App.tsx"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { MsalProvider, MsalAuthenticationTemplate } from "@azure/msal-react"
import { msalInstance } from "./Authorization/AuthConfig.ts"
import { InteractionType } from "@azure/msal-browser"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  </StrictMode>
)
