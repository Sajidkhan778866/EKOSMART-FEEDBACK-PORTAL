import os
import base64
import subprocess
import re

SCREENSHOTS_DIR = r"C:\Users\Sajid Khan\.gemini\antigravity\brain\ea8a7107-27f2-47b2-abf9-5f35f4a547bd\.user_uploaded"
OUTPUT_PDF = r"c:\Users\Sajid Khan\OneDrive\Desktop\Feed back ekosmart\EKOSMART_COMPLETE_PROJECT_DOCUMENTATION.pdf"
HTML_FILE = r"c:\Users\Sajid Khan\OneDrive\Desktop\Feed back ekosmart\documentation_25pages.html"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def get_base64_image(filename):
    path = os.path.join(SCREENSHOTS_DIR, filename)
    if os.path.exists(path):
        with open(path, "rb") as f:
            data = base64.b64encode(f.read()).decode("utf-8")
        return f"data:image/png;base64,{data}"
    return ""

# Load all images
img_p1_home = get_base64_image("media_1790689055035.png") # Homepage Hero
img_p2_arch = get_base64_image("media_1790689055035.png") # Architecture
img_p3_hero = get_base64_image("media_1790689055035.png") # Public Hero
img_p4_cards = get_base64_image("media_1790689067607.png") # Service cards
img_p5_complaint = get_base64_image("media_1790572646031.png") # Dynamic complaint form
img_p6_track = get_base64_image("media_1790398733116.png") # Track ticket
img_p7_warranty_chk = get_base64_image("media_1790398733116.png") # Warranty check
img_p8_contact = get_base64_image("media_1790689046131.png") # Contact & policies
img_p9_admin_dash = get_base64_image("media_1790582820093.png") # Admin dashboard KPIs
img_p10_cms = get_base64_image("media_1790689067607.png") # CMS Studio
img_p11_form_builder = get_base64_image("media_1790573005815.png") # Dynamic form designer
img_p12_employees = get_base64_image("media_1790572430957.png") # Employee CRUD & RBAC
img_p13_id_card = get_base64_image("media_1790572059730.png") # ID card with QR
img_p14_salary_cfg = get_base64_image("media_1790571619509.png") # Salary structure modal
img_p15_payslip_print = get_base64_image("media_1790691873261.png") # Isolated payslip print
img_p16_billing = get_base64_image("media_1790571523850.png") # POS Billing counter
img_p17_template = get_base64_image("media_1790571523850.png") # Bill template / tax slip
img_p18_stock = get_base64_image("media_1790404662382.png") # Warehouse stock explorer
img_p19_scanner = get_base64_image("media_1790403707215.png") # Camera barcode scanner
img_p20_emp_dash = get_base64_image("media_1790398760696.png") # Employee workspace dashboard
img_p21_dossier = get_base64_image("media_1790689897022.png") # Problem dossier modal
img_p22_reports = get_base64_image("media_1790689880199.png") # Admin reports & export
img_p23_date_filter = get_base64_image("media_1790689962351.png") # Date range filter & presets
img_p24_api_db = get_base64_image("media_1790690527012.png") # Stock & showroom billing
img_p25_summary = get_base64_image("media_1790691036463.png") # Employee workload audit & matrix

def render_page(page_num, title, content_html):
    return f"""
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — COMPLETE ENGINEERING & OPERATIONS MANUAL</span>
    <span>PAGE {page_num} OF 25</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">{title}</h1>
    {content_html}
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page {page_num} of 25</span>
  </div>
</div>
"""

pages_html = []

# PAGE 1: PROJECT CHARTER
pages_html.append(render_page(1, "PAGE 1 — PROJECT OVERVIEW & SYSTEM CHARTER", f"""
<div>
  <div style="background: linear-gradient(135deg, #064e3b, #0f172a); color: #fff; padding: 7px 10px; border-radius: 6px; margin-bottom: 4px;">
    <span class="badge badge-amber" style="margin-bottom: 2px;">Enterprise Engineering Manual</span>
    <h2 style="color: #fff; font-size: 11pt; margin: 1px 0; font-weight: 900; letter-spacing: -0.2px;">
      EKOSMART DIGITAL CUSTOMER SERVICE, MANAGEMENT AND OPERATIONS SYSTEM
    </h2>
    <div style="font-size: 7.2pt; color: #a7f3d0;">
      Full-Stack Enterprise EV Battery Diagnostics, POS Showroom Invoicing, Warehouse Inventory & Payroll Platform
    </div>
  </div>

  <h2 class="section-heading">1.1 Executive Summary & Problem Formulation</h2>
  <p>
    The <strong>Ekosmart EV Battery Management Platform</strong> is an enterprise-grade, 3-tier software ecosystem engineered for electric vehicle lithium-ion and LFP battery manufacturing, rental mobility fleets, and dealership service centers. It eliminates traditional operational bottlenecks: unorganized customer grievance logging, manual serial warranty lookup disputes, disconnected showroom POS billing and warehouse stock ledgers, static website CMS constraints, and paper-based payroll calculations.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Key Platform Strategic Objectives:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.2pt;">
      <li>Public dynamic service intake & automated ticket assignment (<code>EBS-YYMM-XXXX</code>).</li>
      <li>Real-time serial warranty verification & automated duration expiry calculation.</li>
      <li>Soft-coded CMS and dynamic form builders stored in MongoDB Atlas.</li>
      <li>Showroom POS billing with camera barcode scanner & auto-stock deduction.</li>
      <li>Role-based access control (RBAC) & isolated A4 payslip generation.</li>
    </ul>
  </div>
  <div>
    <table class="table-custom" style="margin: 0;">
      <tr><th>Layer</th><th>Technology</th><th>Role / Specification</th></tr>
      <tr><td><strong>Frontend</strong></td><td>React 19, Vite 8, Tailwind</td><td>Public, Admin & Staff Portals</td></tr>
      <tr><td><strong>Backend</strong></td><td>Node.js, Express, TypeScript</td><td>RESTful APIs (/api/v1/*)</td></tr>
      <tr><td><strong>Database</strong></td><td>MongoDB Atlas + Mongoose</td><td>NoSQL Document Store</td></tr>
      <tr><td><strong>Security</strong></td><td>JWT, bcrypt, RBAC Middleware</td><td>Token Auth & Route Protection</td></tr>
    </table>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p1_home}" class="screenshot-img-large" alt="Public Website Homepage" />
  <div class="screenshot-caption">Figure 1.1: Real-Time Deployed Ekosmart Public Customer Web Portal & Brand Header (Live Vercel Production)</div>
</div>
"""))

# PAGE 2: COMPLETE SYSTEM ARCHITECTURE
pages_html.append(render_page(2, "PAGE 2 — COMPLETE SYSTEM ARCHITECTURE & TOPOLOGY", f"""
<div>
  <h2 class="section-heading">2.1 Multi-Portal Enterprise Architecture</h2>
  <p>
    The Ekosmart platform is built on a decoupled, modular 3-tier architecture ensuring high scalability, data integrity, and strict separation of concerns across public customer interactions, administrative configuration, and field staff execution.
  </p>
</div>

<div class="flowchart">
+---------------------------------------------------------------------------------------------------+
|                                  EKOSMART SYSTEM TOPOLOGY ARCHITECTURE                            |
+---------------------------------------------------------------------------------------------------+
|   [PUBLIC FRONTEND]             [ADMIN PORTAL]                  [EMPLOYEE PORTAL]                 |
|   (React 19 + Vite)             (React 19 + Vite)               (React 19 + Vite)                 |
|   - Dynamic Intake & Track      - CMS / Form Studio / RBAC      - Diagnostics / POS / Stock / Slips|
+----------------------------------+-------------------------------+---------------------------------+
                                   | HTTPS REST API Requests (JWT Auth)
                                   v
+---------------------------------------------------------------------------------------------------+
|                         BACKEND API SERVER (Node.js + Express + TypeScript)                       |
|           Routes: /api/v1/* (auth, complaints, warranty, customers, billing, stock, content)      |
+--------------------------------------------------+------------------------------------------------+
                                                   | Mongoose ODM Connections
                                                   v
+---------------------------------------------------------------------------------------------------+
|                                  MONGODB ATLAS CLOUD DATABASE                                     |
|   Collections: users, employees, complaints, complaintforms, warranties, customers, bills, stocks |
+---------------------------------------------------------------------------------------------------+
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Client Layer (3 Single Page Apps):</strong>
    <p style="font-size: 7.2pt; margin-top: 1px;">
      1. <strong>Public Customer Portal:</strong> Open access for service booking and warranty check.<br/>
      2. <strong>Admin Portal:</strong> Master administrative suite with RBAC and CMS controls.<br/>
      3. <strong>Employee Portal:</strong> Authenticated mobile-ready workbench for field and showroom staff.
    </p>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Serverless API & ODM Layer:</strong>
    <p style="font-size: 7.2pt; margin-top: 1px;">
      Powered by Node.js, Express, and TypeScript. Implements serverless auto-reconnecting DB middleware, centralized error handling, Multer disk storage for technical photos, and dynamic CORS origin resolution.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p2_arch}" class="screenshot-img-large" alt="Public Web Architecture" />
  <div class="screenshot-caption">Figure 2.1: Multi-Portal Production Deployment Architecture & Live Cloud Infrastructure</div>
</div>
"""))

