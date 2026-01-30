import React, { useState, useEffect, useRef } from 'react';
import { DataTable, type DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import axios from 'axios';


import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const App = () => {
    const [data, setData] = useState<any[]>([]); 
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [howManyToSelect, setHowManyToSelect] = useState<number | null>(null);
    const [targetCount, setTargetCount] = useState<number>(0);
    
    const overlayRef = useRef<OverlayPanel>(null);

    const getData = async (p: number) => {
        setLoading(true);
        try {
            const res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${p}&limit=12`);
            setData(res.data.data);
            setTotal(res.data.pagination.total);
        } catch (err) {
            console.log("Error fetching:", err);
        }
        setLoading(false);
    };

   
    useEffect(() => {
        getData(page);
    }, [page]);

    useEffect(() => {
        if (targetCount > 0) {
            const startLimit = (page - 1) * 12;
            const toSelectFromThisPage = data.filter((_, index) => (startLimit + index + 1) <= targetCount);

            if (toSelectFromThisPage.length > 0) {
                setSelectedRows(prev => {
                    const existing = [...prev];
                    toSelectFromThisPage.forEach(item => {
        
                        if (!existing.find(it => it.id === item.id)) {
                            existing.push(item);
                        }
                    });
                    return existing;
                });
            }
        }
    }, [data, targetCount, page]);

   
    const onPageChange = (e: DataTableStateEvent) => {
        setPage((e.page || 0) + 1);
    };

    const onCustomSelectSubmit = () => {
        if (howManyToSelect) {
            setTargetCount(howManyToSelect);
            
         
            const start = (page - 1) * 12;
            const currentSelected = data.filter((_, index) => (start + index + 1) <= howManyToSelect);
            
            setSelectedRows(prev => {
                const combined = [...prev];
                currentSelected.forEach(row => {
                    if (!combined.find(r => r.id === row.id)) combined.push(row);
                });
                return combined;
            });
        }
        overlayRef.current?.hide();
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Artwork List</h1>
            
            <div className="card">
                <DataTable 
                    value={data} 
                    lazy 
                    paginator 
                    rows={12} 
                    totalRecords={total} 
                    first={(page - 1) * 12}
                    onPage={onPageChange} 
                    loading={loading}
                    selection={selectedRows}
                    onSelectionChange={(e) => setSelectedRows(e.value)}
                    selectionMode="multiple"
                    dataKey="id" 
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    
                
                    <Column 
                        header={<i className="pi pi-chevron-down" style={{ cursor: 'pointer' }} onClick={(e) => overlayRef.current?.toggle(e)}></i>} 
                        style={{ width: '3rem' }} 
                    />
                    
                    <Column field="title" header="Title"></Column>
                    <Column field="place_of_origin" header="Origin"></Column>
                    <Column field="artist_display" header="Artist"></Column>
                    <Column field="inscriptions" header="Inscriptions"></Column>
                    <Column field="date_start" header="Start Year"></Column>
                    <Column field="date_end" header="End Year"></Column>
                </DataTable>
            </div>

           
            <OverlayPanel ref={overlayRef}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <InputNumber 
                        value={howManyToSelect} 
                        onValueChange={(e: InputNumberValueChangeEvent) => setHowManyToSelect(e.value ?? null)} 
                        placeholder="Number of rows..." 
                    />
                    <Button label="Submit" onClick={onCustomSelectSubmit} />
                </div>
            </OverlayPanel>
        </div>
    );
};

export default App;