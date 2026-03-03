/* ============================================
   VHS ADMIN DASHBOARD - ENHANCED JAVASCRIPT
   All Event Handlers Fixed & Working
   ============================================ */

// ===== GLOBAL STATE =====
const AppState = {
  sidebarCollapsed: false,
  currentView: 'dashboard',
  pendingAccounts: 3,
  pendingAppointments: 5
};

// ===== TOAST NOTIFICATION SYSTEM =====
class ToastNotification {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <div class="toast-content">
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

const Toast = new ToastNotification();

// ===== CUSTOM ALERT =====
function showAlert(message, type = 'info') {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const modal = document.createElement('div');
  modal.className = 'confirm-modal-overlay';
  modal.innerHTML = `
    <div class="confirm-modal">
      <div class="confirm-icon">${icons[type]}</div>
      <h3 class="confirm-title">${type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Information'}</h3>
      <p class="confirm-message">${message}</p>
      <div class="confirm-actions">
        <button class="btn-confirm-ok" id="alertOk">OK</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
  
  document.getElementById('alertOk').addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  });
}

// ===== CUSTOM PROMPT =====
function showPrompt(message, defaultValue = '', onConfirm) {
  const modal = document.createElement('div');
  modal.className = 'confirm-modal-overlay';
  modal.innerHTML = `
    <div class="confirm-modal prompt-modal">
      <div class="confirm-icon">📝</div>
      <h3 class="confirm-title">Input Required</h3>
      <p class="confirm-message">${message}</p>
      <input type="text" class="prompt-input" value="${defaultValue}" placeholder="Enter text...">
      <div class="confirm-actions">
        <button class="btn-confirm-ok" id="promptOk">OK</button>
        <button class="btn-confirm-cancel" id="promptCancel">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
  
  const input = modal.querySelector('.prompt-input');
  input.focus();
  input.select();
  
  const handleOk = () => {
    const value = input.value;
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
      if (onConfirm) onConfirm(value);
    }, 300);
  };
  
  const handleCancel = () => {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
      if (onConfirm) onConfirm(null);
    }, 300);
  };
  
  document.getElementById('promptOk').addEventListener('click', handleOk);
  document.getElementById('promptCancel').addEventListener('click', handleCancel);
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleOk();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) handleCancel();
  });
}

// ===== LOADING OVERLAY =====
function showLoading() {
  let overlay = document.querySelector('.loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
  }
  overlay.classList.add('show');
}

function hideLoading() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

// ===== CONFIRMATION DIALOG =====
function confirmAction(message, onConfirm) {
  // Create custom modal
  const modal = document.createElement('div');
  modal.className = 'confirm-modal-overlay';
  modal.innerHTML = `
    <div class="confirm-modal">
      <div class="confirm-icon">⚠️</div>
      <h3 class="confirm-title">Confirm Action</h3>
      <p class="confirm-message">${message}</p>
      <div class="confirm-actions">
        <button class="btn-confirm-ok" id="confirmOk">OK</button>
        <button class="btn-confirm-cancel" id="confirmCancel">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Trigger animation
  setTimeout(() => modal.classList.add('show'), 10);
  
  // OK button
  document.getElementById('confirmOk').addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
      onConfirm();
    }, 300);
  });
  
  // Cancel button
  document.getElementById('confirmCancel').addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  });
  
  // Click outside to cancel
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  });
}

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const hamburger = document.querySelector('.hamburger-menu');
  
  if (sidebar && mainContent) {
    AppState.sidebarCollapsed = !AppState.sidebarCollapsed;
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    if (hamburger) {
      hamburger.classList.toggle('active');
    }
  }
}

// ===== PROFILE DROPDOWN =====
function initProfileDropdown() {
  const adminProfile = document.getElementById('adminProfile');
  const profileDropdown = document.getElementById('profileDropdown');

  if (adminProfile && profileDropdown) {
    adminProfile.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!adminProfile.contains(e.target)) {
        profileDropdown.classList.remove('show');
      }
    });
  }
}

// ===== LOGOUT FUNCTIONALITY =====
function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      confirmAction('Are you sure you want to logout?', () => {
        // Show logout loading animation
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
          <div class="loader-content">
            <div class="loader-spinner"></div>
            <div class="loader-text">Logging out...</div>
          </div>
        `;
        document.body.appendChild(loader);
        
        setTimeout(() => {
          window.location.href = '../web-page/index.html';
        }, 1000);
      });
    });
  }
}

