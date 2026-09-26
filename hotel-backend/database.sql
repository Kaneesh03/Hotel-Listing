-- Hotels table schema and initial seed data


CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude NUMERIC(9, 6) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    image VARCHAR(500) NOT NULL
);

-- Seed initial 12 hotels (6 external image URLs + 6 local uploaded images)
INSERT INTO hotels (title, description, latitude, longitude, price, image) VALUES
('Grand Ocean Resort', 'A luxurious beachfront resort offering stunning ocean views, world-class dining, and a full-service spa. Perfect for both families and couples seeking a relaxing getaway by the sea.', 3.156900, 101.712300, 250.00, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'),
('Mountain View Lodge', 'Nestled in the highlands, this cozy lodge offers breathtaking mountain scenery, hiking trails, and warm fireside evenings. Ideal for nature lovers and adventure seekers.', 4.552100, 101.090100, 120.00, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'),
('City Centre Suites', 'Modern suites located in the heart of the city, steps away from shopping malls, restaurants, and business districts. Equipped with high-speed Wi-Fi and a rooftop pool.', 3.147800, 101.695300, 180.00, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop'),
('Riverside Boutique Hotel', 'A charming boutique hotel beside a calm river, featuring uniquely decorated rooms, a riverside restaurant, and kayaking activities for guests.', 5.414100, 100.328800, 95.00, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop'),
('Heritage Palace Hotel', 'Experience history and elegance at this restored colonial palace. Featuring antique furnishings, guided heritage tours, and a fine-dining restaurant serving local cuisine.', 5.416400, 100.332700, 310.00, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop'),
('Sunset Bay Guesthouse', 'A friendly and affordable guesthouse with beautiful sunset views over the bay. Popular with backpackers and solo travellers who want comfort without the high price tag.', 5.276700, 103.148900, 55.00, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop'),
('Coastal Breeze Resort', 'A relaxing beachfront resort with comfortable rooms, a swimming pool, and easy access to the sea. Ideal for families and short holidays.', 8.524100, 76.936600, 145.00, '/uploads/1790352338274-205543110.webp'),
('Royal Garden Residency', 'A peaceful city hotel with spacious rooms, a restaurant, free Wi-Fi, and convenient access to nearby shopping and business areas.', 10.527600, 76.214400, 110.00, '/uploads/1790352723664-379397005.webp'),
('Lakeview Grand Hotel', 'A comfortable hotel overlooking a scenic lake, offering modern rooms, a rooftop dining area, and a quiet atmosphere for travelers.', 9.498100, 76.338800, 195.00, '/uploads/1790352906114-616129924.webp'),
('Emerald Heights Resort', 'A modern hill-side resort surrounded by greenery, featuring spacious rooms, outdoor activities, and beautiful views of the surrounding landscape.', 11.406400, 76.693200, 225.00, '/uploads/1790353314674-921876677.webp'),
('Sunrise Comfort Inn', 'An affordable hotel with clean rooms, complimentary breakfast, parking, and easy access to major roads and local attractions.', 11.258800, 75.780400, 85.00, '/uploads/1790353390814-165180845.webp'),
('Silver Oak Suites', 'Stylish suites with modern interiors, a fitness area, high-speed Wi-Fi, and an on-site restaurant suitable for business and leisure stays.', 12.295800, 76.639400, 275.00, '/uploads/1790353483269-466889822.webp');

SELECT setval('hotels_id_seq', (SELECT MAX(id) FROM hotels));
