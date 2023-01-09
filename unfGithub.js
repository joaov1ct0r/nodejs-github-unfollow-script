import { Octokit } from "octokit";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from 'node:process';

let rl = readline.createInterface({
  input,
  output
})

const TARGET_USER = await rl.question("Insira seu username do GitHub: ")

console.log(`GitHub username: ${TARGET_USER}`)

const TOKEN = await rl.question(`${TARGET_USER}, Insira o token de autenticação do GitHub: `)

console.log("\n Realizando autenticação...");

const octoKit = new Octokit({
  auth: TOKEN,
})

console.log("\n Autenticação realizada com sucesso...");

async function unfollowUsers() {
  try {
    console.log("\n Obtendo dados de seguidos...");

    var following = await octoKit.request("GET /user/following?per_page=100",);

    console.log("\n Dados obtidos com sucesso...");

    console.log("\n Realizando unfollow em quem não é seguidor...");

    for (var j = 0; j < following.data.length; j++) {
      const isFollowerResponse = await octoKit.request(`GET /users/${following.data[j].login}/following/${TARGET_USER}`, {
        username: following.data[j].login,
        target_user: TARGET_USER,
        headers: {
          accept: "application/vnd.github+json"
        }
      })

      if (isFollowerResponse.status === 204) {
        console.log(`\n Analizando...`);
      }
    }

    console.log("\n Tarefa realizada com sucesso!!");

    process.exit(0);
  } catch (error) {
    console.log(`\n Realizando unfollow em ${following.data[j].login}...`);

    await octoKit.request(`DELETE /user/following/${following.data[j].login}`, {
      headers: {
        accept: "application/vnd.github+json"
      }
    })

    console.log("\n Unfollow realizado com sucesso...");

    unfollowUsers();
  }
}

unfollowUsers();
