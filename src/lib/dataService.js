// Mock Data Service for Pharmacy Management System
// This service provides CRUD operations based on the JSON schemas in the data folder

// Initial mock data based on the schemas
const initialMedicines = [
  {
    id: "1",
    name_ar: "باراسيتامول",
    name_en: "Paracetamol",
    manufacturer: "شركة الأدوية العربية",
    active_ingredient: "باراسيتامول",
    price: 15,
    quantity: 100,
    existing_stock: 85,
    category: "مسكنات",
    requires_prescription: false,
    expiration_date: "2025-12-31",
    barcode: "1234567890123",
    description: "مسكن للألم وخافض للحرارة",
    image_url: "",
    storage_location: "رف A1",
    status: "متوفر"
  },
  {
    id: "2",
    name_ar: "أموكسيسيلين",
    name_en: "Amoxicillin",
    manufacturer: "شركة فارما",
    active_ingredient: "أموكسيسيلين",
    price: 25,
    quantity: 50,
    existing_stock: 42,
    category: "مضادات حيوية",
    requires_prescription: true,
    expiration_date: "2025-06-30",
    barcode: "1234567890124",
    description: "مضاد حيوي للعدوى البكتيرية",
    image_url: "",
    storage_location: "رف B2",
    status: "متوفر"
  },
  {
    id: "3",
    name_ar: "إيبوبروفين",
    name_en: "Ibuprofen",
    manufacturer: "شركة الأدوية العربية",
    active_ingredient: "إيبوبروفين",
    price: 20,
    quantity: 75,
    existing_stock: 60,
    category: "مسكنات",
    requires_prescription: false,
    expiration_date: "2025-08-15",
    barcode: "1234567890125",
    description: "مسكن ومضاد للالتهاب",
    image_url: "",
    storage_location: "رف A3",
    status: "متوفر"
  },
  {
    id: "4",
    name_ar: "أوميبرازول",
    name_en: "Omeprazole",
    manufacturer: "شركة فارما",
    active_ingredient: "أوميبرازول",
    price: 35,
    quantity: 30,
    existing_stock: 5,
    category: "أدوية الجهاز الهضمي",
    requires_prescription: true,
    expiration_date: "2025-04-20",
    barcode: "1234567890126",
    description: "علاج ارتجاع المريء وقرحة المعدة",
    image_url: "",
    storage_location: "رف C1",
    status: "متوفر"
  },
  {
    id: "5",
    name_ar: "ميتفورمين",
    name_en: "Metformin",
    manufacturer: "شركة الأدوية العربية",
    active_ingredient: "ميتفورمين",
    price: 30,
    quantity: 60,
    existing_stock: 55,
    category: "أدوية السكري",
    requires_prescription: true,
    expiration_date: "2026-01-10",
    barcode: "1234567890127",
    description: "علاج السكري من النوع 2",
    image_url: "",
    storage_location: "رف D1",
    status: "متوفر"
  }
];

const initialSuppliers = [
  {
    id: "1",
    name: "شركة الأدوية العربية",
    contact_person: "أحمد محمد",
    phone: "0501234567",
    email: "ahmed@arabpharma.com",
    address: "الرياض، حي العليا",
    status: "نشط"
  },
  {
    id: "2",
    name: "شركة فارما",
    contact_person: "سارة علي",
    phone: "0509876543",
    email: "sara@pharma.com",
    address: "جدة، حي الروضة",
    status: "نشط"
  },
  {
    id: "3",
    name: "المؤسسة الطبية",
    contact_person: "خالد عبدالله",
    phone: "0555555555",
    email: "khaled@medical.com",
    address: "الدمام، حي الشاطئ",
    status: "نشط"
  }
];

const initialOrders = [
  {
    id: "1",
    customer_name: "محمد أحمد",
    customer_phone: "0512345678",
    status: "جديد",
    total_amount: 45,
    delivery_method: "استلام من الصيدلية",
    prescription_url: "",
    prescription_status: "لا يوجد",
    notes: "",
    items: [
      { medicine_id: "1", medicine_name: "باراسيتامول", quantity: 2, price: 15 },
      { medicine_id: "3", medicine_name: "إيبوبروفين", quantity: 1, price: 20 }
    ],
    expires_at: new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    customer_name: "فاطمة علي",
    customer_phone: "0523456789",
    status: "قيد المراجعة",
    total_amount: 25,
    delivery_method: "توصيل منزلي",
    prescription_url: "",
    prescription_status: "قيد المراجعة",
    notes: "وصفة طبية مرفقة",
    items: [
      { medicine_id: "2", medicine_name: "أموكسيسيلين", quantity: 1, price: 25 }
    ],
    expires_at: new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString()
  }
];

