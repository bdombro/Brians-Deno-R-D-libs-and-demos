// @deno-types="npm:@types/estree/index.d.ts"
// @deno-types="npm:@types/esprima@4/index.d.ts"
import esprima from 'npm:esprima@4'

export function parseModule(src: string) {
	const tree = esprima.parseModule(src, {loc: true})

	// hot-patch the toString methods to actually work
	tree.toString = () => src
	tree.body.toString = () => src
	// parse the src to fine the index location of each line, so that we can slice it up easier
	const srcLineStarts = [0, ...[...src.matchAll(/\n/gi)].map((a) => a.index! + 1)]
	tree.body.forEach((node) => {
		node.toString = function () {
			return src.slice(
				srcLineStarts[node.loc!.start.line - 1] + node.loc!.start.column,
				srcLineStarts[node.loc!.end.line - 1] + node.loc!.end.column,
			)
		}
	})

	return tree
}

// deno-lint-ignore no-unused-vars
async function demo() {
	const jsChunk = `
		import hello from 'hello'

		const a = 1

		function b() {
			return 2
		}

		export default function () {
			const c = 3
			return a + b()
		}
	`
	const tree = await parseModule(jsChunk)
	console.log(
		'Dump of top level declarations:',
		tree.body.map((n) => n.toString()),
	)
}
