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
    console.log('[Seeder] Connected to database. Purging old hostel records...');

    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Room.deleteMany({});
    await User.deleteMany({});

    console.log('[Seeder] Old data cleared. Creating warden & student users...');

    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
    const studentPasswordHash = await bcrypt.hash('Student@123', salt);

    // 1. Warden Admin User
    const adminUser = await User.create({
      name: 'Syed Rayyan (Chief Warden & Administrator)',
      email: 'admin@xshostel.com',
      phone: '+1 (555) 789-0123',
      studentId: 'FACULTY-001',
      course: 'Hostel Administration & Student Affairs',
      gender: 'Male',
      passwordHash: adminPasswordHash,
      role: 'admin',
      status: 'active',
    });

    // 2. Student Users
    const studentUser = await User.create({
      name: 'Zayn Malik',
      email: 'student@xshostel.com',
      phone: '+1 (555) 234-5678',
      studentId: 'CS-2024-042',
      course: 'B.Tech Computer Science & AI',
      gender: 'Male',
      guardianName: 'Tariq Malik',
      guardianPhone: '+1 (555) 998-1122',
      passwordHash: studentPasswordHash,
      role: 'student',
      status: 'active',
    });

    const secondStudent = await User.create({
      name: 'Ayesha Khan',
      email: 'student2@xshostel.com',
      phone: '+1 (555) 876-5432',
      studentId: 'EE-2024-118',
      course: 'B.Tech Electrical Engineering',
      gender: 'Female',
      guardianName: 'Rahim Khan',
      guardianPhone: '+1 (555) 998-3344',
      passwordHash: studentPasswordHash,
      role: 'student',
      status: 'active',
    });

    console.log('[Seeder] Hostel accounts created:');
    console.log(`  Warden  : ${adminUser.email} / Admin@123`);
    console.log(`  Student : ${studentUser.email} / Student@123`);

    // 3. Create Hostel Rooms / Dormitories
    console.log('[Seeder] Creating hostel dormitories and blocks...');

    const roomsData = [
      {
        name: 'Block A Double Sharing Study Dorm',
        roomNumber: 'A-101',
        block: 'Block A (Boys)',
        category: 'Double Sharing',
        gender: 'Boys',
        floor: 1,
        description:
          'Spacious twin-sharing student accommodation equipped with ergonomic study stations, individual steel wardrobes with digital lockers, high-speed 1Gbps campus Wi-Fi, and private attached washroom.',
        pricePerNight: 320,
        capacity: 2,
        occupiedBeds: 1,
        amenities: [
          'Study Desk & Ergonomic Chair',
          'Wardrobe with Secure Digital Locker',
          'High-Speed Campus Wi-Fi 6',
          'Attached Washroom with Geyser',
          '24/7 Power Backup',
          'Mess Dining Hall Access',
          'Biometric Access Control',
        ],
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: true,
      },
      {
        name: 'Block A Scholar Single Studio',
        roomNumber: 'A-102',
        block: 'Block A (Boys)',
        category: 'Single Room',
        gender: 'Boys',
        floor: 1,
        description:
          'Independent private sanctuary for focused academic research and study. Features a sound-insulated acoustic wall, executive oak desk, private balcony overlooking campus sports arena, and climate-controlled air conditioning.',
        pricePerNight: 550,
        capacity: 1,
        occupiedBeds: 0,
        amenities: [
          'Private Single Bed',
          'Executive Study Desk',
          'Air Conditioning (Inverter AC)',
          'Balcony View of Sports Complex',
          'Private En-Suite Bathroom',
          'Unlimited High-Speed Wi-Fi',
        ],
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: true,
      },
      {
        name: 'Block A Triple Sharing Economy Dorm',
        roomNumber: 'A-201',
        block: 'Block A (Boys)',
        category: 'Triple Sharing',
        gender: 'Boys',
        floor: 2,
        description:
          'Budget-friendly comfortable 3-student dorm with plenty of natural sunlight, 3 study tables, 3 individual storage lockers, ceiling fans, and access to the 2nd-floor recreation and table tennis lounge.',
        pricePerNight: 240,
        capacity: 3,
        occupiedBeds: 0,
        amenities: [
          '3 Individual Beds & Mattresses',
          '3 Dedicated Study Desks',
          'Individual Secure Lockers',
          'Attached Washroom',
          'Daily Housekeeping',
          'Common Lounge Access',
        ],
        images: [
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1540518614846-7ede433c4b4f?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: false,
      },
      {
        name: 'Block B Girls Wing Premium Double',
        roomNumber: 'B-101',
        block: 'Block B (Girls)',
        category: 'Double Sharing',
        gender: 'Girls',
        floor: 1,
        description:
          'Located in the secure Girls Residence Wing with 24/7 female warden security and biometric entry. Includes contemporary aesthetics, dual study tables, ambient reading lamps, and direct garden courtyard views.',
        pricePerNight: 340,
        capacity: 2,
        occupiedBeds: 1,
        amenities: [
          'Biometric Security & 24/7 Guard',
          'Dual Study Desks with Lamps',
          'Spacious Double Wardrobe',
          'Attached Washroom',
          'High-Speed Campus Wi-Fi',
          'Courtyard Garden View',
        ],
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: true,
      },
      {
        name: 'Block B Girls Single Scholar Room',
        roomNumber: 'B-102',
        block: 'Block B (Girls)',
        category: 'Single Room',
        gender: 'Girls',
        floor: 1,
        description:
          'Private single student room offering tranquil study ambiance, customized book shelving, quiet garden-facing windows, hot water geyser, and daily sanitary housekeeping.',
        pricePerNight: 560,
        capacity: 1,
        occupiedBeds: 0,
        amenities: [
          'Single Comfort Bed',
          'Floor-to-Ceiling Bookshelf',
          'Executive Study Table & Chair',
          'Hot Water Geyser',
          'In-Room Refrigerator Mini-Unit',
        ],
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: false,
      },
      {
        name: 'Block B Four Bed Community Dorm',
        roomNumber: 'B-201',
        block: 'Block B (Girls)',
        category: 'Four Bed Dorm',
        gender: 'Girls',
        floor: 2,
        description:
          'Vibrant 4-bed shared living space ideal for incoming freshmen. Features sturdy bunk beds, study cubicles, 4 individual secure cupboards, and close proximity to the central mess and library wing.',
        pricePerNight: 190,
        capacity: 4,
        occupiedBeds: 0,
        amenities: [
          '4 Individual Beds',
          'Study Cubicles',
          '4 Cupboards & Shoe Racks',
          'High-Speed Campus Wi-Fi',
          'Mess & Dining Access',
        ],
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: false,
      },
      {
        name: 'Block C Executive Scholar Suite',
        roomNumber: 'C-301',
        block: 'Block C (Scholars Wing)',
        category: 'Executive Scholar Suite',
        gender: 'Co-Ed',
        floor: 3,
        description:
          'Reserved for PhD scholars, researchers, and postgraduate students. High-spec studio with soundproof acoustics, dual monitors workstation setup, private microwave kitchenette, and quiet floor regulations.',
        pricePerNight: 720,
        capacity: 1,
        occupiedBeds: 0,
        amenities: [
          'King Single Ergonomic Bed',
          'Dual-Monitor Study Station',
          'Kitchenette (Microwave & Kettle)',
          'Private Air Conditioning',
          'Quiet Floor Zone Guaranteed',
        ],
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: true,
      },
      {
        name: 'Block C Postgraduate Research Studio',
        roomNumber: 'C-302',
        block: 'Block C (Scholars Wing)',
        category: 'Double Sharing',
        gender: 'Co-Ed',
        floor: 3,
        description:
          'Sophisticated double sharing room for master students. High ceilings, panoramic campus library views, dual study desks, high-bandwidth Ethernet ports, and attached modern bath.',
        pricePerNight: 410,
        capacity: 2,
        occupiedBeds: 0,
        amenities: [
          'Dual Executive Workstations',
          'Direct Ethernet LAN Gigabit Ports',
          'Attached Luxury Bath',
          'Laundry Service Included',
          'Campus Mess Access',
        ],
        images: [
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'available',
        featured: false,
      },
    ];

    const createdRooms = await Room.insertMany(roomsData);
    console.log(`[Seeder] ${createdRooms.length} hostel dormitories inserted.`);

    // 4. Create Active Hostel Allocations
    console.log('[Seeder] Creating active student room allocations...');

    const semesterStart = new Date();
    semesterStart.setDate(semesterStart.getDate() - 30);
    const semesterEnd = new Date();
    semesterEnd.setDate(semesterEnd.getDate() + 150);

    const booking1 = await Booking.create({
      bookingReference: 'HST-2026-104921',
      user: studentUser._id,
      room: createdRooms[0]._id, // Block A-101
      academicYear: 'Academic Year 2026-2027',
      semester: 'Fall Semester 2026',
      messPlan: 'Standard Veg Mess',
      checkIn: semesterStart,
      checkOut: semesterEnd,
      guests: 1,
      specialRequests: 'Ground floor room preference requested for easy bicycle access.',
      numberOfNights: 180,
      roomPrice: 180 * createdRooms[0].pricePerNight,
      taxesAndFees: Math.round(180 * createdRooms[0].pricePerNight * 0.05) + (180 * 15),
      totalAmount: Math.round(180 * createdRooms[0].pricePerNight * 1.05) + (180 * 15),
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'Campus Scholarship Fee Grant',
    });

    const booking2 = await Booking.create({
      bookingReference: 'HST-2026-209843',
      user: secondStudent._id,
      room: createdRooms[3]._id, // Block B-101
      academicYear: 'Academic Year 2026-2027',
      semester: 'Fall Semester 2026',
      messPlan: 'Special Multi-Cuisine Mess',
      checkIn: semesterStart,
      checkOut: semesterEnd,
      guests: 1,
      specialRequests: 'Study table facing window.',
      numberOfNights: 180,
      roomPrice: 180 * createdRooms[3].pricePerNight,
      taxesAndFees: Math.round(180 * createdRooms[3].pricePerNight * 0.05) + (180 * 15),
      totalAmount: Math.round(180 * createdRooms[3].pricePerNight * 1.05) + (180 * 15),
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'Demo Student NetBanking',
    });

    console.log('[Seeder] 2 active student allocations created.');

    // 5. Create Reviews / Student Feedback
    console.log('[Seeder] Seeding resident student feedback...');

    await Review.create([
      {
        user: studentUser._id,
        room: createdRooms[0]._id,
        booking: booking1._id,
        rating: 5,
        comment:
          'Block A-101 is incredible for engineering students. The Wi-Fi is blazing fast for programming assignments, power backup is seamless, and the mess food is clean and nutritious.',
        status: 'approved',
      },
      {
        user: secondStudent._id,
        room: createdRooms[3]._id,
        booking: booking2._id,
        rating: 5,
        comment:
          'Security in Block B is top notch. The warden is very helpful, geyser works 24/7 during winter mornings, and the quiet study hours are respected by everyone.',
        status: 'approved',
      },
    ]);

    console.log('[Seeder] Student reviews seeded successfully.');
    console.log('[Seeder] HOSTEL SEED OPERATIONS COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
