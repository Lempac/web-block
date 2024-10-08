import './bootstrap';
import '@xyflow/react/dist/style.css';
import '../css/app.css';

import {createRoot, hydrateRoot} from 'react-dom/client';
import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import {StrictMode} from "react";
import {ReactFlowProvider} from "@xyflow/react";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({el, App, props}) {
        if (import.meta.env.SSR) {
            hydrateRoot(el,
                <StrictMode>
                    <ReactFlowProvider>
                        <App {...props} />
                    </ReactFlowProvider>
                </StrictMode>);
            return;
        }

        createRoot(el).render(
            <StrictMode>
                <ReactFlowProvider>
                    <App {...props} />
                </ReactFlowProvider>
            </StrictMode>);
    },
    progress: {
        color: '#4B5563',
    },
});
