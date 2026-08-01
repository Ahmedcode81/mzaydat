class PlateManager {
    constructor() {
        this.plates = this.loadPlates();
        this.currentPlateId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderPlateList();
    }

    loadPlates() {
        const stored = localStorage.getItem('plateTemplates');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Default plate template
        return {
            'default': {
                id: 'default',
                name: 'اللوحة السعودية الافتراضية',
                svgPath: 'plate form/plate-template.svg',
                type: 'saudi',
                category: 'standard',
                dimensions: { width: 154.7, height: 53 },
                editableAreas: {
                    arabicNumbers: { x: 28, y: 15.5, fontSize: 11, direction: 'rtl' },
                    arabicLetters: { x: 118, y: 15.5, fontSize: 11, direction: 'rtl' },
                    englishNumbers: { x: 28, y: 37.5, fontSize: 9, direction: 'ltr' },
                    englishLetters: { x: 118, y: 37.5, fontSize: 9, direction: 'ltr' }
                },
                createdAt: new Date().toISOString()
            }
        };
    }

    savePlates() {
        localStorage.setItem('plateTemplates', JSON.stringify(this.plates));
    }

    bindEvents() {
        const addPlateBtn = document.getElementById('addPlateBtn');
        const deletePlateBtn = document.getElementById('deletePlateBtn');
        const plateSelect = document.getElementById('plateTemplateSelect');
        const savePlateConfigBtn = document.getElementById('savePlateConfig');
        const cancelPlateConfigBtn = document.getElementById('cancelPlateConfig');
        const closeModalBtn = document.getElementById('closeModal');

        if (addPlateBtn) {
            addPlateBtn.addEventListener('click', () => this.showAddPlateModal());
        }

        if (deletePlateBtn) {
            deletePlateBtn.addEventListener('click', () => this.showDeleteConfirmation());
        }

        if (plateSelect) {
            plateSelect.addEventListener('change', (e) => this.selectPlate(e.target.value));
        }

        if (savePlateConfigBtn) {
            savePlateConfigBtn.addEventListener('click', () => this.savePlateConfiguration());
        }

        if (cancelPlateConfigBtn) {
            cancelPlateConfigBtn.addEventListener('click', () => this.hideAddPlateModal());
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.hideAddPlateModal());
        }

        // Close modal when clicking outside
        const modal = document.getElementById('addPlateModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAddPlateModal();
                }
            });
        }

        // SVG file upload handler
        const svgUpload = document.getElementById('svgUpload');
        if (svgUpload) {
            svgUpload.addEventListener('change', (e) => this.handleSvgUpload(e));
        }
    }

    renderPlateList() {
        const plateSelect = document.getElementById('plateTemplateSelect');
        if (!plateSelect) return;

        plateSelect.innerHTML = '';
        
        Object.keys(this.plates).forEach(plateId => {
            const plate = this.plates[plateId];
            const option = document.createElement('option');
            option.value = plateId;
            option.textContent = plate.name;
            plateSelect.appendChild(option);
        });

        // Select first plate by default
        if (Object.keys(this.plates).length > 0) {
            this.selectPlate(Object.keys(this.plates)[0]);
        }
    }

    selectPlate(plateId) {
        this.currentPlateId = plateId;
        const plate = this.plates[plateId];
        
        if (plate) {
            this.loadPlateConfiguration(plate);
        }
    }

    loadPlateConfiguration(plate) {
        // Load configuration into form
        const plateName = document.getElementById('plateName');
        const plateType = document.getElementById('plateType');
        const plateCategory = document.getElementById('plateCategoryConfig');
        const plateWidth = document.getElementById('plateWidth');
        const plateHeight = document.getElementById('plateHeight');

        if (plateName) plateName.value = plate.name;
        if (plateType) plateType.value = plate.type;
        if (plateCategory) plateCategory.value = plate.category;
        if (plateWidth) plateWidth.value = plate.dimensions.width;
        if (plateHeight) plateHeight.value = plate.dimensions.height;

        // Load editable areas
        this.loadEditableAreas(plate.editableAreas);
    }

    loadEditableAreas(editableAreas) {
        const areas = ['arabicNumbers', 'arabicLetters', 'englishNumbers', 'englishLetters'];
        
        areas.forEach(area => {
            const config = editableAreas[area] || {};
            const xInput = document.getElementById(`${area}X`);
            const yInput = document.getElementById(`${area}Y`);
            const fontSizeInput = document.getElementById(`${area}FontSize`);

            if (xInput) xInput.value = config.x || '';
            if (yInput) yInput.value = config.y || '';
            if (fontSizeInput) fontSizeInput.value = config.fontSize || '';
        });
    }

    showAddPlateModal() {
        const modal = document.getElementById('addPlateModal');
        if (modal) {
            modal.style.display = 'flex';
            // Clear form
            document.getElementById('plateName').value = '';
            document.getElementById('svgUpload').value = '';
        }
    }

    hideAddPlateModal() {
        const modal = document.getElementById('addPlateModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    handleSvgUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.uploadedSvgContent = e.target.result;
                this.uploadedSvgFileName = file.name;
                // Show preview
                const preview = document.getElementById('svgPreview');
                if (preview) {
                    preview.innerHTML = e.target.result;
                }
            };
            reader.readAsText(file);
        } else {
            alert('يرجى رفع ملف SVG صالح');
        }
    }

    savePlateConfiguration() {
        const plateName = document.getElementById('plateName').value.trim();
        const plateType = document.getElementById('plateType').value;
        const plateCategory = document.getElementById('plateCategoryConfig').value;
        const plateWidth = parseFloat(document.getElementById('plateWidth').value);
        const plateHeight = parseFloat(document.getElementById('plateHeight').value);

        if (!plateName) {
            alert('يرجى إدخال اسم اللوحة');
            return;
        }

        // Generate unique ID
        const plateId = 'plate_' + Date.now();

        // Collect editable areas
        const editableAreas = {
            arabicNumbers: {
                x: parseFloat(document.getElementById('arabicNumbersX').value) || 28,
                y: parseFloat(document.getElementById('arabicNumbersY').value) || 15.5,
                fontSize: parseFloat(document.getElementById('arabicNumbersFontSize').value) || 11,
                direction: 'rtl'
            },
            arabicLetters: {
                x: parseFloat(document.getElementById('arabicLettersX').value) || 118,
                y: parseFloat(document.getElementById('arabicLettersY').value) || 15.5,
                fontSize: parseFloat(document.getElementById('arabicLettersFontSize').value) || 11,
                direction: 'rtl'
            },
            englishNumbers: {
                x: parseFloat(document.getElementById('englishNumbersX').value) || 28,
                y: parseFloat(document.getElementById('englishNumbersY').value) || 37.5,
                fontSize: parseFloat(document.getElementById('englishNumbersFontSize').value) || 9,
                direction: 'ltr'
            },
            englishLetters: {
                x: parseFloat(document.getElementById('englishLettersX').value) || 118,
                y: parseFloat(document.getElementById('englishLettersY').value) || 37.5,
                fontSize: parseFloat(document.getElementById('englishLettersFontSize').value) || 9,
                direction: 'ltr'
            }
        };

        // Save SVG file if uploaded
        let svgPath = 'plate form/plate-template.svg';
        if (this.uploadedSvgContent) {
            svgPath = this.saveSvgFile(this.uploadedSvgFileName, this.uploadedSvgContent);
        }

        // Create plate configuration
        const newPlate = {
            id: plateId,
            name: plateName,
            svgPath: svgPath,
            type: plateType,
            category: plateCategory,
            dimensions: { width: plateWidth, height: plateHeight },
            editableAreas: editableAreas,
            createdAt: new Date().toISOString()
        };

        this.plates[plateId] = newPlate;
        this.savePlates();
        this.renderPlateList();
        this.hideAddPlateModal();
        
        alert('تم إضافة اللوحة بنجاح');
        
        // Clear uploaded SVG
        this.uploadedSvgContent = null;
        this.uploadedSvgFileName = null;
    }

    saveSvgFile(fileName, content) {
        // In a real application, this would upload to a server
        // For now, we'll store the path
        const path = 'plate form/' + fileName;
        return path;
    }

    showDeleteConfirmation() {
        const plateSelect = document.getElementById('plateTemplateSelect');
        const selectedId = plateSelect ? plateSelect.value : null;
        
        if (!selectedId || selectedId === 'default') {
            alert('لا يمكن حذف اللوحة الافتراضية');
            return;
        }

        const plate = this.plates[selectedId];
        if (!plate) {
            alert('اللوحة المحددة غير موجودة');
            return;
        }

        const confirmed = confirm(`هل أنت متأكد من حذف اللوحة "${plate.name}"؟\n\nلا يمكن التراجع عن هذا الإجراء.`);
        
        if (confirmed) {
            this.deletePlate(selectedId);
        }
    }

    deletePlate(plateId) {
        if (plateId === 'default') {
            alert('لا يمكن حذف اللوحة الافتراضية');
            return;
        }

        delete this.plates[plateId];
        this.savePlates();
        this.renderPlateList();
        
        // Select first available plate
        const remainingPlates = Object.keys(this.plates);
        if (remainingPlates.length > 0) {
            this.selectPlate(remainingPlates[0]);
        }
        
        alert('تم حذف اللوحة بنجاح');
    }

    getPlate(plateId) {
        return this.plates[plateId];
    }

    getAllPlates() {
        return this.plates;
    }
}

// Initialize plate manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.plateManager = new PlateManager();
    });
} else {
    window.plateManager = new PlateManager();
}
