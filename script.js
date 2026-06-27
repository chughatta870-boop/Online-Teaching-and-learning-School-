/* ═══════════════════════════════════════════════════════════
   EduLearn — script.js
   Full app logic: navigation, courses, quiz engine,
   leaderboard, PWA, service worker, notifications
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── STATE ──────────────────────────────────────────────── */
const STATE = {
  currentPage: 'dashboard',
  currentLesson: 0,
  quiz: {
    active: false,
    subject: null,
    questions: [],
    current: 0,
    score: 0,
    answered: [],
    timerInterval: null,
    secondsLeft: 0,
    startTime: null,
  },
  enrolledCourses: JSON.parse(localStorage.getItem('enrolledCourses') || '[]'),
  notes: JSON.parse(localStorage.getItem('notes') || '{}'),
  xp: parseInt(localStorage.getItem('xp') || '1240'),
};

/* ── DATA ───────────────────────────────────────────────── */
const COURSES = [
  { id: 1, title: 'Python for Beginners', category: 'programming', instructor: 'Dr. Ahmed Ali', lessons: 24, hours: 10, rating: 4.8, reviews: 2341, thumb: 'gradient-1', icon: '🐍', free: false },
  { id: 2, title: 'Web Development Bootcamp', category: 'programming', instructor: 'Sara Khan', lessons: 48, hours: 20, rating: 4.9, reviews: 5123, thumb: 'gradient-5', icon: '🌐', free: false },
  { id: 3, title: 'UI/UX Design Mastery', category: 'design', instructor: 'Zara Malik', lessons: 32, hours: 14, rating: 4.7, reviews: 1802, thumb: 'gradient-6', icon: '🎨', free: false },
  { id: 4, title: 'Machine Learning Basics', category: 'ai', instructor: 'Prof. Usman', lessons: 36, hours: 16, rating: 4.8, reviews: 3210, thumb: 'gradient-2', icon: '🤖', free: false },
  { id: 5, title: 'AWS Solutions Architect', category: 'cloud', instructor: 'Bilal Hassan', lessons: 52, hours: 22, rating: 4.6, reviews: 912, thumb: 'gradient-5', icon: '☁️', free: false },
  { id: 6, title: 'Figma: From Zero to Pro', category: 'design', instructor: 'Ayesha Raza', lessons: 26, hours: 9, rating: 4.9, reviews: 4502, thumb: 'gradient-6', icon: '🖌️', free: true },
  { id: 7, title: 'Data Science Fundamentals', category: 'ai', instructor: 'Dr. Farid', lessons: 40, hours: 18, rating: 4.7, reviews: 2890, thumb: 'gradient-2', icon: '📊', free: false },
  { id: 8, title: 'CSS & Tailwind Mastery', category: 'programming', instructor: 'Nadia Sajid', lessons: 28, hours: 11, rating: 4.8, reviews: 1673, thumb: 'gradient-3', icon: '🎨', free: true },
  { id: 9, title: 'Node.js & Express', category: 'programming', instructor: 'Omar Sheikh', lessons: 34, hours: 15, rating: 4.6, reviews: 1120, thumb: 'gradient-1', icon: '⚡', free: false },
  { id: 10, title: 'Deep Learning with TensorFlow', category: 'ai', instructor: 'Dr. Hina', lessons: 44, hours: 20, rating: 4.9, reviews: 2100, thumb: 'gradient-2', icon: '🧠', free: false },
  { id: 11, title: 'Google Cloud Fundamentals', category: 'cloud', instructor: 'Kamran Ali', lessons: 30, hours: 12, rating: 4.5, reviews: 780, thumb: 'gradient-4', icon: '🌤️', free: false },
  { id: 12, title: 'Graphic Design Basics', category: 'design', instructor: 'Sana Butt', lessons: 20, hours: 8, rating: 4.7, reviews: 3400, thumb: 'gradient-3', icon: '🖼️', free: true },
];

