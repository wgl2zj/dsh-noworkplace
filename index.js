/**
 * dsh-noworkplace — DeepSeek Harness Host plugin.
 *
 * Keeps a fixed "无工作区" workspace at ~/.dsh/scratch so scattered one-off
 * conversations never need a folder pick.
 *
 * The WorkspaceRegistry's create() is idempotent over the canonical path:
 * repeated activations reuse the durable record and leave a user-renamed
 * title alone. If the user deletes the workspace registration, the next
 * activation recreates it; disable this plugin to stop that.
 */
const name = "dsh-noworkspace";
const inject = ["workspaceRegistry"];
/** Display title used only when the durable record is first created. */
const TITLE = "无工作区";
/** Resolve the fixed scratch directory under the user home. */
function scratchDirectory() {
	const { join } = process.getBuiltinModule("node:path");
	const { homedir } = process.getBuiltinModule("node:os");
	return join(homedir(), ".dsh", "scratch");
}
/**
 * Ensure the scratch directory exists and is registered as a workspace.
 * @param ctx - Host plugin context with the workspace registry injected.
 */
function apply(ctx) {
	const registry = ctx.get("workspaceRegistry");
	const directory = scratchDirectory();
	const ensure = async () => {
		const { mkdir } = process.getBuiltinModule("node:fs/promises");
		await mkdir(directory, { recursive: true });
		await registry.create(directory, TITLE);
	};
	ensure().catch((error) => {
		const logger = ctx.logger;
		if (logger?.warn !== void 0) logger.warn(`${name}: ${String(error)}`);
		else console.warn(`${name}: ${String(error)}`);
	});
}
export { apply, inject, name };
