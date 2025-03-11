import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Helper function to chunk array into smaller pieces
const chunkArray = <T>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
};

// Cleanup function
async function cleanup() {
  console.log("Cleaning up existing data...");
  try {
    // Delete in reverse order of dependencies
    await prisma.$transaction([
      prisma.rating.deleteMany({}),
      prisma.like.deleteMany({}),
      prisma.watch.deleteMany({}),
      prisma.movie.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);
    console.log("Cleanup completed successfully");
  } catch (error) {
    console.error("Error during cleanup:", error);
    throw error;
  }
}

async function createUsers(count: number) {
  console.log(`Creating ${count} users...`);
  const userData = Array(count)
    .fill(null)
    .map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    }));

  const chunks = chunkArray(userData, 50);
  const users = [];

  for (const chunk of chunks) {
    const createdUsers = await prisma.user.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    users.push(
      ...(await prisma.user.findMany({
        where: {
          email: { in: chunk.map((u) => u.email) },
        },
      }))
    );
    console.log(`Created ${createdUsers.count} users in this batch`);
  }

  return users;
}

async function createMovies(count: number) {
  console.log(`Creating ${count} movies...`);
  const movieData = Array(count)
    .fill(null)
    .map(() => ({
      title: faker.music.songName(),
      year: faker.number.int({ min: 1950, max: 2024 }),
      poster: faker.image.url(),
    }));

  const chunks = chunkArray(movieData, 50);
  const movies = [];

  for (const chunk of chunks) {
    const createdMovies = await prisma.movie.createMany({
      data: chunk,
    });
    movies.push(
      ...(await prisma.movie.findMany({
        where: {
          title: { in: chunk.map((m) => m.title) },
        },
      }))
    );
    console.log(`Created ${createdMovies.count} movies in this batch`);
  }

  return movies;
}

async function createInteractions(users: any[], movies: any[]) {
  console.log("Creating user interactions (ratings, likes, watches)...");

  for (const chunk of chunkArray(users, 10)) {
    const interactions = [];

    for (const user of chunk) {
      // Generate random interactions for each user
      const moviesToRate = faker.helpers.arrayElements(movies, {
        min: 1,
        max: 20,
      });
      const moviesToLike = faker.helpers.arrayElements(movies, {
        min: 0,
        max: 30,
      });
      const moviesToWatch = faker.helpers.arrayElements(movies, {
        min: 0,
        max: 50,
      });

      // Prepare ratings
      interactions.push(
        prisma.rating.createMany({
          data: moviesToRate.map((movie) => ({
            rating: faker.number.int({ min: 1, max: 5 }),
            userId: user.id,
            movieId: movie.id,
          })),
          skipDuplicates: true,
        })
      );

      // Prepare likes
      interactions.push(
        prisma.like.createMany({
          data: moviesToLike.map((movie) => ({
            userId: user.id,
            movieId: movie.id,
          })),
          skipDuplicates: true,
        })
      );

      // Prepare watches
      interactions.push(
        prisma.watch.createMany({
          data: moviesToWatch.map((movie) => ({
            userId: user.id,
            movieId: movie.id,
          })),
          skipDuplicates: true,
        })
      );
    }

    // Execute all interactions for this chunk of users
    await Promise.all(interactions);
    console.log(`Processed interactions for ${chunk.length} users`);
  }
}

async function main() {
  console.log("Starting seeding process...");

  try {
    // Step 1: Cleanup existing data
    await cleanup();

    // Step 2: Create users and movies
    const users = await createUsers(100);
    const movies = await createMovies(500);

    // Step 3: Create interactions
    await createInteractions(users, movies);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Fatal error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
