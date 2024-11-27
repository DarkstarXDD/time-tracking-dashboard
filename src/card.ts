import { z } from "zod"
import { dataSchema } from "./main"
import { Timeframe } from "./main"

type CardData = Pick<z.infer<typeof dataSchema>[number], "title"> & {
  currentHours: number
  previousHours: number
  timeframe: Timeframe
}

const colorVariants = {
  Work: "bg-orange",
  Play: "bg-aqua",
  Study: "bg-red",
  Exercise: "bg-green",
  Social: "bg-violet",
  "Self Care": "bg-yellow",
}

function getTimeframeLabel(timeframe: Timeframe) {
  let timeframeLabel = ""

  if (timeframe === "daily") {
    timeframeLabel = "Day"
  } else if (timeframe === "weekly") {
    timeframeLabel = "Week"
  } else {
    timeframeLabel = "Month"
  }

  return timeframeLabel
}

export function card({
  title,
  currentHours,
  previousHours,
  timeframe,
}: CardData) {
  return `
    <li>
      <div
        style="background-image: url('/assets/images/icon-${title.toLowerCase().replace(" ", "-")}.svg')"
        class="card ${colorVariants[title]} pt-12 rounded-2xl bg-no-repeat bg-[length:5rem_5rem] bg-[right_8%_top_-14%]"
      >
        <div class="grid gap-6 p-8 bg-purple-dark rounded-2xl">
          <div class="flex justify-between items-center">
            <h2 class="text-preset-3">${title}</h2>
            <button>
              ${buttonSVG()}
            </button>
          </div>
          
          <div class="flex justify-between items-center gap-4 md:flex-col md:items-start">
            <p class="text-preset-5 md:text-preset-7">${currentHours}hrs</p>
            <p class="text-preset-1 text-purple-light">Last ${getTimeframeLabel(timeframe)} - ${previousHours}hrs</p>
          </div>
        </div>
      </div>
    </li>
  `
}

function buttonSVG() {
  return `
    <svg
      width="21"
      height="5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 21 5"
      aria-hidden="true"
      focusable="false"
      class="w-6 h-2"
    >
      <path
        d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
        fill="#BBC0FF"
        fill-rule="evenodd"
      />
    </svg>
  `
}
