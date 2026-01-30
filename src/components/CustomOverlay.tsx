import React, { useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

interface CustomOverlayProps {
    overlayRef: React.RefObject<OverlayPanel>;
    onSelectRows: (count: number) => void;
}

const CustomOverlay: React.FC<CustomOverlayProps> = ({ overlayRef, onSelectRows }) => {
    const [inputValue, setInputValue] = useState<number | null>(null);

    const handleSubmit = () => {
        if (inputValue !== null && inputValue > 0) {
            onSelectRows(inputValue);
            overlayRef.current?.hide();
        }
    };

    return (
        <OverlayPanel ref={overlayRef}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '200px' }}>
                <label htmlFor="row-count" style={{ fontWeight: 'bold' }}>Enter number of rows:</label>
                <InputNumber 
                    id="row-count"
                    value={inputValue} 
                    onValueChange={(e) => setInputValue(e.value ?? null)} 
                    placeholder="e.g. 20"
                    min={0}
                />
                <Button 
                    label="Submit" 
                    icon="pi pi-check" 
                    onClick={handleSubmit} 
                    className="p-button-sm"
                />
            </div>
        </OverlayPanel>
    );
};

export default CustomOverlay;