// ===== ACCOUNT MANAGEMENT =====
function openCreateStaffModal() {
  const modal = document.getElementById('createStaffModal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeCreateStaffModal() {
  const modal = document.getElementById('createStaffModal');
  if (modal) {
    modal.classList.remove('show');
    const form = document.getElementById('createStaffForm');
    if (form) form.reset();
  }
}

function submitStaffAccount(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const password = formData.get('staffPassword');
  const confirmPassword = formData.get('staffConfirmPassword');
  
  if (password !== confirmPassword) {
    Toast.show('Passwords do not match!', 'error');
    return;
  }
  
  showLoading();
  setTimeout(() => {
    hideLoading();
    Toast.show('Staff account created successfully!', 'success');
    closeCreateStaffModal();
  }, 1000);
}

function approveAccount(accountId) {
  confirmAction('Approve this registration?', () => {
    showLoading();
    setTimeout(() => {
      const row = document.querySelector(`tr[data-id="${accountId}"]`);
      if (row) {
        row.style.backgroundColor = '#d4edda';
        setTimeout(() => {
          row.remove();
          updateBadgeCount('accounts', -1);
          hideLoading();
          Toast.show('Account approved successfully!', 'success');
        }, 500);
      } else {
        hideLoading();
      }
    }, 800);
  });
}

function rejectAccount(accountId) {
  showPrompt('Enter reason for rejection (optional):', '', (reason) => {
    if (reason !== null) {
      showLoading();
      setTimeout(() => {
        const row = document.querySelector(`tr[data-id="${accountId}"]`);
        if (row) {
          row.style.backgroundColor = '#f8d7da';
          setTimeout(() => {
            row.remove();
            updateBadgeCount('accounts', -1);
            hideLoading();
            Toast.show('Account rejected.', 'info');
          }, 500);
        } else {
          hideLoading();
        }
      }, 800);
    }
  });
}

function viewAccountDetails(accountId) {
  showAlert(`Loading account #${accountId} details...`, 'info');
}

function viewClient(clientId) {
  showAlert(`Loading client #${clientId} profile...`, 'info');
}

function editClient(clientId) {
  showAlert(`Opening edit form for client #${clientId}...`, 'info');
}

function deactivateClient(clientId) {
  confirmAction('Deactivate this client account?', () => {
    showLoading();
    setTimeout(() => {
      hideLoading();
      Toast.show('Client account deactivated.', 'success');
    }, 1000);
  });
}

function activateClient(clientId) {
  confirmAction('Activate this client account?', () => {
    showLoading();
    setTimeout(() => {
      hideLoading();
      Toast.show('Client account activated.', 'success');
    }, 1000);
  });
}

function viewStaff(staffId) {
  showAlert(`Loading staff #${staffId} details...`, 'info');
}

function editStaff(staffId) {
  showAlert(`Opening edit form for staff #${staffId}...`, 'info');
}

function deactivateStaff(staffId) {
  confirmAction('Deactivate this staff account?', () => {
    showLoading();
    setTimeout(() => {
      hideLoading();
      Toast.show('Staff account deactivated.', 'success');
    }, 1000);
  });
}

// ===== APPOINTMENT MANAGEMENT =====
function approveAppointment(appointmentId) {
  confirmAction('Approve this appointment?', () => {
    showLoading();
    setTimeout(() => {
      const row = document.querySelector(`tr[data-id="${appointmentId}"]`);
      if (row) {
        row.style.backgroundColor = '#d4edda';
        setTimeout(() => {
          row.remove();
          updateBadgeCount('appointments', -1);
          hideLoading();
          Toast.show('Appointment approved!', 'success');
        }, 500);
      } else {
        hideLoading();
      }
    }, 800);
  });
}

function rejectAppointment(appointmentId) {
  showPrompt('Enter reason for rejection (optional):', '', (reason) => {
    if (reason !== null) {
      showLoading();
      setTimeout(() => {
        const row = document.querySelector(`tr[data-id="${appointmentId}"]`);
        if (row) {
          row.style.backgroundColor = '#f8d7da';
          setTimeout(() => {
            row.remove();
            updateBadgeCount('appointments', -1);
            hideLoading();
            Toast.show('Appointment rejected.', 'info');
          }, 500);
        } else {
          hideLoading();
        }
      }, 800);
    }
  });
}

function viewAppointment(appointmentId) {
  showAlert(`Loading appointment #${appointmentId} details...`, 'info');
}

function editAppointment(appointmentId) {
  showAlert(`Opening edit form for appointment #${appointmentId}...`, 'info');
}

function markComplete(appointmentId) {
  confirmAction('Mark this appointment as completed?', () => {
    showLoading();
    setTimeout(() => {
      hideLoading();
      Toast.show('Appointment marked as completed!', 'success');
    }, 1000);
  });
}

function reschedule(appointmentId) {
  showAlert(`Opening reschedule form for appointment #${appointmentId}...`, 'info');
}

function cancelAppointment(appointmentId) {
  confirmAction('Cancel this appointment?', () => {
    showLoading();
    setTimeout(() => {
      hideLoading();
      Toast.show('Appointment cancelled.', 'warning');
    }, 1000);
  });
}

// ===== PET & OWNER MANAGEMENT =====
function addNewOwner() {
  showAlert('Opening add owner form...', 'info');
}

function viewOwnerProfile(ownerId) {
  const modal = document.getElementById('ownerProfileModal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeOwnerProfile() {
  const modal = document.getElementById('ownerProfileModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function editOwner(ownerId) {
  showAlert(`Opening edit form for owner #${ownerId}...`, 'info');
}

function addNewPet() {
  showAlert('Opening add pet form...', 'info');
}

function viewPetProfile(petId) {
  const modal = document.getElementById('petProfileModal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closePetProfile() {
  const modal = document.getElementById('petProfileModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function editPet(petId) {
  showAlert(`Opening edit form for pet #${petId}...`, 'info');
}

function viewHistory(petId) {
  showAlert(`Loading history for pet #${petId}...`, 'info');
}

function uploadDocument() {
  showAlert('Opening file picker...', 'info');
}

// ===== SERVICE MANAGEMENT =====
function addNewService() {
  showAlert('Opening add service form...', 'info');
}

function editService(serviceId) {
  showAlert(`Opening edit form for service #${serviceId}...`, 'info');
}

function toggleService(serviceId) {
  confirmAction('Toggle service status?', () => {
    showLoading();
    setTimeout(() => {
      hideLoading();
      Toast.show('Service status updated.', 'success');
    }, 1000);
  });
}

// ===== WEBSITE CONTENT =====
function addAnnouncement() {
  showAlert('Opening add announcement form...', 'info');
}

function editAnnouncement(announcementId) {
  showAlert(`Opening edit form for announcement #${announcementId}...`, 'info');
}

function deleteAnnouncement(announcementId) {
  confirmAction('Delete this announcement?', () => {
    showLoading();
    setTimeout(() => {
      hideLoading();
      Toast.show('Announcement deleted.', 'success');
    }, 1000);
  });
}

// ===== UTILITY FUNCTIONS =====
function updateBadgeCount(section, change) {
  const badges = document.querySelectorAll('.badge-count');
  badges.forEach(badge => {
    const navItem = badge.closest('.nav-item');
    if (navItem && navItem.href && navItem.href.includes(section)) {
      const currentCount = parseInt(badge.textContent) || 0;
      const newCount = Math.max(0, currentCount + change);
      badge.textContent = newCount;
      badge.style.display = newCount === 0 ? 'none' : 'inline-block';
    }
  });
}

// ===== SEARCH FUNCTIONALITY =====
function setupSearch() {
  const searchInputs = document.querySelectorAll('input[type="search"]');
  
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const section = e.target.closest('section');
      const table = section?.querySelector('.compact-table tbody');
      
      if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      }
    });
  });
}

