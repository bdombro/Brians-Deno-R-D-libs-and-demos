import log from '../lib/log-stack.ts'
import * as fs from '../lib/files.ts'

async function findReplaceRecursive() {
	log.push('findReplaceRecursive')
	const dir = '.'
	const files = (await fs.readDir(dir, {recursive: true})).filter((f) => f.includes('findReplaceNaive.ts'))
	for (const file of files) {
		const contents = await fs.read(file)
		const filtered = contents.replace(/.*/g, '.').replace(/\n/g, '.')
		const hasChanged = filtered !== contents
		if (hasChanged) {
			log(`Updating ${file}`)
			// await fs.write(file, filtered)
			log(`Contents: ${filtered}`)
		}
	}
	log.pop()
}

findReplaceRecursive()
