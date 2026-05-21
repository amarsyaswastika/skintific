function StatsCard({ title, value, icon: IconComponent, color, change }) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
  };

  const changeColor = change && change.startsWith("+") ? "text-green-500" : "text-red-500";

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
          {change && (
            <p className={`text-xs mt-1 ${changeColor}`}>
              {change} than last week
            </p>
          )}
        </div>
        <div className={`rounded-full p-4 text-white ${colorClasses[color]}`}>
          <IconComponent className="text-3xl" />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;