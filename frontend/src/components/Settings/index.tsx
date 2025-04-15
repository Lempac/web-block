import {
	type NodeProps,
	useReactFlow,
	useStore,
	type Node,
} from "@xyflow/react";
import Resize from "../Resize";
import { $api, type CustomNodeType } from "@/bootstrap";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export type SettingsNode = Node<Record<never, never>, "settings">;

export default function Settings({ id }: NodeProps<SettingsNode>) {
	const { t } = useTranslation();
	const { isSuccess } = $api.useQuery("get", "/api/user");
	const { addNodes, getNode, getNodesBounds, updateNode } =
		useReactFlow<CustomNodeType>();
	const themeIsLoaded = useRef(false);
	const profileIsLoaded = useRef(false);
	const theme = getNode("theme");
	const profile = getNode("profile");
	const size = useStore((state) =>
		getNodesBounds(
			state.nodes.filter((node) => node.parentId === id) as CustomNodeType[],
		),
	);
	console.log(size);
	

	useEffect(() => {
		if (!theme && !themeIsLoaded.current) {
			themeIsLoaded.current = true;
			addNodes({
				id: "theme",
				type: "theme",
				position: { x: 100, y: 100 },
				data: {},
				parentId: "settings",
				extent: "parent",
				expandParent: true,
			});
		}
		if (isSuccess && !profile && !profileIsLoaded.current) {
			profileIsLoaded.current = true;
			addNodes({
				id: "profile",
				type: "profile",
				position: { x: 500, y: 50 },
				data: {},
				parentId: "settings",
				extent: "parent",
				expandParent: true,
			});
		}
	}, [addNodes, getNode, isSuccess, profile, theme]);

	useEffect(
		() =>
			updateNode("settings", {
				height: size.height,
				width: size.width,
			}),
		[size, updateNode],
	);

	return (
		<div className="card grid h-full content-between border-2 bg-base-200/25 p-4 shadow ring-neutral in-[.selected]:ring-4">
			<h2 className="card relative -top-10 max-w-fit border-2 border-secondary bg-base-200 p-2 text-2xl">
				{t("settings.name")}
			</h2>
			<Resize />
		</div>
	);
}
