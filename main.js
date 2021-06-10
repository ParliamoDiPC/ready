//  _____
// |  ___|_ _ ___ _ __ ___    __ _  __ _
// | |_ / _` / __| '_ ` _ \  / _` |/ _` |
// |  _| (_| \__ \ | | | | || (_| | (_| |
// |_|  \__,_|___/_| |_| |_(_)__, |\__,_|
//                           |___/

// © 2021-today Fasm.ga
// Protected by GNU GPL v3 License.
// https://github.com/fasm-ga/bot


// Packages

const Discord = require("discord.js")

// Setting up basic things

const bot = new Discord.Client({ intents: [Discord.Intents.NON_PRIVILEGED, "GUILD_MEMBERS"] })

bot.commands = new Discord.Collection()
bot.commands.descriptions = new Discord.Collection()
bot.commands.usage_informations = new Discord.Collection()

bot.embeds = require("./modules/embeds.js")

bot.prefix = "?"

exports.bot = bot

for (file of require("fs").readdirSync("commands")) {
    const command = require("./commands/" + file)
    bot.commands.set(command.name.toLowerCase(), command)
    bot.commands.descriptions.set(command.description.toLowerCase(), command)
    bot.commands.usage_informations.set(command.usage.toLowerCase(), command)
}

bot.on("ready", () => {
    console.log("Logged in!")
    startListeners()
})

function startListeners() {
    for (file of require("fs").readdirSync("listeners")) {
        require("./listeners/" + file)
    }
}

// On message

bot.on("message", message => {
    if (message.author.bot || !message.guild || !message.content.startsWith(bot.prefix)) return;

    const args = message.content.slice(bot.prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();
    message.args = args;

    if (!bot.commands.has(command)) return message.channel.send(bot.embeds.error("The command \"" + command + "\" doesn't exist."))
    bot.commands.get(command).run(bot, message)
})

// Starting the bot

bot.login("") // Your token here
