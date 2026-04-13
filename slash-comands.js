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
        .setName("clear")
        .setDescription("Apaga todas as mensagens que tenham menos de 14 dias"),

    new SlashCommandBuilder()
        .setName("nuke")
        .setDescription("Clona e deleta o canal atual, apagando as mensagens e criando um novo canal idêntico, porém com id diferente.")
].map(cmd => cmd.toJSON())

const rest = new REST().setToken(process.env.accessToken)

try {
    await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: comands })
    console.log("Comandos registrados com sucesso!");
} catch (error) {
    console.error(error);
}