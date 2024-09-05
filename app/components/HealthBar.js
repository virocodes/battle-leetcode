export default function HealthBar({ label, health }) {
    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="font-bold">{label}</span>
                <span className="font-bold">{health}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${health}%` }}></div>
            </div>
        </div>
    );
}