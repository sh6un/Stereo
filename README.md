# BetterDiscord Stereo 
Last Update : November 17th 2025

## Changelog
**{ * } Attempted to fix recent crashing by :**
```
Replacing 'updateVideoQuality' module with 'setRemoteVideoSinkWants'.
Added a weakSet to track patching, ensuring it doesn't occur numerous times.
Options.fec check, to ensure it exists before pushing it to false.
Implemented a .before function in attempt to modify before Discord tampers with it.
```

**{ * } Update Prompts, to ensure you are on the latest plugin version.**

This is an **attempt** to fix recent crashing, further versions may be pushed if issues continue.
If the issue persists, ensure to narrow down what is making it crash so other possible resoloutions can be used.

Feedback is more than welcome, please star the repository too!