# PAGE 3: PUBLIC FRONTEND HOMEPAGE & HERO
pages_html.append(render_page(3, "PAGE 3 — PUBLIC CUSTOMER FRONTEND: HOMEPAGE & HERO", f"""
<div>
  <h2 class="section-heading">3.1 Customer Journey & Soft-Coded Hero Engine</h2>
  <p>
    The public homepage (<code>frontend/src/pages/Home.tsx</code>) serves as the primary gateway for EV customers. Built with React 19 and Tailwind CSS, it loads real-time branding, promotional announcements, active service cards, and division forms directly from MongoDB via <code>GET /api/v1/content/public</code>.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Public Navigation Architecture:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.2pt;">
      <li><strong>Brand Header:</strong> Soft-coded logo, company title, and contact badge.</li>
      <li><strong>Navigation Links:</strong> Home, Register Complaint, Track Status, Check Warranty, Register Warranty, Contact.</li>
      <li><strong>Portal Gateway:</strong> Direct gateway links to Employee & Admin login portals.</li>
      <li><strong>Mobile Responsive Drawer:</strong> 3-dot slide-out menu on mobile devices.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Dynamic Hero Banner Components:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.2pt;">
      <li><strong>Dynamic Badge:</strong> Live promotional pill (e.g. "Smart Clean Energy").</li>
      <li><strong>Hero Title & Subtitle:</strong> Soft-coded headline loaded from database.</li>
      <li><strong>CTA Action Buttons:</strong> "Register Complaint" and "Track Status".</li>
      <li><strong>Hero Artwork:</strong> Dynamic EV battery pack banner illustration.</li>
    </ul>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p3_hero}" class="screenshot-img-large" alt="Public Customer Homepage Hero" />
  <div class="screenshot-caption">Figure 3.1: Ekosmart Live Public Customer Homepage — Hero Banner, Brand Header & Quick Action CTAs</div>
</div>

<table class="table-custom">
  <tr><th>Element</th><th>Database Source</th><th>API Endpoint</th><th>Dynamic Behavior</th></tr>
  <tr><td>Hero Title & Subtitle</td><td><code>Content.hero.title</code></td><td><code>GET /content/public</code></td><td>Updates in real time upon CMS modification</td></tr>
  <tr><td>Promotional Badge</td><td><code>Content.hero.badge</code></td><td><code>GET /content/public</code></td><td>Custom text styling with emerald gradient</td></tr>
  <tr><td>CTA Button Routing</td><td>Client Router</td><td>Local Navigation</td><td>Routes user directly to division intake form</td></tr>
</table>
"""))

# PAGE 4: SERVICE CARDS
pages_html.append(render_page(4, "PAGE 4 — PUBLIC CUSTOMER FRONTEND: SOFT-CODED SERVICE CARDS", f"""
<div>
  <h2 class="section-heading">4.1 Dynamic Service Cards Catalog Grid</h2>
  <p>
    The service cards grid on the public homepage presents the operational divisions of Ekosmart. Every card is soft-coded in the database, allowing administrators to add, modify, reorder, or deactivate service offerings without developer code changes.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Standard Core Divisions:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.2pt;">
      <li><strong>Lithium Battery Support:</strong> Diagnostics, cell balancing, BMS inspection.</li>
      <li><strong>Drive Rental Support:</strong> Rental fleet breakdown, swap assistance.</li>
      <li><strong>Spare Parts Support:</strong> Genuine controllers, motors, wiring harnesses.</li>
      <li><strong>Showroom Support:</strong> New vehicle handover, warranty registration.</li>
      <li><strong>General Support:</strong> Customer billing inquiries and plant support.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Single Source of Truth Architecture:</strong>
    <p style="font-size: 7.2pt; margin-top: 1px;">
      Service cards are stored in <code>Content.serviceCards[]</code>. The public portal maps through this array, dynamically rendering card icons, titles, descriptive copy, and bulleted features. Clicking a card routes to <code>/register?section=&lt;division&gt;</code>.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p4_cards}" class="screenshot-img-large" alt="Public Service Cards Catalog" />
  <div class="screenshot-caption">Figure 4.1: Live Ekosmart Public Portal — Soft-Coded Division Service Cards & Feature Highlights Grid</div>
</div>

<table class="table-custom">
  <tr><th>Division Card</th><th>Target Section Key</th><th>Dynamic Features Rendered</th><th>Default Icon</th></tr>
  <tr><td>Lithium Battery</td><td><code>Battery</code></td><td>Cell Health Testing, Voltage Balancing, BMS Diagnostics</td><td>Battery Icon</td></tr>
  <tr><td>Drive Rental</td><td><code>Rental</code></td><td>Fleet Breakdown, Quick Battery Swap, Rental Claims</td><td>Bike Icon</td></tr>
  <tr><td>Spare Parts</td><td><code>Spare Parts</code></td><td>OEM Controllers, Throttle, Wiring, Motors</td><td>Wrench Icon</td></tr>
  <tr><td>Showroom Support</td><td><code>Showroom</code></td><td>New Delivery Inspection, Warranty Activation</td><td>Building Icon</td></tr>
</table>
"""))

# PAGE 5: COMPLAINT REGISTRATION
pages_html.append(render_page(5, "PAGE 5 — CUSTOMER COMPLAINT REGISTRATION & INTAKE ENGINE", f"""
<div>
  <h2 class="section-heading">5.1 Grievance Ingestion & Dynamic Intake Schema</h2>
  <p>
    The complaint registration engine (<code>RegisterComplaint.tsx</code>) provides a dynamic, division-aware intake workflow. When a customer selects a division, the client queries <code>GET /api/v1/forms/public/fields/:section</code> to retrieve custom technical fields configured by the admin.
  </p>
</div>

<div class="flowchart">
[Customer Selects Division] --> [GET /forms/public/fields/:sec] --> [Renders Dynamic Technical Fields]
             |
             v
[Enters Name, Phone, City, Description] --> [POST /complaints/public] --> [Generates Ticket EBS-YYMM-XXXX]
             |
             v
[Database Ledger Updated] --> [Assigned to Division Staff] --> [Status: PENDING -> IN_PROGRESS -> RESOLVED]
</div>

<div class="screenshot-card">
  <img src="{img_p5_complaint}" class="screenshot-img-large" alt="Complaint Registration Form" />
  <div class="screenshot-caption">Figure 5.1: Service Complaint Registration Form with Dynamic Technical Fields, Validations & Image Upload</div>
</div>

<h2 class="section-heading">5.2 Data Ingestion & Customer Linking Specifications</h2>
<table class="table-custom">
  <tr><th>Field Group</th><th>Attributes Captured</th><th>Database Destination / Behavior</th></tr>
  <tr><td><strong>Customer Identity</strong></td><td>Name, 10-Digit Mobile, Email, Address, City</td><td>Creates or updates master record in <code>Customer.ts</code></td></tr>
  <tr><td><strong>Technical Specs</strong></td><td>Battery Serial #, Voltage, Fault Codes, BMS ID</td><td>Stored in <code>Complaint.formData</code> as structured JSON</td></tr>
  <tr><td><strong>Ticket Generation</strong></td><td>Formatted reference (e.g. <code>EBS-2609-0042</code>)</td><td>Unique indexed ticket ID in <code>Complaint.ticketNumber</code></td></tr>
  <tr><td><strong>Diagnostic Attachments</strong></td><td>Photos of damaged battery, meter readings</td><td>Uploaded via Multer to <code>/uploads</code> storage</td></tr>
</table>
"""))

