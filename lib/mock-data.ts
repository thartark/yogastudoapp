// Mock data storage using localStorage
const STORAGE_KEY = "prana_planner_mock_data"

export interface MockUser {
  id: string
  email: string
  full_name: string
  role: "admin" | "instructor" | "client"
  phone?: string
  date_of_birth?: string
  avatar_url?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_notes?: string
  injuries?: string
  skill_level?: "beginner" | "intermediate" | "advanced"
  preferences?: string[]
  tags?: string[]
  waiver_signed_date?: string
  joined_date?: string
}

export interface MockClass {
  id: string
  name: string
  description: string
  duration: number
  capacity: number
  difficulty_level: string
  color: string
  style: string
  instructor_id: string
  instructor_name: string
  location_id: string
  room_id?: string
  price: number
  image_url?: string
}

export interface MockClassInstance {
  id: string
  class_id: string
  class_name: string
  instructor_id: string
  instructor_name: string
  start_time: string
  end_time: string
  date: string
  capacity: number
  booked_count: number
  status: string
  room_name?: string
  location_name?: string
}

export interface MockBooking {
  id: string
  user_id: string
  class_instance_id: string
  status: string
  checked_in: boolean
  created_at: string
}

export interface MockMembership {
  id: string
  user_id: string
  membership_type_id: string
  type_name: string
  status: string
  start_date: string
  end_date?: string
  classes_remaining?: number
  auto_renew: boolean
}

export interface MockMembershipType {
  id: string
  name: string
  description: string
  type: "unlimited" | "class_pack"
  price: number
  duration_days?: number
  class_count?: number
  tier: string
}

export interface MockWorkshop {
  id: string
  title: string
  description: string
  instructor_id: string
  instructor_name: string
  start_date: string
  end_date: string
  price: number
  early_bird_price?: number
  capacity: number
  registered_count: number
  type: string
  image_url?: string
}

export interface MockProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock_quantity: number
  image_url?: string
  sku: string
}

// Added new interfaces for additional data types
export interface MockLocation {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
}

export interface MockRoom {
  id: string
  location_id: string
  name: string
  capacity: number
  amenities: string[]
  is_heated: boolean
}

export interface MockStaff {
  id: string
  user_id: string
  full_name: string
  email: string
  role: "instructor" | "admin" | "front_desk"
  certifications: string[]
  bio: string
  specialties: string[]
  hourly_rate?: number
  avatar_url?: string
  availability: { day: string; start: string; end: string }[]
}

export interface MockNotification {
  id: string
  user_id: string
  title: string
  message: string
  type: "booking" | "membership" | "class" | "promotion" | "system"
  read: boolean
  created_at: string
}

export interface MockReview {
  id: string
  user_id: string
  user_name: string
  class_id: string
  instructor_id: string
  rating: number
  comment: string
  created_at: string
}

export interface MockAchievement {
  id: string
  user_id: string
  type: string
  title: string
  description: string
  earned_at: string
  icon: string
}

