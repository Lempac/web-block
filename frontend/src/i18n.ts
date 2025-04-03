import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { $api } from "./bootstrap";

const fetchTranslations = async (locale: string) => {
	const { data } = $api.useQuery("get", "/api/translations", {
		params: {
			query: {
				locale: locale,
			},
		},
	});
	return data;
};

i18n.use(initReactI18next).init({
	lng: "en", // Default language
	fallbackLng: "en",
	resources: {},
	interpolation: {
		escapeValue: false, // React already does escaping
	},
	react: {
		useSuspense: false,
	},
});

export const loadTranslations = async (locale: string) => {
	const translations = await fetchTranslations(locale);
	if(!translations) return;
	i18n.addResources(locale, "translation", translations);
};


export default i18n;
