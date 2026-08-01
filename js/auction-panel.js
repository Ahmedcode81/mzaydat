// Auction Control Panel JavaScript
// Saudi License Plate Auction System

class PlateManager {
    constructor() {
        this.selectedPlate = 1;
        this.plateData = {};
        this.autoConversionEnabled = false;
        this.autoNumberConversionEnabled = false;
        
        // English to Arabic letter mapping for Saudi license plates
        this.englishToArabicMap = {
            'A': 'ش',
            'B': 'لا',
            'C': 'چ',
            'D': 'د',
            'E': 'د',
            'F': 'ف',
            'G': 'غ',
            'H': 'ه',
            'I': 'ي',
            'J': 'ت',
            'K': 'ن',
            'L': 'م',
            'M': 'ة',
            'N': 'ى',
            'O': 'خ',
            'P': 'ح',
            'Q': 'ق',
            'R': 'ق',
            'S': 'س',
            'T': 'ف',
            'U': 'ع',
            'V': 'ر',
            'W': 'ص',
            'X': 'ء',
            'Y': 'غ',
            'Z': 'ز'
        };
        
        // English to Arabic number mapping for Saudi license plates
        this.englishToArabicNumberMap = {
            '0': '٠',
            '1': '١',
            '2': '٢',
            '3': '٣',
            '4': '٤',
            '5': '٥',
            '6': '٦',
            '7': '٧',
            '8': '٨',
            '9': '٩'
        };
        
        // Initialize plate data
        for (let i = 1; i <= 5; i++) {
            this.plateData[i] = {
                arabicLetters: 'أ ب ج',
                englishLetters: 'A B J',
                arabicNumbers: '۱۱۱۱',
                englishNumbers: '-1111'
            };
        }
        
        this.arabicLettersInput = document.getElementById('arabicLetters');
        this.englishLettersInput = document.getElementById('englishLetters');
        this.arabicNumbersInput = document.getElementById('arabicNumbers');
        this.englishNumbersInput = document.getElementById('englishNumbers');
        this.selectedPlateLabel = document.getElementById('selectedPlateLabel');
        this.autoConversionToggle = document.getElementById('autoConversionToggle');
        this.autoNumberConversionToggle = document.getElementById('autoNumberConversionToggle');
        
        this.bindEvents();
        this.updateForm();
    }
    
    bindEvents() {
        // Form input listeners
        this.arabicLettersInput.addEventListener('input', () => this.handleArabicLettersInput());
        this.englishLettersInput.addEventListener('input', () => this.handleEnglishLettersInput());
        this.arabicNumbersInput.addEventListener('input', () => this.handleArabicNumbersInput());
        this.englishNumbersInput.addEventListener('input', () => this.handleEnglishNumbersInput());
        
        // Auto conversion toggle listeners
        this.autoConversionToggle.addEventListener('change', () => {
            this.autoConversionEnabled = this.autoConversionToggle.checked;
        });
        
        this.autoNumberConversionToggle.addEventListener('change', () => {
            this.autoNumberConversionEnabled = this.autoNumberConversionToggle.checked;
        });
        
        // Plate click listeners
        document.querySelectorAll('.plate-item').forEach(plate => {
            plate.addEventListener('click', (e) => {
                const plateNumber = parseInt(plate.dataset.plate);
                this.selectPlate(plateNumber);
            });
        });
    }
    
    handleArabicLettersInput() {
        if (this.autoConversionEnabled) {
            this.convertEnglishToArabic();
        }
        this.updatePlateData();
    }
    
    handleEnglishLettersInput() {
        if (this.autoConversionEnabled) {
            this.convertEnglishToArabic();
        }
        this.updatePlateData();
    }
    
    handleArabicNumbersInput() {
        this.updatePlateData();
    }
    
    handleEnglishNumbersInput() {
        if (this.autoNumberConversionEnabled) {
            this.convertEnglishToArabicNumbers();
        }
        this.updatePlateData();
    }
    
    convertEnglishToArabic() {
        const englishText = this.englishLettersInput.value.toUpperCase();
        let arabicText = '';
        
        for (let char of englishText) {
            if (this.englishToArabicMap[char]) {
                arabicText += this.englishToArabicMap[char];
            } else if (char === ' ') {
                arabicText += ' ';
            }
            // Ignore characters that don't have mappings
        }
        
        this.arabicLettersInput.value = arabicText;
    }
    
    convertEnglishToArabicNumbers() {
        const englishText = this.englishNumbersInput.value;
        let arabicText = '';
        
        for (let char of englishText) {
            if (this.englishToArabicNumberMap[char]) {
                arabicText += this.englishToArabicNumberMap[char];
            } else {
                // Keep non-number characters (like hyphens) as-is
                arabicText += char;
            }
        }
        
        this.arabicNumbersInput.value = arabicText;
    }
    
