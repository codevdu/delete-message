import { REST, Routes, SlashCommandBuilder } from "discord.js";
import 'dotenv/config.js'

const comands = [
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responde com Pong"),

    new SlashCommandBuilder()
        .setName("hola")
        .setDescription("Cumprimenta um usuário")
        .addUserOption(option => option
            .setName("usuario")
            .setDescription("selecionar um usuário")
            .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("limpar")
        .setDescription("Apaga todas as mensagens que tenham menos de 14 dias")
].map(cmd => cmd.toJSON())


const rest = new REST().setToken(process.env.accessToken)

try {
    await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: comands })
    console.log("Comandos registrados com sucesso!");
} catch (error) {
    console.error(error);
}