// ===== FILTER FUNCTIONALITY =====
function setupFilters() {
  const filterSelects = document.querySelectorAll('select[id^="filter"]');
  
  filterSelects.forEach(select => {
    select.addEventListener('change', (e) => {
      const filterValue = e.target.value.toLowerCase();
      const section = e.target.closest('section');
      const table = section?.querySelector('.compact-table tbody');
      
      if (table) {
        const rows = table.querySelectorAll('tr');
        if (filterValue === 'all') {
          rows.forEach(row => row.style.display = '');
        } else {
          rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filterValue) ? '' : 'none';
          });
        }
      }
    });
  });
}

// ===== FORM SUBMISSION =====
function setupForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (form.id !== 'createStaffForm') {
        e.preventDefault();
        showLoading();
        setTimeout(() => {
          hideLoading();
          Toast.show('Changes saved successfully!', 'success');
        }, 1000);
      }
    });
  });
}

// ===== TAB FUNCTIONALITY =====
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      button.classList.add('active');
      const targetContent = document.getElementById(`${targetTab}-tab`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

// ===== MODAL FUNCTIONALITY =====
function setupModals() {
  const modals = document.querySelectorAll('.modal-overlay');
  
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  });

  const closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('show');
      }
    });
  });
}

// ===== RESPONSIVE SIDEBAR =====
function handleResponsive() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  if (window.innerWidth <= 768) {
    sidebar?.classList.add('mobile');
    mainContent?.classList.add('mobile');
  } else {
    sidebar?.classList.remove('mobile', 'collapsed');
    mainContent?.classList.remove('mobile', 'expanded');
    AppState.sidebarCollapsed = false;
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Show section loaders (natural timing)
  showSectionLoaders();
  
  initProfileDropdown();
  initLogout();
  setupSearch();
  setupFilters();
  setupForms();
  setupTabs();
  setupModals();
  handleResponsive();
  
  window.addEventListener('resize', handleResponsive);
  
  const hamburger = document.querySelector('.hamburger-menu');
  if (hamburger) {
    hamburger.addEventListener('click', toggleSidebar);
  }
  
  console.log('%c🏥 VHS Admin Dashboard Enhanced', 'color: #6d4ab1; font-size: 20px; font-weight: bold;');
  console.log('%c✓ All systems operational!', 'color: #10b981; font-size: 14px;');
});

