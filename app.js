// Data structures
const CATEGORIES = {
  keystone: {
    name: "Keystone",
    color: "amber-500",
    icon: "fa-check-square",
  },
  "self-care": {
    name: "Self-care",
    color: "sky-500",
    icon: "fa-heart",
  },
  work: {
    name: "Work",
    color: "orange-500",
    icon: "fa-briefcase",
  },
  personal: {
    name: "Personal",
    color: "rose-500",
    icon: "fa-user",
  },
  "morning-routine": {
    name: "Morning Routine",
    color: "yellow-500",
    icon: "fa-sun",
  },
  "night-routine": {
    name: "Night Routine",
    color: "indigo-500",
    icon: "fa-moon",
  },
};

const FREQUENCIES = [
  { value: "daily", label: "Daily", icon: "fa-calendar-day" },
  { value: "weekly", label: "Weekly", icon: "fa-calendar-week" },
  { value: "monthly", label: "Monthly", icon: "fa-calendar" },
];

// State
let habits = [];
let customCategories = {};
let activeCategories = ["keystone", "self-care", "work", "personal", "morning-routine", "night-routine"];
let activeFrequencies = ["daily", "weekly", "monthly"];
let currentView = "list";
let timeRange = "week";
let currentDate = new Date();
let selectedDate = new Date();
let editingHabitId = null;
let deletingHabitId = null;
let deletingCategoryId = null;
let activeAnalyticsTab = "overview";

// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const statsOverview = document.getElementById("stats-overview");
const categoryFilter = document.getElementById("category-filter");
const frequencyFilter = document.getElementById("frequency-filter");
const habitsListView = document.getElementById("habits-list-view");
const calendarView = document.getElementById("calendar-view");
const analyticsView = document.getElementById("analytics-view");
const viewListBtn = document.getElementById("view-list");
const viewCalendarBtn = document.getElementById("view-calendar");
const viewAnalyticsBtn = document.getElementById("view-analytics");
const addHabitBtn = document.getElementById("add-habit-btn");
const habitModal = document.getElementById("habit-modal");
const habitForm = document.getElementById("habit-form");
const modalTitle = document.getElementById("modal-title");
const submitBtnText = document.getElementById("submit-btn-text");
const deleteModal = document.getElementById("delete-modal");
const deleteHabitName = document.getElementById("delete-habit-name");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const deleteCategoryModal = document.getElementById("delete-category-modal");
const confirmDeleteCategoryBtn = document.getElementById("confirm-delete-category");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const calendarMonthYear = document.getElementById("calendar-month-year");
const calendarDays = document.getElementById("calendar-days");
const timeWeekBtn = document.getElementById("time-week");
const timeMonthBtn = document.getElementById("time-month");
const timeYearBtn = document.getElementById("time-year");
const overallProgress = document.getElementById("overall-progress");
const dateRange = document.getElementById("date-range");
const categoryProgress = document.getElementById("category-progress");
const habitPerformance = document.getElementById("habit-performance");
const categoryPerformance = document.getElementById("category-performance");
const performanceTrend = document.getElementById("performance-trend");
const addCategoryBtn = document.getElementById("add-category-btn");
const newCategoryForm = document.getElementById("new-category-form");
const cancelCategoryBtn = document.getElementById("cancel-category-btn");
const addCategorySubmit = document.getElementById("add-category-submit");
const categoryOptions = document.getElementById("category-options");

// Analytics tabs
const tabOverview = document.getElementById("tab-overview");
const tabHabits = document.getElementById("tab-habits");
const tabCategories = document.getElementById("tab-categories");
const tabContentOverview = document.getElementById("tab-content-overview");
const tabContentHabits = document.getElementById("tab-content-habits");
const tabContentCategories = document.getElementById("tab-content-categories");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  setupEventListeners();
  renderAll();
});

// Load data from localStorage
function loadData() {
  const savedHabits = localStorage.getItem("habits");
  if (savedHabits) {
    try {
      habits = JSON.parse(savedHabits);
    } catch (e) {
      console.error("Failed to parse habits from localStorage", e);
      habits = generateSampleHabits();
    }
  } else {
    habits = generateSampleHabits();
  }

  const savedCategories = localStorage.getItem("customCategories");
  if (savedCategories) {
    try {
      customCategories = JSON.parse(savedCategories);
    } catch (e) {
      console.error("Failed to parse custom categories from localStorage", e);
      customCategories = {};
    }
  }

  const savedActiveCategories = localStorage.getItem("activeCategories");
  if (savedActiveCategories) {
    try {
      activeCategories = JSON.parse(savedActiveCategories);
    } catch (e) {
      console.error("Failed to parse active categories from localStorage", e);
    }
  }

  const savedActiveFrequencies = localStorage.getItem("activeFrequencies");
  if (savedActiveFrequencies) {
    try {
      activeFrequencies = JSON.parse(savedActiveFrequencies);
    } catch (e) {
      console.error("Failed to parse active frequencies from localStorage", e);
    }
  }

  // Check if dark mode is enabled
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
  localStorage.setItem("customCategories", JSON.stringify(customCategories));
  localStorage.setItem("activeCategories", JSON.stringify(activeCategories));
  localStorage.setItem("activeFrequencies", JSON.stringify(activeFrequencies));
}