const CURRICULUM = [
  { title: 'Introduction to Python', duration: '12:34', done: true },
  { title: 'Variables & Data Types', duration: '18:22', done: true },
  { title: 'Operators & Expressions', duration: '15:10', done: true },
  { title: 'Control Flow: if/else', duration: '20:45', done: true },
  { title: 'Loops: for and while', duration: '22:18', done: true },
  { title: 'Functions Basics', duration: '19:30', active: true },
  { title: 'Parameters & Return Values', duration: '24:12' },
  { title: 'Lambda Functions', duration: '16:00' },
  { title: 'Lists & Tuples', duration: '25:40' },
  { title: 'Dictionaries & Sets', duration: '21:55' },
  { title: 'File I/O', duration: '18:30' },
  { title: 'Error Handling', duration: '20:00' },
  { title: 'Modules & Packages', duration: '17:20' },
  { title: 'OOP: Classes & Objects', duration: '28:10' },
  { title: 'Inheritance & Polymorphism', duration: '26:45' },
  { title: 'Decorators', duration: '19:00' },
  { title: 'Generators & Iterators', duration: '22:30' },
  { title: 'Final Project', duration: '45:00' },
];

const QUIZ_BANK = {
  python: {
    name: 'Python Fundamentals',
    time: 600,
    questions: [
      { q: 'What is the output of print(type([]))?', opts: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", 'None'], ans: 0 },
      { q: 'Which keyword is used to define a function in Python?', opts: ['func', 'def', 'function', 'define'], ans: 1 },
      { q: 'What does len("Python") return?', opts: ['5', '6', '7', '8'], ans: 1 },
      { q: 'Which of these is NOT a valid Python data type?', opts: ['int', 'float', 'character', 'bool'], ans: 2 },
      { q: 'What operator is used for integer division in Python?', opts: ['/', '//', '%', '**'], ans: 1 },
      { q: 'How do you create an empty dictionary?', opts: ['{}', '[]', '()', 'dict[]'], ans: 0 },
      { q: 'What does the "pass" statement do?', opts: ['Exits the loop', 'Skips to next iteration', 'Does nothing / placeholder', 'Raises an error'], ans: 2 },
      { q: 'Which method adds an element to the end of a list?', opts: ['add()', 'push()', 'append()', 'insert()'], ans: 2 },
      { q: 'What is a lambda function?', opts: ['A recursive function', 'An anonymous function', 'A built-in function', 'A class method'], ans: 1 },
      { q: 'What is the correct way to open a file for reading?', opts: ['open(f, "w")', 'open(f, "r")', 'open(f, "a")', 'open(f, "x")'], ans: 1 },
    ]
  },
  web: {
    name: 'Web Dev Essentials',
    time: 480,
    questions: [
      { q: 'What does HTML stand for?', opts: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], ans: 0 },
      { q: 'Which CSS property changes text color?', opts: ['text-color', 'font-color', 'color', 'text-style'], ans: 2 },
      { q: 'What does CSS stand for?', opts: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], ans: 1 },
      { q: 'Which HTML tag creates a hyperlink?', opts: ['<link>', '<a>', '<href>', '<url>'], ans: 1 },
      { q: 'Which JavaScript method selects an element by ID?', opts: ['querySelector()', 'getElementById()', 'getElement()', 'findById()'], ans: 1 },
      { q: 'What is the CSS box model property for inner spacing?', opts: ['margin', 'spacing', 'padding', 'border'], ans: 2 },
      { q: 'How do you declare a variable in modern JavaScript?', opts: ['var x', 'let x / const x', 'dim x', 'variable x'], ans: 1 },
      { q: 'Which HTTP status code means "Not Found"?', opts: ['200', '301', '404', '500'], ans: 2 },
    ]
  },
  ai: {
    name: 'AI & Machine Learning',
    time: 900,
    questions: [
      { q: 'What does ML stand for?', opts: ['Meta Learning', 'Machine Learning', 'Model Logic', 'Mathematical Learning'], ans: 1 },
      { q: 'Which algorithm is used for classification and regression?', opts: ['K-Means', 'Decision Tree', 'PCA', 'DBSCAN'], ans: 1 },
      { q: 'What is overfitting?', opts: ['Model performs well on training but poorly on test data', 'Model performs equally on all data', 'Model fails to train at all', 'Model is too simple'], ans: 0 },
      { q: 'What is a neural network inspired by?', opts: ['Computer circuits', 'The human brain', 'Mathematical equations', 'Statistical models'], ans: 1 },
      { q: 'Which technique reduces overfitting?', opts: ['Adding more layers', 'Dropout regularization', 'Increasing epochs', 'Removing test data'], ans: 1 },
      { q: 'What does CNN stand for in deep learning?', opts: ['Central Neural Network', 'Convolutional Neural Network', 'Connected Node Network', 'Clustered Neural Network'], ans: 1 },
      { q: 'What is supervised learning?', opts: ['Training without labels', 'Training with labeled data', 'Self-learning algorithms', 'Reinforcement-based training'], ans: 1 },
      { q: 'Which library is popular for ML in Python?', opts: ['NumPy only', 'Pandas only', 'scikit-learn', 'Matplotlib only'], ans: 2 },
      { q: 'What is gradient descent?', opts: ['A data cleaning method', 'An optimization algorithm', 'A type of neural layer', 'A feature selection method'], ans: 1 },
      { q: 'What is a training/test split used for?', opts: ['Data cleaning', 'Model evaluation', 'Feature engineering', 'Hyperparameter tuning'], ans: 1 },
      { q: 'What does RNN stand for?', opts: ['Recurrent Neural Network', 'Random Neural Network', 'Regression Neural Network', 'Residual Neural Network'], ans: 0 },
      { q: 'What is transfer learning?', opts: ['Moving data between systems', 'Reusing pre-trained models', 'Training on multiple datasets', 'Converting model formats'], ans: 1 },
    ]
  },
  design: {
    name: 'UI/UX Design Principles',
    time: 480,
    questions: [
      { q: 'What does UX stand for?', opts: ['User Experience', 'User Execution', 'Unique Experience', 'Ultra Extension'], ans: 0 },
      { q: 'What is a wireframe?', opts: ['A 3D model', 'A low-fidelity layout sketch', 'A color palette', 'A brand guideline'], ans: 1 },
      { q: 'What is the purpose of a style guide?', opts: ['To document bugs', 'To ensure design consistency', 'To write code documentation', 'To plan user interviews'], ans: 1 },
      { q: 'What does "affordance" mean in UX?', opts: ['The cost of design tools', 'Qualities that suggest how an object is used', 'Accessibility guidelines', 'Color contrast ratio'], ans: 1 },
      { q: 'What is the 8pt grid system?', opts: ['A typography scale', 'A spacing system based on multiples of 8', 'A color contrast guide', 'A layout for 8 columns'], ans: 1 },
      { q: 'Which tool is most popular for UI prototyping?', opts: ['Photoshop', 'Figma', 'Word', 'Excel'], ans: 1 },
      { q: 'What is a persona in UX research?', opts: ['A social media account', 'A fictional user representing target users', 'A type of wireframe', 'A usability testing method'], ans: 1 },
      { q: 'What does WCAG stand for?', opts: ['Web Content Accessibility Guidelines', 'Web Code Access Guide', 'Wide Color Accuracy Group', 'Web Creative Asset Generator'], ans: 0 },
    ]
  }
};

