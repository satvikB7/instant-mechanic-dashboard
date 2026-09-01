import { faker } from "@faker-js/faker";
import { pool } from "../config/database";

async function seedDatabase() {
  console.log("Starting database seed...");

  await pool.query(`
    TRUNCATE TABLE
      bookings,
      vehicles,
      mechanics,
      services,
      customers
    RESTART IDENTITY CASCADE;
  `);

  // -------------------------
  // SERVICES
  // -------------------------

  const services = [
    {
      name: "Oil Change",
      category: "Maintenance",
      description: "Engine oil and oil filter replacement",
      basePrice: 1499,
    },
    {
      name: "Brake Inspection",
      category: "Inspection",
      description: "Complete brake system inspection",
      basePrice: 999,
    },
    {
      name: "Battery Replacement",
      category: "Repair",
      description: "Car battery replacement and installation",
      basePrice: 4500,
    },
    {
      name: "AC Service",
      category: "Maintenance",
      description: "Car air conditioning inspection and servicing",
      basePrice: 2499,
    },
    {
      name: "Engine Diagnostics",
      category: "Inspection",
      description: "Complete engine diagnostic check",
      basePrice: 1999,
    },
    {
      name: "Tyre Replacement",
      category: "Repair",
      description: "Tyre replacement and wheel balancing",
      basePrice: 5500,
    },
    {
      name: "General Service",
      category: "Maintenance",
      description: "Comprehensive periodic car service",
      basePrice: 3499,
    },
    {
      name: "Wheel Alignment",
      category: "Maintenance",
      description: "Four-wheel alignment and balancing",
      basePrice: 1299,
    },
    {
      name: "Car Wash",
      category: "Cleaning",
      description: "Exterior and interior car cleaning",
      basePrice: 799,
    },
    {
      name: "Emergency Breakdown",
      category: "Emergency",
      description: "Emergency roadside assistance",
      basePrice: 1999,
    },
    {
      name: "Coolant Replacement",
      category: "Maintenance",
      description: "Engine coolant replacement",
      basePrice: 1299,
    },
    {
      name: "Clutch Inspection",
      category: "Inspection",
      description: "Clutch system inspection and diagnosis",
      basePrice: 1799,
    },
  ];

  for (const service of services) {
    await pool.query(
      `
      INSERT INTO services
        (name, category, description, base_price)
      VALUES
        ($1, $2, $3, $4)
      `,
      [
        service.name,
        service.category,
        service.description,
        service.basePrice,
      ]
    );
  }

  // -------------------------
  // CUSTOMERS
  // -------------------------

  for (let i = 0; i < 60; i++) {
    await pool.query(
      `
      INSERT INTO customers
        (name, email, phone, created_at)
      VALUES
        ($1, $2, $3, $4)
      `,
      [
        faker.person.fullName(),
        faker.internet.email().toLowerCase(),
        faker.string.numeric(10),
        faker.date.between({
          from: "2025-01-01",
          to: new Date(),
        }),
      ]
    );
  }

  const customerResult = await pool.query(
    "SELECT id FROM customers ORDER BY id"
  );

  const customerIds = customerResult.rows.map(
    (customer) => customer.id
  );

  // -------------------------
  // VEHICLES
  // -------------------------

  const vehicleMakes = [
    "Maruti Suzuki",
    "Hyundai",
    "Honda",
    "Toyota",
    "Tata",
    "Mahindra",
    "Kia",
    "Volkswagen",
    "Skoda",
    "MG",
  ];

  const vehicleModels = [
    "Swift",
    "Creta",
    "City",
    "Nexon",
    "Fortuner",
    "Seltos",
    "Baleno",
    "Thar",
    "Virtus",
    "XUV700",
  ];

  for (let i = 0; i < 80; i++) {
    const customerId =
      faker.helpers.arrayElement(customerIds);

    const make =
      faker.helpers.arrayElement(vehicleMakes);

    const model =
      faker.helpers.arrayElement(vehicleModels);

    await pool.query(
      `
      INSERT INTO vehicles
        (
          customer_id,
          make,
          model,
          year,
          registration_number
        )
      VALUES
        ($1, $2, $3, $4, $5)
      `,
      [
        customerId,
        make,
        model,
        faker.number.int({
          min: 2016,
          max: 2025,
        }),
        `TS${faker.string.numeric(2)}${faker.string.alpha({
          length: 2,
          casing: "upper",
        })}${faker.string.numeric(4)}`,
      ]
    );
  }

  const vehicleResult = await pool.query(
    "SELECT id, customer_id FROM vehicles ORDER BY id"
  );

  const vehicles = vehicleResult.rows;

  // -------------------------
  // MECHANICS
  // -------------------------

  const mechanicStatuses = [
    "AVAILABLE",
    "BUSY",
    "ON_THE_WAY",
    "OFFLINE",
  ];

  const specializations = [
    "Engine Repair",
    "Brake Systems",
    "Electrical Systems",
    "AC & Cooling",
    "General Service",
    "Transmission",
  ];

  for (let i = 0; i < 25; i++) {
    await pool.query(
      `
      INSERT INTO mechanics
        (
          name,
          phone,
          status,
          specialization,
          jobs_completed
        )
      VALUES
        ($1, $2, $3, $4, $5)
      `,
      [
        faker.person.fullName(),
        faker.string.numeric(10),
        faker.helpers.arrayElement(mechanicStatuses),
        faker.helpers.arrayElement(specializations),
        faker.number.int({
          min: 20,
          max: 250,
        }),
      ]
    );
  }

  const mechanicResult = await pool.query(
    "SELECT id FROM mechanics ORDER BY id"
  );

  const mechanicIds = mechanicResult.rows.map(
    (mechanic) => mechanic.id
  );

  // -------------------------
  // SERVICES DATA
  // -------------------------

  const serviceResult = await pool.query(
    "SELECT id, base_price FROM services ORDER BY id"
  );

  const serviceData = serviceResult.rows;

  // -------------------------
  // BOOKINGS
  // -------------------------

  const bookingStatuses = [
    "PENDING",
    "ASSIGNED",
    "MECHANIC_ON_THE_WAY",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];

  for (let i = 0; i < 600; i++) {
    const customerId =
      faker.helpers.arrayElement(customerIds);

    const customerVehicles = vehicles.filter(
      (vehicle) =>
        vehicle.customer_id === customerId
    );

    const vehicle =
      customerVehicles.length > 0
        ? faker.helpers.arrayElement(
            customerVehicles
          )
        : faker.helpers.arrayElement(vehicles);

    const service =
      faker.helpers.arrayElement(serviceData);

    const status =
      faker.helpers.arrayElement(
        bookingStatuses
      );

    const mechanicId =
      status === "PENDING" ||
      status === "CANCELLED"
        ? null
        : faker.helpers.arrayElement(
            mechanicIds
          );

    const amount =
      Number(service.base_price) +
      faker.number.int({
        min: 0,
        max: 2500,
      });

    await pool.query(
      `
      INSERT INTO bookings
        (
          customer_id,
          vehicle_id,
          service_id,
          mechanic_id,
          status,
          amount,
          scheduled_at
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        customerId,
        vehicle.id,
        service.id,
        mechanicId,
        status,
        amount,
        faker.date.between({
          from: "2025-01-01",
          to: "2026-09-30",
        }),
      ]
    );
  }

  console.log("Database seed completed.");
}

seedDatabase()
  .then(async () => {
    console.log(
      "Database seeded successfully!"
    );

    await pool.end();
  })
  .catch(async (error) => {
    console.error(
      "Database seeding failed:",
      error
    );

    await pool.end();

    process.exit(1);
  });