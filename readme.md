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
1. The owner of the Twitch channel this bot mods can add commands using the format below:
`!addcommand <commmand> <response>`

For example, to add the command for your Discord server, you'd write in the following message into your own chat with the bot running:
`!addcommand discord https://discord.gg/fHuz7c`

The commands are then saved in a commands.txt file on your computer.

To reference the user calling the command, use the variable `$user` in the response. For example you could have:
`!addcommand hug $user was hugged!`

The response would show up as:
`P4NASH was hugged!`

To remove a quote, use the command:
`!removequote <quote>`

2. This bot also has a persistent quotes system. To add a quote, use the command:
`!addquote <quote>`

To view a quote, write either:
`!quote` or `!quote <number>`

All quotes are stored in quotes.txt. To delete a quote, you can edit that txt file for now.

