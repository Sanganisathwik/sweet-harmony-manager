-- SweetHarmony Database Setup Script
-- Run this in Supabase SQL Editor to create tables and seed data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum type
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('admin', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create sweet_category enum type
DO $$ BEGIN
    CREATE TYPE sweet_category AS ENUM ('sweets', 'snacks', 'premium_sweets', 'gift_boxes', 'seasonal');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create sweets table
CREATE TABLE IF NOT EXISTS sweets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category sweet_category NOT NULL DEFAULT 'sweets',
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sweet_id UUID NOT NULL REFERENCES sweets(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sweets_category ON sweets(category);
CREATE INDEX IF NOT EXISTS idx_sweets_name ON sweets(name);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_sweet_id ON purchases(sweet_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for sweets table
DROP TRIGGER IF EXISTS update_sweets_updated_at ON sweets;
CREATE TRIGGER update_sweets_updated_at
    BEFORE UPDATE ON sweets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE sweets ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sweets table
DROP POLICY IF EXISTS "Anyone can view sweets" ON sweets;
CREATE POLICY "Anyone can view sweets" ON sweets
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert sweets" ON sweets;
CREATE POLICY "Admins can insert sweets" ON sweets
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Admins can update sweets" ON sweets;
CREATE POLICY "Admins can update sweets" ON sweets
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Admins can delete sweets" ON sweets;
CREATE POLICY "Admins can delete sweets" ON sweets
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- RLS Policies for purchases table
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
CREATE POLICY "Users can view own purchases" ON purchases
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create purchases" ON purchases;
CREATE POLICY "Users can create purchases" ON purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all purchases" ON purchases;
CREATE POLICY "Admins can view all purchases" ON purchases
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- RLS Policies for user_roles table
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
CREATE POLICY "Admins can manage roles" ON user_roles
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Clear existing sweets data and insert fresh data
TRUNCATE TABLE sweets CASCADE;

-- Insert all sweets data (YOUR CURRENT DATA - PRESERVED)
INSERT INTO sweets (name, description, category, price, quantity, image_url) VALUES
    ('Ajmeera Kalakandh', 'Traditional milk-based sweet with rich flavor', 'sweets', 450.00, 10, '/sweetsImgs/AjmeeaKalakandh.jpg'),
    ('Ariselu', 'Classic rice flour sweet made with jaggery', 'sweets', 320.00, 12, '/sweetsImgs/Ariselu.jpg'),
    ('Badusha', 'Deep-fried flaky sweet soaked in sugar syrup', 'sweets', 280.00, 15, '/sweetsImgs/Badusha.jpg'),
    ('Basen Ladoo', 'Traditional besan flour ladoo with ghee', 'sweets', 350.00, 10, '/sweetsImgs/BasenLadoo.jpg'),
    ('Brittle Candy', 'Crunchy caramelized sugar candy', 'snacks', 180.00, 20, '/sweetsImgs/BrittleCandy.jpg'),
    ('Chakkara Rekulu', 'Traditional Andhra sweet rice crackers', 'sweets', 380.00, 12, '/sweetsImgs/ChakkaraRekulu.jpg'),
    ('Coconut Burfi', 'Rich coconut fudge with cardamom flavor', 'sweets', 300.00, 15, '/sweetsImgs/cocnutburfi.jpg'),
    ('Coconut Ladoo', 'Sweet coconut balls with condensed milk', 'sweets', 280.00, 18, '/sweetsImgs/CocnutLadoo.jpg'),
    ('Community Special', 'Assorted premium sweets collection box', 'gift_boxes', 1200.00, 5, '/sweetsImgs/Community.jpg'),
    ('Dryfruit Basen Ladoo', 'Premium besan ladoo loaded with dry fruits', 'premium_sweets', 550.00, 8, '/sweetsImgs/DryfruitBasenLadoo.jpg'),
    ('Gaja Halwa', 'Rich carrot halwa with nuts and khoya', 'sweets', 400.00, 10, '/sweetsImgs/GajaHalwa.jpg'),
    ('Gond Ke Ladoo', 'Nutritious edible gum ladoo with ghee', 'premium_sweets', 480.00, 7, '/sweetsImgs/gond ke Ladoo.jpg'),
    ('Ice Cream Burfi', 'Creamy milk burfi with ice cream flavor', 'premium_sweets', 420.00, 12, '/sweetsImgs/IceCreamBurfi.jpg'),
    ('Jalebi', 'Crispy spiral-shaped sweet soaked in syrup', 'sweets', 250.00, 25, '/sweetsImgs/Jalebi.jpg'),
    ('Kalakand', 'Soft milk cake with cardamom and pistachios', 'sweets', 380.00, 10, '/sweetsImgs/Kalakand.jpg'),
    ('Mawa Malpua', 'Traditional fried pancakes with mawa topping', 'sweets', 350.00, 15, '/sweetsImgs/Mawa Malpua.jpg'),
    ('Pure Ghee Sweets', 'Assorted sweets made with pure desi ghee', 'premium_sweets', 600.00, 8, '/sweetsImgs/PureGhee.jpg'),
    ('Rasmalai', 'Soft cottage cheese dumplings in sweetened milk', 'sweets', 450.00, 12, '/sweetsImgs/Rasmalai.jpg'),
    ('Shahi Tukra', 'Royal bread pudding with rabri and nuts', 'premium_sweets', 380.00, 10, '/sweetsImgs/ShahiTukra.jpg'),
    ('Til Patti', 'Sesame seed brittle with jaggery', 'snacks', 200.00, 20, '/sweetsImgs/TilPatti.jpg'),
    ('Traditional Sweets Box', 'Curated box of traditional Indian sweets', 'gift_boxes', 1500.00, 5, '/sweetsImgs/TraditionalSweets.jpg')
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    quantity = EXCLUDED.quantity,
    image_url = EXCLUDED.image_url,
    updated_at = NOW();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Verify the data was inserted
SELECT COUNT(*) as total_sweets FROM sweets;
