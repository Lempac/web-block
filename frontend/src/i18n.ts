import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ChainedBackend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import LocalStorageBackend from "i18next-localstorage-backend";

i18n
	.use(initReactI18next)
	.use(ChainedBackend)
	.init({
		lng: "en", // Default language
		fallbackLng: "en",
		resources: {},
		ns: ["base"],
		defaultNS: "base",
		partialBundledLanguages: true,
		backend: {
			backends: [LocalStorageBackend, HttpBackend],
			backendOptions: [
				{ expirationTime: 24 * 60 * 60 * 1000 },
				{ loadPath: `${import.meta.env.VITE_SERVER_URL}/api/translations/{{lng}}/{{ns}}` },
			],
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
