import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend, { type HttpBackendOptions } from "i18next-http-backend";
import { BASE_URL } from "./bootstrap";

i18n
	.use(initReactI18next)
	.use(HttpBackend)
	.init<HttpBackendOptions>({
		lng: "en", // Default language
		fallbackLng: "en",
		resources: {},
		ns: ["base"],
		defaultNS: "base",
		partialBundledLanguages: true,
		backend: {
			loadPath: `${BASE_URL}/api/translations/{{lng}}/{{ns}}`,
		},
		// saveMissing: true,
		debug: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
		interpolation: {
			escapeValue: false, // React already does escaping
		},
		react: {
			useSuspense: true,
		},
	});

export default i18n;