const LEADERBOARD_DATA = {
  weekly: [
    { name: 'Fatima Zahra', initials: 'FZ', courses: 8, points: 2840, me: false },
    { name: 'Hassan Raza', initials: 'HR', courses: 7, points: 2510, me: false },
    { name: 'Sara Noor', initials: 'SN', courses: 6, points: 1980, me: false },
    { name: 'Ali Khan', initials: 'AK', courses: 5, points: 1240, me: true },
    { name: 'Bilal Ahmed', initials: 'BA', courses: 5, points: 1100, me: false },
    { name: 'Hina Malik', initials: 'HM', courses: 4, points: 980, me: false },
    { name: 'Omar Farooq', initials: 'OF', courses: 3, points: 820, me: false },
    { name: 'Zara Siddiqui', initials: 'ZS', courses: 3, points: 710, me: false },
  ],
  monthly: [
    { name: 'Hassan Raza', initials: 'HR', courses: 18, points: 8920, me: false },
    { name: 'Fatima Zahra', initials: 'FZ', courses: 16, points: 8310, me: false },
    { name: 'Ali Khan', initials: 'AK', courses: 15, points: 7240, me: true },
    { name: 'Sara Noor', initials: 'SN', courses: 14, points: 6800, me: false },
    { name: 'Omar Farooq', initials: 'OF', courses: 12, points: 5430, me: false },
  ],
  alltime: [
    { name: 'Sara Noor', initials: 'SN', courses: 48, points: 42100, me: false },
    { name: 'Hassan Raza', initials: 'HR', courses: 44, points: 38750, me: false },
    { name: 'Fatima Zahra', initials: 'FZ', courses: 40, points: 34200, me: false },
    { name: 'Bilal Ahmed', initials: 'BA', courses: 36, points: 29900, me: false },
    { name: 'Ali Khan', initials: 'AK', courses: 32, points: 21240, me: true },
  ]
};

