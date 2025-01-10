#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

async function createApp(name) {
	const dest = path.resolve(process.cwd(), name);
	console.log(`Creating project at ${dest}...`);

	// Копируем шаблон
	const templatePath = path.join(__dirname, "template");
	await fs.copy(templatePath, dest);

	console.log("Installing dependencies...");
	execSync(`cd ${dest} && npm install`, { stdio: "inherit" });

	console.log("Project created successfully!");
}

const [,, name] = process.argv;
if (!name) {
	console.log("Usage: efko-flare-cli <project-name>");
	process.exit(1);
}

createApp(name);
