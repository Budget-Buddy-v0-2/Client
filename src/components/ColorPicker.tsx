import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD",
    "#E74C3C", "#2ECC71", "#3498DB", "#1ABC9C", "#D35400"
];

export const ColorPicker: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState("#FF5733");
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block">
            {/* Color Display Box */}
            <div
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-400 flex items-center justify-center"
                style={{ backgroundColor: selectedColor }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Palette className="text-white" />
            </div>

            {/* Color Picker Widget */}
            {isOpen && (
                <motion.div
                    ref={pickerRef}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-12 left-0 bg-dark p-3 rounded-lg shadow-lg grid grid-cols-5 gap-2"
                >
                    {colors.map((color) => (
                        <div
                            key={color}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-400"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                setSelectedColor(color);
                                setIsOpen(false);
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
};