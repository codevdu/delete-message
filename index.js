import { Client, GatewayIntentBits, EmbedBuilder, Embed, AttachmentBuilder } from "discord.js";
import 'dotenv/config.js'

const client = new Client({
    intents: Object.values(GatewayIntentBits)
})

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!")
    }

    if (interaction.commandName === "hola") {
        const user = interaction.options.getUser("usuario")
        await interaction.reply(`Hola, <@${user.id}>!`)

    }

    if (!interaction.isChatInputCommand()) return;

    const isAdm = process.env.adminRoleId;

    if (interaction.commandName === "limpar") {

        if (!interaction.member.roles.cache.has(isAdm)) {
            return interaction.reply({
                content: "Apenas membros com o cargo específico podem usar este comando!",
                ephemeral: true
            });
        }

        if (interaction.commandName === "limpar") {
            if (!interaction.member.permissions.has("ManageMessages")) {
                return interaction.reply({ content: "Sem permissão!", ephemeral: true });
            }

            await interaction.reply({ content: "Iniciando limpeza...", ephemeral: true });

            let finalizado = false;
            let totalApagado = 0;

            while (!finalizado) {
                const deleted = await interaction.channel.bulkDelete(100, true).catch(err => {
                    console.log("Limite de 14 dias atingido ou erro de permissão.");
                    finalizado = true;
                    return null;
                });

                if (!deleted || deleted.size === 0) {
                    finalizado = true;
                } else {
                    totalApagado += deleted.size;
                    await new Promise(res => setTimeout(res, 1500));
                }
            }

            await interaction.editReply(`Limpeza concluída! Foram removidas ${totalApagado} mensagens recentes.`);
        }
    }
})

client.login(process.env.accessToken)