const fs = require("fs").promises;
const path = require("path");

(async () => {
	try {
		const directoryPath = path.join(__dirname, "..");
		const files = (await fs.readdir(directoryPath)).filter(file => file.endsWith(".txt"));

		await Promise.all(files.map(async file => {
			const filePath = path.join(directoryPath, file);
			const fileContents = await fs.readFile(filePath, "utf8");

			// Extract unique domains
			const existingDomains = new Set(
				fileContents
					.split("\n")
					.filter(line => line.startsWith("0.0.0.0 "))
					.map(line => line.replace("0.0.0.0 ", ""))
			);

			// Update the total number of network filters
			const updatedContents = fileContents.replace(
				/^# Total number of network filters: ?(\d*)$/gm,
				`# Total number of network filters: ${existingDomains.size}`
			);

			await fs.writeFile(filePath, updatedContents, "utf8");
		}));
	} catch (error) {
		console.error("Error processing files:", error);
	}
})();
