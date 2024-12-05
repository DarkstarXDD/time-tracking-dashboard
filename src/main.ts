import { z } from "zod"
import { dataSchema, validateData } from "./fetchTimes.ts"
import { animate, easeInOut, stagger } from "motion"

const userInfo = document.body.querySelectorAll(".user-avatar, .user-name")
const tabButtons = document.body.querySelectorAll<HTMLElement>(".tab-button")
const tabPanels = document.body.querySelectorAll<HTMLElement>(".panel")
const tabList = document.getElementById("tab-list")

// Handle Card Click
const cardContentElements = document.querySelectorAll(".card-content")
cardContentElements.forEach((cardContentEl) => {
  const linkEl = cardContentEl.querySelector(".card-title-link")
  let upTime: number
  let downTime: number

  cardContentEl.addEventListener("mousedown", () => {
    downTime = Date.now()
  })

  cardContentEl.addEventListener("mouseup", () => {
    upTime = Date.now()

    const timeDifference = upTime - downTime

    if (timeDifference < 200 && linkEl instanceof HTMLElement) {
      linkEl.click()
    }
  })
})

// Handle Options Button Click
const optionsButtons = document.querySelectorAll(".options-button")
optionsButtons.forEach((optionButton) => {
  optionButton.addEventListener("click", (event) => {
    event.stopPropagation()
    console.log("Options Button Clicked!")
  })
})

// Animations
const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

if (!isReduced) {
  animate(
    userInfo,
    { opacity: [0, 1], x: [-25, 0] },
    {
      type: "spring",
      damping: 15,
      delay: stagger(0.2, { startDelay: 0.2 }),
      ease: "easeIn",
    }
  )

  animate(
    tabButtons,
    { opacity: [0, 1], x: [-25, 0] },
    {
      type: "spring",
      damping: 15,
      delay: stagger(0.1, { startDelay: 0.4 }),
      ease: "easeIn",
    }
  )
}

function animateHours(element: Element, endHour: number) {
  animate(0, endHour, {
    duration: 1,
    ease: easeInOut,
    onUpdate: (value) => {
      element.innerHTML = Math.round(value).toString()
    },
  })
}

let isDesktopLayout: boolean
let isTimeAnimated = false

const mediaQuery = window.matchMedia("(min-width: 70rem)")
mediaQuery.addEventListener("change", handleScreenSizeChange)

type TabIndex = 0 | 1 | 2

export let currentTabIndex: TabIndex = getCurrentTabFromURL()
const numOfTabs = tabButtons.length

handleTabSelect()
addEventListenersToTabButtons()
handleScreenSizeChange()

function handleScreenSizeChange() {
  if (mediaQuery.matches) {
    isDesktopLayout = true
    tabList?.setAttribute("aria-orientation", "vertical")
  } else {
    isDesktopLayout = false
    tabList?.setAttribute("aria-orientation", "horizontal")
  }
}

function addEventListenersToTabButtons() {
  tabButtons.forEach((tabButton, index) => {
    tabButton.addEventListener("keydown", (event) => {
      handleKeyDownOnTab(event, index as TabIndex)
    })

    tabButton.addEventListener("click", () => {
      currentTabIndex = index as TabIndex
      handleTabSelect()
    })
  })
}

function renderData(
  cardContainer: Element,
  timeframe: Timeframe,
  validatedData: z.infer<typeof dataSchema>
) {
  Array.from(cardContainer?.children || []).forEach((card, index) => {
    const currentHours = validatedData[index].timeframes[timeframe].current
    const previousHours = validatedData[index].timeframes[timeframe].previous

    const currentHoursEl = card.querySelector(".current-hours")
    const previousHoursEl = card.querySelector(".previous-hours")

    if (currentHoursEl) {
      currentHoursEl.innerHTML = currentHours.toString()
      if (!isTimeAnimated && !isReduced) {
        animateHours(currentHoursEl, currentHours)
      }
    }

    if (previousHoursEl) {
      previousHoursEl.innerHTML = previousHours.toString()
      if (!isTimeAnimated && !isReduced) {
        animateHours(previousHoursEl, previousHours)
      }
    }
  })
  isTimeAnimated = true
}

function handleTabSelect() {
  updateURL()
  tabButtons.forEach((tabButton, index) => {
    const isCurrentTabSelected = index === currentTabIndex

    tabButton.setAttribute("aria-selected", isCurrentTabSelected.toString())
    tabButton.setAttribute("tabindex", isCurrentTabSelected ? "0" : "-1")

    const currentPanel = tabPanels[index]

    if (isCurrentTabSelected) {
      currentPanel.hidden = false
      updateCardData(currentPanel)
    } else {
      currentPanel.hidden = true
    }
  })
}

function getCurrentTabFromURL() {
  const tabNameToIndexMap: Record<string, TabIndex> = {
    daily: 0,
    weekly: 1,
    monthly: 2,
  }

  const searchParams = new URLSearchParams(location.search)
  const currentTabInURL = searchParams.get("tab")
  if (currentTabInURL && currentTabInURL in tabNameToIndexMap) {
    return tabNameToIndexMap[currentTabInURL]
  }
  return 0
}

function updateURL() {
  const tabIndexToTabNameMap: Record<TabIndex, string> = {
    0: "daily",
    1: "weekly",
    2: "monthly",
  }

  const searchParams = new URLSearchParams(location.search)
  searchParams.set("tab", tabIndexToTabNameMap[currentTabIndex])
  window.history.replaceState({}, "", `?${searchParams}`)
}

function navigateTabs(action: "first" | "last" | "previous" | "next") {
  switch (action) {
    case "first":
      currentTabIndex = 0
      break

    case "last":
      currentTabIndex = numOfTabs - 1
      break

    case "previous":
      if (currentTabIndex === 0) {
        currentTabIndex = numOfTabs - 1
      } else {
        currentTabIndex = currentTabIndex - 1
      }
      break

    case "next":
      if (currentTabIndex === numOfTabs - 1) {
        currentTabIndex = 0
      } else {
        currentTabIndex = currentTabIndex + 1
      }
      break
  }
  tabButtons[currentTabIndex].focus()
}

const keyToActionMap: Record<string, "first" | "last" | "previous" | "next"> = {
  ArrowLeft: "previous",
  ArrowRight: "next",
  ArrowUp: "previous",
  ArrowDown: "next",
  Home: "first",
  End: "last",
}

function handleKeyDownOnTab(event: KeyboardEvent, index: TabIndex) {
  currentTabIndex = index

  const allowedKeys = isDesktopLayout
    ? ["ArrowUp", "ArrowDown", "Home", "End"]
    : ["ArrowLeft", "ArrowRight", "Home", "End"]

  const action = allowedKeys.includes(event.key)
    ? keyToActionMap[event.key]
    : null

  if (action) {
    navigateTabs(action)
    handleTabSelect()
  }
}

export type Timeframe = "daily" | "weekly" | "monthly"

async function updateCardData(panel: HTMLElement) {
  const panelTimeframe = panel.dataset.timeframe
  const cardContainer = panel.querySelector(".card-container")

  if (
    cardContainer &&
    (panelTimeframe === "daily" ||
      panelTimeframe === "weekly" ||
      panelTimeframe === "monthly")
  ) {
    const validatedData = await validateData()
    renderData(cardContainer, panelTimeframe, validatedData)
  }
}
