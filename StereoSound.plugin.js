/**
 * @name StereoSound
 * @version 0.0.1
 * @author sh6un
 * @authorId 1051196951141548052
 * @description Enables Stereo to your own microphone's output.
 */

module.exports = class StereoSound {
  constructor() {
      this.config = {
          info: {
              name: "StereoSound",
              authors: [{ name: "sh6un" }],
              version: "0.0.1",
          },
          defaultConfig: []
      };
  }

  start() {
      this.settingsWarning();
      
      const voiceModule = BdApi.Webpack.getModule(m => m?.prototype?.updateVideoQuality);
      if (!voiceModule) return;
      
      BdApi.Patcher.after("StereoSound", voiceModule.prototype, "updateVideoQuality", (thisObj, _args, ret) => {
          if (thisObj && thisObj.conn?.setTransportOptions) {
              const originalSetTransportOptions = thisObj.conn.setTransportOptions;
              thisObj.conn.setTransportOptions = function (options) {
                  if (options.audioEncoder) {
                      options.audioEncoder.channels = 2;
                  }
                  if (options.fec) {
                      options.fec = false;
                  }
                  if (options.encodingVoiceBitRate < 512000) {
                      options.encodingVoiceBitRate = 512000;
                  }
                  originalSetTransportOptions.call(thisObj, options);
              };
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
  }
};