// Setup event listeners
function setupEventListeners() {
  // Theme toggle
  themeToggle.addEventListener("click", toggleTheme);

  // View buttons
  viewListBtn.addEventListener("click", () => setView("list"));
  viewCalendarBtn.addEventListener("click", () => setView("calendar"));
  viewAnalyticsBtn.addEventListener("click", () => setView("analytics"));

  // Add habit button
  addHabitBtn.addEventListener("click", openAddHabitModal);

  // Modal close buttons
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", closeModals);
  });

  // Modal overlays
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", closeModals);
  });

  // Habit form
  habitForm.addEventListener("submit", handleHabitFormSubmit);

  // Delete confirmation
  confirmDeleteBtn.addEventListener("click", confirmDeleteHabit);

  // Delete category confirmation
  confirmDeleteCategoryBtn.addEventListener("click", confirmDeleteCategory);

  // Calendar navigation
  prevMonthBtn.addEventListener("click", () => navigateMonth(-1));
  nextMonthBtn.addEventListener("click", () => navigateMonth(1));

  // Time range buttons
  timeWeekBtn.addEventListener("click", () => setTimeRange("week"));
  timeMonthBtn.addEventListener("click", () => setTimeRange("month"));
  timeYearBtn.addEventListener("click", () => setTimeRange("year"));

  // Category form
  addCategoryBtn.addEventListener("click", showNewCategoryForm);
  cancelCategoryBtn.addEventListener("click", hideNewCategoryForm);
  addCategorySubmit.addEventListener("click", handleAddCategory);

  // Form preview updates
  document.getElementById("habit-name").addEventListener("input", updatePreview);
  document.getElementById("habit-icon").addEventListener("change", updatePreview);
  document.getElementById("habit-exp").addEventListener("change", updatePreview);

  // Analytics tabs
  tabOverview.addEventListener("click", () => setAnalyticsTab("overview"));
  tabHabits.addEventListener("click", () => setAnalyticsTab("habits"));
  tabCategories.addEventListener("click", () => setAnalyticsTab("categories"));
}

// Toggle theme
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// Set current view
function setView(view) {
  currentView = view;
  
  // Update active button
  viewListBtn.classList.remove("active", "bg-teal-600", "text-white");
  viewCalendarBtn.classList.remove("active", "bg-teal-600", "text-white");
  viewAnalyticsBtn.classList.remove("active", "bg-teal-600", "text-white");
  
  if (view === "list") {
    viewListBtn.classList.add("active", "bg-teal-600", "text-white");
    habitsListView.classList.remove("hidden");
    calendarView.classList.add("hidden");
    analyticsView.classList.add("hidden");
  } else if (view === "calendar") {
    viewCalendarBtn.classList.add("active", "bg-teal-600", "text-white");
    habitsListView.classList.add("hidden");
    calendarView.classList.remove("hidden");
    analyticsView.classList.add("hidden");
    renderCalendar();
  } else if (view === "analytics") {
    viewAnalyticsBtn.classList.add("active", "bg-teal-600", "text-white");
    habitsListView.classList.add("hidden");
    calendarView.classList.add("hidden");
    analyticsView.classList.remove("hidden");
    renderAnalytics();
  }
}

// Set analytics tab
function setAnalyticsTab(tab) {
  activeAnalyticsTab = tab;
  
  // Update active tab
  tabOverview.classList.remove("border-teal-500", "text-teal-600", "dark:text-teal-400");
  tabHabits.classList.remove("border-teal-500", "text-teal-600", "dark:text-teal-400");
  tabCategories.classList.remove("border-teal-500", "text-teal-600", "dark:text-teal-400");
  
  tabOverview.classList.add("border-transparent", "text-gray-500");
  tabHabits.classList.add("border-transparent", "text-gray-500");
  tabCategories.classList.add("border-transparent", "text-gray-500");
  
  // Hide all tab contents
  tabContentOverview.classList.add("hidden");
  tabContentHabits.classList.add("hidden");
  tabContentCategories.classList.add("hidden");
  
  if (tab === "overview") {
    tabOverview.classList.remove("border-transparent", "text-gray-500");
    tabOverview.classList.add("border-teal-500", "text-teal-600", "dark:text-teal-400");
    tabContentOverview.classList.remove("hidden");
  } else if (tab === "habits") {
    tabHabits.classList.remove("border-transparent", "text-gray-500");
    tabHabits.classList.add("border-teal-500", "text-teal-600", "dark:text-teal-400");
    tabContentHabits.classList.remove("hidden");
  } else if (tab === "categories") {
    tabCategories.classList.remove("border-transparent", "text-gray-500");
    tabCategories.classList.add("border-teal-500", "text-teal-600", "dark:text-teal-400");
    tabContentCategories.classList.remove("hidden");
  }
  
  renderAnalytics();
}

// Set time range for analytics
function setTimeRange(range) {
  timeRange = range;
  
  // Update active button
  timeWeekBtn.classList.remove("active", "bg-teal-600", "text-white");
  timeMonthBtn.classList.remove("active", "bg-teal-600", "text-white");
  timeYearBtn.classList.remove("active", "bg-teal-600", "text-white");
  
  if (range === "week") {
    timeWeekBtn.classList.add("active", "bg-teal-600", "text-white");
  } else if (range === "month") {
    timeMonthBtn.classList.add("active", "bg-teal-600", "text-white");
  } else if (range === "year") {
    timeYearBtn.classList.add("active", "bg-teal-600", "text-white");
  }
  
  renderAnalytics();
}

// Render all components
function renderAll() {
  renderStats();
  renderCategoryFilter();
  renderFrequencyFilter();
  renderHabitsList();
  renderCalendar();
  renderAnalytics();
  renderCategoryOptions();
}

