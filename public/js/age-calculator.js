document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const birthDateInput = document.getElementById("birth-date")
  const calcDateInput = document.getElementById("calc-date")
  const calculateBtn = document.getElementById("calculate-age")
  const yearsElement = document.getElementById("years")
  const monthsElement = document.getElementById("months")
  const daysElement = document.getElementById("days")
  const totalDaysElement = document.getElementById("total-days")
  const nextBirthdayElement = document.getElementById("next-birthday")

  // History Modal Elements
  const historyBtn = document.getElementById("history-btn")
  const historyModal = document.getElementById("history-modal")
  const closeBtn = document.querySelector(".close")
  const historyList = document.getElementById("history-list")
  const clearHistoryBtn = document.getElementById("clear-history")

  // Set default value for calculation date (today)
  const today = new Date()
  calcDateInput.value = today.toISOString().split("T")[0]

  // Calculate age function
  function calculateAge() {
    const birthDate = new Date(birthDateInput.value)
    const calcDate = new Date(calcDateInput.value)

    // Validate inputs
    if (!birthDateInput.value) {
      alert("Please enter a birth date")
      return
    }

    if (birthDate > calcDate) {
      alert("Birth date cannot be in the future relative to calculation date")
      return
    }

    // Calculate difference in milliseconds
    const diffTime = Math.abs(calcDate - birthDate)
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // Calculate years, months, days
    let years = calcDate.getFullYear() - birthDate.getFullYear()
    let months = calcDate.getMonth() - birthDate.getMonth()
    let days = calcDate.getDate() - birthDate.getDate()

    // Adjust for negative months or days
    if (days < 0) {
      months--
      // Get days in the previous month
      const prevMonthDate = new Date(calcDate.getFullYear(), calcDate.getMonth(), 0)
      days += prevMonthDate.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    // Calculate next birthday
    const nextBirthday = new Date(calcDate.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    if (
      calcDate.getMonth() > birthDate.getMonth() ||
      (calcDate.getMonth() === birthDate.getMonth() && calcDate.getDate() >= birthDate.getDate())
    ) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
    }

    const daysUntilBirthday = Math.ceil((nextBirthday - calcDate) / (1000 * 60 * 60 * 24))

    // Update UI
    yearsElement.textContent = years
    monthsElement.textContent = months
    daysElement.textContent = days
    totalDaysElement.textContent = `Total days: ${totalDays}`
    nextBirthdayElement.textContent = `Next birthday: ${nextBirthday.toLocaleDateString()} (${daysUntilBirthday} days)`

    // Save to history
    const calculation = {
      birthDate: birthDate.toLocaleDateString(),
      calcDate: calcDate.toLocaleDateString(),
      result: {
        years,
        months,
        days,
        totalDays,
      },
      timestamp: new Date().toLocaleString(),
    }

    addToHistory(calculation)
  }

  // Add calculation to history
  function addToHistory(calculation) {
    const history = getHistory()
    history.push(calculation)
    localStorage.setItem("ageCalculatorHistory", JSON.stringify(history))
  }

  // Get history from localStorage
  function getHistory() {
    const history = localStorage.getItem("ageCalculatorHistory")
    return history ? JSON.parse(history) : []
  }

  // Display history in modal
  function displayHistory() {
    historyList.innerHTML = ""
    const history = getHistory()

    if (history.length === 0) {
      historyList.innerHTML = '<p class="empty-history">No calculations yet.</p>'
      return
    }

    history.forEach((item, index) => {
      const historyItem = document.createElement("div")
      historyItem.classList.add("history-item")
      historyItem.innerHTML = `
        <div>Birth Date: ${item.birthDate}</div>
        <div>Calculated as of: ${item.calcDate}</div>
        <div>Age: ${item.result.years} years, ${item.result.months} months, ${item.result.days} days</div>
        <div>Total Days: ${item.result.totalDays}</div>
        <small>${item.timestamp}</small>
      `
      historyList.appendChild(historyItem)
    })
  }

  // Clear history
  function clearHistory() {
    localStorage.removeItem("ageCalculatorHistory")
    displayHistory()
  }

  // Event Listeners
  calculateBtn.addEventListener("click", calculateAge)

  // History Modal Event Listeners
  historyBtn.addEventListener("click", () => {
    displayHistory()
    historyModal.style.display = "block"
  })

  closeBtn.addEventListener("click", () => {
    historyModal.style.display = "none"
  })

  clearHistoryBtn.addEventListener("click", () => {
    clearHistory()
  })

  window.addEventListener("click", (event) => {
    if (event.target === historyModal) {
      historyModal.style.display = "none"
    }
  })
})