// Initialize mock data
const initializeMockData = () => {
  const mockData = {
    currentUser: {
      id: "user-1",
      email: "you@example.com",
      full_name: "Your Name",
      role: "admin" as const,
      phone: "555-0123",
      avatar_url: "/diverse-user-avatars.png",
      emergency_contact_name: "Jane Doe",
      emergency_contact_phone: "555-0199",
      medical_notes: "None",
      injuries: "None",
      skill_level: "intermediate" as const,
      preferences: ["Vinyasa", "Yin"],
      tags: ["active", "member"],
      waiver_signed_date: "2024-01-15",
      joined_date: "2024-01-15",
    },

    locations: [
      {
        id: "loc-1",
        name: "Downtown Studio",
        address: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        phone: "555-YOGA-01",
        email: "downtown@pranaplanner.com",
      },
      {
        id: "loc-2",
        name: "Sunset District Studio",
        address: "456 Ocean Avenue",
        city: "San Francisco",
        state: "CA",
        zip: "94116",
        phone: "555-YOGA-02",
        email: "sunset@pranaplanner.com",
      },
    ],

    rooms: [
      {
        id: "room-1",
        location_id: "loc-1",
        name: "Studio A",
        capacity: 25,
        amenities: ["Props", "Sound System", "Mirrors", "Natural Light"],
        is_heated: false,
      },
      {
        id: "room-2",
        location_id: "loc-1",
        name: "Studio B",
        capacity: 20,
        amenities: ["Props", "Sound System", "Dim Lighting"],
        is_heated: false,
      },
      {
        id: "room-3",
        location_id: "loc-1",
        name: "Studio C - Restorative",
        capacity: 12,
        amenities: ["Props", "Bolsters", "Blankets", "Soft Lighting"],
        is_heated: false,
      },
      {
        id: "room-4",
        location_id: "loc-1",
        name: "Hot Studio",
        capacity: 30,
        amenities: ["Props", "Heated Floor", "Humidity Control"],
        is_heated: true,
      },
      {
        id: "room-5",
        location_id: "loc-2",
        name: "Ocean View Studio",
        capacity: 20,
        amenities: ["Props", "Sound System", "Ocean View", "Natural Light"],
        is_heated: false,
      },
    ],

    classes: [
      {
        id: "class-1",
        name: "Vinyasa Flow",
        description:
          "Dynamic flowing sequences linking breath with movement. Perfect for building strength and flexibility.",
        duration: 60,
        capacity: 20,
        difficulty_level: "intermediate",
        color: "#10b981",
        style: "Vinyasa",
        instructor_id: "instructor-1",
        instructor_name: "Sarah Johnson",
        location_id: "loc-1",
        room_id: "room-1",
        price: 25,
        image_url: "/vinyasa-yoga-class.jpg",
      },
      {
        id: "class-2",
        name: "Yin Yoga",
        description: "Slow-paced practice with longer holds for deep stretching and meditation.",
        duration: 75,
        capacity: 15,
        difficulty_level: "beginner",
        color: "#8b5cf6",
        style: "Yin",
        instructor_id: "instructor-2",
        instructor_name: "Michael Chen",
        location_id: "loc-1",
        room_id: "room-2",
        price: 25,
        image_url: "/yin-yoga-class.jpg",
      },
      {
        id: "class-3",
        name: "Power Yoga",
        description: "Vigorous workout building strength, stamina, and flexibility.",
        duration: 60,
        capacity: 25,
        difficulty_level: "advanced",
        color: "#ef4444",
        style: "Power",
        instructor_id: "instructor-3",
        instructor_name: "Emma Rodriguez",
        location_id: "loc-1",
        room_id: "room-1",
        price: 30,
        image_url: "/power-yoga-class.png",
      },
      {
        id: "class-4",
        name: "Hatha Basics",
        description: "Traditional yoga focusing on alignment, breath, and foundational poses.",
        duration: 60,
        capacity: 20,
        difficulty_level: "beginner",
        color: "#3b82f6",
        style: "Hatha",
        instructor_id: "instructor-1",
        instructor_name: "Sarah Johnson",
        location_id: "loc-1",
        room_id: "room-2",
        price: 20,
        image_url: "/hatha-yoga-class.png",
      },
      {
        id: "class-5",
        name: "Restorative Yoga",
        description: "Gentle practice using props for deep relaxation and stress relief.",
        duration: 90,
        capacity: 12,
        difficulty_level: "all_levels",
        color: "#06b6d4",
        style: "Restorative",
        instructor_id: "instructor-2",
        instructor_name: "Michael Chen",
        location_id: "loc-1",
        room_id: "room-3",
        price: 25,
        image_url: "/restorative-yoga.jpg",
      },
      {
        id: "class-6",
        name: "Hot Yoga",
        description: "Heated room practice for detoxification, flexibility, and cardiovascular health.",
        duration: 60,
        capacity: 30,
        difficulty_level: "intermediate",
        color: "#f59e0b",
        style: "Hot",
        instructor_id: "instructor-3",
        instructor_name: "Emma Rodriguez",
        location_id: "loc-1",
        room_id: "room-4",
        price: 30,
        image_url: "/hot-yoga-class.jpg",
      },
      {
        id: "class-7",
        name: "Prenatal Yoga",
        description: "Safe and gentle yoga designed specifically for expecting mothers.",
        duration: 60,
        capacity: 12,
        difficulty_level: "beginner",
        color: "#ec4899",
        style: "Prenatal",
        instructor_id: "instructor-4",
        instructor_name: "Lisa Martinez",
        location_id: "loc-1",
        room_id: "room-2",
        price: 28,
        image_url: "/prenatal-yoga.jpg",
      },
      {
        id: "class-8",
        name: "Ashtanga Primary Series",
        description: "Traditional Ashtanga sequence with focus on breath and movement synchronization.",
        duration: 90,
        capacity: 18,
        difficulty_level: "advanced",
        color: "#7c3aed",
        style: "Ashtanga",
        instructor_id: "instructor-5",
        instructor_name: "David Kim",
        location_id: "loc-1",
        room_id: "room-1",
        price: 32,
        image_url: "/ashtanga-yoga.jpg",
      },
    ],

    classInstances: generateClassInstances(),

    membershipTypes: [
      {
        id: "mem-type-1",
        name: "Unlimited Monthly",
        description: "Unlimited classes for 30 days. Perfect for dedicated practitioners.",
        type: "unlimited" as const,
        price: 149,
        duration_days: 30,
        tier: "gold",
      },
      {
        id: "mem-type-2",
        name: "10 Class Pack",
        description: "10 classes to use within 90 days. Great flexibility for busy schedules.",
        type: "class_pack" as const,
        price: 200,
        duration_days: 90,
        class_count: 10,
        tier: "silver",
      },
      {
        id: "mem-type-3",
        name: "5 Class Pack",
        description: "5 classes to use within 60 days. Perfect for beginners.",
        type: "class_pack" as const,
        price: 110,
        duration_days: 60,
        class_count: 5,
        tier: "bronze",
      },
      {
        id: "mem-type-4",
        name: "Annual Unlimited",
        description: "Unlimited classes for 365 days - Best Value! Save over $300.",
        type: "unlimited" as const,
        price: 1499,
        duration_days: 365,
        tier: "platinum",
      },
      {
        id: "mem-type-5",
        name: "20 Class Pack",
        description: "20 classes to use within 120 days. Maximum value for regular practitioners.",
        type: "class_pack" as const,
        price: 380,
        duration_days: 120,
        class_count: 20,
        tier: "gold",
      },
    ],

    workshops: [
      {
        id: "workshop-1",
        title: "Yoga for Beginners Workshop",
        description:
          "Learn the fundamentals of yoga in this comprehensive 3-hour workshop covering basic poses, breathing techniques, and yoga philosophy.",
        instructor_id: "instructor-1",
        instructor_name: "Sarah Johnson",
        start_date: "2025-02-15T10:00:00",
        end_date: "2025-02-15T13:00:00",
        price: 75,
        early_bird_price: 60,
        capacity: 20,
        registered_count: 12,
        type: "workshop",
        image_url: "/yoga-beginners-workshop-indoor-studio.jpg",
      },
      {
        id: "workshop-2",
        title: "Advanced Inversions",
        description: "Master headstands, handstands, and arm balances with proper alignment and safety techniques.",
        instructor_id: "instructor-3",
        instructor_name: "Emma Rodriguez",
        start_date: "2025-02-22T14:00:00",
        end_date: "2025-02-22T17:00:00",
        price: 85,
        early_bird_price: 70,
        capacity: 15,
        registered_count: 8,
        type: "workshop",
        image_url: "/advanced-yoga-inversions-handstand.jpg",
      },
      {
        id: "workshop-3",
        title: "Meditation & Mindfulness Retreat",
        description: "Full day retreat focusing on meditation techniques, mindfulness practices, and stress reduction.",
        instructor_id: "instructor-2",
        instructor_name: "Michael Chen",
        start_date: "2025-03-01T09:00:00",
        end_date: "2025-03-01T17:00:00",
        price: 150,
        early_bird_price: 125,
        capacity: 25,
        registered_count: 18,
        type: "retreat",
        image_url: "/peaceful-meditation-retreat-nature.jpg",
      },
      {
        id: "workshop-4",
        title: "Yoga for Athletes",
        description: "Specialized workshop for athletes focusing on flexibility, recovery, and injury prevention.",
        instructor_id: "instructor-5",
        instructor_name: "David Kim",
        start_date: "2025-03-08T13:00:00",
        end_date: "2025-03-08T16:00:00",
        price: 80,
        early_bird_price: 65,
        capacity: 20,
        registered_count: 14,
        type: "workshop",
        image_url: "/athletic-yoga-stretching-flexibility.jpg",
      },
    ],

    products: [
      {
        id: "prod-1",
        name: "Premium Yoga Mat",
        description: "Eco-friendly, non-slip yoga mat with extra cushioning. 6mm thickness, made from natural rubber.",
        price: 79.99,
        category: "mats",
        stock_quantity: 25,
        sku: "MAT-001",
        image_url: "/premium-yoga-mat-rolled-purple.jpg",
      },
      {
        id: "prod-2",
        name: "Yoga Block Set",
        description: "Set of 2 cork yoga blocks for support and alignment. Sustainable and durable.",
        price: 29.99,
        category: "props",
        stock_quantity: 40,
        sku: "BLOCK-001",
        image_url: "/cork-yoga-blocks-set-natural.jpg",
      },
      {
        id: "prod-3",
        name: "Yoga Strap",
        description: "8ft cotton yoga strap with D-ring buckle. Perfect for deepening stretches.",
        price: 14.99,
        category: "props",
        stock_quantity: 50,
        sku: "STRAP-001",
        image_url: "/cotton-yoga-strap-blue.jpg",
      },
      {
        id: "prod-4",
        name: "Meditation Cushion",
        description: "Comfortable zafu cushion for meditation practice. Filled with buckwheat hulls.",
        price: 49.99,
        category: "props",
        stock_quantity: 15,
        sku: "CUSH-001",
        image_url: "/meditation-zafu-cushion-round.jpg",
      },
      {
        id: "prod-5",
        name: "Yoga Towel",
        description: "Microfiber yoga towel with non-slip grip. Perfect for hot yoga.",
        price: 24.99,
        category: "accessories",
        stock_quantity: 30,
        sku: "TOWEL-001",
        image_url: "/microfiber-yoga-towel-teal.jpg",
      },
      {
        id: "prod-6",
        name: "Water Bottle",
        description: "Insulated stainless steel water bottle - 24oz. Keeps drinks cold for 24 hours.",
        price: 34.99,
        category: "accessories",
        stock_quantity: 45,
        sku: "BOTTLE-001",
        image_url: "/insulated-water-bottle-stainless-steel.jpg",
      },
      {
        id: "prod-7",
        name: "Yoga Bolster",
        description: "Rectangular yoga bolster for restorative poses. Filled with cotton batting.",
        price: 64.99,
        category: "props",
        stock_quantity: 12,
        sku: "BOLSTER-001",
        image_url: "/yoga-bolster-rectangular-pillow.jpg",
      },
      {
        id: "prod-8",
        name: "Yoga Blanket",
        description: "Soft cotton yoga blanket for warmth and support during practice.",
        price: 39.99,
        category: "props",
        stock_quantity: 20,
        sku: "BLANKET-001",
        image_url: "/soft-cotton-yoga-blanket-folded.jpg",
      },
      {
        id: "prod-9",
        name: "Essential Oil Set",
        description: "Set of 6 essential oils for aromatherapy and relaxation.",
        price: 44.99,
        category: "wellness",
        stock_quantity: 18,
        sku: "OIL-001",
        image_url: "/essential-oils-aromatherapy-bottles.jpg",
      },
      {
        id: "prod-10",
        name: "Yoga Mat Bag",
        description: "Canvas yoga mat bag with adjustable strap and pockets.",
        price: 29.99,
        category: "accessories",
        stock_quantity: 35,
        sku: "BAG-001",
        image_url: "/canvas-yoga-mat-bag-carrier.jpg",
      },
    ],

    bookings: [],
    memberships: [],

    instructors: [
      {
        id: "instructor-1",
        email: "sarah@pranaplanner.com",
        full_name: "Sarah Johnson",
        name: "Sarah Johnson",
        role: "instructor" as const,
        phone: "555-0101",
        avatar_url: "/professional-female-yoga-instructor.png",
        bio: "Sarah has been teaching yoga for over 10 years. She specializes in Vinyasa and Hatha yoga.",
        certifications: ["RYT-500", "Prenatal Yoga", "Yin Yoga"],
        specialties: ["Vinyasa", "Hatha", "Alignment"],
        hourly_rate: 75,
      },
      {
        id: "instructor-2",
        email: "michael@pranaplanner.com",
        full_name: "Michael Chen",
        name: "Michael Chen",
        role: "instructor" as const,
        phone: "555-0102",
        avatar_url: "/professional-male-yoga-instructor-portrait.jpg",
        bio: "Michael brings mindfulness and meditation into every class. Certified in Yin and Restorative yoga.",
        certifications: ["RYT-200", "Meditation Teacher", "Restorative Yoga"],
        specialties: ["Yin", "Restorative", "Meditation"],
        hourly_rate: 70,
      },
      {
        id: "instructor-3",
        email: "emma@pranaplanner.com",
        full_name: "Emma Rodriguez",
        name: "Emma Rodriguez",
        role: "instructor" as const,
        phone: "555-0103",
        avatar_url: "/athletic-female-yoga-instructor-smiling.jpg",
        bio: "Emma is passionate about power yoga and helping students build strength and confidence.",
        certifications: ["RYT-500", "Hot Yoga", "Power Yoga"],
        specialties: ["Power", "Hot Yoga", "Strength Building"],
        hourly_rate: 80,
      },
      {
        id: "instructor-4",
        email: "lisa@pranaplanner.com",
        full_name: "Lisa Martinez",
        name: "Lisa Martinez",
        role: "instructor" as const,
        phone: "555-0104",
        avatar_url: "/gentle-female-yoga-instructor-calm.jpg",
        bio: "Lisa specializes in prenatal and postnatal yoga, supporting mothers through their journey.",
        certifications: ["RYT-200", "Prenatal Yoga", "Postnatal Yoga"],
        specialties: ["Prenatal", "Gentle", "Therapeutic"],
        hourly_rate: 75,
      },
      {
        id: "instructor-5",
        email: "david@pranaplanner.com",
        full_name: "David Kim",
        name: "David Kim",
        role: "instructor" as const,
        phone: "555-0105",
        avatar_url: "/experienced-male-yoga-instructor-confident.jpg",
        bio: "David is an Ashtanga practitioner with 15 years of experience. He loves teaching traditional sequences.",
        certifications: ["RYT-500", "Ashtanga Authorization", "Yoga Therapy"],
        specialties: ["Ashtanga", "Traditional", "Advanced Practice"],
        hourly_rate: 85,
      },
    ],

    clients: [
      {
        id: "client-1",
        email: "john.doe@email.com",
        full_name: "John Doe",
        role: "client" as const,
        phone: "555-1001",
        date_of_birth: "1985-06-15",
        joined_date: "2024-01-10",
        emergency_contact_name: "Jane Doe",
        emergency_contact_phone: "555-1002",
        medical_notes: "None",
        injuries: "None",
        skill_level: "intermediate" as const,
        preferences: ["Vinyasa", "Yin"],
        tags: ["active", "member"],
        waiver_signed_date: "2024-01-10",
      },
      {
        id: "client-2",
        email: "mary.smith@email.com",
        full_name: "Mary Smith",
        role: "client" as const,
        phone: "555-1003",
        date_of_birth: "1990-03-22",
        joined_date: "2024-02-05",
        emergency_contact_name: "Bob Smith",
        emergency_contact_phone: "555-1004",
        medical_notes: "None",
        injuries: "None",
        skill_level: "beginner" as const,
        preferences: ["Yin"],
        tags: ["beginner"],
        waiver_signed_date: "2024-02-05",
      },
      {
        id: "client-3",
        email: "alex.wong@email.com",
        full_name: "Alex Wong",
        role: "client" as const,
        phone: "555-1005",
        date_of_birth: "1988-11-30",
        joined_date: "2024-03-12",
        emergency_contact_name: "Lisa Wong",
        emergency_contact_phone: "555-1006",
        medical_notes: "None",
        injuries: "None",
        skill_level: "advanced" as const,
        preferences: ["Power Yoga"],
        tags: ["advanced"],
        waiver_signed_date: "2024-03-12",
      },
    ],

    notifications: [
      {
        id: "notif-1",
        user_id: "user-1",
        title: "Class Reminder",
        message: "Your Vinyasa Flow class starts in 1 hour",
        type: "class" as const,
        read: false,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: "notif-2",
        user_id: "user-1",
        title: "Membership Expiring Soon",
        message: "Your membership expires in 7 days. Renew now to continue enjoying unlimited classes.",
        type: "membership" as const,
        read: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "notif-3",
        user_id: "user-1",
        title: "New Workshop Available",
        message: "Advanced Inversions workshop is now open for registration!",
        type: "promotion" as const,
        read: true,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],

    reviews: [
      {
        id: "review-1",
        user_id: "client-1",
        user_name: "John Doe",
        class_id: "class-1",
        instructor_id: "instructor-1",
        rating: 5,
        comment: "Sarah is an amazing instructor! Her cues are clear and the flow is perfect.",
        created_at: "2025-01-20T10:30:00",
      },
      {
        id: "review-2",
        user_id: "client-2",
        user_name: "Mary Smith",
        class_id: "class-2",
        instructor_id: "instructor-2",
        rating: 5,
        comment: "Michael's Yin class is so relaxing. I always leave feeling refreshed.",
        created_at: "2025-01-21T14:15:00",
      },
      {
        id: "review-3",
        user_id: "client-3",
        user_name: "Alex Wong",
        class_id: "class-3",
        instructor_id: "instructor-3",
        rating: 4,
        comment: "Great workout! Emma really pushes you to your limits in the best way.",
        created_at: "2025-01-22T08:45:00",
      },
    ],

    achievements: [
      {
        id: "achieve-1",
        user_id: "user-1",
        type: "milestone",
        title: "First Class Complete",
        description: "Completed your first yoga class",
        earned_at: "2024-01-15T10:00:00",
        icon: "🎉",
      },
      {
        id: "achieve-2",
        user_id: "user-1",
        type: "streak",
        title: "7 Day Streak",
        description: "Practiced yoga for 7 days in a row",
        earned_at: "2024-02-01T18:00:00",
        icon: "🔥",
      },
      {
        id: "achieve-3",
        user_id: "user-1",
        type: "milestone",
        title: "50 Classes",
        description: "Attended 50 yoga classes",
        earned_at: "2024-12-15T12:00:00",
        icon: "⭐",
      },
    ],
  }

  return mockData
}

// Helper function to generate class instances for the next 14 days
function generateClassInstances(): MockClassInstance[] {
  const instances: MockClassInstance[] = []
  const today = new Date()

  const schedule = [
    {
      classId: "class-3",
      className: "Power Yoga",
      instructorId: "instructor-3",
      instructorName: "Emma Rodriguez",
      time: "06:00",
      duration: 60,
      capacity: 25,
      room: "Studio A",
      location: "Downtown Studio",
    },
    {
      classId: "class-1",
      className: "Vinyasa Flow",
      instructorId: "instructor-1",
      instructorName: "Sarah Johnson",
      time: "09:00",
      duration: 60,
      capacity: 20,
      room: "Studio A",
      location: "Downtown Studio",
    },
    {
      classId: "class-2",
      className: "Yin Yoga",
      instructorId: "instructor-2",
      instructorName: "Michael Chen",
      time: "10:30",
      duration: 75,
      capacity: 15,
      room: "Studio B",
      location: "Downtown Studio",
    },
    {
      classId: "class-4",
      className: "Hatha Basics",
      instructorId: "instructor-1",
      instructorName: "Sarah Johnson",
      time: "12:00",
      duration: 60,
      capacity: 20,
      room: "Studio B",
      location: "Downtown Studio",
    },
    {
      classId: "class-6",
      className: "Hot Yoga",
      instructorId: "instructor-3",
      instructorName: "Emma Rodriguez",
      time: "17:00",
      duration: 60,
      capacity: 30,
      room: "Hot Studio",
      location: "Downtown Studio",
    },
    {
      classId: "class-4",
      className: "Hatha Basics",
      instructorId: "instructor-1",
      instructorName: "Sarah Johnson",
      time: "18:00",
      duration: 60,
      capacity: 20,
      room: "Studio B",
      location: "Downtown Studio",
    },
    {
      classId: "class-5",
      className: "Restorative Yoga",
      instructorId: "instructor-2",
      instructorName: "Michael Chen",
      time: "19:00",
      duration: 90,
      capacity: 12,
      room: "Studio C",
      location: "Downtown Studio",
    },
    {
      classId: "class-8",
      className: "Ashtanga Primary Series",
      instructorId: "instructor-5",
      instructorName: "David Kim",
      time: "07:00",
      duration: 90,
      capacity: 18,
      room: "Studio A",
      location: "Downtown Studio",
    },
    {
      classId: "class-7",
      className: "Prenatal Yoga",
      instructorId: "instructor-4",
      instructorName: "Lisa Martinez",
      time: "14:00",
      duration: 60,
      capacity: 12,
      room: "Studio B",
      location: "Downtown Studio",
    },
  ]

  for (let day = 0; day < 14; day++) {
    const date = new Date(today)
    date.setDate(date.getDate() + day)
    const dateStr = date.toISOString().split("T")[0]

    schedule.forEach((sched, idx) => {
      const [hours, minutes] = sched.time.split(":")
      const startTime = new Date(date)
      startTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0)

      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + sched.duration)

      instances.push({
        id: `instance-${day}-${idx}`,
        class_id: sched.classId,
        class_name: sched.className,
        instructor_id: sched.instructorId,
        instructor_name: sched.instructorName,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        date: dateStr,
        capacity: sched.capacity,
        booked_count: Math.floor(Math.random() * (sched.capacity * 0.7)),
        status: "scheduled",
        room_name: sched.room,
        location_name: sched.location,
      })
    })
  }

  return instances
}

