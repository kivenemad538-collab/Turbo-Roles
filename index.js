const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = process.env.TOKEN;

const GUILD_ID = "1522093054365012078";
const CHANNEL_ID = "1522093056944242782";

const ROLES = [
    {
        customId: "news_btn",
        roleId: "1522093054365012085",
        label: "News Notifications",
        emoji: "📣",
        style: ButtonStyle.Primary
    },
    {
        customId: "stream_btn",
        roleId: "1522093054365012082",
        label: "Stream Notifications",
        emoji: "🎬",
        style: ButtonStyle.Success
    },
    {
        customId: "event_btn",
        roleId: "1522093054365012081",
        label: "Event Notifications",
        emoji: "🎉",
        style: ButtonStyle.Danger
    },
    {
        customId: "update_btn",
        roleId: "1522093054365012083",
        label: "Update Notifications",
        emoji: "🚀",
        style: ButtonStyle.Secondary
    },
    {
        customId: "gov_btn",
        roleId: "1522093054365012084",
        label: "Government Notifications",
        emoji: "🏛️",
        style: ButtonStyle.Secondary
    },
    {
        customId: "voice_btn",
        roleId: "1522093054365012086",
        label: "Voice Changer",
        emoji: "🎤",
        style: ButtonStyle.Secondary
    }
];

client.once(Events.ClientReady, async () => {

    console.log('${client.user.tag} Online');

    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = await guild.channels.fetch(CHANNEL_ID);

    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("📢 Notification Roles")
        .setDescription("اضغط على الزر لإضافة أو إزالة الرتبة.");

    const row1 = new ActionRowBuilder();
    const row2 = new ActionRowBuilder();

    ROLES.forEach((r, i) => {

        const button = new ButtonBuilder()
            .setCustomId(r.customId)
            .setLabel(r.label)
            .setEmoji(r.emoji)
            .setStyle(r.style);

        if (i < 5)
            row1.addComponents(button);
        else
            row2.addComponents(button);

    });

    await channel.send({
        embeds: [embed],
        components: [row1, row2]
    });

});

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isButton()) return;

    const data = ROLES.find(x => x.customId === interaction.customId);

    if (!data) return;

    const member = interaction.member;

    if (member.roles.cache.has(data.roleId)) {

        await member.roles.remove(data.roleId);

        return interaction.reply({
            content: '❌ تمت إزالة رتبة **${data.label}**.',
            ephemeral: true
        });

    } else {

        await member.roles.add(data.roleId);

        return interaction.reply({
            content: '✅ تمت إضافة رتبة **${data.label}**.',
            ephemeral: true
        });

    }

});

client.login(TOKEN);
