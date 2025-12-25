import { db } from ".";
import { words } from "./schema";

async function main() {
  console.log("Seeding...");
  await db.insert(words).values([
    {
      content: "Huế",
      definition: "A city in Central Vietnam, famous for its citadel.",
      dialectType: "Central",
      regionId: "hue",
      usageExample: "Đi mô rứa? Về Huế thăm mạ.",
    },
    {
      content: "mô",
      definition: "Where (Central dialect)",
      dialectType: "Central",
      regionId: "central",
      usageExample: "Em đi mô đó?",
    },
    {
      content: "tê",
      definition: "That/There (Central dialect)",
      dialectType: "Central",
      regionId: "central",
      usageExample: "Đứng bên tê đường.",
    }
  ]);
  console.log("Seeded!");
  process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
