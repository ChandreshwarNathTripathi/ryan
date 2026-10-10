const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seeder] Connected to database. Purging old records...');

    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Room.deleteMany({});
    await User.deleteMany({});

    console.log('[Seeder] Old data cleared. Creating users...');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
    const guestPasswordHash = await bcrypt.hash('Guest@123', salt);

    const adminUser = await User.create({
      name: 'Syed Rayyan (Lead Administrator)',
      email: 'admin@xshotel.com',
      phone: '+1 (555) 789-0123',
      passwordHash: adminPasswordHash,
      role: 'admin',
      status: 'active',
    });

    const guestUser = await User.create({
      name: 'Alexander Vance',
      email: 'guest@xshotel.com',
      phone: '+1 (555) 234-5678',
      passwordHash: guestPasswordHash,
      role: 'user',
      status: 'active',
    });

    const secondGuest = await User.create({
      name: 'Elena Rostova',
      email: 'elena@example.com',
      phone: '+1 (555) 876-5432',
      passwordHash: guestPasswordHash,
      role: 'user',
      status: 'active',
    });

    console.log('[Seeder] Users created:');
    console.log(`  Admin : ${adminUser.email} / Admin@123`);
    console.log(`  Guest : ${guestUser.email} / Guest@123`);

    // 2. Create Luxury Rooms
    console.log('[Seeder] Creating luxury rooms...');

    const roomsData = [
      {
        name: 'Royal Presidential Suite',
        roomNumber: 'PH-101',
        category: 'Presidential Suite',
        description:
          'The pinnacle of ultra-luxury. Spanning over 2,800 square feet, this penthouse suite offers wraparound skyline panoramas, private elevator access, a 24-karat gold fixture master bath, dedicated 24-hour personal butler, and custom Bang & Olufsen acoustics.',
        pricePerNight: 1250,
        capacity: 4,
        amenities: [
          '24/7 Dedicated Butler',
          'Private Heated Jacuzzi',
          'Panoramic Skyline Views',
          'Marble En-Suite Bathroom',
          'Custom Wine Cellar',
          'Complimentary Airport Chauffeur',
          'High-Speed Wi-Fi 6',
          'Designer BVLGARI Toiletries',
        ],
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: true,
      },
      {
        name: 'Azure Oceanfront Infinity Villa',
        roomNumber: 'OV-102',
        category: 'Ocean Villa',
        description:
          'Suspended over tranquil turquoise waters, this private sanctuary features a cantilevered infinity plunge pool, direct ocean reef access, sunset cocktail deck, and open-air rain showers surrounded by lush tropical flora.',
        pricePerNight: 980,
        capacity: 4,
        amenities: [
          'Private Infinity Pool',
          'Direct Ocean Access',
          'Sunset Viewing Deck',
          'Outdoor Rain Shower',
          'Sonos Sound System',
          'Espresso Bar',
          'Champagne on Arrival',
        ],
        images: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: true,
      },
      {
        name: 'Executive Horizon Grand Suite',
        roomNumber: 'EX-201',
        category: 'Executive Suite',
        description:
          'Tailored for discerning global executives. Features an ergonomic Herman Miller boardroom lounge, high-speed encrypted satellite Wi-Fi, motorized blackout drapery, and complimentary entry to the 40th-floor Private Club Lounge.',
        pricePerNight: 650,
        capacity: 3,
        amenities: [
          'Private Club Lounge Access',
          'Executive Workstation',
          'City Horizon Views',
          'Nespresso Gourmet Machine',
          'King Bed with Italian Linens',
          'Smart Environmental Controls',
        ],
        images: [
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: true,
      },
      {
        name: 'Imperial Penthouse Suite',
        roomNumber: 'EX-202',
        category: 'Executive Suite',
        description:
          'A majestic blend of mid-century aesthetics and ultra-contemporary luxury. Highlights include an Italian marble fireplace, private terrace, soaking tub overlooking the harbor, and bespoke dining area.',
        pricePerNight: 720,
        capacity: 3,
        amenities: [
          'Marble Soaking Tub',
          'Harbor Balcony',
          'Dual Walk-In Closets',
          'Artisan Minibar',
          'Complimentary High Tea',
        ],
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: false,
      },
      {
        name: 'Opulent Deluxe King',
        roomNumber: 'DX-301',
        category: 'Deluxe',
        description:
          'An intimate retreat boasting high ceilings, plush velvet seating, hand-tufted California King bed, ambient lighting scenes, and an oversized rainforest shower.',
        pricePerNight: 420,
        capacity: 2,
        amenities: [
          'California King Bed',
          'Rainforest Shower',
          'Ambient Mood Lighting',
          'Complimentary High-Speed Wi-Fi',
          'Luxury Bathrobes & Slippers',
        ],
        images: [
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: true,
      },
      {
        name: 'Celestial Courtyard Deluxe',
        roomNumber: 'DX-302',
        category: 'Deluxe',
        description:
          'Overlooks the hotel’s award-winning Zen reflection gardens. Features botanical aromatics, acoustic soundproofing, plush hypoallergenic bedding, and a peaceful private balcony.',
        pricePerNight: 460,
        capacity: 2,
        amenities: [
          'Zen Garden Balcony',
          'Aromatherapy Diffuser',
          'Soundproof Acoustic Glass',
          'Smart HDTV with Streaming',
          'Custom Tea Selection',
        ],
        images: [
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: false,
      },
      {
        name: 'Prestige Royal Family Villa',
        roomNumber: 'FM-401',
        category: 'Family Suite',
        description:
          'Thoughtfully curated for luxury family holidays. Boasts two interconnected master suites, spacious entertainment lounge, children’s play alcove, and private dining kitchen.',
        pricePerNight: 850,
        capacity: 6,
        amenities: [
          'Two Interconnected Master Bedrooms',
          'Family Entertainment Center',
          'Gourmet Kitchenette',
          'Children Welcome Kit',
          'Complimentary Breakfast Buffet',
        ],
        images: [
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: false,
      },
      {
        name: 'Classic Urban King',
        roomNumber: 'ST-501',
        category: 'Standard',
        description:
          'Sleek, minimalist elegance in the heart of the metropolis. Featuring modern artwork, plush bedding, executive desk, and full access to the wellness health center.',
        pricePerNight: 290,
        capacity: 2,
        amenities: [
          'King Size Comfort Bed',
          'Executive Workstation',
          'Health Club & Pool Access',
          '24/7 In-Room Dining',
        ],
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: false,
      },
    ];

    const createdRooms = await Room.insertMany(roomsData);
    console.log(`[Seeder] ${createdRooms.length} luxury rooms successfully inserted.`);

    // 3. Create Sample Bookings
    console.log('[Seeder] Creating realistic bookings...');

    const today = new Date();
    const in3Days = new Date(today);
    in3Days.setDate(today.getDate() + 3);
    const in7Days = new Date(today);
    in7Days.setDate(today.getDate() + 7);

    const pastCheckIn = new Date(today);
    pastCheckIn.setDate(today.getDate() - 14);
    const pastCheckOut = new Date(today);
    pastCheckOut.setDate(today.getDate() - 10);

    const booking1 = await Booking.create({
      bookingReference: 'XSH-2026-881234',
      user: guestUser._id,
      room: createdRooms[0]._id, // Presidential Suite
      checkIn: in3Days,
      checkOut: in7Days,
      guests: 2,
      specialRequests: 'Late evening champagne arrival & hypoallergenic feather pillows requested.',
      numberOfNights: 4,
      roomPrice: 4 * createdRooms[0].pricePerNight,
      taxesAndFees: Math.round(4 * createdRooms[0].pricePerNight * 0.12),
      totalAmount: Math.round(4 * createdRooms[0].pricePerNight * 1.12),
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'Demo Visa Infinite',
    });

    const booking2 = await Booking.create({
      bookingReference: 'XSH-2026-773419',
      user: guestUser._id,
      room: createdRooms[4]._id, // Opulent Deluxe King
      checkIn: pastCheckIn,
      checkOut: pastCheckOut,
      guests: 2,
      specialRequests: 'Quiet high-floor room preference.',
      numberOfNights: 4,
      roomPrice: 4 * createdRooms[4].pricePerNight,
      taxesAndFees: Math.round(4 * createdRooms[4].pricePerNight * 0.12),
      totalAmount: Math.round(4 * createdRooms[4].pricePerNight * 1.12),
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'Demo Mastercard Elite',
    });

    const booking3 = await Booking.create({
      bookingReference: 'XSH-2026-665120',
      user: secondGuest._id,
      room: createdRooms[1]._id, // Azure Oceanfront Villa
      checkIn: in3Days,
      checkOut: in7Days,
      guests: 3,
      specialRequests: 'Anniversary celebration arrangement.',
      numberOfNights: 4,
      roomPrice: 4 * createdRooms[1].pricePerNight,
      taxesAndFees: Math.round(4 * createdRooms[1].pricePerNight * 0.12),
      totalAmount: Math.round(4 * createdRooms[1].pricePerNight * 1.12),
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'Demo American Express Centurion',
    });

    console.log('[Seeder] 3 sample bookings created.');

    // 4. Create Reviews
    console.log('[Seeder] Creating guest reviews...');

    await Review.create([
      {
        user: guestUser._id,
        room: createdRooms[4]._id,
        booking: booking2._id,
        rating: 5,
        comment:
          'An utterly sublime stay. The attention to detail from the concierge to the housekeeping was beyond five stars. The rainfall shower and California King bed provided the best sleep I have had in years.',
        status: 'approved',
      },
      {
        user: secondGuest._id,
        room: createdRooms[0]._id,
        rating: 5,
        comment:
          'The Royal Presidential Suite exceeded every expectation. The panoramic skyline at dusk with the private butler serving cocktails made our holiday unforgettable.',
        status: 'approved',
      },
      {
        user: guestUser._id,
        room: createdRooms[1]._id,
        rating: 5,
        comment:
          'Waking up right over the turquoise water in the Azure Oceanfront Villa was breathtaking. Can not wait to return to XShotel!',
        status: 'approved',
      },
    ]);

    console.log('[Seeder] Guest reviews seeded successfully.');
    console.log('[Seeder] ALL SEED OPERATIONS FINISHED!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
