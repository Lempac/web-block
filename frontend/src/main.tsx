import "./bootstrap.ts";
import { I18nextProvider } from "react-i18next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "./i18n.ts";
import ProjectProvider from "./Providers/ProjectProvider.tsx";
import { initExample } from "./bootstrap.ts";
import UserProvider from "./Providers/UserProvider.tsx";

const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) {
	localStorage.setItem('token', token);
	window.location.replace(import.meta.env.BASE_URL);
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 1000 * 60,
		},
	},
});

if (
	localStorage.getItem("firstTime") === null ||
	localStorage.getItem("firstTime") === "true"
) {
	console.log("Generating example data...")
	initExample();
}

//@ts-expect-error for debug
if(import.meta.env.DEV) window.initExample = initExample;

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<I18nextProvider i18n={i18n}>
				<ReactFlowProvider>
					<UserProvider>
						<ProjectProvider>
							<App />
						</ProjectProvider>
					</UserProvider>
				</ReactFlowProvider>
			</I18nextProvider>
		</QueryClientProvider>
	</StrictMode>,
);
