'use client';

interface CalendarHeatmapProps {
  completionDates: string[];
}

export function CalendarHeatmap({ completionDates }: CalendarHeatmapProps) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const completionSet = new Set(
    completionDates.map((d) => new Date(d).toDateString())
  );

  const today = new Date().toDateString();

  return (
    <div>
      <div className="grid grid-cols-10 gap-2">
        {days.map((day) => {
          const isCompleted = completionSet.has(day.toDateString());
          const isToday = day.toDateString() === today;

          return (
            <div
              key={day.toISOString()}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              } ${isToday ? 'ring-2 ring-niya-500 ring-offset-1' : ''}`}
              title={day.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100 ring-2 ring-niya-500 ring-offset-1" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
