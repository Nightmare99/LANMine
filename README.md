# LANMine
Minecraft server hosting. Now easier than ever.

## Features
- Run ANY minecraft server jar file with any flags that your system supports.
- Allow players to connect from all around the world, without port-forwarding or virtual network services like Hamachi
- Send a message to a discord server with the minecraft server IP through a bot.

## Who is this for?
Are you looking to make the next Hypixel or HiveMC?

If yes, then this app is **NOT FOR YOU**. Please use a dedicated host. 

Are you one of those people who don't wanna port-forward your IP to play with your friends?

If yes, this app is **ABSOLUTELY** for you. It will make your life easier and your friends will think you are a magician :)

## Installation
Grab the installation file for your operating system and install like any other app. Upon install, you will be asked for the following:

 | Option             | Description                                                                |
 | ------------------ | -------------------------------------------------------------------------- |
 | Minecraft server jar file location          | Opens file picker to select your minecraft server jar file.                                             |
 |   Jar flags   | All the flags needed to run your minecraft server.  |
 | Ngrok Auth token            | Your auth token from [ngrok](https://ngrok.com/) |
 | Server port            | The port your minecraft server is configured to run in |
 | Discord channel id (optional)            | The discord text channel's ID where the bot has to send the public url  |

**NOTE:** For the discord feature to work, [this bot](https://discord.com/api/oauth2/authorize?client_id=756065380107157635&permissions=0&scope=bot) must be a member of the discord server. You can use your own bot as well, but you will have to build the app from source.

## Setting up a development environment
See [here](/SETUP.md).