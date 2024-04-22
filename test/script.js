let currentBackgroundColor = '#ffffff';
let currentForegroundColor = '#000000';

function changeFontSize() {
    const fontSize = document.getElementById('font-size-input').value;
    document.getElementById('content').style.fontSize = fontSize + 'pt';
}

function changeBackgroundColor() {
    const color = document.getElementById('background-color-input').value;
    document.body.style.backgroundColor = color;
    currentBackgroundColor = color;
    updateLuminanceValue();
    checkContrastRatio();
    updateHexCode('background-color-input', color);
}

function changeForegroundColor() {
    const color = document.getElementById('foreground-color-input').value;
    document.getElementById('content').style.color = color;
    currentForegroundColor = color;
    updateLuminanceValue();
    checkContrastRatio();
    updateHexCode('foreground-color-input', color);
}

function getLuminance(id) {
    const color = document.getElementById(id).value;
    const r = parseInt(color.substring(1, 3), 16) / 255;
    const g = parseInt(color.substring(3, 5), 16) / 255;
    const b = parseInt(color.substring(5, 7), 16) / 255;

    const R = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
    const G = g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
    const B = b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;

    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return luminance;
}

function contrast_ratio() {
    const L1 = getLuminance('background-color-input');
    const L2 = getLuminance('foreground-color-input');
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    return ratio;
}

function updateLuminanceValue() {
    const backgroundLuminance = getLuminance('background-color-input');
    const foregroundLuminance = getLuminance('foreground-color-input');
    const contrastRatio = contrast_ratio();

    const luminanceOutput = document.getElementById('luminance-output');
    luminanceOutput.innerHTML = `Background luminance: ${backgroundLuminance.toFixed(3)}<br>
        Foreground luminance: ${foregroundLuminance.toFixed(3)}<br>
        Contrast ratio: ${contrastRatio.toFixed(3)}`;
}

function checkContrastRatio() {
    const contrastRatio = contrast_ratio();
    const contrastResultEl = document.getElementById('contrast-result');
    const paramsDiv = document.getElementById('params');

    const AA_Large_Text = 3;
    const AA_Normal_Text = 4.5;
    const AA_Graphic_Components = 3;
    const AAA_Large_Text = 4.5;
    const AAA_Normal_Text = 7;
    const AAA_Graphic_Components = 4.5;

    let results = '';

    document.getElementById('aa-graphic').innerHTML = contrastRatio >= AA_Graphic_Components ? '✔️' : '❌';
    document.getElementById('aa-large-text').innerHTML = contrastRatio >= AA_Large_Text ? '✔️' : '❌';
    document.getElementById('aa-normal-text').innerHTML = contrastRatio >= AA_Normal_Text ? '✔️' : '❌';
    document.getElementById('aaa-graphic').innerHTML = contrastRatio >= AAA_Graphic_Components ? '✔️' : '❌';
    document.getElementById('aaa-large-text').innerHTML = contrastRatio >= AAA_Large_Text ? '✔️' : '❌';
    document.getElementById('aaa-normal-text').innerHTML = contrastRatio >= AAA_Normal_Text ? '✔️' : '❌';

    contrastResultEl.innerHTML = results;
    paramsDiv.style.color = contrastRatio >= AA_Large_Text ? 'green' : 'red';
}

document.getElementById('flip-button').addEventListener('click', function() {
    document.body.style.backgroundColor = currentForegroundColor;
    document.getElementById('content').style.color = currentBackgroundColor;
    document.getElementById('background-color-input').value = currentForegroundColor;
    document.getElementById('foreground-color-input').value = currentBackgroundColor;

    [currentBackgroundColor, currentForegroundColor] = [currentForegroundColor, currentBackgroundColor];

    updateLuminanceValue();
    checkContrastRatio();
    updateHexCode('background-color-input', currentBackgroundColor);
    updateHexCode('foreground-color-input', currentForegroundColor);
});

function loadCustomFont() {
    const fontFile = document.getElementById('font-file').files[0];

    if ('FontFace' in window) {
        const fontFamily = 'My Custom Font';

        const customFontStyle = document.getElementById('custom-font-style');
        customFontStyle.innerHTML = `
            @font-face {
                    font-family: '${fontFamily}';
                    src: url(${URL.createObjectURL(fontFile)}) format('${getFontFormat(fontFile.name)}');
                    font-weight: normal;
                    font-style: normal;
            }

            #content {
                    font-family: '${fontFamily}', sans-serif;
            }
        `;

        const customFont = new FontFace(fontFamily, `
            url(${URL.createObjectURL(fontFile)}) format('${getFontFormat(fontFile.name)}')
        `, {
            weight: 'normal',
            style: 'normal'
        });

        customFont.load().then((font) => {
            document.fonts.add(font);
            document.getElementById('content').style.fontFamily = `"${fontFamily}", sans-serif`;
        }).catch((error) => {
            console.error('Error loading custom font:', error);
        });
    } else {
        console.error('Font Face API is not supported in this browser.');
    }
}

function getFontFormat(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'ttf':
            return 'truetype';
        case 'otf':
            return 'opentype';
        case 'woff':
            return 'woff';
        case 'woff2':
            return 'woff2';
        default:
            return '';
    }
}

function updateHexCode(inputId, color) {
    const hexCodeElement = document.querySelector(`#${inputId} + .hex-code`);
    hexCodeElement.textContent = color;
}

function copyHexCode(inputId) {
    const hexCode = document.querySelector(`#${inputId} + .hex-code`).textContent;
    navigator.clipboard.writeText(hexCode);
    alert(`Copied color code: ${hexCode}`);
}

const textInput = document.getElementById('textInput');
const fontDisplay = document.getElementById('fontDisplay');
const fontFileInput = document.getElementById('fontFileInput');

textInput.addEventListener('input', function() {
    fontDisplay.textContent = this.value;
});

fontFileInput.addEventListener('change', function() {
    loadFontFromFile(this.files[0]);
});

function loadFontFromFile(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fontData = e.target.result;
            const fontFormat = file.name.split('.').pop(); // Get the file extension
            const fontUrl = `data:font/${fontFormat};base64,${fontData}`;
            // Create and apply @font-face rule dynamically
            const fontFace = `@font-face {
                font-family: 'uploadedFont';
                src: url('${fontUrl}') format('${fontFormat}');
            }`;
            const style = document.createElement('style');
            style.innerHTML = fontFace;
            document.head.appendChild(style);
            fontDisplay.style.fontFamily = 'uploadedFont';
        };
        reader.readAsDataURL(file);
    }
}