// Mock data manager
export class MockDataManager {
  private data: ReturnType<typeof initializeMockData>

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      this.data = JSON.parse(stored)
    } else {
      this.data = initializeMockData()
      this.save()
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
  }

  // User methods
  getCurrentUser() {
    return this.data.currentUser
  }

  updateCurrentUser(updates: Partial<MockUser>) {
    this.data.currentUser = { ...this.data.currentUser, ...updates }
    this.save()
  }

  // Class methods
  getClasses() {
    return this.data.classes
  }

  getClass(id: string) {
    return this.data.classes.find((c) => c.id === id)
  }

  // Class instance methods
  getClassInstances(filters?: { date?: string; classId?: string }) {
    let instances = this.data.classInstances

    if (filters?.date) {
      instances = instances.filter((i) => i.date === filters.date)
    }
    if (filters?.classId) {
      instances = instances.filter((i) => i.class_id === filters.classId)
    }

    return instances.sort((a, b) => a.start_time.localeCompare(b.start_time))
  }

  getClassInstance(id: string) {
    return this.data.classInstances.find((i) => i.id === id)
  }

  // Booking methods
  getBookings(userId?: string) {
    if (userId) {
      return this.data.bookings.filter((b) => b.user_id === userId)
    }
    return this.data.bookings
  }

  createBooking(instanceId: string) {
    const instance = this.getClassInstance(instanceId)
    if (!instance) return null

    if (instance.booked_count >= instance.capacity) {
      return null // Class is full
    }

    const booking: MockBooking = {
      id: `booking-${Date.now()}`,
      user_id: this.data.currentUser.id,
      class_instance_id: instanceId,
      status: "confirmed",
      checked_in: false,
      created_at: new Date().toISOString(),
    }

    this.data.bookings.push(booking)
    instance.booked_count++
    this.save()

    return booking
  }

  cancelBooking(bookingId: string) {
    const bookingIndex = this.data.bookings.findIndex((b) => b.id === bookingId)
    if (bookingIndex === -1) return false

    const booking = this.data.bookings[bookingIndex]
    const instance = this.getClassInstance(booking.class_instance_id)

    if (instance) {
      instance.booked_count--
    }

    this.data.bookings.splice(bookingIndex, 1)
    this.save()

    return true
  }

  // Membership methods
  getMemberships(userId?: string) {
    if (userId) {
      return this.data.memberships.filter((m) => m.user_id === userId)
    }
    return this.data.memberships
  }

  getMembershipTypes() {
    return this.data.membershipTypes
  }

  createMembership(typeId: string) {
    const type = this.data.membershipTypes.find((t) => t.id === typeId)
    if (!type) return null

    const startDate = new Date()
    const endDate = type.duration_days
      ? new Date(startDate.getTime() + type.duration_days * 24 * 60 * 60 * 1000)
      : undefined

    const membership: MockMembership = {
      id: `membership-${Date.now()}`,
      user_id: this.data.currentUser.id,
      membership_type_id: typeId,
      type_name: type.name,
      status: "active",
      start_date: startDate.toISOString(),
      end_date: endDate?.toISOString(),
      classes_remaining: type.class_count,
      auto_renew: false,
    }

    this.data.memberships.push(membership)
    this.save()

    return membership
  }

  // Workshop methods
  getWorkshops() {
    return this.data.workshops
  }

  getWorkshop(id: string) {
    return this.data.workshops.find((w) => w.id === id)
  }

  // Product methods
  getProducts() {
    return this.data.products
  }

  getProduct(id: string) {
    return this.data.products.find((p) => p.id === id)
  }

  // Instructor methods
  getInstructors() {
    return this.data.instructors
  }

  getInstructor(id: string) {
    return this.data.instructors.find((i) => i.id === id)
  }

  getLocations() {
    return this.data.locations
  }

  getLocation(id: string) {
    return this.data.locations.find((l) => l.id === id)
  }

  getRooms(locationId?: string) {
    if (locationId) {
      return this.data.rooms.filter((r) => r.location_id === locationId)
    }
    return this.data.rooms
  }

  getRoom(id: string) {
    return this.data.rooms.find((r) => r.id === id)
  }

  getClients() {
    return this.data.clients
  }

  getClient(id: string) {
    return this.data.clients.find((c) => c.id === id)
  }

  getNotifications(userId: string) {
    return this.data.notifications.filter((n) => n.user_id === userId)
  }

  markNotificationRead(notificationId: string) {
    const notification = this.data.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.save()
    }
  }

  getReviews(filters?: { classId?: string; instructorId?: string }) {
    let reviews = this.data.reviews
    if (filters?.classId) {
      reviews = reviews.filter((r) => r.class_id === filters.classId)
    }
    if (filters?.instructorId) {
      reviews = reviews.filter((r) => r.instructor_id === filters.instructorId)
    }
    return reviews
  }

  getAchievements(userId: string) {
    return this.data.achievements.filter((a) => a.user_id === userId)
  }

  getData() {
    return this.data
  }

  // Reset data
  reset() {
    this.data = initializeMockData()
    this.save()
  }
}

// Singleton instance
let mockDataManagerInstance: MockDataManager | null = null

export function getMockDataManager() {
  if (typeof window === "undefined") {
    const tempData = initializeMockData()
    const tempManager = Object.create(MockDataManager.prototype)
    tempManager.data = tempData
    tempManager.save = () => {} // No-op on server
    tempManager.getData = () => tempData // Explicitly add getData method
    // Add all other methods
    Object.getOwnPropertyNames(MockDataManager.prototype).forEach((name) => {
      if (name !== "constructor" && name !== "getData") {
        tempManager[name] = MockDataManager.prototype[name]
      }
    })
    return tempManager as MockDataManager
  }

  if (!mockDataManagerInstance) {
    mockDataManagerInstance = new MockDataManager()
  }

  return mockDataManagerInstance
}

export const mockDataManager = getMockDataManager()

export function getMockData() {
  return getMockDataManager().getData()
}
