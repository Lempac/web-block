import { NodeProps, useReactFlow, useStore, type Node } from "@xyflow/react";
import Resize from "../Resize";
import { $api, CustomNodeType } from "@/bootstrap";
import { useEffect, useRef } from "react";
import { ThemeNode } from "./Theme";
import { ProfileNode } from "./Profile";

export type SettingsNode = Node<Record<never, never>, "settings">;

export default function Settings({ id }: NodeProps<SettingsNode>) {
	const { isSuccess } = $api.useQuery("get", "/api/user");
	const { addNodes, getNode, deleteElements, getNodesBounds, updateNode } =
		useReactFlow<CustomNodeType>();
	const themeIsLoaded = useRef(false);
	const profileIsLoaded = useRef(false);
	const size = useStore((state) =>
		getNodesBounds(
			state.nodes.filter((node) => node.parentId === id) as CustomNodeType[],
		),
	);
	const theme = useStore((state) => state.nodeLookup.get("theme") as ThemeNode | undefined);
	const profile = useStore((state) => state.nodeLookup.get("profile") as ProfileNode | undefined);

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

	useEffect(() => {
		updateNode("settings", {
			height: size.height + 40,
			width: size.width + 40,
		});
	}, [themeIsLoaded, profileIsLoaded, size.width, size.height]);

	return (
		<div className="card grid h-full content-between border-2 p-4">
			<h2 className="card relative -top-10 max-w-fit border-2 bg-base-200 p-2 text-2xl">
				Settings
			</h2>
			<button
				className="btn text-2xl"
				onClick={() =>
					deleteElements({
						nodes: [{ id: "settings" }, { id: "profile" }, { id: "theme" }],
					})
				}
			>
				Save
			</button>
			<Resize />
		</div>
	);
}
