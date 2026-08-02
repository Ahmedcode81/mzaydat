// Auction Control Panel JavaScript
// Saudi License Plate Auction System

class PlateManager {
    constructor() {
        this.selectedPlate = 1;
        this.plateData = {};
        this.autoNumberConversionEnabled = false;
        this.reverseConversionEnabled = false;
        
        // Logo name mapping
        this.logoNames = {
            'none': '',
            'al-diriyah': 'الدرعية',
            'vision': 'رؤية 2030',
            'alula': 'العلا',
            'black-palm': 'النخلة السوداء',
            'green-palm': 'النخلة الخضراء'
        };
        
        // English to Arabic number mapping
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
        
        // Arabic to English letter mapping for Saudi license plates
        this.arabicToEnglishMap = {
            'ا': 'A',
            'ب': 'B',
            'ح': 'J',
            'د': 'D',
            'ر': 'R',
            'س': 'S',
            'ص': 'X',
            'ط': 'T',
            'ع': 'E',
            'ق': 'G',
            'ك': 'K',
            'ل': 'L',
            'م': 'Z',
            'ن': 'N',
            'هـ': 'H',
            'ه': 'h',
            'و': 'U',
            'ي': 'V',
            'ى': 'v'
        };
        
        // English to Arabic letter mapping for Saudi license plates (reverse mapping)
        this.englishToArabicMap = {
            'A': 'ا',
            'a': 'ا',
            'B': 'ب',
            'b': 'ب',
            'J': 'ح',
            'j': 'ح',
            'D': 'د',
            'd': 'د',
            'R': 'ر',
            'r': 'ر',
            'S': 'س',
            's': 'س',
            'X': 'ص',
            'x': 'ص',
            'T': 'ط',
            't': 'ط',
            'E': 'ع',
            'e': 'ع',
            'G': 'ق',
            'g': 'ق',
            'K': 'ك',
            'k': 'ك',
            'L': 'ل',
            'l': 'ل',
            'Z': 'م',
            'z': 'م',
            'H': 'ه',
            'h': 'ه',
            'U': 'و',
            'u': 'و',
            'V': 'ي',
            'v': 'ى'
        };
        
        // Flags to prevent infinite conversion loops
        this.isConvertingArabic = false;
        this.isConvertingEnglish = false;
        
        // Arabic-Indic to English number mapping (reverse conversion)
        this.arabicToEnglishNumberMap = {
            '٠': '0',
            '١': '1',
            '٢': '2',
            '٣': '3',
            '٤': '4',
            '٥': '5',
            '٦': '6',
            '٧': '7',
            '٨': '8',
            '٩': '9'
        };
        
        // Initialize plate data
        for (let i = 1; i <= 5; i++) {
            this.plateData[i] = {
                arabicLetters: 'أ ب ج',
                englishLetters: 'A B J',
                arabicNumbers: '۱۱۱۱',
                englishNumbers: '-1111',
                plateType: 'private',
                logoType: 'none'
            };
        }
        
        // Store references to all plate inputs
        this.plateInputs = {};
        for (let i = 1; i <= 5; i++) {
            this.plateInputs[i] = {
                arabicLetters: document.getElementById(`arabicLetters${i}`),
                englishLetters: document.getElementById(`englishLetters${i}`),
                arabicNumbers: document.getElementById(`arabicNumbers${i}`),
                englishNumbers: document.getElementById(`englishNumbers${i}`),
                plateType: document.getElementById(`plateType${i}`),
                logoType: document.getElementById(`logoType${i}`)
            };
        }
        
        this.autoNumberConversionToggle = document.getElementById('autoNumberConversionToggle');
        this.resetAllPlatesBtn = document.getElementById('resetAllPlates');
        
        this.bindEvents();
        this.updateForm();
        this.updatePlateTypeLabels();
    }
    
    bindEvents() {
        // Bind events for each plate's inputs
        for (let i = 1; i <= 5; i++) {
            const inputs = this.plateInputs[i];
            
            // Arabic letters input
            inputs.arabicLetters.addEventListener('input', () => this.handleArabicLettersInput(i));
            
            // English letters input
            inputs.englishLetters.addEventListener('input', () => this.handleEnglishLettersInput(i));
            
            // Arabic numbers input
            inputs.arabicNumbers.addEventListener('input', () => this.handleArabicNumbersInput(i));
            
            // English numbers input
            inputs.englishNumbers.addEventListener('input', () => this.handleEnglishNumbersInput(i));
            
            // Plate type change
            inputs.plateType.addEventListener('change', () => this.handlePlateTypeChange(i));
            
            // Logo type change
            inputs.logoType.addEventListener('change', () => this.handleLogoTypeChange(i));
        }
        
        // Reset all plates button listener
        this.resetAllPlatesBtn.addEventListener('click', () => this.resetAllPlateData());
        
        // Auto conversion toggle listeners
        this.autoNumberConversionToggle.addEventListener('change', () => {
            this.autoNumberConversionEnabled = this.autoNumberConversionToggle.checked;
        });
        
        // Plate click listeners (for visual selection only)
        document.querySelectorAll('.plate-item').forEach(plate => {
            plate.addEventListener('click', (e) => {
                const plateNumber = parseInt(plate.dataset.plate);
                this.highlightPlate(plateNumber);
            });
        });
    }
    
