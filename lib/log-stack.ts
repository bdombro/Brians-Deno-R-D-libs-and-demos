import chalk from 'npm:chalk@5'
import spawn from './spawn.ts'

export default function log(msg = '', shouldReplaceLast?: boolean) {
	if (log.disabled) return
	const ind = '  '.repeat(log.indentation)
	return shouldReplaceLast ? Deno.stdout.write(new TextEncoder().encode(ind + `${msg}\r`)) : console.log(ind + msg)
}
log.disabled = false
log.disable = () => (log.disabled = true)
log.enable = () => (log.disabled = false)
log.indentation = 0
log.default = log
log.subdued = (msg: string, shouldReplaceLast?: boolean) => log(chalk.gray(msg), shouldReplaceLast)
log.info = async (msg: string, shouldReplaceLast?: boolean) => {
	const msgArray = Array.isArray(msg) ? msg : [msg]
	for (const m of msgArray) {
		await log(chalk.gray('• ' + m), shouldReplaceLast)
	}
}
log.announce = (msg: string, shouldReplaceLast?: boolean) => log(chalk.black.bgGreen(msg), shouldReplaceLast)
log.warn = (msg: string, shouldReplaceLast?: boolean) =>
	// @ts-ignore missing color
	log(chalk.white.bgOrange(msg), shouldReplaceLast)
log.error = (msg: string, shouldReplaceLast?: boolean) => log(chalk.white.bgRed(msg), shouldReplaceLast)
log.newLine = () => log('')
log.say = (msg: string) => spawn(`say ${msg}`)
log.pushStack = [] as string[]
log.push = (msg: string) => {
	log.subdued('-> ' + msg)
	log.pushStack.push(msg)
	log.indentation++
}
log.pop = () => {
	log.indentation--
	log.subdued('<- ' + log.pushStack.pop())
}
