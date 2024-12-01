const { copyFile } = require("fs/promises");
const { resolve } = require("path");
const { exec } = require("child_process");

const rootDir = resolve(__dirname, "./");
const indexFile = resolve(rootDir, "index.html");
const errorFile = resolve(rootDir, "404.html");

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

async function create404AndDeploy() {
  try {
    console.log("Copying index.html to 404.html...");
    await copyFile(indexFile, errorFile);
    console.log("404.html created successfully.");

    console.log("Adding changes to Git...");
    await runCommand("git add .");

    console.log("Committing changes...");
    await runCommand('git commit -m "deploy"');

    console.log("Pushing to repository...");
    await runCommand("git push");

    console.log("Deployment completed successfully!");
  } catch (err) {
    console.error("Error during deployment:", err);
  }
}

create404AndDeploy();
