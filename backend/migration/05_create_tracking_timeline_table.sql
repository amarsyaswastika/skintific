CREATE TABLE IF NOT EXISTS tracking_timeline (
id INT PRIMARY KEY AUTO_INCREMENT,
shipment_id INT NOT NULL,
status VARCHAR(50) NOT NULL,
location VARCHAR(100),
description TEXT,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,


FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE

);

-- Index untuk mempercepat pencarian

CREATE INDEX idx_tracking_shipment ON tracking_timeline(shipment_id);

CREATE INDEX idx_tracking_updated ON tracking_timeline(updated_at);