# PAGE 6: TICKET TRACKING
pages_html.append(render_page(6, "PAGE 6 — REAL-TIME SERVICE TICKET TRACKING SYSTEM", f"""
<div>
  <h2 class="section-heading">6.1 Public Ticket Tracking & Status Transparency</h2>
  <p>
    The ticket tracking module (<code>TrackComplaint.tsx</code>) enables customers to monitor the real-time diagnosis and repair lifecycle of their battery or vehicle. Lookups are executed via <code>GET /api/v1/complaints/track/:ticketNumber</code> using either the ticket ID (<code>EBS-YYMM-XXXX</code>) or registered customer mobile number.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Complaint Lifecycle Stages:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><strong>1. PENDING (NEW):</strong> Ticket logged; awaiting inspection assignment.</li>
      <li><strong>2. ASSIGNED:</strong> Allocated to dedicated division service specialist.</li>
      <li><strong>3. IN PROGRESS:</strong> Battery placed on diagnostic load bench / cell balancing.</li>
      <li><strong>4. RESOLVED:</strong> Repair finished; parts replaced; root-cause logged.</li>
      <li><strong>5. CLOSED:</strong> Handed over to customer; settlement remarks recorded.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Post-Resolution Ledger Preservation:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      Resolved tickets are never deleted. They are archived permanently in MongoDB, allowing customers to review past repair histories and providing administrators with full SLA compliance and warranty claim auditing.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p6_track}" class="screenshot-img-large" alt="Ticket Status Tracker" />
  <div class="screenshot-caption">Figure 6.1: Real-Time Ticket Status Tracking Interface — Live Progression Stages & Problem Dossier</div>
</div>

<table class="table-custom">
  <tr><th>Status Badge</th><th>Customer Status Label</th><th>Internal Operational Meaning</th></tr>
  <tr><td><span class="badge badge-amber">PENDING</span></td><td>Ticket Logged — Waiting Inspection</td><td>New intake record; pending staff triage</td></tr>
  <tr><td><span class="badge badge-blue">IN PROGRESS</span></td><td>Under Lab Diagnostics</td><td>Cell balancing, impedance testing, BMS replacement</td></tr>
  <tr><td><span class="badge badge-emerald">RESOLVED</span></td><td>Technical Repair Completed</td><td>Quality check passed; ready for pickup/dispatch</td></tr>
</table>
"""))

# PAGE 7: WARRANTY CHECK
pages_html.append(render_page(7, "PAGE 7 — PUBLIC WARRANTY LOOKUP & SELF-REGISTRATION", f"""
<div>
  <h2 class="section-heading">7.1 Automated Warranty Verification Engine</h2>
  <p>
    The warranty engine (<code>WarrantyCheck.tsx</code> & <code>backend/src/models/Warranty.ts</code>) provides instantaneous verification of EV battery pack coverage. The public lookup connects to <code>GET /api/v1/warranty/check/:query</code>, querying battery serial numbers, bill numbers, or customer mobile numbers.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Automated Expiry Computation:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      $$\\text{{Expiry Date}} = \\text{{Purchase Date}} + \\text{{Duration (Months)}}$$
      $$\\text{{Remaining Days}} = \\text{{Expiry Date}} - \\text{{Current Date}}$$
    </p>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7pt;">
      <li><strong>Active Coverage:</strong> Remaining Days &gt; 30 days.</li>
      <li><strong>Expiring Soon:</strong> 0 &lt; Remaining Days &le; 30 days.</li>
      <li><strong>Out of Warranty / Expired:</strong> Remaining Days &le; 0 days.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Customer Self-Service Registration:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      On <code>/warranty/register</code>, customers can link newly purchased batteries by entering their showroom invoice number, purchase date, and pack serial number. The system validates the bill and creates an active warranty document.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p7_warranty_chk}" class="screenshot-img-large" alt="Warranty Verification Screen" />
  <div class="screenshot-caption">Figure 7.1: Public Warranty Coverage Lookup Terminal — Live Serial Search & Expiry Countdown</div>
</div>

<table class="table-custom">
  <tr><th>Feature</th><th>Endpoint</th><th>Status</th><th>Technical Logic</th></tr>
  <tr><td>Warranty Serial Lookup</td><td><code>GET /warranty/check/:query</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Case-insensitive regex matching across serials & bills</td></tr>
  <tr><td>Self-Service Registration</td><td><code>POST /warranty/register</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Computes expiry date & links customer profile</td></tr>
  <tr><td>Coverage Badge Engine</td><td>Client Computed</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Evaluates remaining days & applies status theme</td></tr>
</table>
"""))

# PAGE 8: CONTACT & POLICIES
pages_html.append(render_page(8, "PAGE 8 — PUBLIC CONTACT & LEGAL POLICY MANAGEMENT", f"""
<div>
  <h2 class="section-heading">8.1 Contact Center & Dynamic Plant Information</h2>
  <p>
    The Contact Center (<code>Contact.tsx</code>) displays central plant coordinates, emergency breakdown helplines, support emails, and operating hours. All coordinates are dynamically fed from MongoDB via the Admin CMS, ensuring phone numbers or addresses can be updated instantaneously across the platform.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Plant Coordinates & Support Channels:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><strong>Central Plant:</strong> Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan.</li>
      <li><strong>Phone Directory:</strong> +91 8949049003 / +91 9549730483.</li>
      <li><strong>Official Email:</strong> hr@ekosmartdrive.in / support@ekosmartdrive.in.</li>
      <li><strong>Working Hours:</strong> Monday – Saturday: 09:00 AM – 07:00 PM.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Soft-Coded Legal Policy Engine:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      Legal policies (<code>PrivacyPolicy.tsx</code>, <code>TermsConditions.tsx</code>, <code>RefundPolicy.tsx</code>) render markdown/HTML documents stored in <code>Content.policies</code>. Administrators edit statutory battery return guidelines, warranty limitations, and data privacy disclosures directly in the CMS.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p8_contact}" class="screenshot-img-large" alt="Contact and Policy Page" />
  <div class="screenshot-caption">Figure 8.1: Ekosmart Contact Center Dossier & Dynamic Legal Policies Management Terminal</div>
</div>

<table class="table-custom">
  <tr><th>Policy Page</th><th>Route</th><th>Database Key</th><th>Compliance Scope</th></tr>
  <tr><td>Privacy Policy</td><td><code>/privacy</code></td><td><code>Content.policies.privacy</code></td><td>Customer data protection, battery telematics privacy</td></tr>
  <tr><td>Terms & Conditions</td><td><code>/terms</code></td><td><code>Content.policies.terms</code></td><td>Service SLAs, repair terms, dispute jurisdiction</td></tr>
  <tr><td>Refund Policy</td><td><code>/refund</code></td><td><code>Content.policies.refund</code></td><td>Battery replacement policy, pro-rata warranty refunds</td></tr>
</table>
"""))

# PAGE 9: ADMIN AUTH & DASHBOARD
pages_html.append(render_page(9, "PAGE 9 — ADMIN AUTHENTICATION & MASTER KPI DASHBOARD", f"""
<div>
  <h2 class="section-heading">9.1 Administrative Security & Real-Time KPI Dashboard</h2>
  <p>
    The Admin Portal (<code>admin-portal/</code>) provides high-level command and control over company operations. Access requires authenticated credentials processed via <code>POST /api/v1/auth/login</code>. On verification, the server issues a signed JWT stored in <code>localStorage</code> (<code>admin_token</code>), attaching to all subsequent API calls.
  </p>
</div>

<div class="grid-3">
  <div class="card-box" style="text-align: center;">
    <strong style="color: #065f46; font-size: 7.5pt;">Service Counters</strong>
    <div style="font-size: 7pt; margin-top: 1px;">Total Complaints, Pending Inspection, In-Progress Diagnostics, Resolved Tickets.</div>
  </div>
  <div class="card-box" style="text-align: center;">
    <strong style="color: #1e40af; font-size: 7.5pt;">Commercial Metrics</strong>
    <div style="font-size: 7pt; margin-top: 1px;">Total Showroom Revenue (₹), Completed Invoices, Registered Warranties.</div>
  </div>
  <div class="card-box" style="text-align: center;">
    <strong style="color: #92400e; font-size: 7.5pt;">Warehouse & Staff</strong>
    <div style="font-size: 7pt; margin-top: 1px;">Catalog Items, Available Batteries, Active Field Engineers.</div>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p9_admin_dash}" class="screenshot-img-large" alt="Admin Dashboard KPIs" />
  <div class="screenshot-caption">Figure 9.1: Real-Time Admin Master KPI Dashboard with Date Range Presets & Commercial Analytics</div>
</div>

<h2 class="section-heading">9.2 Dashboard Date Range Behavior Specification</h2>
<table class="table-custom">
  <tr><th>Preset Filter</th><th>Date Scope / Calculation</th><th>Implementation Status</th></tr>
  <tr><td><strong>TODAY (Default)</strong></td><td><code>TODAY = default view</code> (00:00:00 to 23:59:59 local date)</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
  <tr><td><strong>Yesterday / 7 Days</strong></td><td>Past 24 hours / Past 7 rolling calendar days</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
  <tr><td><strong>30 Days / This Month</strong></td><td>Past 30 rolling days / First day of month to current timestamp</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
  <tr><td><strong>Custom Range / All</strong></td><td>User selected <code>startDate</code> to <code>endDate</code> / Complete history</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
</table>
"""))

