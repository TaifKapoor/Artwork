import React, { useState, useEffect, useRef } from 'react';
import { DataTable, type DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import axios from 'axios';
import type { Artwork, ApiResponse } from '../types/artwork';

const ArtworkTable = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<Artwork[]>([]); 
    const [customSelectCount, setCustomSelectCount] = useState<number | null>(null);
    
    const op = useRef<OverlayPanel>(null);

    const fetchArtworks = async (pageNumber: number) => {
        setLoading(true);
        try {
            const res = await axios.get<ApiResponse>(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=12`);
            setArtworks(res.data.data);
            setTotalRecords(res.data.pagination.total);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtworks(page);
    }, [page]);

    const onPage = (event: DataTableStateEvent) => {
        setPage((event.page || 0) + 1);
    };

    const handleCustomSelection = () => {
        if (!customSelectCount) return;
        op.current?.hide();
    };

    return (
        <div className="card">
            <DataTable 
                value={artworks} 
                lazy 
                paginator 
                first={(page - 1) * 12} 
                rows={12} 
                totalRecords={totalRecords} 
                onPage={onPage} 
                loading={loading}
                selection={selectedRows}
          
                onSelectionChange={(e) => setSelectedRows(e.value as Artwork[])}
                dataKey="id" 
                tableStyle={{ minWidth: '50rem' }}
           
                selectionMode="multiple" 
            >
                
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                
                <Column 
                    header={<i className="pi pi-chevron-down" onClick={(e) => op.current?.toggle(e)}></i>} 
                    bodyStyle={{ textAlign: 'center' }}
                    style={{ width: '3rem' }}
                />
                
                <Column field="title" header="Title"></Column>
                <Column field="place_of_origin" header="Place of Origin"></Column>
                <Column field="artist_display" header="Artist"></Column>
                <Column field="inscriptions" header="Inscriptions"></Column>
                <Column field="date_start" header="Start Date"></Column>
                <Column field="date_end" header="End Date"></Column>
            </DataTable>

            <OverlayPanel ref={op}>
                <div className="flex flex-column gap-2">
                    <InputNumber 
                        value={customSelectCount} 
                    
                        onValueChange={(e: InputNumberValueChangeEvent) => setCustomSelectCount(e.value ?? null)} 
                        placeholder="Select rows..."
                    />
                    <Button label="Submit" onClick={handleCustomSelection} />
                </div>
            </OverlayPanel>
        </div>
    );
};

export default ArtworkTable;