const BADGES = [
  { icon: '🔥', label: 'Week Warrior' },
  { icon: '🎯', label: 'Quiz Master' },
  { icon: '🚀', label: 'Fast Learner' },
  { icon: '📖', label: 'Bookworm' },
  { icon: '💎', label: 'Perfectionist' },
  { icon: '⭐', label: 'Top Rated' },
];

/* ══════════════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════════════ */
function navigate(page) {
  // Deactivate all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Activate target
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  // Update title
  const titles = {
    dashboard: 'Dashboard',
    courses: 'All Courses',
    lesson: 'Lesson Viewer',
    quiz: 'Quizzes',
    leaderboard: 'Leaderboard',
  };
  document.getElementById('page-title').textContent = titles[page] || page;

  STATE.currentPage = page;
  closeNotif();
  closeSidebar();

  // Page-specific init
  if (page === 'courses') renderCourses('all');
  if (page === 'lesson') renderCurriculum();
  if (page === 'leaderboard') { renderLeaderboard('weekly'); renderBadges(); }
  if (page === 'quiz') resetQuizView();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Nav items click
document.querySelectorAll('.nav-item[data-page]').forEach(item => {
  item.addEventListener('click', () => navigate(item.dataset.page));
});

/* ══════════════════════════════════════════════════════════
   SIDEBAR (MOBILE)
══════════════════════════════════════════════════════════ */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

/* ══════════════════════════════════════════════════════════
   COURSES
══════════════════════════════════════════════════════════ */
function renderCourses(filter) {
  const grid = document.getElementById('coursesGrid');
  const filtered = filter === 'all'
    ? COURSES
    : filter === 'free'
    ? COURSES.filter(c => c.free)
    : COURSES.filter(c => c.category === filter);

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-title">No courses found</div>
        <div class="empty-state-text">Try a different category.</div>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(c => {
    const enrolled = STATE.enrolledCourses.includes(c.id);
    const stars = '★'.repeat(Math.round(c.rating)) + '☆'.repeat(5 - Math.round(c.rating));
    return `
      <div class="course-card" onclick="navigate('lesson')">
        <div class="course-thumbnail ${c.thumb}">
          ${c.free ? '<span class="course-badge free">FREE</span>' : '<span class="course-badge">PAID</span>'}
          <span>${c.icon}</span>
        </div>
        <div class="course-body">
          <div class="course-category">${c.category.toUpperCase()}</div>
          <div class="course-title">${c.title}</div>
          <div class="course-meta">
            <span class="course-meta-item">📹 ${c.lessons} lessons</span>
            <span class="course-meta-item">⏱ ${c.hours}h</span>
          </div>
          <div class="course-instructor">
            <div class="instructor-avatar">${c.instructor.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
            <span class="instructor-name">${c.instructor}</span>
          </div>
          <div class="course-footer">
            <div class="course-rating">
              <span class="stars">${stars}</span>
              <span class="rating-val">${c.rating}</span>
              <span class="rating-count">(${c.reviews.toLocaleString()})</span>
            </div>
            <button class="btn-enroll ${enrolled ? 'enrolled' : ''}"
              onclick="enrollCourse(event, this, ${c.id})">
              ${enrolled ? '✓ Enrolled' : 'Enroll'}
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function enrollCourse(e, btn, id) {
  e.stopPropagation();
  if (id && !STATE.enrolledCourses.includes(id)) {
    STATE.enrolledCourses.push(id);
    localStorage.setItem('enrolledCourses', JSON.stringify(STATE.enrolledCourses));
  }
  btn.textContent = '✓ Enrolled';
  btn.classList.add('enrolled');
  showToast('🎉 Successfully enrolled in course!', 'success');
}

// Filter buttons
document.getElementById('courseFilters')?.addEventListener('click', e => {
  if (!e.target.classList.contains('filter-btn')) return;
  document.querySelectorAll('#courseFilters .filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  renderCourses(e.target.dataset.filter);
});

/* ══════════════════════════════════════════════════════════
   SEARCH
══════════════════════════════════════════════════════════ */
function handleSearch(val) {
  if (STATE.currentPage !== 'courses') navigate('courses');
  const query = val.toLowerCase();
  const grid = document.getElementById('coursesGrid');
  const filtered = COURSES.filter(c =>
    c.title.toLowerCase().includes(query) ||
    c.category.toLowerCase().includes(query) ||
    c.instructor.toLowerCase().includes(query)
  );
  if (!grid) return;
  // Reuse render with filtered list
  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-title">No results for "${val}"</div>
        <div class="empty-state-text">Try different keywords.</div>
      </div>`;
  } else {
    const stars = n => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
    grid.innerHTML = filtered.map(c => `
      <div class="course-card" onclick="navigate('lesson')">
        <div class="course-thumbnail ${c.thumb}">${c.icon}</div>
        <div class="course-body">
          <div class="course-category">${c.category.toUpperCase()}</div>
          <div class="course-title">${c.title}</div>
          <div class="course-meta">
            <span class="course-meta-item">📹 ${c.lessons} lessons</span>
            <span class="course-meta-item">⏱ ${c.hours}h</span>
          </div>
          <div class="course-footer">
            <div class="course-rating">
              <span class="stars">${stars(c.rating)}</span>
              <span class="rating-val">${c.rating}</span>
            </div>
            <button class="btn-enroll" onclick="enrollCourse(event, this, ${c.id})">Enroll</button>
          </div>
        </div>
      </div>`).join('');
  }
}

/* ══════════════════════════════════════════════════════════
   CURRICULUM / LESSON
══════════════════════════════════════════════════════════ */
function renderCurriculum() {
  const list = document.getElementById('curriculumList');
  list.innerHTML = CURRICULUM.map((item, i) => `
    <div class="curriculum-item ${item.done ? 'done' : ''} ${item.active ? 'active' : ''}"
         onclick="selectLesson(${i})">
      <div class="lesson-status ${item.done ? 'done' : item.active ? 'active' : ''}">
        ${item.done ? '✓' : i + 1}
      </div>
      <span>${item.title}</span>
      <span class="lesson-duration">${item.duration}</span>
    </div>`).join('');
}

function selectLesson(index) {
  STATE.currentLesson = index;
  const lesson = CURRICULUM[index];
  document.getElementById('lessonTitle').textContent = lesson.title;
  document.getElementById('videoLabel').textContent = `Python for Beginners — Lesson ${index + 1}: ${lesson.title}`;
  // Re-render curriculum with new active
  CURRICULUM.forEach((l, i) => { l.active = i === index; });
  renderCurriculum();
  showToast(`▶ Loading: ${lesson.title}`, 'success');
}

function playLesson() {
  showToast('▶️ Video player would launch here!', 'success');
}

function prevLesson() {
  if (STAT
