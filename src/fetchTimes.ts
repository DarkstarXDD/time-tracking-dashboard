import { z } from "zod"

async function fetchData() {
  try {
    const fetchResponse = await fetch("/data/data.json")
    const data = await fetchResponse.json()
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

// Zod schema for server data
export const dataSchema = z.array(
  z.object({
    title: z.enum(["Work", "Play", "Study", "Exercise", "Social", "Self Care"]),

    timeframes: z.object({
      daily: z.object({
        current: z.number(),
        previous: z.number(),
      }),

      weekly: z.object({
        current: z.number(),
        previous: z.number(),
      }),

      monthly: z.object({
        current: z.number(),
        previous: z.number(),
      }),
    }),
  })
)

// Validate the data received from the server
export async function validateData() {
  const fetchedData = await fetchData()
  return dataSchema.parse(fetchedData)
}