# PAGE 10: ADMIN CMS
pages_html.append(render_page(10, "PAGE 10 — ADMIN CMS: WEBSITE CONTENT & BRANDING STUDIO", f"""
<div>
  <h2 class="section-heading">10.1 Soft-Coded Content Management Philosophy</h2>
  <p>
    In the Ekosmart platform, <strong>soft-coding</strong> means that marketing text, hero typography, dynamic service cards, plant coordinates, and legal terms are decoupled from static code and stored in MongoDB (<code>Content.ts</code>). Administrators configure the entire platform through the CMS without modifying code or redeploying the application.
  </p>
</div>

<div class="flowchart">
[Admin CMS Studio] --> [PUT /api/v1/content/admin/update] --> [MongoDB: Content Collection]
                                                                     |
[Public Frontend Mount] <----- [GET /api/v1/content/public] <--------+
(Renders Live Hero, Service Cards, Contacts, Terms without Redeployment)
</div>

<div class="screenshot-card">
  <img src="{img_p10_cms}" class="screenshot-img-large" alt="Admin CMS Studio" />
  <div class="screenshot-caption">Figure 10.1: Admin CMS Content Studio — Service Card Management, Ordering & Visibility Toggles</div>
</div>

<h2 class="section-heading">10.2 Configurable CMS Modules & Single Source of Truth</h2>
<table class="table-custom">
  <tr><th>CMS Module</th><th>Configurable Properties</th><th>Database Storage / Schema</th></tr>
  <tr><td><strong>Hero & Branding</strong></td><td>Business Name, Tagline, Hero Title, Subtitle, CTA buttons</td><td><code>Content.companyProfile</code>, <code>Content.hero</code></td></tr>
  <tr><td><strong>Service Cards Grid</strong></td><td>Card Title, Description, Bullet Features, Icon, Order, Active</td><td><code>Content.serviceCards[]</code> (Single Source of Truth)</td></tr>
  <tr><td><strong>Contact & Support</strong></td><td>Head Office Address, Phone Numbers, Support Emails, Hours</td><td><code>Content.contact</code></td></tr>
  <tr><td><strong>Legal Policies</strong></td><td>Markdown text for Privacy Policy, Terms, and Refund Rules</td><td><code>Content.policies</code></td></tr>
</table>
"""))

# PAGE 11: DYNAMIC FORM BUILDER
pages_html.append(render_page(11, "PAGE 11 — ADMIN DYNAMIC FORM BUILDER STUDIO", f"""
<div>
  <h2 class="section-heading">11.1 Dynamic Schema Architecture per Division</h2>
  <p>
    The Dynamic Form Builder (<code>admin-portal/src/pages/Forms.tsx</code>) enables administrators to construct custom grievance intake forms for each operational area (e.g., <em>Battery</em>, <em>Rental</em>, <em>Showroom</em>, <em>Spare Parts</em>). Field schemas are stored in MongoDB (<code>ComplaintForm.ts</code>) and rendered dynamically on the public portal.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Supported Input Field Types:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><strong>Text / Textarea:</strong> Single line & paragraph fault descriptions.</li>
      <li><strong>Number:</strong> Battery voltage, ampere-hour (Ah), mileage.</li>
      <li><strong>Select Dropdown:</strong> Fault codes, cell chemistry (LFP/NMC).</li>
      <li><strong>Date / Checkbox:</strong> Manufacturing date, warranty confirmation.</li>
      <li><strong>File Upload:</strong> Diagnostic test reports, damaged battery photos.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Client-Side Dynamic Rendering:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      When a customer selects a division on <code>RegisterComplaint.tsx</code>, the component queries <code>GET /api/v1/forms/public/fields/:section</code>. Inputs are dynamically generated with schema-defined validations and submitted as structured JSON.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p11_form_builder}" class="screenshot-img-portrait" alt="Admin Dynamic Form Builder" />
  <div class="screenshot-caption">Figure 11.1: Admin Dynamic Form Builder Studio — Custom Field Editor, Validations & Order Manager</div>
</div>

<table class="table-custom">
  <tr><th>Property</th><th>Type</th><th>Description / Operational Role</th></tr>
  <tr><td><code>fieldName</code></td><td>String</td><td>Database key used in the complaint's <code>formData</code> JSON payload.</td></tr>
  <tr><td><code>fieldLabel</code></td><td>String</td><td>Human-readable label rendered in the user interface.</td></tr>
  <tr><td><code>fieldType</code></td><td>Enum</td><td><code>text</code>, <code>number</code>, <code>select</code>, <code>textarea</code>, <code>date</code>, <code>checkbox</code>, <code>file</code></td></tr>
  <tr><td><code>required</code></td><td>Boolean</td><td>Enforces mandatory validation on client and server before submission.</td></tr>
  <tr><td><code>order</code></td><td>Number</td><td>Defines the vertical display order on the customer form.</td></tr>
</table>
"""))

# PAGE 12: EMPLOYEE MANAGEMENT & RBAC
pages_html.append(render_page(12, "PAGE 12 — ADMIN EMPLOYEE MANAGEMENT & GRANULAR RBAC", f"""
<div>
  <h2 class="section-heading">12.1 Staff Onboarding & Profile Management</h2>
  <p>
    The Employee Management module (<code>admin-portal/src/pages/Employees.tsx</code>) handles staff profiles, access credentials, department assignments, and security roles. Administrators maintain complete records including Employee ID (<code>EMP-XXXX</code>), name, contact number, official email, department, designation, and password visibility toggles.
  </p>
</div>

<div class="flowchart">
[Admin Creates Employee] --> [Assigns Role & Permissions] --> [Saves to MongoDB Employee Model]
                                                                        |
[Employee Login] --> [Server Issues JWT with RBAC Payload] <------------+
                                |
                                v
[Client Navigation & API Middleware Enforce Permission Gates]
</div>

<div class="screenshot-card">
  <img src="{img_p12_employees}" class="screenshot-img-large" alt="Employee Management Ledger" />
  <div class="screenshot-caption">Figure 12.1: Admin Employee Directory, Role Assignment, Search Ledger & Granular RBAC Permissions</div>
</div>

<h2 class="section-heading">12.2 Granular RBAC Permission Matrix</h2>
<table class="table-custom">
  <tr><th>Permission Key</th><th>Scope & Access Granted</th><th>Route Guard / Enforcement</th></tr>
  <tr><td><code>complaints</code></td><td>View & resolve assigned service tickets, log diagnostics</td><td>Guards <code>/complaints</code> & <code>/api/v1/complaints/*</code></td></tr>
  <tr><td><code>customers</code></td><td>Search customer ledger, inspect historical services</td><td>Guards <code>/customers</code> & <code>/api/v1/customers/*</code></td></tr>
  <tr><td><code>warranty</code></td><td>Serial warranty check & claim processing</td><td>Guards <code>/warranty</code> & <code>/api/v1/warranty/*</code></td></tr>
  <tr><td><code>billing</code></td><td>Showroom POS billing counter, tax invoice generation</td><td>Guards <code>/billing</code> & <code>/api/v1/billing/*</code></td></tr>
  <tr><td><code>stock</code></td><td>Warehouse inventory, battery pack lookup, CSV export</td><td>Guards <code>/stock</code> & <code>/api/v1/stock/*</code></td></tr>
  <tr><td><code>scanner</code></td><td>HTML5 camera barcode / QR scanning utilities</td><td>Enables scanner modal across modules</td></tr>
  <tr><td><code>reports</code></td><td>View & export assigned workload analytics</td><td>Guards <code>/reports</code> & <code>/api/v1/complaints/admin</code></td></tr>
  <tr><td><code>payslips</code></td><td>View personal monthly remuneration & print payslip</td><td>Guards <code>/my-salary</code> & <code>/api/v1/employees/me/payslips</code></td></tr>
</table>
"""))

# PAGE 13: ID CARD BADGE
pages_html.append(render_page(13, "PAGE 13 — DIGITAL EMPLOYEE ID CARD SYSTEM", f"""
<div>
  <h2 class="section-heading">13.1 Digital Identification Badge & QR Verification</h2>
  <p>
    The ID card engine (<code>IdCardModal.tsx</code> & <code>MyIdCard.tsx</code>) creates verified digital identification badges for technical specialists, showroom managers, and field staff. Badges feature official company branding, staff photograph/avatar, official Employee ID (<code>EMP-XXXX</code>), division, designation, and an encoded QR badge for on-site scanning.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">ID Badge Components:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><strong>Branding Header:</strong> EKOSMART EV BATTERY SOLUTION official logo.</li>
      <li><strong>Employee Profile:</strong> Full name, Employee ID, designation, department.</li>
      <li><strong>Scope / Division:</strong> Assigned division (Battery, Rental, Showroom).</li>
      <li><strong>Emergency Contact:</strong> Verified staff mobile number.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Encoded QR Badge Specification:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      Generates an encoded QR code embedding the employee's unique system identifier, authorization credentials, and verification endpoint. Scanning the badge instantly validates active employment status.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p13_id_card}" class="screenshot-img-large" alt="Digital Employee ID Card" />
  <div class="screenshot-caption">Figure 13.1: Digital Employee ID Badge with Encoded QR Code Verification & Print Layout</div>
</div>

<table class="table-custom">
  <tr><th>Badge Attribute</th><th>Field Key</th><th>Security & Display Rule</th></tr>
  <tr><td>Staff Identity</td><td><code>employee.name, employee.employeeId</code></td><td>Rendered in bold uppercase typography</td></tr>
  <tr><td>Department & Role</td><td><code>employee.department, employee.designation</code></td><td>Determines security clearance level</td></tr>
  <tr><td>Encoded QR Matrix</td><td>Generated via <code>qrcode.react</code></td><td>Encodes employee verification hash</td></tr>
</table>
"""))

