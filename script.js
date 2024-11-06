document.addEventListener('DOMContentLoaded', () => {
  const editableElements = document.querySelectorAll('.editable');
  const downloadButton = document.querySelector('.download-btn a');

  // Загрузка данных из localStorage
  function loadData() {
    const data = JSON.parse(localStorage.getItem('resumeData')) || {};
    editableElements.forEach(element => {
      const section = element.getAttribute('data-section');
      const field = element.getAttribute('data-field');
      if (data[section] && data[section][field]) {
        element.textContent = data[section][field];
      }
    });
  }

  // Сохранение данных в localStorage
  function saveData() {
    const data = {};
    editableElements.forEach(element => {
      const section = element.getAttribute('data-section');
      const field = element.getAttribute('data-field');
      const value = element.textContent;
      if (!data[section]) {
        data[section] = {};
      }
      data[section][field] = value;
    });
    localStorage.setItem('resumeData', JSON.stringify(data));
  }

  // Загрузка данных при загрузке страницы
  loadData();

  editableElements.forEach(element => {
    element.addEventListener('click', () => {
      const currentText = element.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentText;
      input.classList.add('edit-input');

      input.addEventListener('blur', () => {
        const newText = input.value;
        element.textContent = newText;
        element.style.display = 'block';
        input.remove();
        saveData();
      });

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });

      element.textContent = '';
      element.appendChild(input);
      input.focus();
    });

    // Добавление "Material Wave" эффекта
    element.addEventListener('click', (e) => {
      const rect = element.getBoundingClientRect();
      const wave = document.createElement('span');
      wave.classList.add('ripple');
      wave.style.left = `${e.clientX - rect.left}px`;
      wave.style.top = `${e.clientY - rect.top}px`;
      element.appendChild(wave);

      setTimeout(() => {
        wave.remove();
      }, 600);
    });
  });

  // Дополнительный код для скачивания в PDF
  downloadButton.addEventListener('click', () => {
    // Вставляем HTML в PDF
    const resumeContainer = document.querySelector('.resume');
    // Создаем новый объект jsPDF
    const pdf = new jsPDF(); 
    // Используем метод html для преобразования HTML в PDF
    pdf.html(resumeContainer.innerHTML, {
      callback: function(pdf) {
        // Сохраняем файл PDF
        pdf.save('resume.pdf');
      },
      // Устанавливаем масштаб для преобразования 
      html2canvas: {
        scale: 1
      }
    });
  });
});

// Добавление "Material Wave" эффекта на все элементы
document.addEventListener('click', function(event) {
  const element = event.target;
  if (element.classList.contains('ripple')) {
    return; // Ignore clicks on ripple elements themselves
  }

  // Create ripple effect
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');

  // Get position and size of the clicked element
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Style the ripple
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  element.appendChild(ripple);

  // Remove the ripple after a short delay
  setTimeout(() => {
    ripple.remove();
  }, 600);
});
