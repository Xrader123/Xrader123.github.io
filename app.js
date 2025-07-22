// Application State
let appState = {
  user: {
    totalPoints: 127,
    level: 3,
    currentStreak: 5,
    joinDate: "2024-01-15",
    totalTasksCompleted: 89,
    favoriteCategory: "fitness"
  },
  dailyRoutines: [
    {id: 1, name: "Morning Workout", points: 15, completed: false, streak: 3, category: "fitness"},
    {id: 2, name: "Drink 8 glasses of water", points: 10, completed: false, streak: 7, category: "health"},
    {id: 3, name: "Read for 30 minutes", points: 12, completed: false, streak: 2, category: "learning"},
    {id: 4, name: "Meditate", points: 8, completed: false, streak: 5, category: "wellness"},
    {id: 5, name: "Take vitamins", points: 5, completed: false, streak: 10, category: "health"},
    {id: 6, name: "Plan tomorrow", points: 8, completed: false, streak: 4, category: "productivity"}
  ],
  todoTasks: [
    {id: 101, name: "Finish project proposal", points: 25, completed: false, priority: "high"},
    {id: 102, name: "Call dentist", points: 8, completed: false, priority: "medium"},
    {id: 103, name: "Grocery shopping", points: 12, completed: false, priority: "medium"}
  ],
  rewards: [
    {id: 201, name: "Watch a Movie", cost: 50, purchased: false, description: "Relax with your favorite film"},
    {id: 202, name: "Order Favorite Food", cost: 100, purchased: false, description: "Treat yourself to a delicious meal"},
    {id: 203, name: "Buy a Small Treat", cost: 75, purchased: false, description: "Something sweet or fun for yourself"},
    {id: 204, name: "Take a Day Off", cost: 200, purchased: false, description: "Full day of relaxation and self-care"},
    {id: 205, name: "Shopping Spree", cost: 300, purchased: false, description: "Guilt-free shopping experience"}
  ],
  todayStats: {
    completedTasks: 0,
    pointsEarned: 0
  },
  nextId: {
    todo: 104,
    reward: 206
  }
};

// Global variables for modal handling
let currentConfirmCallback = null;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  updateUI();
  renderTasks();
  renderRewards();
  updateStats();
}

// Event Listeners
function setupEventListeners() {
  // Tab Navigation
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      switchTab(this.dataset.tab);
    });
  });

  // Point Slider
  const taskPoints = document.getElementById('taskPoints');
  const pointsPreview = document.getElementById('pointsPreview');
  if (taskPoints && pointsPreview) {
    taskPoints.addEventListener('input', function() {
      pointsPreview.textContent = this.value;
    });
  }

  // Add Task Form
  const addTaskForm = document.getElementById('addTaskForm');
  if (addTaskForm) {
    addTaskForm.addEventListener('submit', handleAddTask);
  }

  // Add Reward Form
  const addRewardForm = document.getElementById('addRewardForm');
  if (addRewardForm) {
    addRewardForm.addEventListener('submit', handleAddReward);
  }

  // Modal Events
  const modalCancel = document.getElementById('modalCancel');
  const modalConfirm = document.getElementById('modalConfirm');
  const modalOverlay = document.getElementById('modalOverlay');
  
  if (modalCancel) {
    modalCancel.addEventListener('click', hideModal);
  }
  
  if (modalConfirm) {
    modalConfirm.addEventListener('click', function() {
      if (currentConfirmCallback) {
        currentConfirmCallback();
      }
    });
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) hideModal();
    });
  }
}

// Tab Switching
function switchTab(tabName) {
  // Update navigation tabs
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    if (tab.dataset.tab === tabName) {
      tab.classList.add('nav-tab--active');
    } else {
      tab.classList.remove('nav-tab--active');
    }
  });

  // Update tab panes
  const tabPanes = document.querySelectorAll('.tab-pane');
  tabPanes.forEach(pane => {
    if (pane.id === `${tabName}-tab`) {
      pane.classList.add('tab-pane--active');
    } else {
      pane.classList.remove('tab-pane--active');
    }
  });
}

// Update UI Elements
function updateUI() {
  const totalPoints = document.getElementById('totalPoints');
  const userLevel = document.getElementById('userLevel');
  const currentStreak = document.getElementById('currentStreak');
  const todayCompleted = document.getElementById('todayCompleted');
  const todayPoints = document.getElementById('todayPoints');
  const weekStreak = document.getElementById('weekStreak');

  if (totalPoints) totalPoints.textContent = appState.user.totalPoints;
  if (userLevel) userLevel.textContent = appState.user.level;
  if (currentStreak) currentStreak.textContent = appState.user.currentStreak;
  if (todayCompleted) todayCompleted.textContent = appState.todayStats.completedTasks;
  if (todayPoints) todayPoints.textContent = appState.todayStats.pointsEarned;
  if (weekStreak) weekStreak.textContent = appState.user.currentStreak;
}