# PAGE 14: SALARY STRUCTURE CONFIG
pages_html.append(render_page(14, "PAGE 14 — ADMIN PAYROLL & SALARY STRUCTURE CONFIGURATION", f"""
<div>
  <h2 class="section-heading">14.1 Soft-Coded Payroll & Compensation Architecture</h2>
  <p>
    The payroll engine (<code>SalarySlipModal.tsx</code> & <code>employee.controller.ts</code>) manages remuneration packages. It records basic earnings, statutory deductions, computes net pay, and translates amounts into Indian Rupees in words.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Earnings & Allowances Structure:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><strong>Basic Salary:</strong> Core monthly base compensation.</li>
      <li><strong>HRA:</strong> House Rent Allowance (statutory 40-50%).</li>
      <li><strong>Conveyance & Special:</strong> Travel & tech field allowance.</li>
      <li><strong>Overtime & Bonus:</strong> Performance incentives & arrears.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #92400e; font-size: 7.8pt;">Statutory Deductions & Recoveries:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><strong>EPF:</strong> Employee Provident Fund (12% of Basic).</li>
      <li><strong>ESI:</strong> Employee State Insurance contribution.</li>
      <li><strong>Professional Tax (PT):</strong> State statutory slab deduction.</li>
      <li><strong>TDS / Advances:</strong> Tax withholding & loan recoveries.</li>
    </ul>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p14_salary_cfg}" class="screenshot-img-large" alt="Salary Structure Modal" />
  <div class="screenshot-caption">Figure 14.1: Admin Monthly Salary Structure, Deduction Ledger & Payslip Generator Modal</div>
</div>

<table class="table-custom">
  <tr><th>Payroll Equation</th><th>Mathematical Formulation</th><th>Implementation</th></tr>
  <tr><td>Gross Earnings</td><td>$$\\text{{Gross}} = \\text{{Basic}} + \\text{{HRA}} + \\text{{Conveyance}} + \\text{{Special}} + \\text{{Overtime}} + \\text{{Bonus}}$$</td><td>Computed in controller</td></tr>
  <tr><td>Total Deductions</td><td>$$\\text{{Deductions}} = \\text{{EPF}} + \\text{{ESI}} + \\text{{PT}} + \\text{{TDS}} + \\text{{Advance}} + \\text{{Loan}}$$</td><td>Computed in controller</td></tr>
  <tr><td>Net Take-Home</td><td>$$\\text{{Net Payable}} = \\text{{Gross Earnings}} - \\text{{Total Deductions}}$$</td><td>Translated to words INR</td></tr>
</table>
"""))

# PAGE 15: PAYSLIP GENERATION & ISOLATED PRINT
pages_html.append(render_page(15, "PAGE 15 — OFFICIAL PAYSLIP GENERATION & ISOLATED PRINT ENGINE", f"""
<div>
  <h2 class="section-heading">15.1 Monthly Remuneration Snapshot & Words Translation</h2>
  <p>
    When an administrator generates a monthly payslip via <code>POST /api/v1/employees/:id/payslips</code>, the system captures a permanent snapshot in <code>PayrollRecord.ts</code> and translates the net salary to Indian Rupees in words (e.g., <em>"Twenty-Eight Thousand Rupees Only"</em>).
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Snapshot Record Properties:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><strong>Pay Period:</strong> Month & Year (e.g. August 2026).</li>
      <li><strong>Attendance Ledger:</strong> Total Working Days, Paid Days, Leaves.</li>
      <li><strong>Disbursal Mode:</strong> Bank Transfer (NEFT/RTGS), Bank & IFSC.</li>
      <li><strong>Payslip Number:</strong> <code>EBS-PAY-EMP001-AUG26</code>.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Isolated Single-Page A4 Print Engine:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      Built with <code>utils/print.ts</code>. When staff clicks <strong>Print / Save PDF</strong>, a hidden iframe renders strictly the payslip card, preventing surrounding sidebars, navbars, and buttons from leaking into the printout or PDF.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p15_payslip_print}" class="screenshot-img-large" alt="Isolated Payslip Print" />
  <div class="screenshot-caption">Figure 15.1: Official Single-Page A4 Remuneration Slip Modal & Isolated Print / PDF Engine</div>
</div>

<table class="table-custom">
  <tr><th>Feature</th><th>Technical Mechanism</th><th>Verified Implementation Status</th></tr>
  <tr><td>Isolated Print Engine</td><td>Hidden iframe rendering strictly <code>#printable-payslip</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
  <tr><td>Number-to-Words INR</td><td><code>numberToWordsINR()</code> algorithm</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
  <tr><td>Published Snapshot</td><td>Stored in <code>PayrollRecord</code> collection</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
</table>
"""))

# PAGE 16: POS BILLING TERMINAL
pages_html.append(render_page(16, "PAGE 16 — SHOWROOM POINT-OF-SALE (POS) BILLING TERMINAL", f"""
<div>
  <h2 class="section-heading">16.1 Showroom Point-of-Sale Billing Terminal</h2>
  <p>
    The billing module (<code>BillingManager.tsx</code> & <code>Billing.tsx</code>) serves as the POS checkout system for showrooms and service centers. Operators can add line items, calculate discounts and GST (18%), scan battery pack barcodes, select payment modes (UPI, Cash, Card, Finance), and generate tax invoices.
  </p>
</div>

<div class="flowchart">
[Select Product / Battery] --> [Scan Serial via Camera Scanner] --> [Validate Stock Level]
                                                                           |
[Generate Invoice (INV-YYMM-XXXX)] <-- [Compute GST 18% & Net Total] <-----+
             |
             +---> [Auto-Issues Warranty Record in Database]
             +---> [Decrements Available Warehouse Stock Quantity]
</div>

<div class="screenshot-card">
  <img src="{img_p16_billing}" class="screenshot-img-large" alt="POS Billing Terminal" />
  <div class="screenshot-caption">Figure 16.1: Showroom Point-of-Sale Billing Terminal & Customer Tax Invoice Slip Modal</div>
</div>

<h2 class="section-heading">16.2 Invoicing Calculations & Database Synchronization</h2>
<table class="table-custom">
  <tr><th>POS Step</th><th>Operational Action</th><th>Database Mutation / Record Created</th></tr>
  <tr><td>1. Customer Entry</td><td>Name, 10-digit phone, city, address</td><td>Auto-creates/updates customer in <code>Customer.ts</code></td></tr>
  <tr><td>2. Serial Linkage</td><td>Scanned battery pack serial number</td><td>Links physical pack to customer invoice</td></tr>
  <tr><td>3. GST & Totals</td><td>Unit price $\\times$ Qty $-$ Discount $+$ 18% GST</td><td>Calculates gross subtotal, tax, grand total</td></tr>
  <tr><td>4. Invoice Issue</td><td>Generates <code>INV-YYMM-XXXX</code></td><td>Creates record in <code>Bill.ts</code>; reduces <code>Stock.quantity</code></td></tr>
</table>
"""))

# PAGE 17: BILL TEMPLATE DESIGNER
pages_html.append(render_page(17, "PAGE 17 — SOFT-CODED BILL TEMPLATE DESIGNER", f"""
<div>
  <h2 class="section-heading">17.1 Custom Invoicing Template Architecture</h2>
  <p>
    Administrators can customize tax invoice layouts via <code>BillTemplateDesigner.tsx</code>. Templates are stored in MongoDB (<code>BillTemplate.ts</code>) and dictate the visual styling, company details, header branding, and legal terms on printed slips.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Customizable Invoicing Elements:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><strong>Brand Theme:</strong> Primary highlight color & watermark text.</li>
      <li><strong>Company Credentials:</strong> Business Name, Tagline, Address, GSTIN.</li>
      <li><strong>Signatory Profile:</strong> Authorized signatory name and designation.</li>
      <li><strong>Legal Terms:</strong> Return conditions and dispute jurisdiction.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Isolated Invoice Print Engine:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      Invoices leverage <code>printElement('invoice-printable')</code>. Clicking <strong>Print / Save PDF</strong> isolates the formatted bill document inside a sandboxed iframe, guaranteeing clean single-page printing.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p17_template}" class="screenshot-img-large" alt="Tax Invoice Slip" />
  <div class="screenshot-caption">Figure 17.1: Generated Customer Tax Invoice Slip styled with Soft-Coded Bill Template</div>
</div>

<table class="table-custom">
  <tr><th>Template Property</th><th>Configuration Schema</th><th>Rendering Output</th></tr>
  <tr><td>Theme Primary Color</td><td>Hex Color (e.g. <code>#059669</code> or <code>#4f46e5</code>)</td><td>Border accents, headers, badge highlights</td></tr>
  <tr><td>Watermark Matrix</td><td>Opacity text (e.g. "OFFICIAL INVOICE")</td><td>Diagonal semi-transparent background watermark</td></tr>
  <tr><td>Signatory Block</td><td>Signatory title, plant location</td><td>Official stamp & authorized signature line</td></tr>
</table>
"""))

