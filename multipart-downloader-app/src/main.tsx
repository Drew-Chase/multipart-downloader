import React from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import ReactDOM from "react-dom/client";
import $ from "jquery";
import {NextUIProvider} from "@nextui-org/react";

import "./assets/scss/index.scss";
import Home from "./assets/pages/Home.tsx";
import ActionBar from "./assets/components/ActionBar.tsx";
import {ThemeProvider} from "./assets/providers/ThemeProvider.tsx";
import {SettingsModalProvider} from "./assets/providers/SettingsModalProvider.tsx";
import {StartDownloadProvider} from "./assets/providers/StartDownloadProvider.tsx";


ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <SettingsModalProvider>
                    <StartDownloadProvider>
                        <MainContentRenderer/>
                    </StartDownloadProvider>
                </SettingsModalProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);

export function MainContentRenderer()
{
    const navigate = useNavigate();
    $("html").off("contextmenu").on("contextmenu", e => e.preventDefault());

    return (
        <NextUIProvider navigate={navigate}>
            <main className={"flex flex-col"}>
                {/*// @ts-ignore*/}
                {window.__TAURI_INTERNALS__! && <ActionBar/>}
                <div className={"flex flex-row w-full max-h-[calc(100vh-2.5rem)] h-screen overflow-y-auto"}>
                    <Routes>
                        <Route>
                            <Route path="/" element={<Home/>}/>
                        </Route>
                    </Routes>
                </div>
            </main>
        </NextUIProvider>
    );
}