// ===== SECTION LOADERS =====
function showSectionLoaders() {
  // Find all content sections
  const sections = document.querySelectorAll('.content-section, .priority-card, .stat-card');
  
  sections.forEach((section, index) => {
    // Create loader overlay
    const loader = document.createElement('div');
    loader.className = 'section-loader';
    loader.innerHTML = `
      <div class="section-spinner"></div>
    `;
    
    // Add loader to section
    section.style.position = 'relative';
    section.style.minHeight = '100px';
    section.appendChild(loader);
    
    // Natural staggered loading (300ms base + 80ms per section)
    const delay = 300 + (index * 80);
    
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.remove();
      }, 300);
    }, delay);
  });
}

// Make functions globally available
window.Toast = Toast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.confirmAction = confirmAction;

// ===== CALENDAR FUNCTIONS =====

// Calendar state
const CalendarState = {
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  currentView: 'month',
  selectedDate: new Date(),
  appointments: [
    { id: 1, date: '2026-01-08', owner: 'Tita Leia', pet: 'Luna', service: 'Grooming', type: 'grooming' },
    { id: 2, date: '2026-01-13', owner: 'Tita Eren', pet: 'Max', service: 'Deworming', type: 'deworming' },
    { id: 3, date: '2026-01-15', owner: 'Ana Garcia', pet: 'Fluffy', service: 'Vaccination', type: 'vaccination' },
    { id: 4, date: '2026-01-22', owner: 'Pedro Santos', pet: 'Rocky', service: 'Checkup', type: 'checkup' }
  ]
};

/**
 * Generate accurate calendar for given month and year
 */
function generateCalendar() {
  const { currentMonth, currentYear } = CalendarState;
  const calendarGrid = document.getElementById('calendarGrid');
  
  if (!calendarGrid) return;
  
  // Clear existing calendar
  calendarGrid.innerHTML = '';
  
  // Add day headers
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    const header = document.createElement('div');
    header.className = 'calendar-day-header';
    header.textContent = day;
    calendarGrid.appendChild(header);
  });
  
  // Get first day of month and total days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Get previous month's last days
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  const prevMonthDays = startingDayOfWeek;
  
  // Add previous month's days
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const dayElement = createDayElement(day, true, currentMonth - 1, currentYear);
    calendarGrid.appendChild(dayElement);
  }
  
  // Add current month's days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && 
                    currentMonth === today.getMonth() && 
                    currentYear === today.getFullYear();
    const dayElement = createDayElement(day, false, currentMonth, currentYear, isToday);
    calendarGrid.appendChild(dayElement);
  }
  
  // Add next month's days to fill the grid
  const totalCells = calendarGrid.children.length - 7; // Subtract headers
  const remainingCells = 42 - totalCells; // 6 rows * 7 days
  for (let day = 1; day <= remainingCells; day++) {
    const dayElement = createDayElement(day, true, currentMonth + 1, currentYear);
    calendarGrid.appendChild(dayElement);
  }
}

