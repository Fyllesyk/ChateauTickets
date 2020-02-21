exports.run = (client, message, args, ops) => {
    if(message.author.id !== ops.ownerID) message.channel.send('This is just for the owner!');

    try {
        delete require.cache[require.resolve(`./${args[0]}.js`)];
    } catch (e)
    {
        return message.channel.send(`Unable to reload: ${args[0]}`);
    }

    message.channel.send(`Successfully reloaded: ***${args[0]}.js***`);
}