// Render Tasks
function renderTasks() {
  renderRoutineTasks();
  renderTodoTasks();
}

function renderRoutineTasks() {
  const routinesList = document.getElementById('routinesList');
  if (!routinesList) return;
  
  routinesList.innerHTML = '';
  
  appState.dailyRoutines.forEach(task => {
    const taskElement = createTaskElement(task, 'routine');
    routinesList.appendChild(taskElement);
  });
}

function renderTodoTasks() {
  const todosList = document.getElementById('todosList');
  if (!todosList) return;
  
  todosList.innerHTML = '';
  
  appState.todoTasks.forEach(task => {
    const taskElement = createTaskElement(task, 'todo');
    todosList.appendChild(taskElement);
  });
}

function createTaskElement(task, type) {
  const taskDiv = document.createElement('div');
  taskDiv.className = `task-item ${task.completed ? 'task-item--completed' : ''}`;
  
  const categoryEmoji = getCategoryEmoji(task.category || 'default');
  const priorityClass = task.priority ? `priority-${task.priority}` : '';
  
  taskDiv.innerHTML = `
    <div class="task-checkbox ${task.completed ? 'task-checkbox--completed' : ''}" data-task-id="${task.id}" data-task-type="${type}">
      ${task.completed ? '✓' : ''}
    </div>
    <div class="task-info">
      <div class="task-name">${task.name}</div>
      <div class="task-meta">
        <span class="task-points">+${task.points} pts</span>
        ${task.streak !== undefined ? `<span class="task-streak">🔥 ${task.streak}</span>` : ''}
        ${task.priority ? `<span class="priority-indicator ${priorityClass}">${task.priority.toUpperCase()}</span>` : ''}
        ${task.category ? `<span>${categoryEmoji}</span>` : ''}
      </div>
    </div>
    ${type === 'todo' ? `<div class="task-actions"><button class="task-delete" data-task-id="${task.id}">🗑️</button></div>` : ''}
  `;

  // Add event listeners
  const checkbox = taskDiv.querySelector('.task-checkbox');
  if (checkbox) {
    checkbox.addEventListener('click', function(e) {
      e.preventDefault();
      toggleTask(task.id, type);
    });
  }

  if (type === 'todo') {
    const deleteBtn = taskDiv.querySelector('.task-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        deleteTask(task.id);
      });
    }
  }

  return taskDiv;
}

function getCategoryEmoji(category) {
  const emojis = {
    fitness: '💪',
    health: '🌱',
    learning: '📚',
    wellness: '🧘',
    productivity: '⚡',
    default: '📋'
  };
  return emojis[category] || emojis.default;
}

// Task Management
function toggleTask(taskId, type) {
  const taskList = type === 'routine' ? appState.dailyRoutines : appState.todoTasks;
  const task = taskList.find(t => t.id === taskId);
  
  if (!task) return;

  if (!task.completed) {
    // Complete task
    task.completed = true;
    earnPoints(task.points);
    
    if (type === 'routine') {
      task.streak++;
    }
    
    appState.todayStats.completedTasks++;
    appState.todayStats.pointsEarned += task.points;
    appState.user.totalTasksCompleted++;
  } else {
    // Uncomplete task
    task.completed = false;
    appState.user.totalPoints = Math.max(0, appState.user.totalPoints - task.points);
    appState.todayStats.completedTasks = Math.max(0, appState.todayStats.completedTasks - 1);
    appState.todayStats.pointsEarned = Math.max(0, appState.todayStats.pointsEarned - task.points);
    
    if (type === 'routine' && task.streak > 0) {
      task.streak--;
    }
  }

  updateUI();
  renderTasks();
  updateStats();
}

function earnPoints(points) {
  appState.user.totalPoints += points;
  showPointAnimation(points);
  
  // Check for level up
  const newLevel = Math.floor(appState.user.totalPoints / 100) + 1;
  if (newLevel > appState.user.level) {
    appState.user.level = newLevel;
    showAchievement(`Level ${newLevel} Reached!`);
  }
}

function showPointAnimation(points) {
  const pointAnimation = document.getElementById('pointAnimation');
  const animationPoints = document.getElementById('animationPoints');
  
  if (animationPoints) {
    animationPoints.textContent = points;
  }
  
  if (pointAnimation) {
    pointAnimation.classList.add('point-animation--show');
    
    setTimeout(() => {
      pointAnimation.classList.remove('point-animation--show');
    }, 1000);
  }
}

