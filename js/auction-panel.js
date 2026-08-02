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
        
        this.arabicLettersInput = document.getElementById('arabicLetters');
        this.englishLettersInput = document.getElementById('englishLetters');
        this.arabicNumbersInput = document.getElementById('arabicNumbers');
        this.englishNumbersInput = document.getElementById('englishNumbers');
        this.selectedPlateLabel = document.getElementById('selectedPlateLabel');
        this.plateTypeSelect = document.getElementById('plateType');
        this.logoTypeSelect = document.getElementById('logoType');
        this.autoNumberConversionToggle = document.getElementById('autoNumberConversionToggle');
        this.reverseConversionToggle = document.getElementById('reverseConversionToggle');
        this.resetAllPlatesBtn = document.getElementById('resetAllPlates');
        
        this.bindEvents();
        this.updateForm();
        this.updatePlateTypeLabels();
    }
    
    bindEvents() {
        // Form input listeners
        this.arabicLettersInput.addEventListener('input', () => this.handleArabicLettersInput());
        this.englishLettersInput.addEventListener('input', () => this.handleEnglishLettersInput());
        this.arabicNumbersInput.addEventListener('input', () => this.handleArabicNumbersInput());
        this.englishNumbersInput.addEventListener('input', () => this.handleEnglishNumbersInput());
        
        // Plate type change listener
        this.plateTypeSelect.addEventListener('change', () => this.handlePlateTypeChange());
        
        // Logo type change listener
        this.logoTypeSelect.addEventListener('change', () => this.handleLogoTypeChange());
        
        // Reset all plates button listener
        this.resetAllPlatesBtn.addEventListener('click', () => this.resetAllPlateData());
        
        // Auto conversion toggle listeners
        this.autoNumberConversionToggle.addEventListener('change', () => {
            this.autoNumberConversionEnabled = this.autoNumberConversionToggle.checked;
        });
        
        this.reverseConversionToggle.addEventListener('change', () => {
            this.reverseConversionEnabled = this.reverseConversionToggle.checked;
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
        if (!this.isConvertingArabic) {
            this.isConvertingArabic = true;
            this.convertArabicToEnglish();
            this.updatePlateData();
            this.isConvertingArabic = false;
        }
    }
    
    handleEnglishLettersInput() {
        if (!this.isConvertingEnglish) {
            this.isConvertingEnglish = true;
            this.convertEnglishToArabic();
            this.updatePlateData();
            this.isConvertingEnglish = false;
        }
    }
    
    handleArabicNumbersInput() {
        if (this.reverseConversionEnabled) {
            this.convertArabicToEnglishNumbers();
        }
        this.updatePlateData();
    }
    
    handleEnglishNumbersInput() {
        if (this.autoNumberConversionEnabled) {
            this.convertEnglishToArabicNumbers();
        }
        this.updatePlateData();
    }
    
    handlePlateTypeChange() {
        this.plateData[this.selectedPlate].plateType = this.plateTypeSelect.value;
        this.updateAllOverlays();
        this.updatePlateTypeLabels();
    }
    
    handleLogoTypeChange() {
        this.plateData[this.selectedPlate].logoType = this.logoTypeSelect.value;
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
    
    convertArabicToEnglish() {
        const arabicText = this.arabicLettersInput.value;
        let englishText = '';
        
        for (let char of arabicText) {
            if (this.arabicToEnglishMap[char]) {
                englishText += this.arabicToEnglishMap[char];
            } else if (char === ' ') {
                englishText += ' ';
            }
            // Ignore characters that don't have mappings
        }
        
        this.englishLettersInput.value = englishText;
    }
    
    convertEnglishToArabic() {
        const englishText = this.englishLettersInput.value;
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
    
    convertArabicToEnglishNumbers() {
        const arabicText = this.arabicNumbersInput.value;
        let englishText = '';
        
        for (let char of arabicText) {
            if (this.arabicToEnglishNumberMap[char]) {
                englishText += this.arabicToEnglishNumberMap[char];
            } else {
                // Keep non-number characters (like hyphens) as-is
                englishText += char;
            }
        }
        
        this.englishNumbersInput.value = englishText;
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
        this.plateTypeSelect.value = data.plateType || 'private';
        this.logoTypeSelect.value = data.logoType || 'none';
        
        this.selectedPlateLabel.textContent = `اللوحة النشطة: ${this.selectedPlate}`;
    }
    
    updatePlateData() {
        this.plateData[this.selectedPlate] = {
            arabicLetters: this.arabicLettersInput.value,
            englishLetters: this.englishLettersInput.value,
            arabicNumbers: this.arabicNumbersInput.value,
            englishNumbers: this.englishNumbersInput.value,
            plateType: this.plateTypeSelect.value,
            logoType: this.logoTypeSelect.value
        };
        
        // Update all plate overlays
        this.updateAllOverlays();
    }
    
    saveCurrentData() {
        this.plateData[this.selectedPlate] = {
            arabicLetters: this.arabicLettersInput.value,
            englishLetters: this.englishLettersInput.value,
            arabicNumbers: this.arabicNumbersInput.value,
            englishNumbers: this.englishNumbersInput.value,
            plateType: this.plateTypeSelect.value,
            logoType: this.logoTypeSelect.value
        };
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
                    arabicLetters: { x: 115, y: 15.5 },
                    englishNumbers: { x: 28, y: 37.5 },
                    englishLetters: { x: 118, y: 37.5 }
                };
                
                switch (plateType) {
                    case 'private':
                        templatePath = 'plate form/plate-template.svg';
                        viewBox = '0 0 154.7 53';
                        textPositions = {
                            arabicNumbers: { x: 28, y: 15.5 },
                            arabicLetters: { x: 119, y: 15.5 },
                            englishNumbers: { x: 28, y: 37.5 },
                            englishLetters: { x: 118, y: 37.5 }
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
                
                // Console logs for debugging
                console.log('=== Plate Type Switch ===');
                console.log('Selected Plate Type:', plateType);
                console.log('Loading SVG Template:', templatePath);
                console.log('Setting viewBox:', viewBox);
                console.log('Text Positions:', textPositions);
                
                // Update SVG viewBox
                const svgElement = plateImage.closest('svg');
                if (svgElement) {
                    const oldViewBox = svgElement.getAttribute('viewBox');
                    console.log('Previous viewBox:', oldViewBox);
                    svgElement.setAttribute('viewBox', viewBox);
                    console.log('New viewBox set to:', svgElement.getAttribute('viewBox'));
                }
                
                // Update text positions
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
                
                // Update template image and remove fixed dimensions
                const oldHref = plateImage.getAttribute('href');
                console.log('Previous template:', oldHref);
                plateImage.setAttribute('href', templatePath);
                plateImage.setAttribute('width', '100%');
                plateImage.setAttribute('height', '100%');
                console.log('New template set to:', templatePath);
                console.log('Image dimensions set to 100%');
                console.log('=== End Plate Type Switch ===');
            }
            
            // Update plate logo label based on selection
            if (plateLogoLabel) {
                const logoType = data.logoType || 'none';
                const logoName = this.logoNames[logoType] || '';
                
                if (logoName) {
                    plateLogoLabel.textContent = logoName;
                    plateLogoLabel.style.display = 'block';
                } else {
                    plateLogoLabel.textContent = '';
                    plateLogoLabel.style.display = 'none';
                }
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
    const auctionControls = new AuctionControls(plateManager);
    const bidManager = new BidManager();
    
    // Initial overlay update
    plateManager.updateAllOverlays();
});
