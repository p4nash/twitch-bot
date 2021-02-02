# Twitch Bot

This repository contains code for a simple Twitch bot. It's based off of [ComfyJS](https://github.com/instafluff/ComfyJS).

## How to use:
1. Download or clone the repo.
2. Create a `.env` file in the main folder. It should be just named `.env`.
3. Add the following variables to the file:
```
TWITCH_AUTH_CLIENT = "<your twitch auth code>"
TWITCH_USERNAME= "<username of your bot profile>"
TWITCH_TARGET_CHANNEL="<username of your channel that you want to add bot to>"
```
4. Run `node app.js` to have the code online. You have to install the required node modules first.

Note: You can get your Twitch auth code from this [link](https://twitchapps.com/tmi/).

# Current features:
## The broadcaster and mods can add commands using the format below:
`!addcommand <command> <response>`

For example, to add the command for your Discord server, you'd write in the following message into your own chat with the bot running:
`!addcommand discord https://discord.gg/fHuz7c`

The commands are then uploaded to the Firebase database linked.

## To reference the user calling the command, use the variable `$user` in the response. For example you could have:
`!addcommand hug $user was hugged!`

The response to "P4NASH: !lurk" would show up as:
`P4NASH is now lurking!`

## To reference a target for a command, use the variable `$target` in the response. For example, you could have:
`!addcommand so $target is raiding! You can check them out at their channel https://www.twitch.tv/$target`

The response to the command "!so J_Writer_" would then be:
`J_Writer is raiding! You can check them out at their channel https://wwww.twitch.tv/target`

Note that the target is the second argument that we call within the final saved command.

## Mods can remove a command as well using the format below:
`!removecommand <command>`

If the corresponding command is not found, the bot will send a message accordingly.

## Mods can edit a command:
`!editcommand <command> <response>`

If the corresponding command is not found, the bot will send a message accordingly.

## This bot also has a persistent quotes system. To add a quote, use the command:
`!addquote <quote>`

To view a quote, write either:
`!quote` or `!quote <number>`

All quotes are stored in the Firebase database. For now, you can only delete a quote via the Firebase console (for owner).

