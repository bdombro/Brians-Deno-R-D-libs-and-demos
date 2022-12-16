import jsonGrammar from './json-grammar.ts'
import * as mod from 'https://deno.land/x/nearley@2.19.7-deno/mod.ts'

function main() {
	const grammar: mod.Grammar = mod.Grammar.fromCompiled(jsonGrammar)
	const parser: mod.Parser = new mod.Parser(grammar)

	parser.feed(chunk)
	const asts = parser.finish()
	console.log(asts)
}

const chunk = `
{"test": 42}
`

main()
