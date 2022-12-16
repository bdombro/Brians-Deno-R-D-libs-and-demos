import {j} from '../lib/js-parsing.ts'

/**
 * Demonstrates replacing a module.exports with an export default
 */
function demoReplaceModuleExport(jsChunk: string) {
	const c = j(jsChunk)

	// Both of these work
	const isModuleExports1 = (p: j.ASTPath<BinaryExpressionStatement>) => j(p).toSource().startsWith('module.exports')
	const isModuleExports2 = (p: j.ASTPath<BinaryExpressionStatement>) =>
		p.value?.expression?.left?.object?.name === 'module' && p.value?.expression?.left?.property?.name === 'exports'

	const moduleExportPath = c
		// can also pass a filter to find, but that's type unsafe and ugly
		// .find(j.ExpressionStatement, {expression: {left: {object: {name: 'module'}, property: {name: 'export'}}}})
		.find(j.ExpressionStatement)
		.map((p) => p as j.ASTPath<BinaryExpressionStatement>)
		.filter(isModuleExports1)
		.filter(isModuleExports2)
		.paths()[0]
	const moduleExportRight = moduleExportPath.node.expression.right
	const exportDefaultPath = j.exportDefaultDeclaration(moduleExportRight)
	moduleExportPath.replace(exportDefaultPath)

	console.log(c.toSource())
}

// Create custom BinaryExpressionStatement bc jscodeshift doesn't have a type for it for some reason
interface BinaryExpressionStatement extends Omit<j.ExpressionStatement, 'expression'> {
	expression: BinaryExpression
}
interface BinaryExpression extends Omit<j.BinaryExpression, 'left'> {
	left: j.BinaryExpression['left'] & {
		object: {name: string}
		property: {name: string}
	}
}

demoReplaceModuleExport(`

import hello from 'hello'
let a = 1
a = 3
function b() {
	a = 2
	return 2
}
module.exports = 'blah'

`)
