/** See https://deno.land/api@v1.29.0?s=Deno.run */

/** Spawns a process and returns the output */
export default async function spawn(cmd: string) {
	const p = Deno.run({
		cmd: cmd.split(' '),
		stdout: 'piped',
	})
	const out = new TextDecoder().decode(await p.output())
	return out
}