/**
 * Create a day element
 */
function createDayElement(day, isOtherMonth, month, year, isToday = false) {
  const dayElement = document.createElement('div');
  dayElement.className = 'calendar-day';
  
  if (isOtherMonth) {
    dayElement.classList.add('other-month');
  }
  
  if (isToday) {
    dayElement.classList.add('today');
  }
  
  dayElement.textContent = day;
  
  // Add appointments for this day
  if (!isOtherMonth) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayAppointments = CalendarState.appointments.filter(apt => apt.date === dateStr);
    
    dayAppointments.forEach(apt => {
      const aptElement = document.createElement('div');
      aptElement.className = `appointment-item ${apt.type}`;
      aptElement.onclick = () => viewAppointmentDetails(apt.id);
      
      const badge = document.createElement('span');
      badge.className = 'appointment-badge';
      badge.textContent = `${apt.owner} - ${apt.service}`;
      
      aptElement.appendChild(badge);
      dayElement.appendChild(aptElement);
    });
  }
  
  return dayElement;
}

/**
 * Update calendar month display
 */
function updateCalendarDisplay() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  const monthElement = document.getElementById('calendarMonth');
  if (monthElement) {
    monthElement.textContent = `${monthNames[CalendarState.currentMonth]} ${CalendarState.currentYear}`;
  }
  
  generateCalendar();
}

/**
 * Go to previous month
 */
function previousMonth() {
  CalendarState.currentMonth--;
  if (CalendarState.currentMonth < 0) {
    CalendarState.currentMonth = 11;
    CalendarState.currentYear--;
  }
  updateCalendarDisplay();
  Toast.show('Navigated to previous month', 'info');
}

/**
 * Go to next month
 */
function nextMonth() {
  CalendarState.currentMonth++;
  if (CalendarState.currentMonth > 11) {
    CalendarState.currentMonth = 0;
    CalendarState.currentYear++;
  }
  updateCalendarDisplay();
  Toast.show('Navigated to next month', 'info');
}

/**
 * Go to today
 */
function goToToday() {
  const today = new Date();
  CalendarState.currentMonth = today.getMonth();
  CalendarState.currentYear = today.getFullYear();
  updateCalendarDisplay();
  Toast.show('Showing current month', 'success');
}

/**
 * Set calendar view (month, week, day)
 */
function setCalendarView(view) {
  CalendarState.currentView = view;
  
  // Update active button
  document.querySelectorAll('.calendar-view-toggle .btn-small').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-view') === view) {
      btn.classList.add('active');
    }
  });
  
  showAlert(`Switched to ${view} view`, 'info');
  // In production, this would re-render the calendar in the selected view
}

/**
 * Filter appointments by status
 */
function filterAppointments() {
  const filter = document.getElementById('statusFilter').value;
  showAlert(`Filtering by: ${filter}`, 'info');
  // In production, this would filter the displayed appointments
}

/**
 * View appointment details from calendar
 */
function viewAppointmentDetails(appointmentId) {
  const appointment = CalendarState.appointments.find(apt => apt.id === appointmentId);
  if (appointment) {
    showAlert(`${appointment.owner} - ${appointment.pet} (${appointment.service})`, 'info');
  }
  // In production, this would open a modal with full appointment details
}

/**
 * Add new appointment
 */
function addNewAppointment() {
  showAlert('Opening appointment creation form...', 'info');
  // In production, this would open a modal to create a new appointment
}

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('calendarGrid')) {
    // Wait for section loader to finish before initializing calendar
    setTimeout(() => {
      updateCalendarDisplay();
    }, 500);
  }
});
