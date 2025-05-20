import { type NodeProps, useReactFlow, type Node } from "@xyflow/react";
import Resize from "../Resize";
import { INITAL_SETTINGS_WINDOW } from "@/bootstrap";
import { type CustomNodeType } from "@/index";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/Providers/useUser";

export type SettingsNode = Node<Record<never, never>, "settings">;

export default function Settings({ width, height }: NodeProps<SettingsNode>) {
	const { isSuccess, settings, setSettings } = useUser();
	const { t } = useTranslation();

	const { addNodes, getNode } = useReactFlow<CustomNodeType>();
	const themeIsLoaded = useRef(false);
	const profileIsLoaded = useRef(false);
	const keybindsIsLoaded = useRef(false);
	const theme = getNode("theme");
	const profile = getNode("profile");
	const keybinds = getNode("profile");
	// const size = useStore((state) =>
	// 	getNodesBounds(
	// 		state.nodes.filter((node) => node.parentId === id) as CustomNodeType[],
	// 	),
	// );

	useEffect(() => {
		if (!theme && !themeIsLoaded.current) {
			themeIsLoaded.current = true;
			addNodes({
				id: "theme",
				type: "theme",
				position: {
					x: settings.theme.x ? settings.theme.x : 100,
					y: settings.theme.y ? settings.theme.y : 100,
				},
				style: { width: settings.theme.width, height: settings.theme.height },
				data: {},
				parentId: "settings",
				expandParent: true,
			});
		}
		if (!keybinds && !keybindsIsLoaded.current) {
			keybindsIsLoaded.current = true;
			// addNodes({
			// 	id: "keybinds",
			// 	type: "keybinds",
			// 	position: {
			// 		x: settings.keybinds.x ? settings.keybinds.x : 100,
			// 		y: settings.keybinds.y ? settings.keybinds.y : 100,
			// 	},
			// 	style: {
			// 		width: settings.keybinds.width,
			// 		height: settings.keybinds.height,
			// 	},
			// 	data: {},
			// 	parentId: "settings",
			// 	expandParent: true,
			// });
		}
		if (!profile && !profileIsLoaded.current) {
			profileIsLoaded.current = true;
			addNodes({
				id: "profile",
				type: "profile",
				position: {
					x: settings.profile.x ? settings.profile.x : 500,
					y: settings.profile.y ? settings.profile.y : 50,
				},
				style: {
					width: settings.profile.width,
					height: settings.profile.height,
				},
				data: {},
				parentId: "settings",
				expandParent: true,
			});
		}
	}, [
		addNodes,
		isSuccess,
		keybinds,
		profile,
		settings.keybinds.height,
		settings.keybinds.width,
		settings.keybinds.x,
		settings.keybinds.y,
		settings.profile.height,
		settings.profile.width,
		settings.profile.x,
		settings.profile.y,
		settings.theme.height,
		settings.theme.width,
		settings.theme.x,
		settings.theme.y,
		theme,
	]);

	// useEffect(() => {
	// 	updateNode("settings", {
	// 		height: size.height,
	// 		width: size.width,
	// 	});
	// }, [size, updateNode]);
	useEffect(() => {
		//HACK: values are 0 on init
		if (width === 0 || height === 0) return;
		setSettings({
			...settings,
			height: height ?? INITAL_SETTINGS_WINDOW.height,
			width: width ?? INITAL_SETTINGS_WINDOW.width,
		});
	}, [height, setSettings, settings, width]);

	return (
		<div className="card grid h-full content-between border-2 bg-base-200/25 p-4 shadow ring-neutral in-[.selected]:ring-4">
			<h2 className="card relative -top-10 max-w-fit border-2 border-secondary bg-base-200 p-2 text-2xl">
				{t("settings.name")}
			</h2>
			{/* <Delete parent={id}/> */}
			<Resize />
		</div>
	);
}
