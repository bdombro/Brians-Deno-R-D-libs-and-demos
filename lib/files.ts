// deno-lint-ignore-file require-await

/** Returns context for the script import.meta passed in */
export function ctx(importMeta: ImportMeta) {
	const cwd = Deno.cwd()
	const filename = importMeta.url.replace('file://', '')
	const relFilename = filename.replace(`${cwd}/`, '')
	const _dirname = dirname(filename)
	const relDirname = _dirname.replace(`${cwd}/`, '')

	return {
		filename,
		relFilename,
		dirname: _dirname,
		relDirname,
		cwd,
	}
}

export function basename(path: string) {
	return path.split('/').pop() || ''
}

export function dirname(path: string) {
	return path.split('/').slice(0, -1).join('/') || ''
}

export async function exists(path: string) {
	try {
		await Deno.stat(path)
		return true
	} catch (err) {
		if (err instanceof Deno.errors.NotFound) return false
		else throw err
	}
}

export async function mkdir(path: string, {clobber = false}) {
	if (clobber && (await exists(path))) {
		await Deno.remove(path, {recursive: true})
	}
	return Deno.mkdir(path, {recursive: true})
}

export async function pathResolve(path: string) {
	return Deno.realPath(path)
}

export async function read(path: string) {
	return Deno.readTextFile(path).catch(() => throwError(`${path} read failed`))
}

export async function readDir(path: string, {recursive = false} = {}) {
	let results: string[] = []

	const dirEntries: Deno.DirEntry[] = []
	try {
		for await (const fileName of Deno.readDir(path)) {
			dirEntries.push(fileName)
		}
	} catch (_) {
		throw new Error(`${path} stat failed`)
	}

	for (const dirEntry of dirEntries) {
		const matchDotSlashPrefix = new RegExp('^./')
		const filePath = `${path}/${dirEntry.name}`.replace(matchDotSlashPrefix, '')
		if (recursive && dirEntry.isDirectory) {
			const res = await readDir(filePath, {recursive: true})
			results = results.concat(res)
		} else {
			results.push(filePath)
		}
	}

	return results
}

export async function readStream(path: string) {
	return Deno.open(path)
}

export async function write(path: string, content: string) {
	return Deno.writeTextFile(path, content)
}

export async function writeStream(path: string) {
	return Deno.open(path, {write: true})
}

function throwError(e: Error | string): never {
	throw e
}
