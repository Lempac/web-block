import { AxiosInstance } from "axios";

declare global {
	interface Window {
		Ziggy: unknown;
		axios: AxiosInstance;
	}
}
