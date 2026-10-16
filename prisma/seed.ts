import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const voices = [
    { id: "darija-laila", name: "ليلى الأطلس", gender: "أنثى", style: "إعلاني دافئ", previewText: "سلام عليكم" },
    { id: "darija-youssef", name: "يوسف كازا", gender: "ذكر", style: "بودكاست شبابي", previewText: "مرحبا" },
    { id: "darija-salma", name: "سلمى فاس", gender: "أنثى", style: "رواية هادئة", previewText: "أهلا وسهلا" },
  ];

  for (const voice of voices) {
    await prisma.voice.upsert({
      where: { id: voice.id },
      update: voice,
      create: { ...voice, locale: "ar-MA", isActive: true },
    });
  }

  await prisma.plan.upsert({
    where: { code: "starter" },
    update: { name: "Starter", monthlyCredits: 10000, priceMad: 99 },
    create: { code: "starter", name: "Starter", monthlyCredits: 10000, priceMad: 99 },
  });

  await prisma.plan.upsert({
    where: { code: "pro" },
    update: { name: "Pro", monthlyCredits: 50000, priceMad: 249 },
    create: { code: "pro", name: "Pro", monthlyCredits: 50000, priceMad: 249 },
  });

  await prisma.user.upsert({
    where: { email: "demo@sawtatlas.local" },
    update: {},
    create: {
      id: "demo-user-1",
      email: "demo@sawtatlas.local",
      name: "Demo User",
      role: "ADMIN",
      creditsBalance: 10000,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
