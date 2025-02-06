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

// 할 일 목록을 로컬 스토리지에 저장하는 함수
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", function () {
  const welcomeModal = document.createElement("div");
  welcomeModal.id = "welcome-modal";
  welcomeModal.innerHTML = `
      <div class="modal-content">
          <h2>Welcome!</h2>
          <p>자동 저장되므로 안심하고 사용하세요.</p>
          <button id="start-guide">가이드 시작<br>(Start Guide)</button>
          <button id="skip-guide">건너뛰기<br>(Skip)</button>
      </div>
  `;
  document.body.appendChild(welcomeModal);

  const steps = [
      { element: "#task-input", text: "여기에 일정을 입력해보세요.<br>(Enter your task here.)" },
      { element: "#add-task", text: "추가 버튼을 눌러 일정을 추가하세요.<br>(Click this button to add a task.)" },
      { element: "#task-list", text: "여기에 일정 목록이 표시됩니다.<br>(Your task list will be displayed here.)" },
      { element: "#all-filter", text: "모든 일정을 확인할 수 있습니다.<br>(View all tasks.)" },
      { element: "#active-filter", text: "진행 중인 일정만 볼 수 있습니다.<br>(View only active tasks.)" },
      { element: "#completed-filter", text: "완료된 일정만 볼 수 있습니다.<br>(View only completed tasks.)" },
      { element: "#theme-toggle", text: "다크모드로 변경할 수 있습니다.<br>(Switch to dark mode.)" },
      { element: "#settings-toggle", text: "폰트를 변경할 수 있습니다.<br>(Change the font settings.)" },
      { element: "#language-toggle", text: "한/영 언어를 변경할 수 있습니다.<br>(Switch between Korean and English.)" }
  ];

  let currentStep = 0;

  function showStep(index) {
    if (index >= steps.length) {
        welcomeModal.remove();
        return;
    }

    const step = steps[index];
    const targetElement = document.querySelector(step.element);

    if (targetElement) {
        // 기존 하이라이트 제거
        document.querySelectorAll(".highlight-box").forEach(el => el.remove());

        const rect = targetElement.getBoundingClientRect();
        const highlightBox = document.createElement("div");
        highlightBox.classList.add("highlight-box");

        // 화면에서 정확한 위치 계산
        highlightBox.style.top = `${window.scrollY + rect.top - 5}px`;
        highlightBox.style.left = `${window.scrollX + rect.left - 5}px`;
        highlightBox.style.width = `${rect.width + 10}px`;
        highlightBox.style.height = `${rect.height + 10}px`;

        document.body.appendChild(highlightBox);

        welcomeModal.innerHTML = `
            <div class="modal-content">
                <p>${step.text}</p>
                <button id="next-step">OK</button>
            </div>
        `;

        document.getElementById("next-step").addEventListener("click", function () {
            highlightBox.remove();
            currentStep++;
            showStep(currentStep);
        });
    }
}

  document.getElementById("start-guide").addEventListener("click", function () {
      showStep(0);
  });

  document.getElementById("skip-guide").addEventListener("click", function () {
      welcomeModal.remove();
  });

  
});
