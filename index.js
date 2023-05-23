const discord = require("discord.js")

const bot = new discord.Client({ intents: 3276799})
const token = "MTEwOTI4NzIyMTgzMzUwMjczMQ.G_aFHM.S8fKg33xl8QiRA6GtEM8ErCljvY1xzhX46CGCw"
const prefix = "!"
const sqlite3 = require("sqlite3").verbose();
let sql;
//connecting to db
const db = new sqlite3.Database("./info.db", sqlite3.OPEN_READWRITE, (err) =>{
    if (err) return console.log(err.message);
})
//sql = 'CREATE TABLE users(id INTEGER PRIMARY KEY, first_name, last_name, username, password, email)'
//sql = 'ALTER TABLE users ADD rizz'
//sql = "DROP TABLE users"
//sql = "INSERT INTO users(first_name, last_name, username, password, email, rizz) VALUES (?, ?, ?, ?, ?, ?)"
//sql = `SELECT * FROM users WHERE first_name = "Paul"`
/*db.all(sql, [], (err, rows)=>{
    if (err) return console.error(err.message);
    rows.forEach((row)=>{
        console.log(row.first_name);
    })
})*/
//db.run(sql);
/*db.run(sql, ["Paul", "Trusov", "nerap", "i_like_em_young", "nerap08@gmail.com", 0], (err)=>{
    if (err) return console.log(err.message); 
})*/


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
    if (command == "warn"){
        let member = message.mentions.members.first() 
        if (!member){
            member = await message.guild.members.fetch(args[1]).catch(err=> {
                console.log(err.message)
            })
                
        }
        if (!member) return message.channel.send("You need to mention a member via mentions or id");
    }
    else if (command == "ban"){
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