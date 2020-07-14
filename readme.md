# Twitch Bot

This repository contains code for a simple Twitch bot. It's based off of (ComfyJS)[https://github.com/instafluff/ComfyJS].

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

Note: You can get your Twitch auth code from this (link)[https://twitchapps.com/tmi/].
