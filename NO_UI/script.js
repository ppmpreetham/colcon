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