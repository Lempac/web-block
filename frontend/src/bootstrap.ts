import axios from "axios";
// @ts-expect-error Ziggy is known
import { Ziggy } from "./ziggy.js";
window.axios = axios;
window.axios.defaults.withCredentials = true;
window.axios.defaults.timeout = 60000;
window.axios.defaults.withXSRFToken = true;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

window.Ziggy = Ziggy;
