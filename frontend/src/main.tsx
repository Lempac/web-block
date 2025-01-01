import './bootstrap.ts';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@xyflow/react/dist/style.css';
import '@/index.css';
import App from '@/App.tsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Ziggy } from '@/ziggy.js';
import {ReactFlowProvider} from "@xyflow/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
globalThis.Ziggy = Ziggy;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 1000 * 60,
        }
    }
})


createRoot(document.getElementById('root')!).render(<StrictMode>
    <QueryClientProvider client={queryClient}>
        <ReactFlowProvider>
            <App/>
        </ReactFlowProvider>
    </QueryClientProvider>
</StrictMode>,)
