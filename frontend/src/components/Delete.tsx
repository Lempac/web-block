import { NodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { CustomNodeType } from "..";
import { clearDirectory, pfs } from "@/bootstrap";

export default function Delete({ parent }: { parent: string }) {
	const { deleteElements } = useReactFlow<CustomNodeType>();
	const onDelete = async (id: string) => {
		const [name, file] = id.split("|*|");
		const path = `/${name}/${file}` as const;
		const stat = await pfs.lstat(path);
		// console.log(name, file)
		await pfs.unlink(`/${name}/.web-block/${file?.replaceAll("/", "-")}.json`)
		if(stat.isDirectory()){
			await clearDirectory(path)
			await pfs.rmdir(path)
		}
		else if(stat.isFile()){
			await pfs.unlink(path)
		}
		deleteElements({ nodes: [{ id }] })
	}
	return (
		<NodeToolbar
			//BUG: The only possible position cause the need to do custom css
			// that support scaling, so for now the delete button is on right side.
			position={Position.Right}
		>
			{/* <div className="relative -top-50"> */}
			<button
				className="btn btn-error"
				onClick={() => onDelete(parent)}
			>
				<RiDeleteBin6Line />
			</button>
			{/* </div> */}
		</NodeToolbar>
	);
}
