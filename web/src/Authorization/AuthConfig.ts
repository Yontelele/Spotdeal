import { AccountInfo, Configuration, InteractionRequiredAuthError, PublicClientApplication } from "@azure/msal-browser"

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: import.meta.env.VITE_MSAL_AUTHORITY,
    redirectUri: window.location.origin,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
}

export const msalInstance = new PublicClientApplication(msalConfig)

export const loginRequest = {
  scopes: [import.meta.env.VITE_API_SCOPE],
  prompt: "select_account",
}

export const getActiveAccount = (): AccountInfo | null => {
  let account = msalInstance.getActiveAccount()
  if (!account) {
    const accounts = msalInstance.getAllAccounts()
    if (accounts.length > 0) {
      account = accounts[0]
      msalInstance.setActiveAccount(account)
    }
  }
  return account
}

export const loginRedirect = async () => {
  await msalInstance.loginRedirect(loginRequest)
}

export const getAccessToken = async (): Promise<string> => {
  const account = getActiveAccount()
  if (!account) throw new Error("Ingen inloggad användare hittades. Vänligen logga in på nytt.")

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    })
    return response.accessToken
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect(loginRequest)
    }
    throw error
  }
}