    handleArabicLettersInput(plateNumber) {
        if (!this.isConvertingArabic) {
            this.isConvertingArabic = true;
            this.convertArabicToEnglish(plateNumber);
            this.updatePlateData(plateNumber);
            this.isConvertingArabic = false;
        }
    }
    
    handleEnglishLettersInput(plateNumber) {
        if (!this.isConvertingEnglish) {
            this.isConvertingEnglish = true;
            this.convertEnglishToArabic(plateNumber);
            this.updatePlateData(plateNumber);
            this.isConvertingEnglish = false;
        }
    }
    
    handleArabicNumbersInput(plateNumber) {
        this.updatePlateData(plateNumber);
    }
    
    handleEnglishNumbersInput(plateNumber) {
        if (this.autoNumberConversionEnabled) {
            this.convertEnglishToArabicNumbers(plateNumber);
        }
        this.updatePlateData(plateNumber);
    }
    
    handlePlateTypeChange(plateNumber) {
        this.plateData[plateNumber].plateType = this.plateInputs[plateNumber].plateType.value;
        this.updateAllOverlays();
        this.updatePlateTypeLabels();
    }
    
    handleLogoTypeChange(plateNumber) {
        this.plateData[plateNumber].logoType = this.plateInputs[plateNumber].logoType.value;
        this.updateAllOverlays();
    }
    
    updatePlateTypeLabels() {
        const typeNames = {
            'private': 'خصوصي',
            'transport': 'نقل',
            'large-private': 'خصوصي كبير',
            'vision': 'الرؤية',
            'golden-swords': 'سيفين ذهبي',
            'tuwaiq': 'جبل طويق',
            'alula': 'العلا'
        };
        
        for (let i = 1; i <= 5; i++) {
            const plateType = this.plateData[i].plateType || 'private';
            const label = document.getElementById(`plateTypeLabel${i}`);
            if (label) {
                label.textContent = typeNames[plateType] || 'خصوصي';
            }
        }
    }
    
