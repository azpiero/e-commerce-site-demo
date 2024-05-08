'use client'

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({isOpen, onClose, onConfirm, loading}) => {
    
    /** Modalが表示されていない際には何も表示しない */
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    },[])
    if (!isMounted) return null;
    
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Are you sure?" 
            description="This action cannot be restored">
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button variant="destructive" onClick={onConfirm} disabled={loading}>Continue</Button>
            </div>
        </Modal>
    );
}