const initialPurchaseOrders = [
  {
    id: "1",
    supplier_id: "1",
    supplier_name: "شركة الأدوية العربية",
    status: "جديد",
    items: [
      { medicine_id: "1", medicine_name: "باراسيتامول", quantity: 50, unit_cost: 10 },
      { medicine_id: "3", medicine_name: "إيبوبروفين", quantity: 30, unit_cost: 15 }
    ],
    total_cost: 950,
    notes: "طلب شهري",
    expected_delivery: "2025-02-15",
    created_at: new Date().toISOString()
  }
];

const initialUsers = [
  {
    id: "1",
    email: "admin@pharmacy.com",
    name: "Admin User",
    role: "admin",
    admin_id: "ADM001"
  },
  {
    id: "2",
    email: "manager@pharmacy.com",
    name: "Manager User",
    role: "manager",
    certificate_number: "MGR001"
  },
  {
    id: "3",
    email: "pharmacist@pharmacy.com",
    name: "Pharmacist User",
    role: "pharmacist",
    license_number: "PHR001"
  },
  {
    id: "4",
    email: "patient@pharmacy.com",
    name: "Patient User",
    role: "patient"
  }
];

const initialAuditLogs = [
  {
    id: "1",
    action: "CREATE",
    entity_type: "Medicine",
    entity_id: "1",
    user_name: "Admin User",
    details: "تم إضافة دواء جديد: باراسيتامول",
    timestamp: new Date().toISOString()
  }
];

// In-memory storage
let medicines = [...initialMedicines];
let suppliers = [...initialSuppliers];
let orders = [...initialOrders];
let purchaseOrders = [...initialPurchaseOrders];
let users = [...initialUsers];
let auditLogs = [...initialAuditLogs];

