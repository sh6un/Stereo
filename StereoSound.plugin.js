/**
 * @name StereoSound
 * @version 0.0.2
 * @author sh6un
 * @authorId 1051196951141548052
 * @source https://raw.githubusercontent.com/sh6un/Stereo/refs/heads/main/StereoSound.plugin.js
 * @updateUrl https://raw.githubusercontent.com/sh6un/Stereo/refs/heads/main/StereoSound.plugin.js
 * @description Enables Stereo to your own microphone's output.
 */
module.exports = class StereoSound {
    constructor() {
        this.config = {
            info: {
                name: "StereoSound",
                authors: [{ name: "sh6un" }],
                version: "0.0.2",
            },
            defaultConfig: []
        };
        this.CheckPatch = new WeakSet();
    }
    start() {
        this.settingsWarning();

        const voiceModule = BdApi.Webpack.getModule(m => m?.prototype?.setRemoteVideoSinkWants);
        if (!voiceModule) return;

        BdApi.Patcher.after("StereoSound", voiceModule.prototype, "setRemoteVideoSinkWants", (thisObj, _args, ret) => {
            if (thisObj?.conn && !this.CheckPatch.has(thisObj.conn)) {
                this.CheckPatch.add(thisObj.conn);

                BdApi.Patcher.before("StereoSound", thisObj.conn, "setTransportOptions", (_thisObj, args) => {
                    const options = args[0];
                    if (!options) return;

                    if (options.audioEncoder) {
                        options.audioEncoder.channels = 2;
                    }
                    if (options.fec !== undefined) {
                    options.fec = false;
                    }
                    if (options.encodingVoiceBitRate < 512000) {
                    options.encodingVoiceBitRate = 512000;
                    }
                });
            }
            return ret;
        });
    }

    settingsWarning() {
        const voiceSettingsStore = BdApi.Webpack.getModule(m => typeof m?.getEchoCancellation === "function");
        if (!voiceSettingsStore) return;

        if (
            voiceSettingsStore.getNoiseSuppression() ||
            voiceSettingsStore.getNoiseCancellation() ||
            voiceSettingsStore.getEchoCancellation()
        ) {
            setTimeout(() => {
                BdApi.UI.showToast(
                    "⚠️ Please disable echo cancellation, noise reduction, and noise suppression for StereoSound",
                    { type: "warning", timeout: 5000 }
                );
            }, 1000);
        }
    }
    stop() {
        BdApi.Patcher.unpatchAll("StereoSound");
        this.CheckPatch = new WeakSet();
    }
};
