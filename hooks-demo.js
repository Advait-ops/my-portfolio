/**
 * React Hooks Interactive Showcase & Live Playground
 * Powers the interactive demo modal on Advait Adkine's portfolio
 */

// Global State simulation for the Hooks Playground
const playgroundState = {
  // useState state
  counter: {
    count: 0,
    step: 1,
    history: []
  },
  // useEffect state
  effect: {
    timerSeconds: 0,
    timerInterval: null,
    isListening: true,
    resourceId: 1,
    status: 'idle',
    lastFetchedData: null,
    cleanupLog: []
  },
  // useReducer state
  reducer: {
    todos: [
      { id: 1, text: 'Learn React Hooks fundamentals', done: true },
      { id: 2, text: 'Master useReducer & useContext architecture', done: true },
      { id: 3, text: 'Build production React components', done: false }
    ],
    nextId: 4,
    actionLog: []
  }
};

// Open Modal
function openHookModal(tabId = 'useState') {
  const modal = document.getElementById('hooks-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  switchTab(tabId);
  initEffectDemo();
}

// Close Modal
function closeHookModal() {
  const modal = document.getElementById('hooks-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  // Cleanup timer if running
  if (playgroundState.effect.timerInterval) {
    clearInterval(playgroundState.effect.timerInterval);
    playgroundState.effect.timerInterval = null;
  }
}

// Tab Switching
function switchTab(tabId) {
  const tabBtns = document.querySelectorAll('.hook-tab-btn');
  const tabPanes = document.querySelectorAll('.hook-tab-pane');

  tabBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  tabPanes.forEach(pane => {
    if (pane.id === `tab-${tabId}`) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });
}

// ----------------------------------------------------
// 1. useState Demo Logic
// ----------------------------------------------------
function updateCounterState(newCount, actionName) {
  const prevCount = playgroundState.counter.count;
  playgroundState.counter.count = newCount;
  playgroundState.counter.history.unshift(`${actionName}: ${prevCount} -> ${newCount}`);
  if (playgroundState.counter.history.length > 5) {
    playgroundState.counter.history.pop();
  }
  renderCounter();
}

function incrementCounter() {
  updateCounterState(
    playgroundState.counter.count + playgroundState.counter.step,
    `Increment (+${playgroundState.counter.step})`
  );
}

function decrementCounter() {
  updateCounterState(
    playgroundState.counter.count - playgroundState.counter.step,
    `Decrement (-${playgroundState.counter.step})`
  );
}

function resetCounter() {
  updateCounterState(0, 'Reset');
}

function setCounterStep(stepValue) {
  playgroundState.counter.step = Number(stepValue);
  renderCounter();
}

function renderCounter() {
  const valEl = document.getElementById('counter-value');
  const jsonEl = document.getElementById('counter-json');
  const historyEl = document.getElementById('counter-history');

  if (valEl) valEl.textContent = playgroundState.counter.count;
  if (jsonEl) {
    jsonEl.textContent = JSON.stringify(
      {
        count: playgroundState.counter.count,
        step: playgroundState.counter.step,
        historyCount: playgroundState.counter.history.length
      },
      null,
      2
    );
  }
  if (historyEl) {
    if (playgroundState.counter.history.length === 0) {
      historyEl.innerHTML = '<li class="empty-note">No actions yet. Click buttons above!</li>';
    } else {
      historyEl.innerHTML = playgroundState.counter.history
        .map(item => `<li><i class="fa-solid fa-angle-right"></i> ${item}</li>`)
        .join('');
    }
  }
}

// ----------------------------------------------------
// 2. useEffect Demo Logic
// ----------------------------------------------------
function initEffectDemo() {
  renderEffectState();
}

function toggleEffectTimer() {
  const effectState = playgroundState.effect;
  if (effectState.timerInterval) {
    // Unmount / cleanup simulation
    clearInterval(effectState.timerInterval);
    effectState.timerInterval = null;
    logEffectCleanup('🧹 Cleanup function executed: clearInterval()');
  } else {
    // Mount / subscribe simulation
    logEffectCleanup('⚡ Effect ran: window.setInterval() mounted');
    effectState.timerInterval = setInterval(() => {
      effectState.timerSeconds += 1;
      renderEffectState();
    }, 1000);
  }
  renderEffectState();
}

function resetEffectTimer() {
  playgroundState.effect.timerSeconds = 0;
  renderEffectState();
}

function triggerEffectFetch(id) {
  playgroundState.effect.resourceId = id;
  playgroundState.effect.status = 'fetching...';
  renderEffectState();

  const mockUsers = {
    1: { name: 'Advait Adkine', role: 'Full Stack Engineer', tech: 'React, Hooks, JavaScript' },
    2: { name: 'Sarah Jenkins', role: 'UI/UX Designer', tech: 'Figma, Tailwind, React' },
    3: { name: 'Alex Rivera', role: 'Backend Developer', tech: 'Node.js, Express, Python' }
  };

  setTimeout(() => {
    playgroundState.effect.status = 'completed (200 OK)';
    playgroundState.effect.lastFetchedData = mockUsers[id] || { name: 'Custom User', role: 'Developer' };
    logEffectCleanup(`🔄 Dependency [userId: ${id}] changed: fetched new record`);
    renderEffectState();
  }, 450);
}

function logEffectCleanup(msg) {
  const log = playgroundState.effect.cleanupLog;
  const time = new Date().toLocaleTimeString();
  log.unshift(`[${time}] ${msg}`);
  if (log.length > 5) log.pop();
  renderEffectState();
}

function renderEffectState() {
  const timerEl = document.getElementById('effect-timer');
  const timerBtn = document.getElementById('effect-timer-btn');
  const jsonEl = document.getElementById('effect-json');
  const logEl = document.getElementById('effect-log');
  const dataEl = document.getElementById('effect-data');

  if (timerEl) timerEl.textContent = `${playgroundState.effect.timerSeconds}s`;
  if (timerBtn) {
    if (playgroundState.effect.timerInterval) {
      timerBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Effect (Unmount)';
      timerBtn.classList.add('btn-active-state');
    } else {
      timerBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Effect (Mount)';
      timerBtn.classList.remove('btn-active-state');
    }
  }

  if (jsonEl) {
    jsonEl.textContent = JSON.stringify(
      {
        timerActive: Boolean(playgroundState.effect.timerInterval),
        seconds: playgroundState.effect.timerSeconds,
        activeDependencyId: playgroundState.effect.resourceId,
        requestStatus: playgroundState.effect.status
      },
      null,
      2
    );
  }

  if (logEl) {
    if (playgroundState.effect.cleanupLog.length === 0) {
      logEl.innerHTML = '<li class="empty-note">Click "Start Effect" or select a User ID to inspect lifecycle effects.</li>';
    } else {
      logEl.innerHTML = playgroundState.effect.cleanupLog
        .map(entry => `<li>${entry}</li>`)
        .join('');
    }
  }

  if (dataEl) {
    if (playgroundState.effect.lastFetchedData) {
      const u = playgroundState.effect.lastFetchedData;
      dataEl.innerHTML = `<strong>${u.name}</strong> • ${u.role} <br><small style="color:#666">${u.tech}</small>`;
    } else {
      dataEl.textContent = 'Click User buttons above to fetch data.';
    }
  }
}

// ----------------------------------------------------
// 3. useReducer Demo Logic
// ----------------------------------------------------
function dispatchReducer(action) {
  const state = playgroundState.reducer;
  const timestamp = new Date().toLocaleTimeString();

  switch (action.type) {
    case 'ADD_TODO': {
      if (!action.payload || !action.payload.trim()) return;
      state.todos.push({
        id: state.nextId++,
        text: action.payload.trim(),
        done: false
      });
      state.actionLog.unshift(`[${timestamp}] dispatch({ type: 'ADD_TODO', text: "${action.payload}" })`);
      break;
    }
    case 'TOGGLE_TODO': {
      state.todos = state.todos.map(t =>
        t.id === action.payload ? { ...t, done: !t.done } : t
      );
      state.actionLog.unshift(`[${timestamp}] dispatch({ type: 'TOGGLE_TODO', id: ${action.payload} })`);
      break;
    }
    case 'DELETE_TODO': {
      state.todos = state.todos.filter(t => t.id !== action.payload);
      state.actionLog.unshift(`[${timestamp}] dispatch({ type: 'DELETE_TODO', id: ${action.payload} })`);
      break;
    }
    case 'RESET': {
      state.todos = [
        { id: 1, text: 'Learn React Hooks fundamentals', done: true },
        { id: 2, text: 'Master useReducer & useContext architecture', done: true }
      ];
      state.actionLog.unshift(`[${timestamp}] dispatch({ type: 'RESET' })`);
      break;
    }
  }

  if (state.actionLog.length > 5) state.actionLog.pop();
  renderReducer();
}

function handleAddTodo() {
  const input = document.getElementById('todo-input');
  if (!input) return;
  dispatchReducer({ type: 'ADD_TODO', payload: input.value });
  input.value = '';
}

function renderReducer() {
  const listEl = document.getElementById('todo-list');
  const jsonEl = document.getElementById('reducer-json');
  const logEl = document.getElementById('reducer-log');

  if (listEl) {
    if (playgroundState.reducer.todos.length === 0) {
      listEl.innerHTML = '<li class="empty-note">All tasks completed! Add a new one below.</li>';
    } else {
      listEl.innerHTML = playgroundState.reducer.todos
        .map(
          item => `
          <li class="todo-item ${item.done ? 'completed' : ''}">
            <label class="todo-label">
              <input type="checkbox" ${item.done ? 'checked' : ''} onchange="dispatchReducer({ type: 'TOGGLE_TODO', payload: ${item.id} })">
              <span>${item.text}</span>
            </label>
            <button type="button" class="btn-delete" title="Delete" onclick="dispatchReducer({ type: 'DELETE_TODO', payload: ${item.id} })">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </li>
        `
        )
        .join('');
    }
  }

  if (jsonEl) {
    const total = playgroundState.reducer.todos.length;
    const completed = playgroundState.reducer.todos.filter(t => t.done).length;
    jsonEl.textContent = JSON.stringify(
      {
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: total - completed,
        stateArray: playgroundState.reducer.todos
      },
      null,
      2
    );
  }

  if (logEl) {
    if (playgroundState.reducer.actionLog.length === 0) {
      logEl.innerHTML = '<li class="empty-note">Dispatch actions by adding, toggling, or deleting tasks.</li>';
    } else {
      logEl.innerHTML = playgroundState.reducer.actionLog
        .map(entry => `<li><code>${entry}</code></li>`)
        .join('');
    }
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderCounter();
  renderReducer();

  // Close modal when clicking outside of modal container
  const modal = document.getElementById('hooks-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeHookModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeHookModal();
    }
  });
});