// Render stats overview
function renderStats() {
  const totalHabits = habits.length;
  const today = new Date().toISOString().split("T")[0];
  const totalCompletedToday = habits.filter(habit => 
    habit.frequency === "daily" && habit.progress.some(p => p.date === today && p.completed)
  ).length;
  const totalDailyHabits = habits.filter(habit => habit.frequency === "daily").length;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(habit => calculateStreak(habit.progress))) : 0;
  const totalExp = habits.reduce((total, habit) => {
    const completedDays = habit.progress.filter(p => p.completed).length;
    return total + completedDays * habit.expPoints;
  }, 0);
  
  const completionRate = totalDailyHabits > 0 ? Math.round((totalCompletedToday / totalDailyHabits) * 100) : 0;
  
  statsOverview.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center space-x-4 mb-3">
        <div class="p-2 bg-teal-100 dark:bg-teal-900 rounded-full">
          <i class="fas fa-check-circle text-teal-600 dark:text-teal-400 text-lg"></i>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Progress</p>
          <div class="flex items-baseline space-x-2">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
              ${totalCompletedToday}/${totalDailyHabits}
            </h3>
            <span class="text-sm text-gray-500 dark:text-gray-400">(${completionRate}%)</span>
          </div>
        </div>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div class="bg-teal-600 h-2 rounded-full progress-bar" style="width: ${completionRate}%"></div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center space-x-4">
      <div class="p-2 bg-teal-100 dark:bg-teal-900 rounded-full">
        <i class="fas fa-calendar text-teal-600 dark:text-teal-400 text-lg"></i>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Habits</p>
        <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200">${totalHabits}</h3>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center space-x-4">
      <div class="p-2 bg-teal-100 dark:bg-teal-900 rounded-full">
        <i class="fas fa-award text-teal-600 dark:text-teal-400 text-lg"></i>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Longest Streak</p>
        <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          ${longestStreak} ${longestStreak === 1 ? "day" : "days"}
        </h3>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center space-x-4">
      <div class="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
        <i class="fas fa-bolt text-amber-600 dark:text-amber-400 text-lg"></i>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total EXP</p>
        <h3 class="text-2xl font-bold text-amber-500">${totalExp.toLocaleString()}</h3>
      </div>
    </div>
  `;
}

// Render category filter
function renderCategoryFilter() {
  const allCategories = { ...CATEGORIES, ...customCategories };
  
  categoryFilter.innerHTML = "";
  
  Object.entries(allCategories).forEach(([key, category]) => {
    const isActive = activeCategories.includes(key);
    
    const categoryBtn = document.createElement("div");
    categoryBtn.className = "relative group";
    categoryBtn.innerHTML = `
      <button class="px-3 py-1.5 rounded-md flex items-center ${
        isActive 
          ? `bg-${category.color} text-white` 
          : `border border-${category.color}/30 text-black dark:text-white hover:bg-${category.color}/10`
      }">
        <i class="fas ${category.icon} mr-2 text-sm"></i>
        ${category.name}
      </button>
    `;
    
    // Add click event for category button
    const button = categoryBtn.querySelector("button");
    button.addEventListener("click", () => toggleCategory(key));
    
    categoryFilter.appendChild(categoryBtn);
  });
}

// Render frequency filter
function renderFrequencyFilter() {
  frequencyFilter.innerHTML = "";
  
  FREQUENCIES.forEach(frequency => {
    const isActive = activeFrequencies.includes(frequency.value);
    
    const button = document.createElement("button");
    button.className = `px-3 py-1.5 rounded-md flex items-center ${
      isActive 
        ? "bg-teal-600 hover:bg-teal-700 text-white" 
        : "border border-gray-300 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;
    button.innerHTML = `
      <i class="fas ${frequency.icon} mr-2 text-sm"></i>
      ${frequency.label}
    `;
    
    button.addEventListener("click", () => toggleFrequency(frequency.value));
    
    frequencyFilter.appendChild(button);
  });
}

// Render habits list
function renderHabitsList() {
  const filteredHabits = habits.filter(
    habit => activeCategories.includes(habit.category) && activeFrequencies.includes(habit.frequency)
  );
  
  habitsListView.innerHTML = "";
  
  if (filteredHabits.length === 0) {
    habitsListView.innerHTML = `
      <div class="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p class="text-gray-600 dark:text-gray-400 mb-4">You don't have any habits yet.</p>
        <button id="empty-add-habit" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md">
          <i class="fas fa-plus-circle mr-2"></i>
          Add Your First Habit
        </button>
      </div>
    `;
    
    document.getElementById("empty-add-habit").addEventListener("click", openAddHabitModal);
    return;
  }
  
  filteredHabits.forEach(habit => {
    const streak = calculateStreak(habit.progress);
    const completed = isCompletedToday(habit);
    const categoryInfo = getCategoryInfo(habit.category);
    
    const habitCard = document.createElement("div");
    habitCard.className = `bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-all duration-200 ${
      completed ? `border-l-4 border-${categoryInfo.color}` : "border-l-4 border-transparent"
    }`;
    
    habitCard.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button class="toggle-habit h-10 w-10 flex items-center justify-center rounded-full transition-colors
            ${
              completed
                ? `bg-${categoryInfo.color} text-white`
                : `bg-${categoryInfo.color}/20 text-${categoryInfo.color} hover:bg-${categoryInfo.color}/30`
            }"
            data-id="${habit.id}">
            ${completed 
              ? '<i class="fas fa-check"></i>' 
              : `<i class="fas ${categoryInfo.icon}"></i>`
            }
          </button>

          <div>
            <div class="flex items-center space-x-2">
              <label class="text-lg font-medium cursor-pointer ${
                completed
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : "text-gray-800 dark:text-gray-200"
              }" data-id="${habit.id}">
                ${habit.name}
              </label>
              <span class="px-2 py-0.5 text-xs rounded-full bg-${categoryInfo.color}/10 text-${categoryInfo.color} border border-${categoryInfo.color}/20">
                ${categoryInfo.name}
              </span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">${habit.description}</p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="text-right">
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Current streak</div>
            <div class="text-xl font-bold text-teal-600 dark:text-teal-400">
              ${streak} ${streak === 1 ? "day" : "days"}
            </div>
          </div>

          <div class="text-right">
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">EXP</div>
            <div class="text-xl font-bold text-amber-500">${habit.expPoints}</div>
          </div>

          <div class="flex space-x-1">
            <button class="edit-habit p-2 text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400" data-id="${habit.id}">
              <i class="fas fa-edit"></i>
            </button>

            <button class="delete-habit p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" data-id="${habit.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    const toggleBtn = habitCard.querySelector(".toggle-habit");
    toggleBtn.addEventListener("click", () => toggleHabitCompletion(habit.id));
    
    const habitLabel = habitCard.querySelector("label");
    habitLabel.addEventListener("click", () => toggleHabitCompletion(habit.id));
    
    const editBtn = habitCard.querySelector(".edit-habit");
    editBtn.addEventListener("click", () => openEditHabitModal(habit.id));
    
    const deleteBtn = habitCard.querySelector(".delete-habit");
    deleteBtn.addEventListener("click", () => openDeleteHabitModal(habit.id));
    
    habitsListView.appendChild(habitCard);
  });
}

