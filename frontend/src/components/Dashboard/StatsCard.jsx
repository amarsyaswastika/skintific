function StatsCard({ title, value, icon: IconComponent, color, change }) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
  };

  const changeColor = change && change.startsWith("+") ? "text-green-600" : "text-red-600";

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-1">
            {value?.toLocaleString() || 0}
          </h3>
          {change && (
            <p className={`text-xs mt-1 font-medium ${changeColor}`}>
              {change} dari minggu lalu
            </p>
          )}
        </div>
        <div className={`rounded-full p-3 text-white ${colorClasses[color]}`}>
          <IconComponent className="text-2xl" />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;