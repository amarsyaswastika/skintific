function DeliveryChart() {
  // Data per bulan (jumlah paket)
  const shipments = [12, 19, 15, 17, 14, 18, 22, 24, 20, 16, 13, 11];
  const deliveries = [8, 14, 11, 13, 10, 14, 18, 20, 16, 12, 9, 7];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  
  // Cari nilai maksimal untuk skala
  const maxValue = Math.max(...shipments, ...deliveries, 1);
  const totalShipments = shipments.reduce((a, b) => a + b, 0);
  const totalDeliveries = deliveries.reduce((a, b) => a + b, 0);
  const onTimePercent = Math.round((totalDeliveries / totalShipments) * 100);

  // Tinggi maksimal batang chart (dalam px)
  const maxBarHeight = 180;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Statistik Pengiriman</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Pengiriman</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Terkirim</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Chart Bars */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full">
            <div className="flex items-end gap-2 h-48">
              {months.map((month, index) => (
                <div key={month} className="flex-1 text-center">
                  {/* Bar Biru (Shipment) */}
                  <div
                    className="mx-auto w-full max-w-6 rounded-t-lg bg-blue-500 transition-all hover:bg-blue-600"
                    style={{ 
                      height: `${(shipments[index] / maxValue) * maxBarHeight}px`,
                      marginBottom: "4px" 
                    }}
                    title={`${month}: ${shipments[index]} total paket`}
                  ></div>
                  {/* Bar Hijau (Delivery) */}
                  <div
                    className="mx-auto w-full max-w-6 rounded-t-lg bg-green-500 transition-all hover:bg-green-600"
                    style={{ 
                      height: `${(deliveries[index] / maxValue) * maxBarHeight}px` 
                    }}
                    title={`${month}: ${deliveries[index]} paket terkirim`}
                  ></div>
                  <p className="mt-2 text-xs text-gray-500">{month}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between">
            <div className="text-center flex-1">
              <p className="text-xs text-gray-500">Total Terkirim</p>
              <p className="text-lg font-bold text-gray-800">{totalDeliveries}</p>
              <p className="text-xs text-gray-400">dari {totalShipments} total</p>
            </div>
            <div className="text-center flex-1 border-x border-gray-100">
              <p className="text-xs text-gray-500">Tepat Waktu</p>
              <p className="text-lg font-bold text-green-600">{onTimePercent}%</p>
              <p className="text-xs text-gray-400">{totalDeliveries} dari {totalShipments}</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-xs text-gray-500">Kurir Aktif</p>
              <p className="text-lg font-bold text-blue-600">24</p>
              <p className="text-xs text-green-500">+3.85%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryChart;