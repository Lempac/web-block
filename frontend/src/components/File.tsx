export default function File({ data }: { data: File }) {
	return (
		<div className="card bg-base-content p-2 gap-2">
			<div className="collapse collapse-arrow bg-base-200">
				<input type="checkbox" />
				<h1 className="collapse-title text-xl font-medium">{data.name}</h1>
				<div className="collapse-content">
					<p>hello</p>
				</div>
			</div>
		</div>
	);
}
