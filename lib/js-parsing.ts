/**
 * jscodeshift is a JavaScript codemod toolkit that
 * allows for jquery like navigation of the AST
 *
 * Tips:
 *
 * - Refs:
 *   - https://github.com/benjamn/ast-types
 *   - https://github.com/reactjs/react-codemod
 *   - https://www.toptal.com/javascript/write-code-to-rewrite-your-code
 *   - https://astexplorer.net/
 *
 * - Types: Collection vs Nodes vs Paths
 *  - Collections are the jscodeshift objects, i.e. collection of NodePaths
 *  - Nodes are the actual AST nodes
 *  - NodePaths are the AST nodes wrapped in a jscodeshift object
 *  - i.e. path.value = path.node = the raw node
 *
 * - jscodeshift Collections:
 *   c = j(source or node or path)
 *   methods: _parent, toSource, find, filter, nodes, paths, get, at, remove, forEach, replaceWith
 *
 * - jscodeshift NodePaths
 *   methods: name, parent, parentPath, scope, value, node, replace, prune
 *
 * - jscodeshift Nodes
 *   attrs: type, loc, start, end, expression
 *   methods: nodes, paths
 *
 * - Creating a Node
 *   j.literal('foo')
 *   j.exportDefaultDeclaration(j.literal('foo'))
 *
 *       j.expressionStatement(
 *         j.callExpression(
 *           j.functionExpression(
 *             j.identifier("foo"),
 *             [],
 *             j.blockStatement(j.literal('foo'))
 *           ),
 *           []
 *         ),
 *         []
 *       )
 *
 *
 * - Dumping the AST - useful for learning/debugging
 *   - https://astexplorer.net/
 *   - c.find(j.Statement).forEach(p => {console.log(p.value);console.log('source', j(p).toSource())})
 *
 * - Traversing down a Collection/NodePath
 *   c.find(j.<type>) // returns a new collection that is filtered by type
 *   c.find(j.<type>)._parent // gets the collection pre-filtered by type
 *   c.find(j.Statement, {type: 'ExpressionStatement'})
 *   c.find(j.Statement).filter(p => p.value.type === 'ExpressionStatement')
 *   c.filter(j.<type>)
 *   j(p).find(j.<type>)
 *   p.paths()
 *   p.nodes()
 *   p.get(0) // get first path in paths
 *   p.at(0) // p with only one path at index 0
 *
 * - Removing/Deleting a Collection
 *   c.find(j.<type>).remove()
 *   c.find(j.<type>).forEach(p => p.prune())
 *   c.find(j.<type>).forEach(p => p.replace())
 *
 * - Mutations
 *   - c.find(j.<type>).replaceWith(nodePath => node)
 *   - p.replace(node | empty)
 *   - p.prune()
 *
 *
 * Types
 * - j.ImportDeclaration - import statements
 * - j.ExportDefaultDeclaration - export default statements
 * - j.ExportNamedDeclaration - export named statements
 * - j.VariableDeclaration - const, let, var
 * - j.FunctionDeclaration - functions
 * - j.Statement - variables, expressions, functions, blocks, etc
 * - j.ExpressionStatement - the setting of an existing variable, i.e. 'a = 1'
 * - j.BlockStatement - the body of a function including '{' and '}'
 * - j.Identifier - a target of an assignment i.e. 'a' in const a = 1
 *
 */

// @deno-types="npm:@types/jscodeshift/index.d.ts"
import j from 'npm:jscodeshift'

/** Can convert a js src statement into a NodePath */
function srcToPath(src: string) {
	return j(src).find(j.Statement).paths()[0]
}

export {j, srcToPath}
