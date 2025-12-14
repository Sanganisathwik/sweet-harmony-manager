-- Create sweets table and insert your 21 sweets
CREATE TABLE IF NOT EXISTS sweets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'sweets',
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO sweets (name, description, category, price, quantity, image_url) VALUES
('Ajmeera Kalakandh', 'Traditional milk-based sweet', 'sweets', 450.00, 10, '/sweetsImgs/AjmeeaKalakandh.jpg'),
('Ariselu', 'Classic rice flour sweet with jaggery', 'sweets', 320.00, 12, '/sweetsImgs/Ariselu.jpg'),
('Badusha', 'Deep-fried flaky sweet', 'sweets', 280.00, 15, '/sweetsImgs/Badusha.jpg'),
('Basen Ladoo', 'Traditional besan flour ladoo', 'sweets', 350.00, 10, '/sweetsImgs/BasenLadoo.jpg'),
('Brittle Candy', 'Crunchy caramelized candy', 'snacks', 180.00, 20, '/sweetsImgs/BrittleCandy.jpg'),
('Chakkara Rekulu', 'Andhra sweet rice crackers', 'sweets', 380.00, 12, '/sweetsImgs/ChakkaraRekulu.jpg'),
('Coconut Burfi', 'Rich coconut fudge', 'sweets', 300.00, 15, '/sweetsImgs/cocnutburfi.jpg'),
('Coconut Ladoo', 'Sweet coconut balls', 'sweets', 280.00, 18, '/sweetsImgs/CocnutLadoo.jpg'),
('Community Special', 'Premium sweets collection', 'gift_boxes', 1200.00, 5, '/sweetsImgs/Community.jpg'),
('Dryfruit Basen Ladoo', 'Premium ladoo with dry fruits', 'premium_sweets', 550.00, 8, '/sweetsImgs/DryfruitBasenLadoo.jpg'),
('Gaja Halwa', 'Carrot halwa with nuts', 'sweets', 400.00, 10, '/sweetsImgs/GajaHalwa.jpg'),
('Gond Ke Ladoo', 'Nutritious gum ladoo', 'premium_sweets', 480.00, 7, '/sweetsImgs/gond ke Ladoo.jpg'),
('Ice Cream Burfi', 'Creamy milk burfi', 'premium_sweets', 420.00, 12, '/sweetsImgs/IceCreamBurfi.jpg'),
('Jalebi', 'Crispy spiral sweet', 'sweets', 250.00, 25, '/sweetsImgs/Jalebi.jpg'),
('Kalakand', 'Soft milk cake', 'sweets', 380.00, 10, '/sweetsImgs/Kalakand.jpg'),
('Mawa Malpua', 'Fried pancakes with mawa', 'sweets', 350.00, 15, '/sweetsImgs/Mawa Malpua.jpg'),
('Pure Ghee Sweets', 'Assorted pure ghee sweets', 'premium_sweets', 600.00, 8, '/sweetsImgs/PureGhee.jpg'),
('Rasmalai', 'Cottage cheese in sweetened milk', 'sweets', 450.00, 12, '/sweetsImgs/Rasmalai.jpg'),
('Shahi Tukra', 'Royal bread pudding', 'premium_sweets', 380.00, 10, '/sweetsImgs/ShahiTukra.jpg'),
('Til Patti', 'Sesame seed brittle', 'snacks', 200.00, 20, '/sweetsImgs/TilPatti.jpg'),
('Traditional Sweets Box', 'Curated traditional sweets', 'gift_boxes', 1500.00, 5, '/sweetsImgs/TraditionalSweets.jpg')
ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price, quantity = EXCLUDED.quantity;