# PAGE 18: WAREHOUSE STOCK
pages_html.append(render_page(18, "PAGE 18 — WAREHOUSE STOCK & INVENTORY EXPLORER", f"""
<div>
  <h2 class="section-heading">18.1 Warehouse Inventory Architecture</h2>
  <p>
    The inventory engine (<code>backend/src/models/Stock.ts</code>) tracks catalog products, serialized battery packs, and movement ledgers across warehouses and showrooms. Stock items maintain status flags (<code>In Stock</code>, <code>Sold</code>, <code>Reserved</code>, <code>Damaged</code>) and record comprehensive movement histories.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Stock Classification & Tracking:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><strong>Battery Packs:</strong> Serialized LFP / Li-ion models (48V, 60V, 72V).</li>
      <li><strong>EV Scooters:</strong> Chassis serialized vehicle inventory.</li>
      <li><strong>Spare Parts & Chargers:</strong> Batch tracked inventory units.</li>
      <li><strong>Location Nodes:</strong> Kota Plant, Showroom Counter, Rental Hub.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Stock Movement Audit Trail:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      Every inventory operation logs a record in <code>StockMovement.ts</code> recording movement type (<em>Received</em>, <em>Sold</em>, <em>Issued</em>, <em>Returned</em>, <em>Transferred</em>, <em>Adjustment</em>), quantity, staff name, and timestamp.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p18_stock}" class="screenshot-img-large" alt="Warehouse Stock Inventory" />
  <div class="screenshot-caption">Figure 18.1: Warehouse Stock Inventory Management, Serialized Battery Packs & Barcode Lookup</div>
</div>

<table class="table-custom">
  <tr><th>Field Key</th><th>Data Type</th><th>Description / Operational Purpose</th></tr>
  <tr><td><code>productId</code></td><td>String (Indexed)</td><td>Catalog SKU identifier (e.g. <code>BAT-6030</code>)</td></tr>
  <tr><td><code>batterySerialNumber</code></td><td>String (Unique)</td><td>Laser-engraved physical battery pack serial number</td></tr>
  <tr><td><code>quantity, unitPrice</code></td><td>Number</td><td>Available units in warehouse & unit selling price (₹)</td></tr>
  <tr><td><code>status</code></td><td>Enum</td><td><code>In Stock</code>, <code>Sold</code>, <code>Reserved</code>, <code>Damaged</code></td></tr>
</table>
"""))

# PAGE 19: CAMERA SCANNER
pages_html.append(render_page(19, "PAGE 19 — HTML5 CAMERA BARCODE & QR SCANNER MODULE", f"""
<div>
  <h2 class="section-heading">19.1 Real-Time Camera Barcode & QR Scanner Integration</h2>
  <p>
    Integrated via <code>ScannerModal.tsx</code> using <code>@zxing/browser</code>, the scanner leverages device webcams or mobile cameras to read Code 128, Code 39, EAN-13, and QR barcodes on physical battery packs, instantly auto-populating line items in POS billing.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Scanner Technical Capabilities:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><strong>HTML5 Stream:</strong> Accesses rear mobile camera or USB webcam.</li>
      <li><strong>Multi-Format:</strong> Decodes linear barcodes and 2D QR matrix.</li>
      <li><strong>Auto-Lookup:</strong> Queries <code>GET /stock/serial/:serial</code> instantly.</li>
      <li><strong>Manual Fallback:</strong> Allows direct keyboard typing if camera blocked.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">POS Billing + Scanner Workflow:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      During showroom billing, staff click "Scan Barcode". Pointing the camera at the battery laser serial instantly populates the product name, unit price, and serial number into the POS bill, eliminating typing mistakes.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p19_scanner}" class="screenshot-img-large" alt="Camera Barcode Scanner" />
  <div class="screenshot-caption">Figure 19.1: HTML5 Real-Time Camera Barcode & QR Scanner in Operation on Mobile Device</div>
</div>

<table class="table-custom">
  <tr><th>Step</th><th>Workflow Phase</th><th>System Action / Data Mutation</th></tr>
  <tr><td>1</td><td>Barcode Scan</td><td>Staff scans battery serial; system verifies <code>status === 'In Stock'</code>.</td></tr>
  <tr><td>2</td><td>POS Invoice Creation</td><td>Item added to bill; GST (18%) and grand total computed.</td></tr>
  <tr><td>3</td><td>Database Sync</td><td><code>Stock.quantity</code> decremented; <code>StockMovement</code> logged as 'Sold'.</td></tr>
  <tr><td>4</td><td>Warranty Auto-Creation</td><td>Warranty record generated linking serial number to customer bill.</td></tr>
</table>
"""))

# PAGE 20: EMPLOYEE PORTAL WORKSPACE
pages_html.append(render_page(20, "PAGE 20 — EMPLOYEE PORTAL: WORKSPACE & ASSIGNED QUEUE", f"""
<div>
  <h2 class="section-heading">20.1 Employee Workspace Architecture</h2>
  <p>
    The Employee Portal (<code>employee-portal/</code>) provides field engineers and showroom staff with a dedicated workstation. Authentication via <code>POST /api/v1/auth/login</code> verifies credentials, issues an <code>employee_token</code>, and evaluates RBAC permissions to dynamically configure the workspace.
  </p>
</div>

<div class="screenshot-card">
  <img src="{img_p20_emp_dash}" class="screenshot-img-large" alt="Employee Dashboard" />
  <div class="screenshot-caption">Figure 20.1: Employee Workspace Dashboard, Active Assigned Queue & Operational Metrics</div>
</div>

<h2 class="section-heading">20.2 Employee Portal Functional Module Directory</h2>
<table class="table-custom">
  <tr><th>Module Page</th><th>Route</th><th>RBAC Permission</th><th>Operational Function</th></tr>
  <tr><td><strong>Workspace Dashboard</strong></td><td><code>/</code></td><td>Authenticated Staff</td><td>Daily assigned queue summary, task status overview.</td></tr>
  <tr><td><strong>Assigned Complaints</strong></td><td><code>/complaints</code></td><td><code>complaints</code></td><td>Inspect problem dossiers, update status, add repair notes.</td></tr>
  <tr><td><strong>Customer Directory</strong></td><td><code>/customers</code></td><td><code>customers</code></td><td>Search customer profiles and linked service histories.</td></tr>
  <tr><td><strong>Warranty Terminal</strong></td><td><code>/warranty</code></td><td><code>warranty</code></td><td>Check warranty coverage by serial, process service claims.</td></tr>
  <tr><td><strong>Showroom Billing</strong></td><td><code>/billing</code></td><td><code>billing</code></td><td>Generate customer invoices, scan serials, compute GST.</td></tr>
  <tr><td><strong>Stock Inventory</strong></td><td><code>/stock</code></td><td><code>stock</code></td><td>Check warehouse stock levels, scan barcodes, export CSV.</td></tr>
  <tr><td><strong>Staff Reports</strong></td><td><code>/reports</code></td><td><code>reports</code></td><td>Export <strong>strictly assigned</strong> complaints to CSV.</td></tr>
  <tr><td><strong>My Salary Slip</strong></td><td><code>/my-salary</code></td><td><code>payslips</code></td><td>View monthly remuneration & print official single-page slip.</td></tr>
</table>
"""))

# PAGE 21: EMPLOYEE COMPLAINTS & DOSSIER
pages_html.append(render_page(21, "PAGE 21 — EMPLOYEE COMPLAINT, CUSTOMER & WARRANTY WORKFLOW", f"""
<div>
  <h2 class="section-heading">21.1 End-to-End Service Resolution Workflow</h2>
  <p>
    When an employee logs into the portal, tickets assigned to their division appear in their active queue. Staff open the technical problem dossier (<code>TicketDetailModal.tsx</code>) to inspect customer complaints, photos, and dynamic test metrics.
  </p>
</div>

<div class="flowchart">
[Assigned Ticket in Queue] --> [Inspect Customer Details & Photos] --> [Update Status to "IN PROGRESS"]
                                                                                |
[Ticket Moved to Permanent History Ledger] <-- [Resolve Ticket & Add Remarks] <--+
</div>

<div class="screenshot-card">
  <img src="{img_p21_dossier}" class="screenshot-img-large" alt="Complaint Dossier" />
  <div class="screenshot-caption">Figure 21.1: Service Complaint Inspection Dossier, Status Update & Resolution Workbench</div>
</div>

<h2 class="section-heading">21.2 Workload Isolation & Active Queue Rules</h2>
<table class="table-custom">
  <tr><th>Operation / Rule</th><th>Technical Mechanism</th><th>Audit & Ledger Outcome</th></tr>
  <tr><td><strong>Assigned Queue Filter</strong></td><td>Matches <code>c.assignedTo</code> with <code>user.employeeId</code> and <code>user._id</code></td><td>Staff view only their assigned workload.</td></tr>
  <tr><td><strong>Diagnostic Progression</strong></td><td><code>PATCH /api/v1/complaints/:id/status</code></td><td>Updates status from <code>Pending</code> to <code>In Progress</code> to <code>Resolved</code>.</td></tr>
  <tr><td><strong>Active vs. History</strong></td><td>Resolved/Closed tickets clear from active list</td><td>Permanently archived in database for SLA reports.</td></tr>
  <tr><td><strong>Warranty Verification</strong></td><td>Serial lookup against purchase date</td><td>Confirms active coverage before processing free repairs.</td></tr>
</table>
"""))

