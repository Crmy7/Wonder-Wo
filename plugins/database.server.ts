export default defineNuxtPlugin(async () => {
  if (process.server) {
    // Juste importer pour déclencher la sync
    await import('~/server/database')
  }
}) 