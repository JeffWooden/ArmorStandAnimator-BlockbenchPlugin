# ArmorStandAnimator-BlockbenchPlugin
Blockbench plugin used to help Minecraft creators animating armor stands in the game.
## How to install
- Download the .js file and open **Blockbench**.
- Once the software is ready, go onto `File > Plugins` and click on `Load Plugin from File`.
- Select the .js file, wait for the installation to finish.
- Then go onto `Help > Developer > Reload Blockbench`.
- Confirm by clicking "Ok" and *voilà*, the plugin is ready to use.
## How to use
 - First, you'll need to create a new project that contains an "animate" mode (e.g. Generic Model, Bedrock Model).
 - Import the armorstand 3d model by clicking on `Armorstand Animator > Load Armorstand Model`.
 - Enter the animate mode and create an animation. Name it while following the "namespace convention" ([See more](https://minecraft.fandom.com/wiki/Resource_location#Java_Edition)) and set the snapping rule to 20 (as there are 20 ticks per second).
 - When you're done with the animation, you've two choices:
	 - either you use a plugin to generate keyframes every tick (e.g. Bakery),
	 - or you keep an animation whose keyframes transition instantly.
- Once you keep that in mind, press `Armorstand Animator > Export Animation`.
- A dialog should appear and ask you where you want your file to be saved. You can rename it and place it wherever you want in your datapack ([See more](https://minecraft.fandom.com/wiki/Function_(Java_Edition))).
- However, to load and read the animation, you'll need another datapack: https://github.com/JeffWooden/ArmorStandAnimator
- If the datapack is installed, all you have to do is to load the animation onto the armorstand. To do it, execute this command: `execute as <armor-stand> run function <path-to-the-exported-function>`
- Lastly, to start the animation, once again execute this command: `execute as <armor-stand> run function jw_aa:start`
