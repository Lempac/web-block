import type { JSX } from "react";

export default function IterToOptions({iter}: {iter: SetIterator<string>}) {
	const options: JSX.Element[] = [];
	let current = iter.next();
	while (!current.done) {
		options.push(
			<option key={current.value} value={current.value}>
				{current.value}
			</option>,
		);
		current = iter.next();
	}
	return options;
}