// Helper function to generate IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Medicine Service
export const medicineService = {
  getAll: () => Promise.resolve([...medicines]),
  
  getById: (id) => Promise.resolve(medicines.find(m => m.id === id)),
  
  create: (data) => {
    const newMedicine = {
      id: generateId(),
      ...data,
      existing_stock: data.quantity || 0
    };
    medicines.push(newMedicine);
    auditLogs.push({
      id: generateId(),
      action: "CREATE",
      entity_type: "Medicine",
      entity_id: newMedicine.id,
      user_name: "Current User",
      details: `تم إضافة دواء جديد: ${data.name_ar}`,
      timestamp: new Date().toISOString()
    });
    return Promise.resolve(newMedicine);
  },
  
  update: (id, data) => {
    const index = medicines.findIndex(m => m.id === id);
    if (index !== -1) {
      medicines[index] = { ...medicines[index], ...data };
      auditLogs.push({
        id: generateId(),
        action: "UPDATE",
        entity_type: "Medicine",
        entity_id: id,
        user_name: "Current User",
        details: `تم تحديث الدواء: ${data.name_ar}`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(medicines[index]);
    }
    return Promise.reject(new Error("Medicine not found"));
  },
  
  delete: (id) => {
    const index = medicines.findIndex(m => m.id === id);
    if (index !== -1) {
      const deleted = medicines.splice(index, 1)[0];
      auditLogs.push({
        id: generateId(),
        action: "DELETE",
        entity_type: "Medicine",
        entity_id: id,
        user_name: "Current User",
        details: `تم حذف الدواء: ${deleted.name_ar}`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(deleted);
    }
    return Promise.reject(new Error("Medicine not found"));
  },
  
  updateStock: (id, quantity) => {
    const medicine = medicines.find(m => m.id === id);
    if (medicine) {
      medicine.existing_stock = quantity;
      medicine.status = quantity > 0 ? "متوفر" : quantity === 0 ? "غير متوفر" : "منتهي الصلاحية";
      return Promise.resolve(medicine);
    }
    return Promise.reject(new Error("Medicine not found"));
  }
};

// Supplier Service
export const supplierService = {
  getAll: () => Promise.resolve([...suppliers]),
  
  getById: (id) => Promise.resolve(suppliers.find(s => s.id === id)),
  
  create: (data) => {
    const newSupplier = {
      id: generateId(),
      ...data
    };
    suppliers.push(newSupplier);
    auditLogs.push({
      id: generateId(),
      action: "CREATE",
      entity_type: "Supplier",
      entity_id: newSupplier.id,
      user_name: "Current User",
      details: `تم إضافة مورد جديد: ${data.name}`,
      timestamp: new Date().toISOString()
    });
    return Promise.resolve(newSupplier);
  },
  
  update: (id, data) => {
    const index = suppliers.findIndex(s => s.id === id);
    if (index !== -1) {
      suppliers[index] = { ...suppliers[index], ...data };
      auditLogs.push({
        id: generateId(),
        action: "UPDATE",
        entity_type: "Supplier",
        entity_id: id,
        user_name: "Current User",
        details: `تم تحديث المورد: ${data.name}`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(suppliers[index]);
    }
    return Promise.reject(new Error("Supplier not found"));
  },
  
  delete: (id) => {
    const index = suppliers.findIndex(s => s.id === id);
    if (index !== -1) {
      const deleted = suppliers.splice(index, 1)[0];
      auditLogs.push({
        id: generateId(),
        action: "DELETE",
        entity_type: "Supplier",
        entity_id: id,
        user_name: "Current User",
        details: `تم حذف المورد: ${deleted.name}`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(deleted);
    }
    return Promise.reject(new Error("Supplier not found"));
  }
};

// Order Service
export const orderService = {
  getAll: () => Promise.resolve([...orders]),
  
  getById: (id) => Promise.resolve(orders.find(o => o.id === id)),
  
  create: (data) => {
    const newOrder = {
      id: generateId(),
      ...data,
      status: "جديد",
      created_at: new Date().toISOString()
    };
    orders.push(newOrder);
    auditLogs.push({
      id: generateId(),
      action: "CREATE",
      entity_type: "Order",
      entity_id: newOrder.id,
      user_name: "Current User",
      details: `تم إنشاء طلب جديد: ${data.customer_name}`,
      timestamp: new Date().toISOString()
    });
    return Promise.resolve(newOrder);
  },
  
  update: (id, data) => {
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...data };
      auditLogs.push({
        id: generateId(),
        action: "UPDATE",
        entity_type: "Order",
        entity_id: id,
        user_name: "Current User",
        details: `تم تحديث الطلب: ${data.status}`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(orders[index]);
    }
    return Promise.reject(new Error("Order not found"));
  },
  
  updateStatus: (id, status) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      auditLogs.push({
        id: generateId(),
        action: "UPDATE",
        entity_type: "Order",
        entity_id: id,
        user_name: "Current User",
        details: `تم تغيير حالة الطلب إلى: ${status}`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(order);
    }
    return Promise.reject(new Error("Order not found"));
  },
  
  delete: (id) => {
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      const deleted = orders.splice(index, 1)[0];
      auditLogs.push({
        id: generateId(),
        action: "DELETE",
        entity_type: "Order",
        entity_id: id,
        user_name: "Current User",
        details: `تم حذف الطلب: ${deleted.customer_name}`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(deleted);
    }
    return Promise.reject(new Error("Order not found"));
  }
};

// Purchase Order Service
export const purchaseOrderService = {
  getAll: () => Promise.resolve([...purchaseOrders]),
  
  getById: (id) => Promise.resolve(purchaseOrders.find(po => po.id === id)),
  
  create: (data) => {
    const newPO = {
      id: generateId(),
      ...data,
      status: "جديد",
      created_at: new Date().toISOString()
    };
    purchaseOrders.push(newPO);
    auditLogs.push({
      id: generateId(),
      action: "CREATE",
      entity_type: "PurchaseOrder",
      entity_id: newPO.id,
      user_name: "Current User",
      details: `تم إنشاء أمر شراء جديد: ${data.supplier_name}`,
      timestamp: new Date().toISOString()
    });
    return Promise.resolve(newPO);
  },
  
  update: (id, data) => {
    const index = purchaseOrders.findIndex(po => po.id === id);
    if (index !== -1) {
      purchaseOrders[index] = { ...purchaseOrders[index], ...data };
      auditLogs.push({
        id: generateId(),
        action: "UPDATE",
        entity_type: "PurchaseOrder",
        entity_id: id,
        user_name: "Current User",
        details: `تم تحديث أمر الشراء`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(purchaseOrders[index]);
    }
    return Promise.reject(new Error("Purchase Order not found"));
  },
  
  updateStatus: (id, status) => {
    const po = purchaseOrders.find(po => po.id === id);
    if (po) {
      po.status = status;
      // If received, update medicine stock
      if (status === "مستلم" && po.items) {
        po.items.forEach(item => {
          const medicine = medicines.find(m => m.id === item.medicine_id);
          if (medicine) {
            medicine.existing_stock += item.quantity;
            medicine.quantity += item.quantity;
          }
        });
      }
      auditLogs.push({
        id: generateId(),
        action: "UPDATE",
        entity_type: "PurchaseOrder",
        entity_id: id,
        user_name: "Current User",
        details: `تم تغيير حالة أمر الشراء إلى: ${status}`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(po);
    }
    return Promise.reject(new Error("Purchase Order not found"));
  },
  
  delete: (id) => {
    const index = purchaseOrders.findIndex(po => po.id === id);
    if (index !== -1) {
      const deleted = purchaseOrders.splice(index, 1)[0];
      auditLogs.push({
        id: generateId(),
        action: "DELETE",
        entity_type: "PurchaseOrder",
        entity_id: id,
        user_name: "Current User",
        details: `تم حذف أمر الشراء: ${deleted.supplier_name}`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(deleted);
    }
    return Promise.reject(new Error("Purchase Order not found"));
  }
};

// User Service
export const userService = {
  getAll: () => Promise.resolve([...users]),
  
  getById: (id) => Promise.resolve(users.find(u => u.id === id)),
  
  create: (data) => {
    const newUser = {
      id: generateId(),
      ...data
    };
    users.push(newUser);
    auditLogs.push({
      id: generateId(),
      action: "CREATE",
      entity_type: "User",
      entity_id: newUser.id,
      user_name: "Current User",
      details: `تم إضافة مستخدم جديد: ${data.name}`,
      timestamp: new Date().toISOString()
    });
    return Promise.resolve(newUser);
  },
  
  update: (id, data) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      auditLogs.push({
        id: generateId(),
        action: "UPDATE",
        entity_type: "User",
        entity_id: id,
        user_name: "Current User",
        details: `تم تحديث المستخدم: ${data.name}`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(users[index]);
    }
    return Promise.reject(new Error("User not found"));
  },
  
  delete: (id) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      const deleted = users.splice(index, 1)[0];
      auditLogs.push({
        id: generateId(),
        action: "DELETE",
        entity_type: "User",
        entity_id: id,
        user_name: "Current User",
        details: `تم حذف المستخدم: ${deleted.name}`,
        timestamp: new Date().toISOString()
      });
      return Promise.resolve(deleted);
    }
    return Promise.reject(new Error("User not found"));
  }
};

// Audit Log Service
export const auditLogService = {
  getAll: () => Promise.resolve([...auditLogs]),
  
  getById: (id) => Promise.resolve(auditLogs.find(al => al.id === id)),
  
  create: (data) => {
    const newLog = {
      id: generateId(),
      ...data,
      timestamp: new Date().toISOString()
    };
    auditLogs.push(newLog);
    return Promise.resolve(newLog);
  }
};

// Authentication Service (Mock)
export const authService = {
  login: async (email, password) => {
    // Mock authentication - accepts any email with password "password123"
    const user = users.find(u => u.email === email);
    if (user && password === "password123") {
      return Promise.resolve({
        user,
        token: "mock-jwt-token"
      });
    }
    return Promise.reject(new Error("Invalid credentials"));
  },
  
  register: async (userData) => {
    const { email, password, name, role, license_number, certificate_number, admin_id } = userData;
    const newUser = {
      id: generateId(),
      email,
      name,
      role: role || "patient",
      created_date: new Date().toISOString(),
      status: "نشط",
      ...(license_number && { license_number }),
      ...(certificate_number && { certificate_number }),
      ...(admin_id && { admin_id }),
    };
    users.push(newUser);
    return Promise.resolve(newUser);
  },

  verifyOtp: async (email, otpCode) => {
    // Mock OTP verification - accepts any 6-digit code
    if (otpCode.length === 6) {
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("Invalid verification code"));
  },

  resendOtp: async (email) => {
    // Mock OTP resend
    return Promise.resolve({ success: true });
  },
  
  logout: async () => {
    return Promise.resolve({ success: true });
  }
};

export default {
  medicineService,
  supplierService,
  orderService,
  purchaseOrderService,
  userService,
  auditLogService,
  authService
};