    selectPlate(plateNumber) {
        // Save current form data before switching
        this.saveCurrentData();
        
        // Update selected plate
        this.selectedPlate = plateNumber;
        
        // Update visual selection
        document.querySelectorAll('.plate-item').forEach(plate => {
            plate.classList.remove('selected');
        });
        
        const selectedPlateElement = document.querySelector(`.plate-item[data-plate="${plateNumber}"]`);
        if (selectedPlateElement) {
            selectedPlateElement.classList.add('selected');
        }
        
        // Update form with new plate data
        this.updateForm();
        
        // Update main plate display
        this.updateMainPlateDisplay();
    }
    
    updateForm() {
        const data = this.plateData[this.selectedPlate];
        
        this.arabicLettersInput.value = data.arabicLetters;
        this.englishLettersInput.value = data.englishLetters;
        this.arabicNumbersInput.value = data.arabicNumbers;
        this.englishNumbersInput.value = data.englishNumbers;
        
        this.selectedPlateLabel.textContent = `اللوحة النشطة: ${this.selectedPlate}`;
    }
    
    updatePlateData() {
        this.plateData[this.selectedPlate] = {
            arabicLetters: this.arabicLettersInput.value,
            englishLetters: this.englishLettersInput.value,
            arabicNumbers: this.arabicNumbersInput.value,
            englishNumbers: this.englishNumbersInput.value
        };
        
        // Update all plate overlays
        this.updateAllOverlays();
    }
    
    saveCurrentData() {
        this.plateData[this.selectedPlate] = {
            arabicLetters: this.arabicLettersInput.value,
            englishLetters: this.englishLettersInput.value,
            arabicNumbers: this.arabicNumbersInput.value,
            englishNumbers: this.englishNumbersInput.value
        };
    }
    
    updateAllOverlays() {
        for (let i = 1; i <= 5; i++) {
            const data = this.plateData[i];
            
            const arabicLettersOverlay = document.getElementById(`overlayArabicLetters${i}`);
            const englishLettersOverlay = document.getElementById(`overlayEnglishLetters${i}`);
            const arabicNumbersOverlay = document.getElementById(`overlayArabicNumbers${i}`);
            const englishNumbersOverlay = document.getElementById(`overlayEnglishNumbers${i}`);
            
            if (arabicLettersOverlay) {
                arabicLettersOverlay.textContent = data.arabicLetters || 'أ ب ج';
            }
            if (englishLettersOverlay) {
                englishLettersOverlay.textContent = data.englishLetters || 'A B J';
            }
            if (arabicNumbersOverlay) {
                arabicNumbersOverlay.textContent = data.arabicNumbers || '۱۱۱۱';
            }
            if (englishNumbersOverlay) {
                englishNumbersOverlay.textContent = data.englishNumbers || '-1111';
            }
        }
    }
    
    updateMainPlateDisplay() {
        // Update main plate (always shows selected plate)
        const data = this.plateData[this.selectedPlate];
        
        const mainArabicLetters = document.getElementById('overlayArabicLetters1');
        const mainEnglishLetters = document.getElementById('overlayEnglishLetters1');
        const mainArabicNumbers = document.getElementById('overlayArabicNumbers1');
        const mainEnglishNumbers = document.getElementById('overlayEnglishNumbers1');
        
        if (mainArabicLetters) {
            mainArabicLetters.textContent = data.arabicLetters || 'أ ب ج';
        }
        if (mainEnglishLetters) {
            mainEnglishLetters.textContent = data.englishLetters || 'A B J';
        }
        if (mainArabicNumbers) {
            mainArabicNumbers.textContent = data.arabicNumbers || '۱۱۱۱';
        }
        if (mainEnglishNumbers) {
            mainEnglishNumbers.textContent = data.englishNumbers || '-1111';
        }
        
        // Update main plate label
        const mainPlateLabel = document.querySelector('.main-plate .plate-number');
        if (mainPlateLabel) {
            mainPlateLabel.textContent = `اللوحة النشطة - ${this.selectedPlate}`;
        }
    }
}