# PAGE 22: ENTERPRISE REPORTS SUITE
pages_html.append(render_page(22, "PAGE 22 — ENTERPRISE REPORTS, FILTERS & EXCEL EXPORT", f"""
<div>
  <h2 class="section-heading">22.1 Master Reporting & Analytics Engine</h2>
  <p>
    The reporting engine (<code>admin-portal/src/pages/Reports.tsx</code> & <code>employee-portal/src/pages/Reports.tsx</code>) provides analytics across complaints, warranties, inventory, and revenue. It supports division filters (<em>Battery</em>, <em>Rental</em>, <em>Showroom</em>, <em>Spare Parts</em>) and date presets.
  </p>
</div>

<div class="screenshot-card">
  <img src="{img_p22_reports}" class="screenshot-img-large" alt="Admin Reports Suite" />
  <div class="screenshot-caption">Figure 22.1: Administrative Reports Suite with Date Presets, KPI Counters & Division CSV Export</div>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Date Range Filter Presets:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><code>Today</code> (Default view) & <code>Yesterday</code></li>
      <li><code>Last 7 Days</code> & <code>Last 30 Days</code></li>
      <li><code>This Month</code> & <code>All Time</code></li>
      <li><code>Custom Date Range</code> (Start Date &rarr; End Date)</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Workload Isolation Guarantee:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      Employee Reports strictly filter tickets assigned to the logged-in staff member by matching <code>employeeId</code>, <code>_id</code>, <code>name</code>, and <code>email</code>, preventing data leakage across staff.
    </p>
  </div>
</div>

<h2 class="section-heading">22.2 Excel / CSV Export Specifications</h2>
<p style="font-size: 7.3pt;">
  Export routines format data into RFC 4180 compliant CSV files with <code>\\uFEFF</code> UTF-8 Byte Order Marks (BOM), ensuring multilingual customer names and Indian Rupee (&8377;) currency symbols render cleanly in Microsoft Excel and Google Sheets.
</p>
"""))

# PAGE 23: DATE RANGE FILTERING
pages_html.append(render_page(23, "PAGE 23 — GLOBAL DATE RANGE FILTERING & PRESETS ENGINE", f"""
<div>
  <h2 class="section-heading">23.1 Global Date Filtering Architecture</h2>
  <p>
    The date filtering module (<code>DateRangeFilter.tsx</code> & <code>backend/src/utils/dateRange.ts</code>) provides unified temporal filtering across the platform. Present in Dashboard, Complaints, Warranty, Billing, Stock, and Reports, it guarantees synchronized date queries.
  </p>
</div>

<div class="grid-2">
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Unified Filter Presets:</strong>
    <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
      <li><strong>Today (Default):</strong> 00:00:00 to 23:59:59 of current local date.</li>
      <li><strong>Yesterday:</strong> Past 24 hours snapshot.</li>
      <li><strong>Last 7 Days / 30 Days:</strong> Rolling weekly & monthly windows.</li>
      <li><strong>This Month:</strong> Calendar month start to current timestamp.</li>
      <li><strong>Custom Range:</strong> Exact user-specified date parameters.</li>
    </ul>
  </div>
  <div class="card-box">
    <strong style="color: #065f46; font-size: 7.8pt;">Backend Date Resolution:</strong>
    <p style="font-size: 7.1pt; margin-top: 1px;">
      The backend helper <code>getDateRangeQuery()</code> translates preset query parameters into MongoDB query operators (<code>$gte</code> and <code>$lte</code> on <code>createdAt</code> or <code>purchaseDate</code>), ensuring index optimization.
    </p>
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p23_date_filter}" class="screenshot-img-large" alt="Date Range Filter Integration" />
  <div class="screenshot-caption">Figure 23.1: Global Date Range Filter Component & Live Data Ledger Synchronization</div>
</div>

<table class="table-custom">
  <tr><th>Module</th><th>Component Path</th><th>Supported Presets</th><th>Export Linkage</th></tr>
  <tr><td>Dashboard</td><td><code>Dashboard.tsx</code></td><td>Today, 7D, 30D, Month, Custom</td><td>Updates all KPI counters</td></tr>
  <tr><td>Warranty</td><td><code>Warranty.tsx</code></td><td>Today, 7D, 30D, Month, Custom</td><td>Filters warranties & CSV export</td></tr>
  <tr><td>Showroom Billing</td><td><code>Billing.tsx</code></td><td>Today, 7D, 30D, Month, Custom</td><td>Filters invoices & sales CSV</td></tr>
  <tr><td>Stock Inventory</td><td><code>Stock.tsx</code></td><td>Today, 7D, 30D, Month, Custom</td><td>Filters stock records & CSV</td></tr>
</table>
"""))

# PAGE 24: REST API & DATABASE
pages_html.append(render_page(24, "PAGE 24 — RESTFUL API DICTIONARY & DATABASE SCHEMA", f"""
<div>
  <h2 class="section-heading">24.1 RESTful API Endpoints Specification</h2>
  <p>
    The backend architecture mounts 12 route modules supporting both <code>/api/v1/*</code> and <code>/api/*</code> prefixes with JWT authentication, role guards, and serverless database auto-reconnection.
  </p>
</div>

<table class="table-custom" style="font-size: 6.8pt;">
  <tr><th>Module</th><th>Method & Endpoint</th><th>Auth / RBAC Guard</th><th>Operational Action</th></tr>
  <tr><td>Auth</td><td><code>POST /api/v1/auth/login</code></td><td>Public</td><td>Validates credentials, returns JWT token</td></tr>
  <tr><td>Complaints</td><td><code>POST /api/v1/complaints/public</code></td><td>Public</td><td>Creates service ticket (<code>EBS-YYMM-XXXX</code>)</td></tr>
  <tr><td>Complaints</td><td><code>GET /api/v1/complaints/track/:ref</code></td><td>Public</td><td>Tracks status by ticket # or mobile</td></tr>
  <tr><td>Complaints</td><td><code>PATCH /api/v1/complaints/:id/status</code></td><td>JWT (Staff)</td><td>Updates status & diagnostic remarks</td></tr>
  <tr><td>Warranty</td><td><code>GET /api/v1/warranty/check/:query</code></td><td>Public</td><td>Checks warranty coverage by serial #</td></tr>
  <tr><td>Warranty</td><td><code>POST /api/v1/warranty/register</code></td><td>Public</td><td>Registers warranty from showroom invoice</td></tr>
  <tr><td>Billing</td><td><code>POST /api/v1/billing</code></td><td>JWT (Staff)</td><td>Generates POS bill & decrements stock</td></tr>
  <tr><td>Stock</td><td><code>GET /api/v1/stock</code></td><td>JWT (Staff)</td><td>Lists warehouse stock with date filters</td></tr>
  <tr><td>Employees</td><td><code>POST /api/v1/employees/:id/payslips</code></td><td>JWT (Admin)</td><td>Generates monthly payslip snapshot</td></tr>
  <tr><td>Content (CMS)</td><td><code>PUT /api/v1/content/admin/update</code></td><td>JWT (Admin)</td><td>Updates dynamic CMS website copy</td></tr>
</table>

<div class="screenshot-card">
  <img src="{img_p24_api_db}" class="screenshot-img-large" alt="Stock and Billing Integration" />
  <div class="screenshot-caption">Figure 24.1: POS Billing & Warehouse Stock Synchronization Ledger (Live Production API)</div>
</div>

<h2 class="section-heading">24.2 MongoDB Collections Architecture</h2>
<p style="font-size: 7.2pt;">
  Collections: <code>users</code>, <code>employees</code>, <code>complaints</code>, <code>complaintforms</code>, <code>warranties</code>, <code>customers</code>, <code>bills</code>, <code>billtemplates</code>, <code>stocks</code>, <code>stockmovements</code>, <code>payrollrecords</code>, <code>contents</code>.
</p>
"""))

