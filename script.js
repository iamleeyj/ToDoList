const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const welcomeModal = document.getElementById("welcome-modal");
const languageToggle = document.getElementById("language-toggle"); // 언어 전환 버튼

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// 한/영 텍스트 설정
let language = localStorage.getItem("language") || "ko"; // 기본 값은 한글

const languageText = {
  ko: {
    title: "To-Do List",
    placeholder: "새로운 할 일 추가...",
    addButton: "추가",
    allFilter: "모두",
    activeFilter: "진행중",
    completedFilter: "완료",
    settingsTitle: "설정",
    fontStyle: "폰트 스타일",
    saveButton: "적용",
    closeButton: "닫기",
    deleteConfirmation: "정말 '{task}'를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
  },
  en: {
    title: "To-Do List",
    placeholder: "Add a new task...",
    addButton: "Add",
    allFilter: "All",
    activeFilter: "Active",
    completedFilter: "Completed",
    settingsTitle: "Settings",
    fontStyle: "Font Style",
    saveButton: "Save",
    closeButton: "Close",
    deleteConfirmation: "Are you sure you want to delete '{task}'? This action cannot be undone."
  }
};

// 언어 변경 함수
function changeLanguage() {
  language = language === "ko" ? "en" : "ko"; // 언어 전환
  localStorage.setItem("language", language); // 로컬 스토리지에 저장

  const text = languageText[language]; // 현재 언어에 맞는 텍스트 가져오기
  document.getElementById("title").textContent = text.title;
  document.getElementById("task-input").placeholder = text.placeholder;
  addTaskButton.textContent = text.addButton;
  document.getElementById("all-filter").textContent = text.allFilter;
  document.getElementById("active-filter").textContent = text.activeFilter;
  document.getElementById("completed-filter").textContent = text.completedFilter;
  document.getElementById("save-settings").textContent = text.saveButton;
  document.getElementById("close-settings").textContent = text.closeButton;

  // 삭제 확인 메시지 업데이트
  window.deleteTask = function(taskId) {
    const task = tasks.find(task => task.id === taskId);
    const confirmDelete = window.confirm(text.deleteConfirmation.replace("{task}", task.text));

    if (confirmDelete) {
      tasks = tasks.filter(task => task.id !== taskId); // 할 일 삭제
      updateTaskList(); // 할 일 목록 업데이트
      saveTasks(); // 로컬 스토리지에 저장
    }
  }
}

// 할 일 추가 함수
function addTask() {
  if (taskInput.value.trim() === "") return;

  const newTask = {
    id: Date.now(),
    text: taskInput.value.trim(),
    completed: false,
  };

  tasks.push(newTask);
  taskInput.value = "";
  updateTaskList();
  saveTasks();
}

// 할 일 목록 업데이트 함수
function updateTaskList() {
  taskList.innerHTML = "";
  tasks.filter(task => currentFilter === "all" || (currentFilter === "active" && !task.completed) || (currentFilter === "completed" && task.completed))
    .forEach(task => {
      const li = document.createElement("li");
      li.classList.add("task");
      if (task.completed) li.classList.add("completed");
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleComplete(${task.id})">
        <span>${task.text}</span>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      `;
      taskList.appendChild(li);
    });
}

// 할 일 완료/미완료 토글 함수
function toggleComplete(taskId) {
  const task = tasks.find(task => task.id === taskId);
  task.completed = !task.completed;
  updateTaskList();
  saveTasks();
}

// 할 일 삭제 함수
function deleteTask(taskId) {
  const task = tasks.find(task => task.id === taskId);
  const confirmDelete = window.confirm(`정말 "${task.text}"를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`);

  if (confirmDelete) {
    tasks = tasks.filter(task => task.id !== taskId); // 할 일 삭제
    updateTaskList(); // 할 일 목록 업데이트
    saveTasks(); // 로컬 스토리지에 저장
  }
}

// 필터 버튼 클릭 함수
function applyFilter(filter) {
  currentFilter = filter;
  updateTaskList();
}

// 테마 전환 함수
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// 저장된 테마 설정
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

// 이벤트 리스너
addTaskButton.addEventListener("click", addTask);

// 필터 버튼
document.getElementById("all-filter").addEventListener("click", () => applyFilter("all"));
document.getElementById("active-filter").addEventListener("click", () => applyFilter("active"));
document.getElementById("completed-filter").addEventListener("click", () => applyFilter("completed"));

// 테마 토글 버튼
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

// 설정 모달
const settingsModal = document.getElementById("settings-modal");
const settingsToggle = document.getElementById("settings-toggle");
const saveSettingsButton = document.getElementById("save-settings");
const closeSettingsButton = document.getElementById("close-settings");

settingsToggle.addEventListener("click", () => settingsModal.style.display = "flex");
saveSettingsButton.addEventListener("click", saveSettings);
closeSettingsButton.addEventListener("click", () => settingsModal.style.display = "none");

// 저장된 폰트 스타일 적용
function saveSettings() {
  const fontStyle = document.getElementById("font-style").value; // 선택한 폰트 스타일 가져오기
  localStorage.setItem("font-style", fontStyle);  // 폰트 스타일을 로컬 스토리지에 저장
  document.body.style.fontFamily = fontStyle;  // 즉시 페이지에 폰트 스타일 적용
}
window.onload = function() {
  // 저장된 폰트 스타일이 있으면 적용
  const savedFontStyle = localStorage.getItem("font-style");
  if (savedFontStyle) {
    document.body.style.fontFamily = savedFontStyle;  // 저장된 폰트 스타일을 적용
    document.getElementById("font-style").value = savedFontStyle;  // 폰트 선택 창에 반영
  }

  // 언어 설정
  changeLanguage();
};

// 페이지 로드 시 할 일 목록 업데이트
updateTaskList();
saveSettingsButton.addEventListener("click", saveSettings);  // 저장 버튼 클릭 시 saveSettings 호출

// 언어 전환 버튼 클릭 이벤트
languageToggle.addEventListener("click", changeLanguage);