function deleteTask(taskId) {
  const taskIndex = appState.todoTasks.findIndex(task => task.id === taskId);
  if (taskIndex > -1) {
    const task = appState.todoTasks[taskIndex];
    if (task.completed) {
      // Adjust stats if deleting a completed task
      appState.todayStats.completedTasks = Math.max(0, appState.todayStats.completedTasks - 1);
      appState.todayStats.pointsEarned = Math.max(0, appState.todayStats.pointsEarned - task.points);
      appState.user.totalPoints = Math.max(0, appState.user.totalPoints - task.points);
    }
    appState.todoTasks.splice(taskIndex, 1);
    updateUI();
    renderTodoTasks();
  }
}

// Add Task Handler
function handleAddTask(e) {
  e.preventDefault();
  
  const taskNameEl = document.getElementById('taskName');
  const taskPointsEl = document.getElementById('taskPoints');
  const taskPriorityEl = document.getElementById('taskPriority');
  const pointsPreviewEl = document.getElementById('pointsPreview');

  if (!taskNameEl || !taskPointsEl || !taskPriorityEl) return;

  const taskName = taskNameEl.value.trim();
  const taskPoints = parseInt(taskPointsEl.value);
  const taskPriority = taskPriorityEl.value;

  if (!taskName) return;

  const newTask = {
    id: appState.nextId.todo++,
    name: taskName,
    points: taskPoints,
    completed: false,
    priority: taskPriority
  };

  appState.todoTasks.push(newTask);
  renderTodoTasks();
  
  // Reset form
  taskNameEl.value = '';
  taskPointsEl.value = '10';
  taskPriorityEl.value = 'medium';
  if (pointsPreviewEl) {
    pointsPreviewEl.textContent = '10';
  }
}

// Render Rewards
function renderRewards() {
  const rewardsList = document.getElementById('rewardsList');
  if (!rewardsList) return;
  
  rewardsList.innerHTML = '';
  
  appState.rewards.forEach(reward => {
    const rewardElement = createRewardElement(reward);
    rewardsList.appendChild(rewardElement);
  });
}

function createRewardElement(reward) {
  const rewardDiv = document.createElement('div');
  rewardDiv.className = `reward-item ${reward.purchased ? 'reward-item--purchased' : ''}`;
  
  const canAfford = appState.user.totalPoints >= reward.cost;
  
  rewardDiv.innerHTML = `
    <div class="reward-icon">${getRewardIcon(reward.name)}</div>
    <div class="reward-name">${reward.name}</div>
    <div class="reward-description">${reward.description}</div>
    <div class="reward-cost">
      <span>⭐</span>
      <span>${reward.cost}</span>
    </div>
    <button class="btn ${reward.purchased ? 'btn--secondary' : (canAfford ? 'btn--primary' : 'btn--outline')} reward-button" 
            ${reward.purchased || !canAfford ? 'disabled' : ''} 
            data-reward-id="${reward.id}">
      ${reward.purchased ? 'Purchased' : (canAfford ? 'Purchase' : 'Not Enough Points')}
    </button>
  `;

  if (!reward.purchased && canAfford) {
    const button = rewardDiv.querySelector('.reward-button');
    if (button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        purchaseReward(reward.id);
      });
    }
  }

  return rewardDiv;
}

function getRewardIcon(rewardName) {
  const icons = {
    'Watch a Movie': '🎬',
    'Order Favorite Food': '🍕',
    'Buy a Small Treat': '🍫',
    'Take a Day Off': '🌴',
    'Shopping Spree': '🛍️'
  };
  return icons[rewardName] || '🎁';
}

// Purchase Reward
function purchaseReward(rewardId) {
  const reward = appState.rewards.find(r => r.id === rewardId);
  if (!reward) return;

  showModal(
    'Confirm Purchase',
    `Purchase "${reward.name}" for ${reward.cost} points?`,
    () => {
      appState.user.totalPoints -= reward.cost;
      reward.purchased = true;
      updateUI();
      renderRewards();
      hideModal();
      showAchievement(`Purchased: ${reward.name}!`);
    }
  );
}

// Add Reward Handler
function handleAddReward(e) {
  e.preventDefault();
  
  const rewardNameEl = document.getElementById('rewardName');
  const rewardCostEl = document.getElementById('rewardCost');
  const rewardDescriptionEl = document.getElementById('rewardDescription');

  if (!rewardNameEl || !rewardCostEl) return;

  const rewardName = rewardNameEl.value.trim();
  const rewardCost = parseInt(rewardCostEl.value);
  const rewardDescription = rewardDescriptionEl ? (rewardDescriptionEl.value.trim() || 'Custom reward') : 'Custom reward';

  if (!rewardName || !rewardCost) return;

  const newReward = {
    id: appState.nextId.reward++,
    name: rewardName,
    cost: rewardCost,
    purchased: false,
    description: rewardDescription
  };

  appState.rewards.push(newReward);
  renderRewards();
  
  // Reset form
  rewardNameEl.value = '';
  rewardCostEl.value = '50';
  if (rewardDescriptionEl) {
    rewardDescriptionEl.value = '';
  }
}

