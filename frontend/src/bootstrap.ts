import axios from "axios";
// @ts-expect-error Ziggy is known
import { Ziggy } from "./ziggy.js";
window.axios = axios;
window.axios.defaults.withCredentials = true;
window.axios.defaults.timeout = 60000;
window.axios.defaults.withXSRFToken = true;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

window.Ziggy = Ziggy;

export const fileExtensionMap = {
    js: 'javascript',
    py: 'python',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'c#',
    rb: 'ruby',
    php: 'php',
    html: 'html',
    css: 'css',
    swift: 'swift',
    go: 'go',
    rs: 'rust',
    kt: 'kotlin',
    pl: 'perl',
    r: 'r',
    sql: 'sql',
    sh: 'shell',
    ts: 'typescript',
    dart: 'dart',
    xml: 'xml',
    json: 'json',
	md: 'markdown',
    yaml: 'yaml',
    nix: 'nix'
} as const;

export function getLanguage(extension: string) {
    return extension in fileExtensionMap ? fileExtensionMap[extension as keyof typeof fileExtensionMap] : 'Unknown extension';
}
