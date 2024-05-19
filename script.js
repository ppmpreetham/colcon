function changeFontSize() {
    const fontSizeInput = document.querySelector('.input[oninput="changeFontSize()"]');
    const contentElement = document.getElementById('content');
  
    const fontSize = fontSizeInput.value.replace(/\D/g, '');
    const fontUnit = fontSizeInput.value.replace(/\d/g, '') || 'pt';
  
    contentElement.style.fontSize = `${fontSize}${fontUnit}`;
}