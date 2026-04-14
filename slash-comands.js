import { REST, Routes, SlashCommandBuilder } from "discord.js";
import 'dotenv/config.js'

const comands = [
    new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Apaga todas as mensagens que tenham menos de 14 dias"),

    new SlashCommandBuilder()
        .setName("nuke")
        .setDescription("Clona o canal atual, apagando as mensagens e criando um novo canal idêntico")
].map(cmd => cmd.toJSON())

const rest = new REST().setToken(process.env.accessToken)

try {
    await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: comands })
    console.log("Comandos registrados com sucesso!");
} catch (error) {
    console.error(error);
}