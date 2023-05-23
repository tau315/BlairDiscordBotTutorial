const discord = require("discord.js")

const bot = new discord.Client({ intents: 3276799})
const token = "MTEwOTI4NzIyMTgzMzUwMjczMQ.G_aFHM.S8fKg33xl8QiRA6GtEM8ErCljvY1xzhX46CGCw"
const prefix = "!"
bot.login(token)
bot.on("ready", client=>{
    console.log(client.user.username + " is ready!")
})
bot.on("messageCreate", async message=>{
    if (message.member.id != "570766174011260967") return;
    if (!message.content.startsWith(prefix)) return;
    command = message.content.split(" ")[0]
    command = command.substring(prefix.length, command.length).toLowerCase()
    if (command == "test"){
        const button = new discord.ActionRowBuilder()
        .addComponents(
            new discord.ButtonBuilder()
            .setCustomId('button')
            .setLabel('Click this 4 free robux')
            .setStyle(discord.ButtonStyle.Primary),
        );
        const embed = new discord.EmbedBuilder()
        .setColor("Blue")
        .setDescription("Free Robux trust me")

        const embed2 = new discord.EmbedBuilder()
        .setColor("Blue")
        .setDescription("Ez get hacked")

        const sentmsg = await message.channel.send({embeds: [embed], components: [button]})
        try{
        const collector = message.channel.createMessageComponentCollector();
        collector.on('collect', async i=>{
            if (i.message.id != sentmsg.id) return;
            await i.update({embeds: [embed2], components: [button]})
        })
        }
        catch{
            console.log("Unknown Error")
        }
    }
    else if (command == "ban"){
        const member = message.mentions.members.first()
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
                member.ban()
                i.reply("I have banned " + member.user.username)
            }
            else{
                i.reply("I will not ban " + member.user.username)
            }
        })
    }
})