class AuctionControls {
    constructor() {
        this.status = 'idle';
        
        this.startAuctionBtn = document.getElementById('startAuction');
        this.pauseAuctionBtn = document.getElementById('pauseAuction');
        this.resumeAuctionBtn = document.getElementById('resumeAuction');
        this.endAuctionBtn = document.getElementById('endAuction');
        this.resetAuctionBtn = document.getElementById('resetAuction');
        
        this.statusDisplay = document.getElementById('auctionStatus');
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.startAuctionBtn.addEventListener('click', () => this.startAuction());
        this.pauseAuctionBtn.addEventListener('click', () => this.pauseAuction());
        this.resumeAuctionBtn.addEventListener('click', () => this.resumeAuction());
        this.endAuctionBtn.addEventListener('click', () => this.endAuction());
        this.resetAuctionBtn.addEventListener('click', () => this.resetAuction());
    }
    
    startAuction() {
        this.status = 'active';
        this.updateStatus();
        this.updateButtons();
    }
    
    pauseAuction() {
        this.status = 'paused';
        this.updateStatus();
        this.updateButtons();
    }
    
    resumeAuction() {
        this.status = 'active';
        this.updateStatus();
        this.updateButtons();
    }
    
    endAuction() {
        this.status = 'ended';
        this.updateStatus();
        this.updateButtons();
    }
    
    resetAuction() {
        this.status = 'idle';
        this.updateStatus();
        this.updateButtons();
    }
    
    updateStatus() {
        this.statusDisplay.className = 'status-value';
        
        switch (this.status) {
            case 'idle':
                this.statusDisplay.textContent = 'خامل';
                this.statusDisplay.classList.add('status-idle');
                break;
            case 'active':
                this.statusDisplay.textContent = 'نشط';
                this.statusDisplay.classList.add('status-active');
                break;
            case 'paused':
                this.statusDisplay.textContent = 'متوقف';
                this.statusDisplay.classList.add('status-paused');
                break;
            case 'ended':
                this.statusDisplay.textContent = 'منتهي';
                this.statusDisplay.classList.add('status-ended');
                break;
        }
    }
    
    updateButtons() {
        switch (this.status) {
            case 'idle':
                this.startAuctionBtn.disabled = false;
                this.pauseAuctionBtn.disabled = true;
                this.resumeAuctionBtn.disabled = true;
                this.endAuctionBtn.disabled = true;
                break;
            case 'active':
                this.startAuctionBtn.disabled = true;
                this.pauseAuctionBtn.disabled = false;
                this.resumeAuctionBtn.disabled = true;
                this.endAuctionBtn.disabled = false;
                break;
            case 'paused':
                this.startAuctionBtn.disabled = true;
                this.pauseAuctionBtn.disabled = true;
                this.resumeAuctionBtn.disabled = false;
                this.endAuctionBtn.disabled = false;
                break;
            case 'ended':
                this.startAuctionBtn.disabled = true;
                this.pauseAuctionBtn.disabled = true;
                this.resumeAuctionBtn.disabled = true;
                this.endAuctionBtn.disabled = true;
                break;
        }
    }
}

class BidManager {
    constructor() {
        this.currentBidInput = document.getElementById('currentBid');
        this.minIncrementInput = document.getElementById('minIncrement');
        this.currentBidderInput = document.getElementById('currentBidder');
        
        this.displayCurrentBid = document.getElementById('displayCurrentBid');
        this.displayMinIncrement = document.getElementById('displayMinIncrement');
        this.displayBidder = document.getElementById('displayBidder');
        
        this.quickBidBtn = document.getElementById('quickBid');
        this.quickBid500Btn = document.getElementById('quickBid500');
        this.quickBid1000Btn = document.getElementById('quickBid1000');
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.currentBidInput.addEventListener('input', () => this.updateDisplay());
        this.minIncrementInput.addEventListener('input', () => this.updateDisplay());
        this.currentBidderInput.addEventListener('input', () => this.updateDisplay());
        
        this.quickBidBtn.addEventListener('click', () => this.quickBid(100));
        this.quickBid500Btn.addEventListener('click', () => this.quickBid(500));
        this.quickBid1000Btn.addEventListener('click', () => this.quickBid(1000));
    }
    
    updateDisplay() {
        const currentBid = parseInt(this.currentBidInput.value) || 0;
        const minIncrement = parseInt(this.minIncrementInput.value) || 100;
        const bidder = this.currentBidderInput.value || '-';
        
        this.displayCurrentBid.textContent = 'SAR ' + currentBid.toLocaleString();
        this.displayMinIncrement.textContent = 'SAR ' + minIncrement.toLocaleString();
        this.displayBidder.textContent = bidder;
    }
    
    quickBid(amount) {
        const currentBid = parseInt(this.currentBidInput.value) || 0;
        const newBid = currentBid + amount;
        this.currentBidInput.value = newBid;
        this.updateDisplay();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const plateManager = new PlateManager();
    const auctionControls = new AuctionControls();
    
    // Initial overlay update
    plateManager.updateAllOverlays();
});
