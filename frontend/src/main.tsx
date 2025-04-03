import "./bootstrap.ts";
import { I18nextProvider } from "react-i18next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "./i18n.ts";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 1000 * 60,
		},
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<I18nextProvider i18n={i18n}>
				<ReactFlowProvider>
					<App />
				</ReactFlowProvider>
			</I18nextProvider>
		</QueryClientProvider>
	</StrictMode>,
);
