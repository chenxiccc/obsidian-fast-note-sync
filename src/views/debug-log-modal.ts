import { App, Modal, Setting } from "obsidian";
import { DebugLogManager } from "../lib/debug_log_manager";
import { $ } from "../i18n/lang";

export class DebugLogModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl, titleEl } = this;
        titleEl.setText($("ui.log.debug_title"));

        const container = contentEl.createDiv({ cls: "fns-debug-log-container" });
        container.style.fontFamily = "var(--font-monospace)";
        container.style.fontSize = "12px";
        container.style.backgroundColor = "var(--background-secondary-alt)";
        container.style.border = "1px solid var(--background-modifier-border)";
        container.style.borderRadius = "4px";
        container.style.padding = "10px";
        container.style.height = "400px";
        container.style.overflowY = "auto";
        container.style.whiteSpace = "pre-wrap";
        container.style.wordBreak = "break-all";

        const refreshLogs = () => {
            container.empty();
            const logs = DebugLogManager.getInstance().getLogs();
            if (logs.length === 0) {
                container.createDiv({ text: $("ui.log.empty"), cls: "fns-setting-no-results" });
                return;
            }
            logs.forEach(log => {
                const item = container.createDiv({ cls: "fns-debug-log-item" });
                item.style.borderBottom = "1px solid var(--background-modifier-border-faint)";
                item.style.padding = "4px 0";
                item.setText(log);
            });
            // Scroll to bottom
            container.scrollTop = container.scrollHeight;
        };

        refreshLogs();

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText($("ui.log.copy_all"))
                .onClick(async () => {
                    const logs = DebugLogManager.getInstance().getLogs().join("\n");
                    await navigator.clipboard.writeText(logs);
                })
            )
            .addButton(btn => btn
                .setButtonText($("ui.log.clear"))
                .onClick(() => {
                    DebugLogManager.getInstance().clearLogs();
                    refreshLogs();
                })
            )
            .addButton(btn => btn
                .setButtonText($("ui.button.collapse"))
                .onClick(() => this.close())
            );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