    resetAllPlateData() {
        // Reset all plate data to empty values
        for (let i = 1; i <= 5; i++) {
            this.plateData[i] = {
                arabicLetters: '',
                englishLetters: '',
                arabicNumbers: '',
                englishNumbers: '',
                plateType: 'private',
                logoType: 'none'
            };
        }
        
        // Reset selected plate to 1
        this.selectedPlate = 1;
        
        // Update all displays
        this.updateForm();
        this.updateAllOverlays();
        this.updatePlateTypeLabels();
        this.updateMainPlateDisplay();
        
        // Reset plate selection UI
        document.querySelectorAll('.plate-item').forEach(item => {
            item.classList.remove('selected');
        });
        const mainPlate = document.querySelector('.plate-item[data-plate="1"]');
        if (mainPlate) {
            mainPlate.classList.add('selected');
        }
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
    
    convertArabicToEnglish(plateNumber) {
        const arabicText = this.plateInputs[plateNumber].arabicLetters.value;
        let englishText = '';
        
        for (let char of arabicText) {
            if (this.arabicToEnglishMap[char]) {
                englishText += this.arabicToEnglishMap[char];
            } else if (char === ' ') {
                englishText += ' ';
            }
            // Ignore characters that don't have mappings
        }
        
        this.plateInputs[plateNumber].englishLetters.value = englishText;
    }
    
    convertEnglishToArabic(plateNumber) {
        const englishText = this.plateInputs[plateNumber].englishLetters.value;
        let arabicText = '';
        
        for (let char of englishText) {
            if (this.englishToArabicMap[char]) {
                arabicText += this.englishToArabicMap[char];
            } else if (char === ' ') {
                arabicText += ' ';
            }
            // Ignore characters that don't have mappings
        }
        
        this.plateInputs[plateNumber].arabicLetters.value = arabicText;
    }
    
    convertArabicToEnglishNumbers(plateNumber) {
        const arabicText = this.plateInputs[plateNumber].arabicNumbers.value;
        let englishText = '';
        
        for (let char of arabicText) {
            if (this.arabicToEnglishNumberMap[char]) {
                englishText += this.arabicToEnglishNumberMap[char];
            } else {
                // Keep non-number characters (like hyphens) as-is
                englishText += char;
            }
        }
        
        this.plateInputs[plateNumber].englishNumbers.value = englishText;
    }
    
    convertEnglishToArabicNumbers(plateNumber) {
        const englishText = this.plateInputs[plateNumber].englishNumbers.value;
        let arabicText = '';
        
        const englishToArabicNumberMap = {
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
        
        for (let char of englishText) {
            if (englishToArabicNumberMap[char]) {
                arabicText += englishToArabicNumberMap[char];
            } else {
                // Keep non-number characters (like hyphens) as-is
                arabicText += char;
            }
        }
        
        this.plateInputs[plateNumber].arabicNumbers.value = arabicText;
    }
    
    selectPlate(plateNumber) {
        // Update visual selection for highlighting only
        this.highlightPlate(plateNumber);
    }
    
    updateForm() {
        // Update all plate forms with their respective data
        for (let i = 1; i <= 5; i++) {
            const data = this.plateData[i];
            const inputs = this.plateInputs[i];
            
            inputs.arabicLetters.value = data.arabicLetters;
            inputs.englishLetters.value = data.englishLetters;
            inputs.arabicNumbers.value = data.arabicNumbers;
            inputs.englishNumbers.value = data.englishNumbers;
            inputs.plateType.value = data.plateType || 'private';
            inputs.logoType.value = data.logoType || 'none';
        }
    }
    
    updatePlateData(plateNumber) {
        const inputs = this.plateInputs[plateNumber];
        
        this.plateData[plateNumber] = {
            arabicLetters: inputs.arabicLetters.value,
            englishLetters: inputs.englishLetters.value,
            arabicNumbers: inputs.arabicNumbers.value,
            englishNumbers: inputs.englishNumbers.value,
            plateType: inputs.plateType.value,
            logoType: inputs.logoType.value
        };
        
        // Update all plate overlays
        this.updateAllOverlays();
    }
    
    saveCurrentData() {
        // Save all plate data from their respective inputs
        for (let i = 1; i <= 5; i++) {
            const inputs = this.plateInputs[i];
            
            this.plateData[i] = {
                arabicLetters: inputs.arabicLetters.value,
                englishLetters: inputs.englishLetters.value,
                arabicNumbers: inputs.arabicNumbers.value,
                englishNumbers: inputs.englishNumbers.value,
                plateType: inputs.plateType.value,
                logoType: inputs.logoType.value
            };
        }
        
        // Update all plate overlays
        this.updateAllOverlays();
    }
    
    updateAllOverlays() {
        for (let i = 1; i <= 5; i++) {
            const data = this.plateData[i];
            
            const arabicLettersOverlay = document.getElementById(`overlayArabicLetters${i}`);
            const englishLettersOverlay = document.getElementById(`overlayEnglishLetters${i}`);
            const arabicNumbersOverlay = document.getElementById(`overlayArabicNumbers${i}`);
            const englishNumbersOverlay = document.getElementById(`overlayEnglishNumbers${i}`);
            const plateImage = document.querySelector(`.plate-item[data-plate="${i}"] image`);
            const plateLogoLabel = document.getElementById(`plateLogoLabel${i}`);
            
            if (arabicLettersOverlay) {
                arabicLettersOverlay.textContent = data.arabicLetters;
            }
            if (englishLettersOverlay) {
                englishLettersOverlay.textContent = data.englishLetters;
            }
            if (arabicNumbersOverlay) {
                arabicNumbersOverlay.textContent = data.arabicNumbers;
            }
            if (englishNumbersOverlay) {
                englishNumbersOverlay.textContent = data.englishNumbers;
            }
            
            // Update plate template based on type
            if (plateImage) {
                const plateType = data.plateType || 'private';
                let templatePath = 'plate form/plate-template.svg';
                let viewBox = '0 0 154.7 53';
                let textPositions = {
                    arabicNumbers: { x: 28, y: 15.5 },
                    arabicLetters: { x: 123, y: 15.5 },
                    englishNumbers: { x: 28, y: 37.5 },
                    englishLetters: { x: 123, y: 37.5 }
                };
                
                switch (plateType) {
                    case 'private':
                        templatePath = 'plate form/plate-template.svg';
                        viewBox = '0 0 154.7 53';
                        textPositions = {
                            arabicNumbers: { x: 28, y: 15.5 },
                            arabicLetters: { x: 123, y: 15.5 },
                            englishNumbers: { x: 28, y: 37.5 },
                            englishLetters: { x: 123, y: 37.5 }
                        };
                        break;
                    case 'transport':
                        templatePath = 'plate form/plate-template-transport.svg';
                        viewBox = '0 0 154 80';
                        textPositions = {
                            arabicNumbers: { x: 28, y: 20 },
                            arabicLetters: { x: 115, y: 20 },
                            englishNumbers: { x: 28, y: 55 },
                            englishLetters: { x: 118, y: 55 }
                        };
                        break;
                    case 'large-private':
                        templatePath = 'plate form/plate-template-large-private.svg';
                        viewBox = '0 0 198.4 44';
                        textPositions = {
                            arabicNumbers: { x: 25, y: 12 },
                            arabicLetters: { x: 160, y: 12 },
                            englishNumbers: { x: 25, y: 32 },
                            englishLetters: { x: 160, y: 32 }
                        };
                        break;
                    case 'vision':
                        templatePath = 'plate form/plate-template-vision.svg';
                        viewBox = '0 0 198.4 50';
                        textPositions = {
                            arabicNumbers: { x: 30, y: 15 },
                            arabicLetters: { x: 144, y: 15 },
                            englishNumbers: { x: 30, y: 35 },
                            englishLetters: { x: 144, y: 35 }
                        };
                        break;
                    case 'golden-swords':
                        templatePath = 'plate form/plate-template-golden-swords.svg';
                        viewBox = '0 0 241.9 67';
                        textPositions = {
                            arabicNumbers: { x: 40, y: 20 },
                            arabicLetters: { x: 180, y: 20 },
                            englishNumbers: { x: 40, y: 45 },
                            englishLetters: { x: 180, y: 45 }
                        };
                        break;
                    case 'tuwaiq':
                        templatePath = 'plate form/plate-template-tuwaiq.svg';
                        viewBox = '0 0 184.7 52';
                        textPositions = {
                            arabicNumbers: { x: 25, y: 14 },
                            arabicLetters: { x: 165, y: 14 },
                            englishNumbers: { x: 25, y: 34 },
                            englishLetters: { x: 165, y: 34 }
                        };
                        break;
                    case 'alula':
                        templatePath = 'plate form/plate-template-alula.svg';
                        viewBox = '0 0 211.5 52.4';
                        textPositions = {
                            arabicNumbers: { x: 35, y: 15 },
                            arabicLetters: { x: 160, y: 15 },
                            englishNumbers: { x: 35, y: 37 },
                            englishLetters: { x: 160, y: 37 }
                        };
                        break;
                }
                
                plateImage.setAttribute('href', templatePath);
                plateImage.setAttribute('width', '100%');
                plateImage.setAttribute('height', '100%');
                
                const svgContainer = plateImage.closest('svg');
                if (svgContainer) {
                    svgContainer.setAttribute('viewBox', viewBox);
                }
                
                if (arabicNumbersOverlay) {
                    console.log('Arabic Numbers position:', textPositions.arabicNumbers.x, textPositions.arabicNumbers.y);
                    arabicNumbersOverlay.setAttribute('x', textPositions.arabicNumbers.x);
                    arabicNumbersOverlay.setAttribute('y', textPositions.arabicNumbers.y);
                }
                if (arabicLettersOverlay) {
                    console.log('Arabic Letters position:', textPositions.arabicLetters.x, textPositions.arabicLetters.y);
                    arabicLettersOverlay.setAttribute('x', textPositions.arabicLetters.x);
                    arabicLettersOverlay.setAttribute('y', textPositions.arabicLetters.y);
                }
                if (englishNumbersOverlay) {
                    console.log('English Numbers position:', textPositions.englishNumbers.x, textPositions.englishNumbers.y);
                    englishNumbersOverlay.setAttribute('x', textPositions.englishNumbers.x);
                    englishNumbersOverlay.setAttribute('y', textPositions.englishNumbers.y);
                }
                if (englishLettersOverlay) {
                    console.log('English Letters position:', textPositions.englishLetters.x, textPositions.englishLetters.y);
                    englishLettersOverlay.setAttribute('x', textPositions.englishLetters.x);
                    englishLettersOverlay.setAttribute('y', textPositions.englishLetters.y);
                }
            }
            
            if (plateLogoLabel) {
                plateLogoLabel.textContent = data.logoType || '';
            }
        }
        
        // Update main plate (always shows selected plate)
        const data = this.plateData[1];
        
        const mainArabicLetters = document.getElementById('overlayArabicLetters1');
        const mainEnglishLetters = document.getElementById('overlayEnglishLetters1');
        const mainArabicNumbers = document.getElementById('overlayArabicNumbers1');
        const mainEnglishNumbers = document.getElementById('overlayEnglishNumbers1');
        
        if (mainArabicLetters) {
            mainArabicLetters.textContent = data.arabicLetters;
        }
        if (mainEnglishLetters) {
            mainEnglishLetters.textContent = data.englishLetters;
        }
        if (mainArabicNumbers) {
            mainArabicNumbers.textContent = data.arabicNumbers;
        }
        if (mainEnglishNumbers) {
            mainEnglishNumbers.textContent = data.englishNumbers;
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
    const auctionControls = new AuctionControls(plateManager);
    const bidManager = new BidManager();
    
    // Initial overlay update
    plateManager.updateAllOverlays();
});