// Modal Functions
function showModal(title, message, confirmCallback) {
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const modalOverlay = document.getElementById('modalOverlay');
  
  if (modalTitle) modalTitle.textContent = title;
  if (modalMessage) modalMessage.textContent = message;
  if (modalOverlay) modalOverlay.classList.add('modal-overlay--show');
  
  currentConfirmCallback = confirmCallback;
}

function hideModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('modal-overlay--show');
  }
  currentConfirmCallback = null;
}

// Stats and Progress
function updateStats() {
  updateProgressCircle();
  updateWeekProgress();
  updateAchievements();
}

function updateProgressCircle() {
  const totalTasks = appState.dailyRoutines.length + appState.todoTasks.length;
  const completedTasks = appState.dailyRoutines.filter(t => t.completed).length + 
                        appState.todoTasks.filter(t => t.completed).length;
  
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const progressValue = document.querySelector('.progress-value');
  if (progressValue) {
    progressValue.textContent = `${percentage}%`;
  }
  
  const progressCircle = document.querySelector('.progress-circle');
  if (progressCircle) {
    const degrees = (percentage / 100) * 360;
    progressCircle.style.background = `conic-gradient(var(--color-primary) 0deg ${degrees}deg, var(--color-secondary) ${degrees}deg 360deg)`;
  }
}

function updateWeekProgress() {
  const weekDays = document.querySelectorAll('.day-progress');
  weekDays.forEach((day, index) => {
    if (index < 2) {
      day.textContent = '✓';
      day.classList.remove('active');
    } else if (index === 2) {
      day.textContent = appState.todayStats.completedTasks;
      day.classList.add('active');
    } else {
      day.textContent = '-';
      day.classList.remove('active');
    }
  });
}

function updateAchievements() {
  const achievements = document.querySelectorAll('.achievement');
  
  // First Week achievement
  if (appState.user.totalTasksCompleted >= 7 && achievements[0]) {
    achievements[0].classList.add('achievement--earned');
  }
  
  // 5 Day Streak achievement
  if (appState.user.currentStreak >= 5 && achievements[1]) {
    achievements[1].classList.add('achievement--earned');
  }
  
  // 100 Points achievement
  if (appState.user.totalPoints >= 100 && achievements[2]) {
    achievements[2].classList.add('achievement--earned');
  }
  
  // Fitness Master achievement
  const fitnessTasksCompleted = appState.dailyRoutines
    .filter(t => t.category === 'fitness' && t.completed).length;
  if (fitnessTasksCompleted >= 1 && achievements[3]) {
    achievements[3].classList.add('achievement--earned');
  }
}

function showAchievement(message) {
  // Create temporary achievement notification
  const notification = document.createElement('div');
  notification.className = 'point-animation point-animation--show';
  notification.innerHTML = `<div class="point-animation__text">${message}</div>`;
  notification.style.position = 'fixed';
  notification.style.top = '50%';
  notification.style.left = '50%';
  notification.style.transform = 'translate(-50%, -50%)';
  notification.style.zIndex = '1000';
  notification.style.pointerEvents = 'none';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.remove('point-animation--show');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 2000);
}

// Initialize point counter animation on load
window.addEventListener('load', () => {
  const pointsElement = document.getElementById('totalPoints');
  if (pointsElement) {
    const finalValue = parseInt(pointsElement.textContent);
    if (!isNaN(finalValue)) {
      pointsElement.textContent = '0';
      animateCounter(pointsElement, 0, finalValue, 1500);
    }
  }
});

// Utility Functions
function animateCounter(element, start, end, duration = 1000) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    element.textContent = Math.round(current);
    
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      clearInterval(timer);
      element.textContent = end;
    }
  }, 16);
}

// Add touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const swipeDistance = touchEndX - touchStartX;
  
  if (Math.abs(swipeDistance) > swipeThreshold) {
    const currentTab = document.querySelector('.nav-tab--active');
    const tabs = Array.from(document.querySelectorAll('.nav-tab'));
    const currentIndex = tabs.indexOf(currentTab);
    
    if (swipeDistance > 0 && currentIndex > 0) {
      // Swipe right - previous tab
      switchTab(tabs[currentIndex - 1].dataset.tab);
    } else if (swipeDistance < 0 && currentIndex < tabs.length - 1) {
      // Swipe left - next tab
      switchTab(tabs[currentIndex + 1].dataset.tab);
    }
  }
}

// Auto-save simulation
setInterval(() => {
  console.log('Auto-saving app state...', {
    totalPoints: appState.user.totalPoints,
    completedTasks: appState.todayStats.completedTasks,
    todayPoints: appState.todayStats.pointsEarned
  });
}, 30000);