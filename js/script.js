// Variables globales para la calculadora
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Función para obtener el elemento de display
function getDisplay() {
    return document.getElementById('result');
}

// Función para agregar números y operadores al display
function appendToDisplay(value) {
    const display = getDisplay();
    
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    // Si es un operador
    if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput === '' && display.value === '') {
            return; // No permitir operador sin número
        }
        
        if (operator && currentInput && !shouldResetDisplay) {
            calculate(); // Calcular resultado anterior antes de nueva operación
        }
        
        operator = value;
        previousInput = display.value || currentInput;
        currentInput = '';
        shouldResetDisplay = true;
        
        // Mostrar la operación en el display
        display.value = previousInput + ' ' + (value === '*' ? '×' : value) + ' ';
        return;
    }
    
    // Si es un punto decimal
    if (value === '.') {
        if (display.value.includes('.')) {
            return; // No permitir múltiples puntos decimales
        }
        if (display.value === '' || shouldResetDisplay) {
            display.value = '0.';
            shouldResetDisplay = false;
            return;
        }
    }
    
    // Si es un número
    if (shouldResetDisplay || display.value === '0') {
        display.value = value;
        shouldResetDisplay = false;
    } else {
        display.value += value;
    }
    
    currentInput = display.value.split(' ').pop(); // Obtener solo la parte numérica actual
}

// Función para calcular el resultado
function calculate() {
    const display = getDisplay();
    
    if (operator && previousInput !== '' && currentInput !== '') {
        try {
            let result;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            switch (operator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        display.value = 'Error: División por cero';
                        resetCalculator();
                        return;
                    }
                    result = prev / current;
                    break;
                default:
                    return;
            }
            
            // Formatear el resultado
            if (result % 1 === 0) {
                display.value = result.toString();
            } else {
                display.value = parseFloat(result.toFixed(10)).toString();
            }
            
            // Resetear para nueva operación
            currentInput = display.value;
            operator = '';
            previousInput = '';
            shouldResetDisplay = true;
            
        } catch (error) {
            display.value = 'Error';
            resetCalculator();
        }
    }
}

// Función para limpiar completamente la calculadora
function clearDisplay() {
    const display = getDisplay();
    display.value = '';
    resetCalculator();
}

// Función para limpiar solo la entrada actual
function clearEntry() {
    const display = getDisplay();
    display.value = '';
    currentInput = '';
}

// Función para borrar el último carácter
function deleteLast() {
    const display = getDisplay();
    if (display.value.length > 0) {
        display.value = display.value.slice(0, -1);
        currentInput = display.value.split(' ').pop();
    }
}

// Función para resetear todas las variables
function resetCalculator() {
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

// Manejo de eventos de teclado
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Números
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    }
    // Operadores
    else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    }
    // Punto decimal
    else if (key === '.') {
        appendToDisplay('.');
    }
    // Enter o = para calcular
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Escape para limpiar
    else if (key === 'Escape') {
        clearDisplay();
    }
    // Backspace para borrar último carácter
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculadora lista para usar!');
    console.log('Puedes usar el teclado: números, +, -, *, /, Enter/=, Escape, Backspace');
});