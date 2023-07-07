const discord = require("discord.js")

const bot = new discord.Client({ intents: 3276799})
const token = "your-token"
const prefix = "!"

bot.login(token)
bot.on("ready", client=>{
    console.log(client.user.username + " is ready!")
})
bot.on("messageCreate", async message=>{
    if (!message.content.startsWith(prefix)) return;
    args = message.content.split(" ")
    args = args.filter((str)=>str != "")
    command = message.content.split(" ")[0]
    command = command.substring(prefix.length, command.length).toLowerCase()
    if (command == "ban"){
        if (!message.member.permissions.has(discord.PermissionsBitField.Flags.BanMembers) && !message.member.permissions.has(discord.PermissionsBitField.Flags.Administrator) && message.member.id != message.guild.ownerId) return;
        let member = message.mentions.members.first() 
        if (!member){
            member = await message.guild.members.fetch(args[1]).catch(err=> {
                console.log(err.message);
            })
        }
        let user_outside_of_server = await bot.users.fetch(args[1]).catch(err=>{
            console.log(err.message)
        })
        if (!args[1]) return message.channel.send("You need to mention a member via mentions or id");
        if (!user_outside_of_server && !member) return message.channel.send("You need to mention a member via mentions or id");
        var reason = "";
        for (var e = 2; e < args.length; e++){
            reason = reason + args[e]
        }
        if (reason == ""){
            reason = "None"
        }
        if (!member){
            const ban = await message.guild.bans.fetch(user_outside_of_server.id).catch(err=> {
                console.log(err.message)
            })
            if (ban) return message.channel.send(user_outside_of_server.username + " is already banned")
            const confirm = new discord.ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Ban')
			.setStyle(discord.ButtonStyle.Danger);

            const cancel = new discord.ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle(discord.ButtonStyle.Secondary);
            const row = new discord.ActionRowBuilder()
            .addComponents(cancel, confirm);

            const sentmsg = await message.reply({
                content: `Are you sure you want to ban ${user_outside_of_server.username}?`,
                components: [row],
            });
            const collector = message.channel.createMessageComponentCollector();
            collector.on('collect', async i=>{
                if (i.message.id != sentmsg.id) return;
                if (i.user.id != message.member.id) return;
                if (i.customId == "confirm"){
                    await message.guild.members.ban(args[1])
                    .then(user => {
                        console.log(user.username);
                    })
                    .catch(console.error);
                    i.reply("I have banned " + user_outside_of_server.username + ` for ${reason}`)
                }
                else{
                    i.reply("I will not ban " + user_outside_of_server.username)
                }
            })
            return;
            }
        const confirm = new discord.ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Ban')
			.setStyle(discord.ButtonStyle.Danger);

		const cancel = new discord.ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(discord.ButtonStyle.Secondary);
        const row = new discord.ActionRowBuilder()
        .addComponents(cancel, confirm);

		const sentmsg = await message.reply({
			content: `Are you sure you want to ban ${member.user.username}?`,
			components: [row],
		});
        const collector = message.channel.createMessageComponentCollector();
        collector.on('collect', async i=>{
            if (i.message.id != sentmsg.id) return;
            if (i.user.id != message.member.id) return;
            if (i.customId == "confirm"){
                if (!member.bannable) return i.reply(member.user.username + " is not bannable");
                member.ban({reason: reason})
                i.reply("I have banned " + member.user.username + " for " + reason)
            }
            else{
                i.reply("I will not ban " + member.user.username)
            }
        })
    }
})
