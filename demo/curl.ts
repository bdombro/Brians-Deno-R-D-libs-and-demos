/** See https://deno.land/api@v1.29.0?s=Deno.run */
const p = Deno.run({
	cmd: ['curl', 'https://example.com'],
	stdout: 'piped',
})
const status = await p.status()
console.log('status', status)
const out = new TextDecoder().decode(await p.output())
console.log('out', out)
