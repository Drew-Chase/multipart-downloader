import React from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import ReactDOM from "react-dom/client";
import $ from "jquery";
import {NextUIProvider} from "@nextui-org/react";

import "./assets/scss/index.scss";
import Home from "./assets/pages/Home.tsx";
import ActionBar from "./assets/components/ActionBar.tsx";
import {ThemeProvider} from "./assets/providers/Theme.tsx";


ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <MainContentRenderer/>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);

export function MainContentRenderer()
{
    const navigate = useNavigate();
    return (
        <NextUIProvider navigate={navigate}>
            <main className={"flex flex-col"}>
                <ActionBar/>
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
