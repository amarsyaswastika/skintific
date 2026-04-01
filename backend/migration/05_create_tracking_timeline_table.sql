CREATE TABLE IF NOT EXISTS tracking\_timeline (
id INT PRIMARY KEY AUTO\_INCREMENT,
shipment\_id INT NOT NULL,
status VARCHAR(50) NOT NULL,
location VARCHAR(100),
description TEXT,
updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP,


FOREIGN KEY (shipment\_id) REFERENCES shipments(id) ON DELETE CASCADE

);

-- Index untuk mempercepat pencarian

CREATE INDEX idx\_tracking\_shipment ON tracking\_timeline(shipment\_id);

CREATE INDEX idx\_tracking\_updated ON tracking\_timeline(updated\_at);
