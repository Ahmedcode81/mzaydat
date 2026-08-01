// Auction Control Panel JavaScript
// Saudi License Plate Auction System

class AuctionTimer {
    constructor(auctionControls = null) {
        this.totalSeconds = 0;
        this.intervalId = null;
        this.isRunning = false;
        this.isPaused = false;
        this.auctionControls = auctionControls;
        this.startTime = null;
        
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.durationInput = document.getElementById('timerDuration');
        
        this.startBtn = document.getElementById('startTimer');
        this.pauseBtn = document.getElementById('pauseTimer');
        this.resumeBtn = document.getElementById('resumeTimer');
        this.resetBtn = document.getElementById('resetTimer');
        
        this.loadTimerState();
        this.bindEvents();
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resumeBtn.addEventListener('click', () => this.resume());
        this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    start() {
        if (this.isRunning) return;
        
        const minutes = parseInt(this.durationInput.value) || 5;
        this.totalSeconds = minutes * 60;
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        
        this.updateDisplay();
        this.saveTimerState();
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.resumeBtn.disabled = true;
        this.durationInput.disabled = true;
        
        this.intervalId = setInterval(() => this.tick(), 1000);
    }
    
    tick() {
        if (this.totalSeconds > 0) {
            this.totalSeconds--;
            this.updateDisplay();
            this.saveTimerState();
            
            // Alert when less than 30 seconds
            if (this.totalSeconds <= 30 && this.totalSeconds > 0) {
                this.timerDisplay.classList.add('alert');
            }
        } else {
            this.timeUp();
        }
    }
    
    pause() {
        if (!this.isRunning || this.isPaused) return;
        
        this.isPaused = true;
        clearInterval(this.intervalId);
        this.saveTimerState();
        
        this.pauseBtn.disabled = true;
        this.resumeBtn.disabled = false;
    }
    
    resume() {
        if (!this.isRunning || !this.isPaused) return;
        
        this.isPaused = false;
        this.intervalId = setInterval(() => this.tick(), 1000);
        this.saveTimerState();
        
        this.pauseBtn.disabled = false;
        this.resumeBtn.disabled = true;
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = null;
        clearInterval(this.intervalId);
        
        this.totalSeconds = 0;
        this.updateDisplay();
        this.clearTimerState();
        
        this.timerDisplay.classList.remove('alert');
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.resumeBtn.disabled = true;
        this.durationInput.disabled = false;
    }
    
    timeUp() {
        this.playNotificationSound();
        this.timerDisplay.classList.add('alert');
        
        // Automatically end the auction
        if (this.auctionControls) {
            this.auctionControls.endAuction();
        } else {
            this.reset();
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.totalSeconds / 60);
        const seconds = this.totalSeconds % 60;
        
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    saveTimerState() {
        const state = {
            totalSeconds: this.totalSeconds,
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            startTime: this.startTime,
            duration: this.durationInput.value
        };
        localStorage.setItem('auctionTimerState', JSON.stringify(state));
    }
    
    loadTimerState() {
        const savedState = localStorage.getItem('auctionTimerState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                
                // Check if the timer was running and calculate elapsed time
                if (state.isRunning && !state.isPaused && state.startTime) {
                    const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
                    this.totalSeconds = Math.max(0, state.totalSeconds - elapsedSeconds);
                    
                    if (this.totalSeconds > 0) {
                        this.isRunning = true;
                        this.isPaused = false;
                        this.startTime = state.startTime;
                        this.durationInput.value = state.duration;
                        
                        this.updateDisplay();
                        this.startBtn.disabled = true;
                        this.pauseBtn.disabled = false;
                        this.resumeBtn.disabled = true;
                        this.durationInput.disabled = true;
                        
                        // Resume the countdown
                        this.intervalId = setInterval(() => this.tick(), 1000);
                    } else {
                        // Timer expired while page was closed
                        this.totalSeconds = 0;
                        this.updateDisplay();
                        this.clearTimerState();
                    }
                } else if (state.isPaused) {
                    // Timer was paused, restore paused state
                    this.totalSeconds = state.totalSeconds;
                    this.isRunning = true;
                    this.isPaused = true;
                    this.durationInput.value = state.duration;
                    
                    this.updateDisplay();
                    this.startBtn.disabled = true;
                    this.pauseBtn.disabled = true;
                    this.resumeBtn.disabled = false;
                    this.durationInput.disabled = true;
                }
            } catch (e) {
                console.log('Error loading timer state:', e);
                this.clearTimerState();
            }
        }
    }
    
    clearTimerState() {
        localStorage.removeItem('auctionTimerState');
    }
    
    playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

class PlateOverlay {
    constructor() {
        this.arabicLettersInput = document.getElementById('arabicLetters');
        this.englishLettersInput = document.getElementById('englishLetters');
        this.arabicNumbersInput = document.getElementById('arabicNumbers');
        this.englishNumbersInput = document.getElementById('englishNumbers');
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.arabicLettersInput.addEventListener('input', () => this.updateOverlay());
        this.englishLettersInput.addEventListener('input', () => this.updateOverlay());
        this.arabicNumbersInput.addEventListener('input', () => this.updateOverlay());
        this.englishNumbersInput.addEventListener('input', () => this.updateOverlay());
    }
    
    updateOverlay() {
        // Update SVG text elements for single plate
        const arabicLettersOverlay = document.getElementById('overlayArabicLetters');
        const englishLettersOverlay = document.getElementById('overlayEnglishLetters');
        const arabicNumbersOverlay = document.getElementById('overlayArabicNumbers');
        const englishNumbersOverlay = document.getElementById('overlayEnglishNumbers');
        
        if (arabicLettersOverlay) {
            arabicLettersOverlay.textContent = this.arabicLettersInput.value || 'أ ب ج';
        }
        if (englishLettersOverlay) {
            englishLettersOverlay.textContent = this.englishLettersInput.value || 'A B J';
        }
        if (arabicNumbersOverlay) {
            arabicNumbersOverlay.textContent = this.arabicNumbersInput.value || '۱۱۱۱';
        }
        if (englishNumbersOverlay) {
            englishNumbersOverlay.textContent = this.englishNumbersInput.value || '-1111';
        }
    }
}

class AuctionControls {
    constructor(timer) {
        this.timer = timer;
        this.status = 'idle';
        
        this.startAuctionBtn = document.getElementById('startAuction');
        this.pauseAuctionBtn = document.getElementById('pauseAuction');
        this.resumeAuctionBtn = document.getElementById('resumeAuction');
        this.endAuctionBtn = document.getElementById('endAuction');
        this.resetAuctionBtn = document.getElementById('resetAuction');
        this.prevPlateBtn = document.getElementById('prevPlate');
        this.nextPlateBtn = document.getElementById('nextPlate');
        
        this.statusDisplay = document.getElementById('auctionStatus');
        this.plateNumberDisplay = document.getElementById('plateNumber');
        
        this.currentPlate = 1;
        
        // Pass auctionControls reference to timer for auto-end functionality
        if (this.timer) {
            this.timer.auctionControls = this;
        }
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.startAuctionBtn.addEventListener('click', () => this.startAuction());
        this.pauseAuctionBtn.addEventListener('click', () => this.pauseAuction());
        this.resumeAuctionBtn.addEventListener('click', () => this.resumeAuction());
        this.endAuctionBtn.addEventListener('click', () => this.endAuction());
        this.resetAuctionBtn.addEventListener('click', () => this.resetAuction());
        this.prevPlateBtn.addEventListener('click', () => this.previousPlate());
        this.nextPlateBtn.addEventListener('click', () => this.nextPlate());
    }
    
    startAuction() {
        this.status = 'active';
        this.updateStatus();
        this.updateButtons();
        this.timer.start();
    }
    
    pauseAuction() {
        this.status = 'paused';
        this.updateStatus();
        this.updateButtons();
        this.timer.pause();
    }
    
    resumeAuction() {
        this.status = 'active';
        this.updateStatus();
        this.updateButtons();
        this.timer.resume();
    }
    
    endAuction() {
        this.status = 'ended';
        this.updateStatus();
        this.updateButtons();
        this.timer.reset();
    }
    
    resetAuction() {
        this.status = 'idle';
        this.updateStatus();
        this.updateButtons();
        this.timer.reset();
    }
    
    previousPlate() {
        if (this.currentPlate > 1) {
            this.currentPlate--;
            this.plateNumberDisplay.textContent = this.currentPlate;
        }
    }
    
    nextPlate() {
        this.currentPlate++;
        this.plateNumberDisplay.textContent = this.currentPlate;
    }
    
    updateStatus() {
        this.statusDisplay.textContent = this.status.charAt(0).toUpperCase() + this.status.slice(1);
        this.statusDisplay.className = 'status-value status-' + this.status;
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

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const timer = new AuctionTimer();
    const plateOverlay = new PlateOverlay();
    const auctionControls = new AuctionControls(timer);
    const bidManager = new BidManager();
    
    // Initial display update
    plateOverlay.updateOverlay();
    bidManager.updateDisplay();
});
