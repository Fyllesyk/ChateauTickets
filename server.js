const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '?';
const ownerID = '156497366130622464';

const db = require('quick.db');
client.on('message', async message => {
    let solution = "";
    let author = message.author;
    let args = message.content.slice(prefix.length).trim().split(' ');
    let cmd = args.shift().toLowerCase();
    const log = new Discord.RichEmbed()
                    .setColor(0x66ff00)
                    .setFooter(`Bigseth Support - Logs`)
                    .setAuthor(`Support Ticket - ${message.author.id}`, author.displayAvatarURL)

    
        if(message.author.bot) return;
        if(message.channel.type !== 'text') {
            let active = await db.fetch(`support_${message.author.id}`);
            let guild = client.guilds.get('407293354137878538');
            let member = guild.roles.get('407598077252206602');
            let staff = guild.roles.get('513498364483076105');
            let channel, found = true;
            let ChannelID = 0;
            //let ticketname = author.username + '-' + author.discriminator;
            try {
                if(active) client.channels.get(active.channelID).guild;
            } catch (e)
            {
                found = false;
            }
            if(!active || !found) {
                active = {};
                if(guild.channels.find(channel => channel.name === `${message.author.id}`)) {
                    
                    let channel = guild.channels.find(channel => channel.name === `${message.author.id}`);
                    
                    const embed = new Discord.RichEmbed()
                    .setColor(0x89cff0)
                    .setAuthor(author.tag, author.displayAvatarURL)
                    .setFooter(`Message received -- ` + author.username + '#' + author.discriminator)
                    .setDescription(message.content)
                    log.addField(message.author.tag, message.content);
                    guild.channels.get('678968595086180352').send(log);
                    if(message.attachments.size == 1)
                    {
                    embed.setImage(message.attachments.first().url)
                    }
                    channel.send(embed);

                    const dm = new Discord.RichEmbed()
                    .setColor(0x66ff00)
                    .setAuthor(`Thank you, ${author.tag}`, author.displayAvatarURL)
                    .setFooter(`Your message has been added to the ticket`)
                    await author.send(dm);
                }
                else{
                const newChannel = new Discord.RichEmbed()
                    .setColor(0x89cff0)
                    .setAuthor(author.tag, author.displayAvatarURL)
                    .setFooter('Support Ticket Created')
                    .addField('User', author)
                    .addField('ID', author.id)
                    log.addField(message.author.id, 'Created Ticket')
                    guild.channels.get('678968595086180352').send(log);

                const embed = new Discord.RichEmbed()
                    .setColor(0x89cff0)
                    .setAuthor(author.tag, author.displayAvatarURL)
                    .setDescription(message.content)
                    .setFooter(`Message Received -- ${author.tag}`)
                    log.addField(message.author.tag, message.content)
                    guild.channels.get('678968595086180352').send(log);
                channel = await guild.createChannel(`${message.author.id}`,{type: 'text'}).then(channel => {
                    channel.setParent('676869477496913931')
                    channel.setTopic(`?complete to close the ticket | support for ${message.author.tag} | ID: ${message.author.id}`)
                    channel.overwritePermissions(member, { 'VIEW_CHANNEL': false});
                    channel.overwritePermissions(staff, { 'VIEW_CHANNEL': true});
                    channel.send(newChannel);
                    channel.send(embed);
                    ChannelID = channel.id;
            });
                const newTicket = new Discord.RichEmbed()
                    .setColor(0x66ff00)
                    .setAuthor(`Hello, ${author.tag}`, author.displayAvatarURL)
                    .setFooter('Support Ticket Created')
                await author.send(newTicket);
                active.channelID = channel;
                active.targetID = author.id;
            
            channel = client.channels.get(active.channelID);
            const dm = new Discord.RichEmbed()
                .setColor(0x66ff00)
                .setAuthor(`Thank you, ${author.tag}`, author.displayAvatarURL)
                .setFooter(`Your message has been sent -- A staff member will be in contact soon`)
            await author.send(dm);
            db.set(`support_${author.id}`, active);
            db.set(`supportChannel_${ChannelID}`, author.id);
            return;
        }
        }
    }
        let support = await db.fetch(`supportChannel_${message.channel.id}`);
        if(support)
        {
            support = await db.fetch(`support_${support}`);
            let supportUser = client.users.get(support.targetID);
            if(!supportUser) return message.channel.delete();
            if(message.content.toLowerCase() === '?solution')
            {
                if(!args.length)
                {
                    message.channel.send("Please state the solution");
                }
                else {
                    solution = args[0];
                    message.channel.send(`Solution = ${solution}`);
                }
            }
            if(message.content.toLowerCase() === '?complete') {
                const complete = new Discord.RichEmbed()
                    .setColor(0x66ff00)
                    .setAuthor(`Hey, ${supportUser.tag}`, supportUser.displayAvatarURL)
                    .setFooter('Ticked Closed -- Bigseth Community Staff Team')
                    .setDescription('Your Ticket has been marked as **Solved**. If you wish to reopen this, or create a new one, please send a message to the bot.'); 
                supportUser.send(complete);
                message.channel.delete();
                log.addField(`Ticket **Solved**`, `${solution}`)
                message.guild.channels.get('678968595086180352').send(log);
                return db.delete(`support_${support.targetID}`);
            }
            if(message.content.startsWith('?solution'))
            {
                
            }
            else
            {
            const embed = new Discord.RichEmbed()
                .setColor(0x66ff00)
                .setAuthor(author.tag, author.displayAvatarURL)
                .setFooter(`Message Received -- Bigseth Community Staff Team`)
                .setDescription(message.content)
                log.addField(supportUser.id, message.content)
                message.guild.channels.get('678968595086180352').send(log);
                if(message.attachments.size == 1)
                {
                embed.setImage(message.attachments.first().url)
                }
            client.users.get(support.targetID).send(embed);
            message.delete({timeout: 1000});
            embed.setFooter(`Message Sent -- ${supportUser.tag}`).setDescription(message.content);
            log.addField(supportUser.id, message.content)
            return message.channel.send(embed);

            }
        }
    
        
        if (message.author.bot) return;
        if(!message.content.startsWith(prefix)) return;
        try {
            delete require.cache[require.resolve(`./commands/${cmd}.js`)];
            let ops = {
                ownerID: ownerID
            }
            let commandFile = require(`./commands/${cmd}.js`);
            commandFile.run(client, message, args, ops);
        } catch (e)
        {
        }
});

client.on('guildMemberAdd', member => {

    const embed = new Discord.RichEmbed()
        .setColor(0x66ff00)
        .setDescription(`Welcome to Bigseth Community ${member}`)
        .setFooter("Bigseth Support ").setTimestamp()
    member.guild.channels.get('410019627285086218').send(embed);
});

client.on('guildMemberRemove', member => {

    const embed = new Discord.RichEmbed()
        .setColor(0xff0000)
        .setDescription(`${member} has left`)
        .setFooter("Bigseth Support ").setTimestamp()
    member.guild.channels.get('678968595086180352').send(embed);
});
client.on('ready', () => console.log(`"Bigseth Support" is now Online!`));
client.login('NIBB');
