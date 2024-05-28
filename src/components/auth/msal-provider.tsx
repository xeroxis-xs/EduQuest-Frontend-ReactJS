// 'use client'
//
// import React, { useEffect } from "react";
// import { initializeMsal, msalInstance } from "@/app/msal/msal";
// import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from "@azure/msal-react"
// import Page from "@/app/auth/sign-in/page";
//
// export default function MyMsalProvider({ children }: { children: React.ReactNode }) {
//
//   const initialize = async () => {
//     await initializeMsal();
//     console.log('MSAL initialized');
//   }
//
//   useEffect(() => {
//     initialize().then(r => console.log('MSAL initialized')).catch(e => console.error(e));
//   }, []);
//
//   return (
//     <MsalProvider instance={msalInstance}>
//       {/*<AuthenticatedTemplate>*/}
//         {children}
//       {/*</AuthenticatedTemplate>*/}
//       {/*<UnauthenticatedTemplate>*/}
//       {/*  <Page />*/}
//       {/*</UnauthenticatedTemplate>*/}
//     </MsalProvider>
//   );
// };
