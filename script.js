function changeFontSize() {
    const fontSizeInput = document.querySelector('.input[oninput="changeFontSize()"]');
    const contentElement = document.getElementById('content');
  
    const fontSize = fontSizeInput.value.replace(/\D/g, '');
    const fontUnit = fontSizeInput.value.replace(/\d/g, '') || 'pt';
  
    contentElement.style.fontSize = `${fontSize}${fontUnit}`;
}

function changeForegroundColor() {
    const input = document.querySelector('input[oninput="changeForegroundColor()"]');
    const content = document.getElementById('content');
    const color = input.value.replace('#', '');
    if (/^[0-9A-F]{6}$/i.test(color)) {
      content.style.color = '#' + color;
    }
    updateContrastRatio();
}

function changeBackgroundColor() {
    const input = document.querySelector('input[oninput="changeBackgroundColor()"]');
    const body = document.querySelector('body');
    const color = input.value.replace('#', '');
    if (/^[0-9A-F]{6}$/i.test(color)) {
        body.style.backgroundColor = '#' + color;
    }

    updateContrastRatio();
}

function getLuminance(inputId) {
  const inputElement = document.getElementById(inputId);
  const color = inputElement.value.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16) / 255;
  const g = parseInt(color.substring(2, 4), 16) / 255;
  const b = parseInt(color.substring(4, 6), 16) / 255;
  const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio() {
    const L1 = getLuminance('foreground-color-input');
    const L2 = getLuminance('background-color-input');
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const ratioFixed = ratio.toFixed(2);
    document.querySelector('.right').textContent = ratioFixed;
    document.getElementById('aa-graphic').textContent = ratio >= 3 ? "Yes" : "No";
    document.getElementById('aa-large-text').textContent = ratio >= 3 ? "Yes" : "No";
    document.getElementById('aa-normal-text').textContent = ratio >= 4.5 ? "Yes" : "No";
    document.getElementById('aaa-graphic').textContent = ratio >= 4.5 ? "Yes" : "No";
    document.getElementById('aaa-large-text').textContent = ratio >= 4.5 ? "Yes" : "No";
    document.getElementById('aaa-normal-text').textContent = ratio >= 7 ? "Yes" : "No";
    return ratio; // return the numerical ratio
}

// Listen to the inputs

const foregroundColorInput = document.getElementById('foreground-color-input');
const backgroundColorInput = document.getElementById('background-color-input');
const contrastRatioElement = document.querySelector('.contrast-ratio-container');

foregroundColorInput.addEventListener('input', updateContrastRatio);
backgroundColorInput.addEventListener('input', updateContrastRatio);


function updateContrastRatio() {
    const ratio = parseFloat(contrastRatio());
    contrastRatioElement.textContent = ratio;
}

updateContrastRatio();