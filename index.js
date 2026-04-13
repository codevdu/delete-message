import { Client, GatewayIntentBits, EmbedBuilder, Embed, AttachmentBuilder } from "discord.js";
import 'dotenv/config.js'

const client = new Client({
    intents: Object.values(GatewayIntentBits)
})

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const isAdm = process.env.adminRoleId;

    // clear command
    if (interaction.commandName === "clear") {

        if (!interaction.member.roles.cache.has(isAdm)) {
            return interaction.reply({
                content: "Apenas membros com o cargo específico podem usar este comando!",
                ephemeral: true
            });
        }

        if (interaction.commandName === "clear") {
            if (!interaction.member.permissions.has("ManageMessages")) {
                return interaction.reply({ content: "Sem permissão!", ephemeral: true });
            }

            await interaction.reply({ content: "Iniciando limpeza...", ephemeral: true });

            let finished = false;
            let totalDeleted = 0;

            while (!finished) {
                const deleted = await interaction.channel.bulkDelete(100, true).catch(err => {
                    console.log("Limite de 14 dias atingido ou erro de permissão.");
                    finished = true;
                    return null;
                });

                if (!deleted || deleted.size === 0) {
                    finished = true;
                } else {
                    totalDeleted += deleted.size;
                    await new Promise(res => setTimeout(res, 1500));
                }
            }

            await interaction.editReply(`Limpeza concluída! Foram removidas ${totalDeleted} mensagens recentes.`);
        }
    }

    // nuke command
    if (interaction.commandName === "nuke") {
        if (!interaction.member.roles.cache.has(isAdm)) {
            return interaction.reply({
                content: "Apenas membros com o cargo específico podem usar este comando!",
                ephemeral: true
            });
        }

        if (!interaction.member.permissions.has("ManageChannels")) {
            return interaction.reply({ content: "Você não tem permissão para gerenciar canais!", ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has("ManageChannels")) {
            return interaction.reply({ content: "Eu não tenho permissão para deletar/criar canais!", ephemeral: true });
        }

        try {
            // armazena a posição e o canal atual
            const position = interaction.channel.position;

            // clona o canal
            const newChannel = await interaction.channel.clone({
                reason: `Nuke solicitado por ${interaction.user.tag}`
            });

            // define a posição para ficar exatamente onde o outro estava
            await newChannel.setPosition(position);

            // deleta o canal antigo
            await interaction.channel.delete(`Nuke por ${interaction.user.tag}`);

            // envia a mensagem de sucesso no novo canal
            await newChannel.send({
                content: `**Este canal sofreu um Nuke!**`,
                files: [{
                    attachment: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z6eXN6eXN6eXN6eXN6eXN6eXN6eXN6eXN6eXN6eXN6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HhTXt43pk1I1W/giphy.gif',
                    name: 'nuke.gif'
                }]
            });

        } catch (error) {
            console.error("Erro no sistema de Nuke:", error);
            if (!interaction.replied) {
                await interaction.reply({ content: "Houve um erro ao tentar executar o Nuke.", ephemeral: true });
            }
        }
    }


})

client.login(process.env.accessToken)