# PAGE 25: MASTER FLOW & AUDIT MATRIX
pages_html.append(render_page(25, "PAGE 25 — MASTER END-TO-END FLOW & IMPLEMENTATION MATRIX", f"""
<div>
  <h2 class="section-heading">25.1 Master End-to-End Operational Flow</h2>
  <div class="flowchart" style="font-size: 6.2pt; line-height: 1.2;">
[CUSTOMER] --> Public Portal --> Dynamic Form Intake --> Express API --> MongoDB Atlas (Ticket Created)
[ADMIN]    --> Admin Portal  --> CMS / Form Designer / RBAC / Payroll --> MongoDB Atlas (Global Config)
[EMPLOYEE] --> Employee Portal --> Diagnostic Dossier / POS / Stock --> MongoDB Atlas (Task Completed)
  </div>
</div>

<div class="screenshot-card">
  <img src="{img_p25_summary}" class="screenshot-img-large" alt="Employee Workload Audit" />
  <div class="screenshot-caption">Figure 25.1: Staff Assigned Workload Live Audit, Date Filter Presets & Excel CSV Export Terminal</div>
</div>

<h2 class="section-heading">25.2 Comprehensive System Implementation Audit Matrix</h2>
<table class="table-custom" style="font-size: 6.6pt;">
  <tr><th>System Module</th><th>Verified Status</th><th>Technical Architecture & Verification Notes</th></tr>
  <tr><td>Public Website</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>React 19 SPA, dynamic CMS hero, soft-coded division cards, mobile menu</td></tr>
  <tr><td>Admin Portal</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>KPI dashboard, CMS studio, dynamic form builder, staff management</td></tr>
  <tr><td>Employee Portal</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Role-gated workspace, assigned queue, POS billing, stock lookup</td></tr>
  <tr><td>Backend API</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Node.js, Express, TypeScript, dual prefix routing (<code>/api/v1</code> & <code>/api</code>)</td></tr>
  <tr><td>Database Layer</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>MongoDB Atlas, Mongoose ODM schemas, serverless reconnect middleware</td></tr>
  <tr><td>Authentication & RBAC</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>JWT Bearer token, bcrypt password hashing, granular permission flags</td></tr>
  <tr><td>Soft-Coded CMS</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Database-driven hero, branding, dynamic service cards, legal policies</td></tr>
  <tr><td>Dynamic Form Builder</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Configurable field schema per division with live public form rendering</td></tr>
  <tr><td>Complaint System</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Automatic ticket generation (<code>EBS-YYMM-XXXX</code>), lifecycle tracking</td></tr>
  <tr><td>Warranty Engine</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Serial registration, automated duration expiry calculation, live search</td></tr>
  <tr><td>Customer Directory</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Central customer directory auto-ingested from complaints & invoices</td></tr>
  <tr><td>Staff & Permissions</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Staff CRUD, designation/department tracking, granular RBAC flags</td></tr>
  <tr><td>Digital ID Cards</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Printable ID card badge with verifiable QR badge and company branding</td></tr>
  <tr><td>Salary & Payroll</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Salary structure configuration, allowances, deductions, words INR</td></tr>
  <tr><td>Isolated Payslip Print</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Hidden iframe print engine generating single-page A4 payslips / PDF</td></tr>
  <tr><td>Showroom POS Billing</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Multi-item invoicing, GST 18%, sequential invoice numbering (<code>INV-XXXX</code>)</td></tr>
  <tr><td>Warehouse Stock</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Serialized battery tracking, inventory movement ledger, CSV export</td></tr>
  <tr><td>Barcode Scanner</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>HTML5 camera scanner (<code>@zxing/browser</code>) with manual entry fallback</td></tr>
  <tr><td>Reports & CSV Export</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Multi-tab analytical reports, UTF-8 BOM CSV export, workload isolation</td></tr>
  <tr><td>Date Range Filters</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Global preset engine (<code>Today</code>, <code>7 Days</code>, <code>30 Days</code>, <code>Month</code>, <code>Custom</code>)</td></tr>
  <tr><td>OTP SMS Verification</td><td><span class="badge badge-amber">FRONTEND/UI ONLY</span></td><td>OTP UI dialog present; third-party SMS gateway not connected</td></tr>
</table>
"""))

full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>EKOSMART Complete Engineering & Operations System Documentation (25 Pages)</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 0;
  }}
  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}
  html, body {{
    margin: 0;
    padding: 0;
    background: #e2e8f0;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    font-size: 8.5pt;
    line-height: 1.32;
  }}
  .page {{
    width: 210mm;
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
    box-sizing: border-box;
    padding: 10mm 14mm 10mm 14mm;
    background: #ffffff;
    page-break-after: always;
    page-break-inside: avoid;
    break-inside: avoid;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 auto;
  }}
  .page-header {{
    border-bottom: 2px solid #059669;
    padding-bottom: 3px;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.2pt;
    font-weight: 700;
    color: #065f46;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  .page-footer {{
    border-top: 1px solid #cbd5e1;
    padding-top: 3px;
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 6.8pt;
    color: #64748b;
  }}
  .page-content {{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 4px;
    overflow: hidden;
  }}
  h1.page-title {{
    font-size: 11.2pt;
    font-weight: 900;
    color: #0f172a;
    margin: 0 0 3px 0;
    display: flex;
    align-items: center;
    gap: 6px;
    border-left: 4px solid #059669;
    padding-left: 6px;
    line-height: 1.2;
  }}
  h2.section-heading {{
    font-size: 8.6pt;
    font-weight: 800;
    color: #065f46;
    margin: 2px 0 1px 0;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1px;
  }}
  p {{
    margin: 0 0 3px 0;
    color: #334155;
    text-align: justify;
    font-size: 8.1pt;
  }}
  .badge {{
    display: inline-block;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 6.5pt;
    font-weight: 700;
    text-transform: uppercase;
  }}
  .badge-emerald {{ background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }}
  .badge-blue {{ background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }}
  .badge-amber {{ background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }}
  
  .table-custom {{
    width: 100%;
    border-collapse: collapse;
    font-size: 7pt;
    margin: 2px 0 3px 0;
  }}
  .table-custom th {{
    background: #065f46;
    color: #ffffff;
    padding: 2.5px 5px;
    text-align: left;
    font-weight: 700;
    border: 1px solid #047857;
  }}
  .table-custom td {{
    padding: 2px 5px;
    border: 1px solid #e2e8f0;
    color: #334155;
  }}
  .table-custom tr:nth-child(even) {{
    background: #f8fafc;
  }}

  .card-box {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 5px;
    padding: 4px 6px;
    margin: 1px 0;
  }}
  .flowchart {{
    background: #0f172a;
    color: #f8fafc;
    border-radius: 5px;
    padding: 4px 6px;
    font-family: 'Consolas', monospace;
    font-size: 6.8pt;
    line-height: 1.25;
    margin: 2px 0;
    border-left: 3px solid #10b981;
  }}

  /* High Visibility Screenshot Cards */
  .screenshot-card {{
    border: 1.5px solid #94a3b8;
    border-radius: 6px;
    background: #ffffff;
    padding: 3px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
    margin: 3px 0 2px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }}
  .screenshot-img-large {{
    width: 100%;
    max-height: 215px;
    height: 205px;
    object-fit: contain;
    border-radius: 4px;
    background: #f8fafc;
    display: block;
  }}
  .screenshot-img-portrait {{
    width: auto;
    max-width: 100%;
    max-height: 215px;
    height: 205px;
    object-fit: contain;
    border-radius: 4px;
    background: #f8fafc;
    display: block;
    margin: 0 auto;
  }}
  .screenshot-caption {{
    font-size: 7.2pt;
    font-weight: 800;
    color: #0f172a;
    margin-top: 3px;
    text-align: center;
    letter-spacing: 0.1px;
  }}
  .grid-2 {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }}
  .grid-3 {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 5px;
  }}
</style>
</head>
<body>
{"".join(pages_html)}
</body>
</html>
"""

with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(full_html)

print(f"Generated 25-page HTML documentation: {HTML_FILE}")

# Execute Chrome headless to generate PDF
cmd = [
    CHROME_PATH,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={OUTPUT_PDF}",
    HTML_FILE
]

print("Rendering 25-page PDF via Google Chrome headless engine...")
res = subprocess.run(cmd, capture_output=True, text=True)
print(f"Chrome exit code: {res.returncode}")

if os.path.exists(OUTPUT_PDF):
    size_kb = os.path.getsize(OUTPUT_PDF) / 1024
    with open(OUTPUT_PDF, "rb") as f:
        pdf_bytes = f.read()
    page_count = len(re.findall(rb"/Type\s*/Page\b", pdf_bytes)) - len(re.findall(rb"/Type\s*/Pages\b", pdf_bytes))
    print(f"SUCCESS: Generated 25-Page PDF at {OUTPUT_PDF}")
    print(f"File Size: {size_kb:.2f} KB")
else:
    print("ERROR: PDF file was not generated.")
