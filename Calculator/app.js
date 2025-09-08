// Calculator functionality
const calculator = {
    currentInput: '0',
    previousInput: '',
    operation: '',
    shouldResetDisplay: false,

    updateDisplay() {
        const display = document.getElementById('display');
        let displayValue = this.currentInput;
        
        // Handle very long numbers
        if (displayValue.length > 12) {
            const num = parseFloat(displayValue);
            if (Math.abs(num) >= 1e12) {
                displayValue = num.toExponential(5);
            } else {
                displayValue = num.toString().substring(0, 12);
            }
        }
        
        display.value = displayValue;
    },

    handleNumber(number) {
        if (this.shouldResetDisplay || this.currentInput === '0') {
            this.currentInput = number;
            this.shouldResetDisplay = false;
        } else {
            this.currentInput += number;
        }
        
        this.updateDisplay();
    },

    handleOperation(nextOperation) {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput === '') {
            this.previousInput = this.currentInput;
        } else if (this.operation) {
            const currentValue = parseFloat(this.previousInput) || 0;
            const result = this.calculate(currentValue, inputValue, this.operation);
            
            this.currentInput = String(result);
            this.previousInput = String(result);
        }

        this.shouldResetDisplay = true;
        this.operation = nextOperation;
        this.updateDisplay();
    },

    handleEquals() {
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);

        if (this.operation && !isNaN(prev) && !isNaN(current)) {
            const result = this.calculate(prev, current, this.operation);
            this.currentInput = String(result);
            this.previousInput = '';
            this.operation = '';
            this.shouldResetDisplay = true;
            this.updateDisplay();
        }
    },

    handleClear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = '';
        this.shouldResetDisplay = false;
        this.updateDisplay();
    },

    handleDecimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }

        if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
            this.updateDisplay();
        }
    },

    calculate(firstOperand, secondOperand, operation) {
        let result;
        
        // Use if-else statements to perform calculations
        if (operation === '+') {
            result = firstOperand + secondOperand;
        } else if (operation === '-') {
            result = firstOperand - secondOperand;
        } else if (operation === '×') {
            result = firstOperand * secondOperand;
        } else if (operation === '÷') {
            if (secondOperand === 0) {
                alert('Error: Cannot divide by zero!');
                return firstOperand;
            }
            result = firstOperand / secondOperand;
        } else {
            return secondOperand;
        }

        // Round result to avoid floating point precision issues
        return Math.round((result + Number.EPSILON) * 100000000) / 100000000;
    },

    handleKeyboard(e) {
        const key = e.key;
        
        // Handle number keys
        if (key >= '0' && key <= '9') {
            this.handleNumber(key);
        } 
        // Handle operation keys
        else if (key === '+') {
            this.handleOperation('+');
        } else if (key === '-') {
            this.handleOperation('-');
        } else if (key === '*') {
            this.handleOperation('×');
        } else if (key === '/') {
            e.preventDefault(); // Prevent default browser behavior
            this.handleOperation('÷');
        }
        // Handle special keys
        else if (key === 'Enter' || key === '=') {
            this.handleEquals();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.handleClear();
        } else if (key === '.') {
            this.handleDecimal();
        }
    },

    init() {
        // Add keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Add visual feedback for button presses
        const buttons = document.querySelectorAll('.btn');
        
        // Use loop to add visual feedback to all buttons
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            
            button.addEventListener('mousedown', function() {
                button.style.transform = 'scale(0.95) translateY(-2px)';
            });
            
            button.addEventListener('mouseup', function() {
                button.style.transform = 'scale(1)';
            });
            
            button.addEventListener('mouseleave', function() {
                button.style.transform = 'scale(1)';
            });
        }
        
        // Initialize display
        this.updateDisplay();
    }
};

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    calculator.init();
});