export const SpellModalStyles = `
.spell-modal-container {
    max-height: 80vh;
    overflow-y: auto;
    padding-right: 10px;
    /* CHANGE: Unified font for all content */
    font-family: var(--font-interface);
    font-size: var(--font-ui-small);
}

.spell-modal-container::-webkit-scrollbar {
    width: 8px;
}

.spell-modal-container::-webkit-scrollbar-track {
    background: var(--background-secondary);
    border-radius: 4px;
}

.spell-modal-container::-webkit-scrollbar-thumb {
    background: var(--background-modifier-border);
    border-radius: 4px;
}

.spell-modal-container::-webkit-scrollbar-thumb:hover {
    background: var(--interactive-accent);
}

/* CHANGE: Centering section headers like in Creature modal */
.mod-spell-creation .section-title {
    text-align: center !important;
    width: 100% !important;
    margin: 20px 0 15px 0 !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    padding-bottom: 8px !important;
}

/* CHANGE: Styles for sections like in Creature modal */
.mod-spell-creation .creature-section {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--background-modifier-border);
}

/* NEW: Styles for casting trigger container */
.casting-trigger-container {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-secondary);
    transition: all 0.3s ease;
}

/* CHANGE: Container for buttons with correct margins */
.spell-button-container {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid var(--background-modifier-border);
}

.selected-classes-container {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-secondary);
}

.selected-values-title {
    font-weight: bold;
    margin-bottom: 5px;
    color: var(--text-normal);
    font-size: 14px;
    /* CHANGE: Unified font */
    font-family: var(--font-interface);
}

.selected-values-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.selected-value-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    background: var(--background-primary);
    border-radius: 3px;
    border: 1px solid var(--background-modifier-border);
    font-size: 13px;
    /* CHANGE: Unified font */
    font-family: var(--font-interface);
}

.selected-value-remove {
    background: var(--background-modifier-error);
    color: white;
    border: none;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    cursor: pointer;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    /* CHANGE: Unified font */
    font-family: var(--font-interface);
}

.selected-value-remove:hover {
    background: var(--background-modifier-error-hover);
}

.components-section {
    margin: 15px 0;
    padding: 15px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-secondary);
}

.components-section h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: var(--text-normal);
}

.verbal-description-container,
.material-description-container {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
}

.description-section {
    margin: 15px 0;
}

/* CHANGE: Added styles for text areas with fixed size */
.verbal-textarea,
.material-textarea,
.spell-description-textarea,
.cantrip-upgrade-textarea {
    resize: none !important;
    min-height: 60px !important;
    width: 100% !important;
    font-family: var(--font-interface) !important;
    font-size: var(--font-ui-small) !important;
}

/* CHANGE: Unified styles for all text input fields */
.spell-text-input,
.spell-dropdown,
.spell-textarea {
    font-family: var(--font-interface) !important;
    font-size: var(--font-ui-small) !important;
}

.spell-section-divider {
    border: none;
    border-top: 1px solid var(--background-modifier-border);
    margin: 20px 0;
}

/* Styles for checkboxes and toggles */
.spell-toggle-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 5px 0;
}

.spell-toggle-label {
    font-size: 14px;
    color: var(--text-normal);
    /* CHANGE: Unified font */
    font-family: var(--font-interface);
}

/* Styles for dropdowns */
.spell-dropdown {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    color: var(--text-normal);
}

.spell-dropdown:focus {
    border-color: var(--interactive-accent);
    outline: none;
}

/* Styles for text fields */
.spell-text-input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    color: var(--text-normal);
}

.spell-text-input:focus {
    border-color: var(--interactive-accent);
    outline: none;
}

/* Styles for section headers */
.spell-section-title {
    color: var(--text-accent);
    border-bottom: 2px solid var(--background-modifier-border);
    padding-bottom: 5px;
    margin: 20px 0 15px 0;
    font-size: 16px;
    font-weight: 600;
    /* EXCEPTION: Headers remain unchanged */
}

/* CHANGE: Unified styles for all Setting elements */
.setting-item-name,
.setting-item-description {
    font-family: var(--font-interface) !important;
    font-size: var(--font-ui-small) !important;
}

/* CHANGE: Unified styles for buttons */
.mod-spell-creation .button-container button {
    font-family: var(--font-interface) !important;
    font-size: var(--font-ui-small) !important;
}

/* Animations */
.spell-fade-in {
    animation: spellFadeIn 0.3s ease-in-out;
}

@keyframes spellFadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsiveness */
@media (max-width: 768px) {
    .spell-modal-container {
        max-height: 70vh;
    }
    
    .selected-value-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }
    
    .selected-value-remove {
        align-self: flex-end;
    }
}
`;