// Render calendar
function renderCalendar() {
  // Update month and year display
  calendarMonthYear.textContent = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
  
  // Get days for the month
  const days = getMonthData(currentDate);
  
  // Clear previous calendar
  calendarDays.innerHTML = '';
  
  // Render days
  days.forEach(day => {
    const isCurrentMonth = day.date.getMonth() === currentDate.getMonth();
    const isToday = isCurrentDay(day.date);
    const isPast = isPastDay(day.date);
    const isFuture = isFutureDay(day.date);
    const isSelected = isSelectedDay(day.date);
    const completedHabits = day.habits.filter(h => h.completed);
    const totalExp = completedHabits.reduce((total, habit) => total + habit.expPoints, 0);
    
    // For past days, only show completed habits
    // For future days, don't show any habits
    // For today or selected day, show all habits
    const displayHabits = 
      isPast && !isToday && !isSelected
        ? completedHabits
        : isFuture && !isToday && !isSelected
          ? []
          : day.habits;
    
    const dayElement = document.createElement('div');
    dayElement.className = `min-h-[100px] border rounded-md p-1 
      ${isCurrentMonth ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600"} 
      ${isToday ? "ring-2 ring-teal-500 dark:ring-teal-400" : ""}
      ${isSelected ? "ring-2 ring-amber-500 dark:ring-amber-400" : ""}
      cursor-pointer
    `;
    
    dayElement.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="text-sm font-medium p-1 rounded-full w-6 h-6 flex items-center justify-center
          ${isToday ? "bg-teal-500 text-white" : ""}
          ${isSelected && !isToday ? "bg-amber-500 text-white" : ""}
        ">
          ${day.date.getDate()}
        </div>

        ${totalExp > 0 ? `
          <span class="px-1.5 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
            ${totalExp} EXP
          </span>
        ` : ''}
      </div>

      <div class="mt-1 space-y-1">
        ${displayHabits.map(habit => {
          const categoryInfo = getCategoryInfo(habit.category);
          // Only allow toggling for today
          const canToggle = isToday || (isSelected && !isPast && !isFuture);
          
          return `
            <div class="text-xs flex items-center p-1 rounded
              bg-${categoryInfo.color}/10 text-${categoryInfo.color}
              ${canToggle ? "cursor-pointer" : ""}"
              data-habit-id="${habit.id}" data-date="${day.date.toISOString().split('T')[0]}">
              ${canToggle ? `
                <input type="checkbox" class="calendar-toggle h-3 w-3 mr-1 rounded border-${categoryInfo.color}" 
                  ${habit.completed ? "checked" : ""}>
              ` : `
                <i class="fas ${categoryInfo.icon} text-xs mr-1"></i>
              `}
              <span class="truncate">${habit.name}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
    
    // Add event listener to select day
    dayElement.addEventListener('click', () => {
      selectedDate = new Date(day.date);
      renderCalendar();
    });
    
    // Add event listeners for habit toggles
    dayElement.querySelectorAll('[data-habit-id]').forEach(habitEl => {
      habitEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const habitId = habitEl.dataset.habitId;
        const date = habitEl.dataset.date;
        const canToggle = isToday(new Date(date)) || (isSelectedDay(new Date(date)) && !isPastDay(new Date(date)) && !isFutureDay(new Date(date)));
        
        if (canToggle) {
          toggleHabitCompletion(habitId, date);
        }
      });
    });
    
    calendarDays.appendChild(dayElement);
  });
}

// Render analytics
function renderAnalytics() {
  const { startDate, endDate } = getDateRange();
  const allCategories = { ...CATEGORIES, ...customCategories };

  // Set date range text
  dateRange.textContent = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  // Calculate overall completion rate
  const allProgress = habits.flatMap(habit =>
    habit.progress.filter(p => {
      const progressDate = new Date(p.date);
      return progressDate >= startDate && progressDate <= endDate;
    })
  );

  const overallCompletionRate = allProgress.length > 0
    ? Math.round((allProgress.filter(p => p.completed).length / allProgress.length) * 100)
    : 0;

  // Render circular progress
  overallProgress.innerHTML = `
    <svg class="circular-progress w-full h-full" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="10" class="text-gray-200 dark:text-gray-700" />
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="10" 
        stroke-dasharray="${2 * Math.PI * 45}" stroke-dashoffset="${2 * Math.PI * 45 * (1 - overallCompletionRate / 100)}" 
        stroke-linecap="round" class="text-teal-600 dark:text-teal-400" />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-3xl font-bold text-teal-600 dark:text-teal-400">${overallCompletionRate}%</span>
    </div>
  `;

  // Calculate completion by category
  const categoryData = {};

  // Initialize all categories
  Object.keys(allCategories).forEach(key => {
    categoryData[key] = { total: 0, completed: 0 };
  });

  habits.forEach(habit => {
    const progressInRange = habit.progress.filter(p => {
      const progressDate = new Date(p.date);
      return progressDate >= startDate && progressDate <= endDate;
    });
    
    if (!categoryData[habit.category]) {
      categoryData[habit.category] = { total: 0, completed: 0 };
    }
    
    categoryData[habit.category].total += progressInRange.length;
    categoryData[habit.category].completed += progressInRange.filter(p => p.completed).length;
  });

  // Render category progress
  categoryProgress.innerHTML = "";

  Object.entries(categoryData)
    .filter(([_, data]) => data.total > 0) // Only show categories with data
    .map(([category, data]) => ({
      category,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      total: data.total,
      completed: data.completed,
    }))
    .sort((a, b) => b.completionRate - a.completionRate)
    .forEach(({ category, completionRate }) => {
      const categoryInfo = allCategories[category] || CATEGORIES.keystone;
      
      const categoryEl = document.createElement("div");
      categoryEl.className = "space-y-1";
      categoryEl.innerHTML = `
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <i class="fas ${categoryInfo.icon} mr-2 text-${categoryInfo.color} text-sm"></i>
            <span class="text-sm font-medium">${categoryInfo.name}</span>
          </div>
          <span class="text-sm font-medium">${completionRate}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div class="bg-${categoryInfo.color} h-2 rounded-full progress-bar" style="width: ${completionRate}%"></div>
        </div>
      `;
      
      categoryProgress.appendChild(categoryEl);
    });

  // Render performance trend
  renderPerformanceTrend(startDate, endDate);

  // Calculate habit analytics
  const habitAnalytics = habits
    .map(habit => {
      // Filter progress entries within the selected date range
      const progressInRange = habit.progress.filter(p => {
        const progressDate = new Date(p.date);
        return progressDate >= startDate && progressDate <= endDate;
      });
      
      // Calculate completion rate
      const completionRate = progressInRange.length > 0
        ? Math.round((progressInRange.filter(p => p.completed).length / progressInRange.length) * 100)
        : 0;
      
      return {
        id: habit.id,
        name: habit.name,
        category: habit.category,
        icon: habit.icon,
        frequency: habit.frequency,
        completionRate,
        streak: calculateStreak(habit.progress),
        totalCompletions: habit.progress.filter(p => p.completed).length,
        expPoints: habit.expPoints,
      };
    })
    .sort((a, b) => b.completionRate - a.completionRate);

  // Render habit performance
  habitPerformance.innerHTML = "";

  habitAnalytics.forEach(habit => {
    const categoryInfo = allCategories[habit.category] || CATEGORIES.keystone;
    
    const habitEl = document.createElement("div");
    habitEl.className = "flex items-center space-x-4 mb-4";
    habitEl.innerHTML = `
      <div class="p-2 rounded-full bg-${categoryInfo.color}/20">
        <i class="fas ${habit.icon === 'fa-check' ? categoryInfo.icon : habit.icon} text-${categoryInfo.color}"></i>
      </div>

      <div class="flex-1">
        <div class="flex items-center space-x-2">
          <h3 class="font-medium">${habit.name}</h3>
          <span class="px-2 py-0.5 text-xs rounded-full bg-${categoryInfo.color}/10 text-${categoryInfo.color} border border-${categoryInfo.color}/20">
            ${categoryInfo.name}
          </span>
          <span class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            ${getFrequencyLabel(habit.frequency)}
          </span>
        </div>
        <div class="mt-1">
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-teal-600 h-2 rounded-full progress-bar" style="width: ${habit.completionRate}%"></div>
          </div>
        </div>
      </div>

      <div class="text-right">
        <div class="text-lg font-bold text-teal-600 dark:text-teal-400">${habit.completionRate}%</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          ${habit.streak} day streak • ${habit.totalCompletions} total
        </div>
      </div>
    `;
    
    habitPerformance.appendChild(habitEl);
  });

  // Render category performance
  renderCategoryPerformance(categoryData, allCategories);
}

// Render performance trend
function renderPerformanceTrend(startDate, endDate) {
  // Get dates between start and end
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Calculate completion rate for each date
  const completionData = dates.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const progressForDate = habits.flatMap(habit => 
      habit.progress.filter(p => p.date === dateStr)
    );
    
    const completionRate = progressForDate.length > 0
      ? Math.round((progressForDate.filter(p => p.completed).length / progressForDate.length) * 100)
      : 0;
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completionRate
    };
  });

  // Create the trend chart
  let chartHTML = `
    <div class="flex flex-col h-full">
      <div class="flex-1 flex items-end">
  `;

  // Add bars
  completionData.forEach(data => {
    chartHTML += `
      <div class="flex flex-col items-center flex-1">
        <div class="text-xs text-gray-500 mb-1">${data.completionRate}%</div>
        <div class="w-full px-1">
          <div class="bg-teal-500 rounded-t-sm" style="height: ${data.completionRate}%;"></div>
        </div>
      </div>
    `;
  });

  chartHTML += `
      </div>
      <div class="h-6 flex">
  `;

  // Add date labels
  completionData.forEach(data => {
    chartHTML += `
      <div class="flex-1 text-xs text-center text-gray-500 truncate">${data.date}</div>
    `;
  });

  chartHTML += `
      </div>
    </div>
  `;

  performanceTrend.innerHTML = chartHTML;
}

// Render category performance
function renderCategoryPerformance(categoryData, allCategories) {
  categoryPerformance.innerHTML = "";
  
  Object.entries(categoryData)
    .filter(([_, data]) => data.total > 0)
    .forEach(([category, data]) => {
      const categoryInfo = allCategories[category] || CATEGORIES.keystone;
      const completionRate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
      
      // Get habits in this category
      const categoryHabits = habits.filter(h => h.category === category);
      
      const categoryEl = document.createElement("div");
      categoryEl.className = "mb-6";
      categoryEl.innerHTML = `
        <div class="flex items-center space-x-2 mb-2">
          <div class="p-2 rounded-full bg-${categoryInfo.color}/20">
            <i class="fas ${categoryInfo.icon} text-${categoryInfo.color}"></i>
          </div>
          <h3 class="text-lg font-medium">${categoryInfo.name}</h3>
          <span class="ml-auto text-lg font-bold text-teal-600 dark:text-teal-400">${completionRate}%</span>
        </div>
        
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div class="bg-${categoryInfo.color} h-2 rounded-full progress-bar" style="width: ${completionRate}%"></div>
        </div>
        
        <div class="pl-4 border-l-2 border-${categoryInfo.color}">
          ${categoryHabits.map(habit => {
            const habitProgress = habit.progress.filter(p => {
              const progressDate = new Date(p.date);
              const { startDate, endDate } = getDateRange();
              return progressDate >= startDate && progressDate <= endDate;
            });
            
            const habitCompletionRate = habitProgress.length > 0
              ? Math.round((habitProgress.filter(p => p.completed).length / habitProgress.length) * 100)
              : 0;
              
            return `
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <i class="fas ${habit.icon} text-${categoryInfo.color} mr-2 text-sm"></i>
                  <span class="text-sm">${habit.name}</span>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div class="bg-${categoryInfo.color} h-1.5 rounded-full" style="width: ${habitCompletionRate}%"></div>
                  </div>
                  <span class="text-sm font-medium">${habitCompletionRate}%</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
      
      categoryPerformance.appendChild(categoryEl);
    });
}

// Render category options in habit form
function renderCategoryOptions() {
  const allCategories = { ...CATEGORIES, ...customCategories };

  categoryOptions.innerHTML = "";

  Object.entries(allCategories).forEach(([key, category]) => {
    const categoryOption = document.createElement("div");
    categoryOption.className = "relative flex items-center space-x-2 border rounded-md p-1.5 text-black dark:text-white";
    categoryOption.innerHTML = `
      <input type="radio" name="category" id="category-${key}" value="${key}" class="h-4 w-4 text-teal-600">
      <label for="category-${key}" class="flex items-center cursor-pointer">
        <i class="fas ${category.icon} text-${category.color} mr-1 text-sm"></i>
        <span class="ml-1 text-sm">${category.name}</span>
      </label>
    `;
    
    categoryOptions.appendChild(categoryOption);
  });
}

// Open add habit modal
function openAddHabitModal() {
  modalTitle.textContent = "Add New Habit";
  submitBtnText.textContent = "Add Habit";

  // Reset form
  habitForm.reset();
  document.getElementById("habit-id").value = "";
  editingHabitId = null;

  // Set default values
  document.getElementById("habit-icon").value = "fa-brain";
  document.getElementById("habit-exp").value = "1000";
  document.getElementById("habit-frequency").value = "daily";

  // Update preview
  updatePreview();

  // Show modal
  habitModal.classList.remove("opacity-0", "pointer-events-none");

  // Hide new category form
  hideNewCategoryForm();
}

// Open edit habit modal
function openEditHabitModal(habitId) {
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return;

  modalTitle.textContent = "Edit Habit";
  submitBtnText.textContent = "Update Habit";

  // Set form values
  document.getElementById("habit-id").value = habit.id;
  document.getElementById("habit-name").value = habit.name;
  document.getElementById("habit-description").value = habit.description;
  document.getElementById("habit-icon").value = habit.icon;
  document.getElementById("habit-exp").value = habit.expPoints.toString();
  document.getElementById("habit-frequency").value = habit.frequency;

  // Set category radio button
  const categoryRadio = document.querySelector(`input[name="category"][value="${habit.category}"]`);
  if (categoryRadio) categoryRadio.checked = true;

  editingHabitId = habit.id;

  // Update preview
  updatePreview();

  // Show modal
  habitModal.classList.remove("opacity-0", "pointer-events-none");

  // Hide new category form
  hideNewCategoryForm();
}

// Open delete habit modal
function openDeleteHabitModal(habitId) {
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return;

  deleteHabitName.textContent = habit.name;
  deletingHabitId = habit.id;

  // Show modal
  deleteModal.classList.remove("opacity-0", "pointer-events-none");
}

// Open delete category modal
function openDeleteCategoryModal(categoryId) {
  deletingCategoryId = categoryId;

  // Show modal
  deleteCategoryModal.classList.remove("opacity-0", "pointer-events-none");
}

// Close all modals
function closeModals() {
  habitModal.classList.add("opacity-0", "pointer-events-none");
  deleteModal.classList.add("opacity-0", "pointer-events-none");
  deleteCategoryModal.classList.add("opacity-0", "pointer-events-none");
}

// Handle habit form submit
function handleHabitFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("habit-name").value.trim();
  const description = document.getElementById("habit-description").value.trim();
  const categoryRadio = document.querySelector('input[name="category"]:checked');
  const category = categoryRadio ? categoryRadio.value : "keystone";
  const icon = document.getElementById("habit-icon").value;
  const expPoints = parseInt(document.getElementById("habit-exp").value, 10);
  const frequency = document.getElementById("habit-frequency").value;

  if (!name) return;

  if (editingHabitId) {
    // Update existing habit
    const habitIndex = habits.findIndex(h => h.id === editingHabitId);
    if (habitIndex !== -1) {
      habits[habitIndex] = {
        ...habits[habitIndex],
        name,
        description,
        category,
        icon,
        expPoints,
        frequency
      };
    }
  } else {
    // Add new habit
    const newHabit = {
      id: Date.now().toString(),
      name,
      description,
      category,
      icon,
      expPoints,
      frequency,
      createdAt: new Date().toISOString(),
      progress: []
    };
    
    habits.push(newHabit);
  }

  // Save data
  saveData();

  // Close modal
  closeModals();

  // Re-render
  renderAll();
}

// Confirm delete habit
function confirmDeleteHabit() {
  if (!deletingHabitId) return;

  // Remove habit
  habits = habits.filter(h => h.id !== deletingHabitId);

  // Save data
  saveData();

  // Close modal
  closeModals();

  // Re-render
  renderAll();

  deletingHabitId = null;
}

// Confirm delete category
function confirmDeleteCategory() {
  if (!deletingCategoryId) return;

  // Remove category from custom categories
  delete customCategories[deletingCategoryId];

  // Remove from active categories
  activeCategories = activeCategories.filter(c => c !== deletingCategoryId);

  // Delete all habits in this category
  habits = habits.filter(habit => habit.category !== deletingCategoryId);

  // Save data
  saveData();

  // Close modal
  closeModals();

  // Re-render
  renderAll();

  deletingCategoryId = null;
}

// Show new category form
function showNewCategoryForm() {
  newCategoryForm.classList.remove("hidden");
  addCategoryBtn.classList.add("hidden");
}

// Hide new category form
function hideNewCategoryForm() {
  newCategoryForm.classList.add("hidden");
  addCategoryBtn.classList.remove("hidden");

  // Reset form
  document.getElementById("category-name").value = "";
  document.getElementById("category-color").value = "teal-500";
  document.getElementById("category-icon").value = "fa-check-square";
}

// Handle add category
function handleAddCategory() {
  const name = document.getElementById("category-name").value.trim();
  const color = document.getElementById("category-color").value;
  const icon = document.getElementById("category-icon").value;

  if (!name) return;

  const categoryId = name.toLowerCase().replace(/\s+/g, "-");

  // Add to custom categories
  customCategories[categoryId] = {
    name,
    color,
    icon
  };

  // Add to active categories
  if (!activeCategories.includes(categoryId)) {
    activeCategories.push(categoryId);
  }

  // Save data
  saveData();

  // Hide form
  hideNewCategoryForm();

  // Re-render
  renderCategoryFilter();
  renderCategoryOptions();

  // Select the new category
  const categoryRadio = document.querySelector(`input[name="category"][value="${categoryId}"]`);
  if (categoryRadio) categoryRadio.checked = true;
}

// Update preview in habit form
function updatePreview() {
  const name = document.getElementById("habit-name").value.trim() || "Habit Name";
  const icon = document.getElementById("habit-icon").value;
  const expPoints = document.getElementById("habit-exp").value;

  document.getElementById("preview-name").textContent = name;
  document.getElementById("preview-icon").innerHTML = `<i class="fas ${icon} text-black text-lg"></i>`;
  document.getElementById("preview-exp").textContent = `${expPoints} EXP`;
}

// Toggle category
function toggleCategory(category) {
  if (activeCategories.includes(category)) {
    activeCategories = activeCategories.filter(c => c !== category);
  } else {
    activeCategories.push(category);
  }

  saveData();
  renderCategoryFilter();
  renderHabitsList();
}

// Toggle frequency
function toggleFrequency(frequency) {
  if (activeFrequencies.includes(frequency)) {
    activeFrequencies = activeFrequencies.filter(f => f !== frequency);
  } else {
    activeFrequencies.push(frequency);
  }

  saveData();
  renderFrequencyFilter();
  renderHabitsList();
}

// Toggle habit completion
function toggleHabitCompletion(habitId, date) {
  const today = date || new Date().toISOString().split("T")[0];

  habits = habits.map(habit => {
    if (habit.id !== habitId) return habit;
    
    const existingProgressIndex = habit.progress.findIndex(p => p.date === today);
    const updatedProgress = [...habit.progress];
    
    if (existingProgressIndex >= 0) {
      // Toggle existing progress
      updatedProgress[existingProgressIndex] = {
        ...updatedProgress[existingProgressIndex],
        completed: !updatedProgress[existingProgressIndex].completed
      };
    } else {
      // Add new progress
      updatedProgress.push({
        date: today,
        completed: true
      });
    }
    
    return {
      ...habit,
      progress: updatedProgress
    };
  });

  saveData();
  renderAll();
}

// Navigate month in calendar
function navigateMonth(direction) {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
  renderCalendar();
}

// Helper functions
function isCompletedToday(habit) {
  const today = new Date().toISOString().split("T")[0];
  return habit.progress.some(p => p.date === today && p.completed);
}

function calculateStreak(progress) {
  if (!progress.length) return 0;

  // Sort progress by date in descending order (newest first)
  const sortedProgress = [...progress].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Check if the habit was completed today
  const todayStr = currentDate.toISOString().split("T")[0];
  const todayCompleted = sortedProgress.some(p => p.date === todayStr && p.completed);

  // If not completed today, check if it was completed yesterday
  if (!todayCompleted) {
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split("T")[0];
    
    const yesterdayCompleted = sortedProgress.some(p => p.date === yesterdayStr && p.completed);
    
    // If not completed yesterday either, streak is 0
    if (!yesterdayCompleted) {
      return 0;
    }
  }

  // Calculate streak by checking consecutive days
  for (let i = 0; i < sortedProgress.length; i++) {
    const entry = sortedProgress[i];
    
    // Skip if not completed
    if (!entry.completed) continue;
    
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    
    // If this is the first completed entry
    if (streak === 0) {
      streak = 1;
      currentDate = entryDate;
      continue;
    }
    
    // Check if this entry is consecutive with the previous one
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - 1);
    
    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
      currentDate = entryDate;
    } else {
      // Break the streak if a day was missed
      break;
    }
  }

  return streak;
}

function getCategoryInfo(categoryId) {
  return customCategories[categoryId] || CATEGORIES[categoryId] || CATEGORIES.keystone;
}

function getFrequencyLabel(frequency) {
  switch (frequency) {
    case "daily": return "Daily";
    case "weekly": return "Weekly";
    case "monthly": return "Monthly";
    default: return frequency;
  }
}

function getMonthData(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay();

  // Calculate days from previous month to show (Monday is first day)
  const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Calculate total days to show (including days from prev/next month)
  const totalDays = daysFromPrevMonth + lastDay.getDate() + (7 - ((daysFromPrevMonth + lastDay.getDate()) % 7 || 7));

  const days = [];

  // Add days from previous month
  const prevMonth = new Date(year, month - 1, 0);
  const prevMonthLastDay = prevMonth.getDate();

  for (let i = 0; i < daysFromPrevMonth; i++) {
    const day = prevMonthLastDay - daysFromPrevMonth + i + 1;
    days.push({
      date: new Date(year, month - 1, day),
      habits: getHabitsForDate(new Date(year, month - 1, day))
    });
  }

  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: new Date(year, month, i),
      habits: getHabitsForDate(new Date(year, month, i))
    });
  }

  // Add days from next month
  const remainingDays = totalDays - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      habits: getHabitsForDate(new Date(year, month + 1, i))
    });
  }

  return days;
}

function getHabitsForDate(date) {
  const dateString = date.toISOString().split("T")[0];

  return habits
    .filter(habit => {
      // Filter by active categories and frequencies
      if (!activeCategories.includes(habit.category) || !activeFrequencies.includes(habit.frequency)) {
        return false;
      }
      
      // Check if habit should be shown on this date based on frequency
      if (habit.frequency === "daily") return true;
      if (habit.frequency === "weekly" && date.getDay() === 1) return true; // Monday
      if (habit.frequency === "monthly" && date.getDate() === 1) return true; // First day of month
      
      return false;
    })
    .map(habit => {
      const progressForDate = habit.progress.find(p => p.date === dateString);
      
      return {
        id: habit.id,
        name: habit.name,
        completed: progressForDate ? progressForDate.completed : false,
        icon: habit.icon,
        expPoints: habit.expPoints,
        category: habit.category
      };
    });
}

function isCurrentDay(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

function isPastDay(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isFutureDay(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

function isSelectedDay(date) {
  return date.getDate() === selectedDate.getDate() &&
         date.getMonth() === selectedDate.getMonth() &&
         date.getFullYear() === selectedDate.getFullYear();
}

function getDateRange() {
  const today = new Date();
  const startDate = new Date();

  if (timeRange === "week") {
    startDate.setDate(today.getDate() - 7);
  } else if (timeRange === "month") {
    startDate.setMonth(today.getMonth() - 1);
  } else {
    startDate.setFullYear(today.getFullYear() - 1);
  }

  return { startDate, endDate: today };
}

// Sample data generator
function generateSampleHabits() {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];
  const fourDaysAgo = new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0];

  return [
    {
      id: "1",
      name: "Morning Meditation",
      description: "10 minutes of mindfulness meditation",
      category: "morning-routine",
      icon: "fa-brain",
      expPoints: 1000,
      frequency: "daily",
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      progress: [
        { date: today, completed: true },
        { date: yesterday, completed: true },
        { date: twoDaysAgo, completed: true },
        { date: threeDaysAgo, completed: true },
        { date: fourDaysAgo, completed: false },
      ],
    },
    {
      id: "2",
      name: "Read a Book",
      description: "Read for at least 30 minutes",
      category: "personal",
      icon: "fa-book",
      expPoints: 1500,
      frequency: "daily",
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      progress: [
        { date: today, completed: true },
        { date: yesterday, completed: true },
        { date: twoDaysAgo, completed: false },
        { date: threeDaysAgo, completed: true },
      ],
    },
    {
      id: "3",
      name: "Exercise",
      description: "30 minutes of physical activity",
      category: "keystone",
      icon: "fa-dumbbell",
      expPoints: 2000,
      frequency: "daily",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      progress: [
        { date: today, completed: true },
        { date: yesterday, completed: false },
        { date: twoDaysAgo, completed: true },
      ],
    },
    {
      id: "4",
      name: "Weekly Planning",
      description: "Plan tasks and goals for the week",
      category: "work",
      icon: "fa-calendar",
      expPoints: 1000,
      frequency: "weekly",
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      progress: [
        { date: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0], completed: true },
        { date: new Date(Date.now() - 8 * 86400000).toISOString().split("T")[0], completed: true },
      ],
    },
    {
      id: "5",
      name: "Journal",
      description: "Write in journal before bed",
      category: "night-routine",
      icon: "fa-pen",
      expPoints: 1000,
      frequency: "daily",
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      progress: [
        { date: today, completed: false },
        { date: yesterday, completed: true },
        { date: twoDaysAgo, completed: true },
        { date: threeDaysAgo, completed: false },
      ],
    },
  ];
}