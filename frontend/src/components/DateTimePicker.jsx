import { forwardRef, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom input component for the date picker trigger
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <button
        type="button"
        onClick={onClick}
        ref={ref}
        className={cn(
            "w-full h-9 px-3 text-xs text-left rounded-xl border transition-all",
            "bg-background/80 border-border/50 hover:border-primary/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
            value ? "text-foreground font-medium" : "text-muted-foreground"
        )}
    >
        <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary/70" />
            <span>{value || placeholder || "Select date"}</span>
        </div>
    </button>
));

CustomInput.displayName = 'CustomInput';

export default function DateTimePicker({ selected, onChange, placeholder, className }) {
    const [timeValue, setTimeValue] = useState('12:00');

    // Sync time input with selected date
    useEffect(() => {
        if (selected) {
            const hours = String(selected.getHours()).padStart(2, '0');
            const mins = String(selected.getMinutes()).padStart(2, '0');
            setTimeValue(`${hours}:${mins}`);
        }
    }, [selected]);

    const handleDateChange = (date) => {
        if (date) {
            // Apply current time to the selected date
            const [hours, mins] = timeValue.split(':').map(Number);
            date.setHours(hours || 0, mins || 0, 0, 0);
        }
        onChange(date);
    };

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setTimeValue(newTime);

        if (selected && newTime) {
            const [hours, mins] = newTime.split(':').map(Number);
            const updatedDate = new Date(selected);
            updatedDate.setHours(hours || 0, mins || 0, 0, 0);
            onChange(updatedDate);
        }
    };

    const handleClear = () => {
        onChange(null);
        setTimeValue('12:00');
    };

    // Format date for button display
    const formatDateDisplay = (date) => {
        if (!date) return '';
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        if (isToday) return 'Today';
        if (isTomorrow) return 'Tomorrow';
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <div className={cn("date-time-picker space-y-2", className)}>
            {/* Date picker */}
            <DatePicker
                selected={selected}
                onChange={handleDateChange}
                dateFormat="MMM d, yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                scrollableYearDropdown
                yearDropdownItemNumber={10}
                customInput={
                    <CustomInput
                        value={formatDateDisplay(selected)}
                        placeholder={placeholder || "Select date"}
                    />
                }
                calendarClassName="olive-calendar"
                popperClassName="date-picker-popper"
                popperPlacement="bottom-start"
                showPopperArrow={false}
                minDate={new Date()}
            />

            {/* Time input */}
            <div className="relative flex items-center">
                <Clock className="absolute left-2.5 w-3 h-3 text-primary/70 pointer-events-none" />
                <input
                    type="time"
                    value={timeValue}
                    onChange={handleTimeChange}
                    className={cn(
                        "w-full h-9 pl-7 pr-2 text-xs font-medium rounded-xl border transition-all",
                        "bg-background/80 border-border/50 hover:border-primary/50",
                        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    )}
                />
            </div>

            {/* Clear button */}
            {selected && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-3 h-3" />
                    Clear due date
                </button>
            )}
        </div>
    );
}
