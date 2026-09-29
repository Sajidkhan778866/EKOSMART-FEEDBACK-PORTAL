import os
import base64
import subprocess
import re

SCREENSHOTS_DIR = r"C:\Users\Sajid Khan\.gemini\antigravity\brain\ea8a7107-27f2-47b2-abf9-5f35f4a547bd\.user_uploaded"
OUTPUT_PDF = r"c:\Users\Sajid Khan\OneDrive\Desktop\Feed back ekosmart\EKOSMART_COMPLETE_PROJECT_DOCUMENTATION.pdf"
HTML_FILE = r"c:\Users\Sajid Khan\OneDrive\Desktop\Feed back ekosmart\documentation_15pages.html"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def get_base64_image(filename):
    path = os.path.join(SCREENSHOTS_DIR, filename)
    if os.path.exists(path):
        with open(path, "rb") as f:
            data = base64.b64encode(f.read()).decode("utf-8")
        return f"data:image/png;base64,{data}"
    return ""

# Load all screenshots
img_p1_home = get_base64_image("media_1790689055035.png") # Public Homepage / Hero (1024x640)
img_p2_services = get_base64_image("media_1790689067607.png") # Service Cards (1024x419)
img_p3_complaint = get_base64_image("media_1790572646031.png") # Dynamic complaint form (1024x575)
img_p4_warranty = get_base64_image("media_1790689962351.png") # Warranty Manager with date filter (1024x581)
img_p5_dashboard = get_base64_image("media_1790582820093.png") # Admin Dashboard with KPIs (1024x379)
img_p6_cms = get_base64_image("media_1790689067607.png") # CMS service card editor (1024x419)
img_p7_form_builder = get_base64_image("media_1790573005815.png") # Dynamic form designer studio (620x925)
img_p8_employees = get_base64_image("media_1790572430957.png") # Employee CRUD & permissions (1024x535)
img_p9_salary = get_base64_image("media_1790571619509.png") # Salary slip modal (1024x638)
img_p10_billing = get_base64_image("media_1790571523850.png") # POS Billing & slip (1024x585)
img_p11_emp_dash = get_base64_image("media_1790398760696.png") # Employee dashboard & queue (1024x575)
img_p12_dossier = get_base64_image("media_1790689897022.png") # Complaints dossier list (1024x463)
img_p13_stock = get_base64_image("media_1790404662382.png") # Warehouse stock inventory (1024x538)
img_p14_reports = get_base64_image("media_1790689880199.png") # Admin reports & export (1024x548)
img_p15_summary = get_base64_image("media_1790691036463.png") # Employee Reports & workload audit (1024x575)

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>EKOSMART Digital Customer Service, Management & Operations System - Project Documentation</title>
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
    margin-bottom: 6px;
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
    font-size: 11.5pt;
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
    font-size: 8.8pt;
    font-weight: 800;
    color: #065f46;
    margin: 3px 0 1px 0;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1px;
  }}
  p {{
    margin: 0 0 3px 0;
    color: #334155;
    text-align: justify;
    font-size: 8.2pt;
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
    font-size: 7.2pt;
    margin: 2px 0 4px 0;
  }}
  .table-custom th {{
    background: #065f46;
    color: #ffffff;
    padding: 3px 5px;
    text-align: left;
    font-weight: 700;
    border: 1px solid #047857;
  }}
  .table-custom td {{
    padding: 2.5px 5px;
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
    padding: 5px 7px;
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
    margin: 4px 0 2px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }}
  .screenshot-img-hero {{
    width: 100%;
    max-height: 220px;
    height: 210px;
    object-fit: contain;
    border-radius: 4px;
    background: #0f172a;
    display: block;
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

<!-- ========================================== -->
<!-- PAGE 1: PROJECT OVERVIEW                  -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — ENGINEERING SYSTEM DOCUMENTATION</span>
    <span>PAGE 1 OF 15</span>
  </div>
  <div class="page-content">
    <div style="background: linear-gradient(135deg, #064e3b, #0f172a); color: #fff; padding: 7px 10px; border-radius: 6px;">
      <span class="badge badge-amber" style="margin-bottom: 2px;">Official Technical Architecture Document</span>
      <h1 style="color: #fff; font-size: 11.5pt; margin: 2px 0; font-weight: 900; letter-spacing: -0.2px;">
        EKOSMART DIGITAL CUSTOMER SERVICE, MANAGEMENT AND OPERATIONS SYSTEM
      </h1>
      <div style="font-size: 7.2pt; color: #a7f3d0;">
        Full-Stack Enterprise EV Lithium-ion/LFP Battery Platform, POS Invoicing, Warehouse Inventory & Payroll Engine
      </div>
    </div>

    <div>
      <h2 class="section-heading">1.1 Executive Overview & Problem Statement</h2>
      <p>
        The <strong>Ekosmart EV Battery Management Platform</strong> resolves critical operational bottlenecks in electric mobility operations: fragmented customer grievance tracking, manual serial warranty verification disputes, disconnected showroom POS billing and stock counts, static CMS website constraints, and paper-based payroll calculations.
      </p>
    </div>

    <div class="grid-2">
      <div class="card-box">
        <strong style="color: #065f46; font-size: 7.8pt;">Key Platform Capabilities:</strong>
        <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.2pt;">
          <li>Public dynamic service registration with automated ticket assignment.</li>
          <li>Real-time serial warranty verification & automated duration expiry.</li>
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

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p1_home}" class="screenshot-img-hero" alt="Public Customer Website Homepage" />
      <div class="screenshot-caption">Figure 1.1: Real-Time Deployed Ekosmart Public Customer Web Portal & Brand Header (Live Vercel Production)</div>
    </div>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 1</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 2: PUBLIC CUSTOMER WEBSITE           -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 2 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 2 — PUBLIC CUSTOMER WEBSITE</h1>
    
    <div>
      <h2 class="section-heading">2.1 Customer Journey & Soft-Coded Navigation Architecture</h2>
      <p>
        The Public Customer Website (<code>frontend/</code>) provides intuitive access for EV owners and dealership clients. Built with React 19 and Tailwind CSS, it loads real-time branding, promotional announcements, active service cards, and division forms directly from MongoDB via <code>GET /api/v1/content/public</code>.
      </p>
    </div>

    <div class="grid-2">
      <div class="card-box">
        <strong style="color: #065f46; font-size: 7.8pt;">Customer Portal Modules:</strong>
        <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.2pt;">
          <li><strong>Hero Section:</strong> CMS-driven value proposition & CTA links.</li>
          <li><strong>Service Catalog:</strong> Battery, Rental, Showroom, Spare Parts.</li>
          <li><strong>Ticket Tracker:</strong> Search by <code>EBS-YYMM-XXXX</code> or Phone.</li>
          <li><strong>Warranty Center:</strong> Live serial lookup & self-registration.</li>
        </ul>
      </div>
      <div class="card-box">
        <strong style="color: #065f46; font-size: 7.8pt;">Dynamic Data Propagation Flow:</strong>
        <p style="font-size: 7.2pt; margin-top: 2px;">
          When an administrator edits hero text or service card details in the Admin CMS, the changes are stored in MongoDB (<code>Content.ts</code>) and immediately reflected on the live public website without requiring code rebuilds or server restarts.
        </p>
      </div>
    </div>

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p2_services}" class="screenshot-img-large" alt="Public Service Cards" />
      <div class="screenshot-caption">Figure 2.1: Live Ekosmart Public Portal — Soft-Coded Division Service Cards & Navigation Grid</div>
    </div>

    <table class="table-custom">
      <tr><th>Module / Page</th><th>Component</th><th>Route</th><th>Implementation Status</th></tr>
      <tr><td>Customer Homepage</td><td><code>Home.tsx</code></td><td><code>/</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td>Complaint Intake</td><td><code>RegisterComplaint.tsx</code></td><td><code>/register</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td>Live Ticket Tracking</td><td><code>TrackComplaint.tsx</code></td><td><code>/track</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td>Warranty Coverage Check</td><td><code>WarrantyCheck.tsx</code></td><td><code>/warranty/check</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td>Contact & Legal Policies</td><td><code>Contact.tsx, PrivacyPolicy.tsx</code></td><td><code>/contact, /privacy</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
    </table>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 2</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 3: CUSTOMER COMPLAINT REGISTRATION   -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 3 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 3 — CUSTOMER COMPLAINT REGISTRATION</h1>
    
    <div>
      <h2 class="section-heading">3.1 Grievance Ingestion & Dynamic Intake Schema</h2>
      <p>
        The complaint registration pipeline (<code>RegisterComplaint.tsx</code>) enables customers to submit technical battery issues, rental breakdowns, and showroom service requests. The frontend connects to the dynamic form builder to fetch custom inputs on a per-division basis.
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

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p3_complaint}" class="screenshot-img-large" alt="Complaint Registration Form" />
      <div class="screenshot-caption">Figure 3.1: Service Complaint Registration Form with Dynamic Technical Fields & File Upload</div>
    </div>

    <h2 class="section-heading">3.2 Complaint Reference & Lifecycle Specification</h2>
    <table class="table-custom">
      <tr><th>Stage / Status</th><th>System Action</th><th>Visibility & Post-Resolution Behavior</th></tr>
      <tr><td><strong>1. PENDING (NEW)</strong></td><td>Ticket generated (<code>EBS-2609-XXXX</code>), customer profile created.</td><td>Visible on customer tracker & incoming queue.</td></tr>
      <tr><td><strong>2. ASSIGNED</strong></td><td>Ticket mapped to specific division specialist or engineer.</td><td>Employee assigned queue updated; SLA active.</td></tr>
      <tr><td><strong>3. IN PROGRESS</strong></td><td>Battery placed on diagnostic test bench / cell balancing.</td><td>Tracking displays "Under Lab Diagnostics".</td></tr>
      <tr><td><strong>4. RESOLVED / CLOSED</strong></td><td>Repair complete, root-cause logged, parts replaced.</td><td>Moved from active queue to permanent history ledger.</td></tr>
    </table>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 3</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 4: WARRANTY AND CUSTOMER MANAGEMENT  -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 4 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 4 — WARRANTY AND CUSTOMER MANAGEMENT</h1>
    
    <div>
      <h2 class="section-heading">4.1 Warranty Verification Engine & Coverage Rules</h2>
      <p>
        The warranty system (<code>backend/src/models/Warranty.ts</code>) governs product coverage for EV battery packs, chargers, and vehicles. When a serial number or invoice ID is queried, the system queries MongoDB and computes remaining validity in real time.
      </p>
    </div>

    <div class="grid-2">
      <div class="card-box">
        <strong style="color: #065f46; font-size: 7.8pt;">Automated Expiry Computation:</strong>
        <p style="font-size: 7.2pt; margin-top: 2px;">
          $$\\text{{Expiry Date}} = \\text{{Purchase Date}} + \\text{{Duration (Months)}}$$
          $$\\text{{Remaining Days}} = \\text{{Expiry Date}} - \\text{{Current Date}}$$
        </p>
        <ul style="margin: 2px 0 0 10px; padding: 0; font-size: 7.1pt;">
          <li><strong>Active Coverage:</strong> Remaining Days &gt; 30 days.</li>
          <li><strong>Expiring Soon:</strong> 0 &lt; Remaining Days &le; 30 days.</li>
          <li><strong>Out of Warranty / Expired:</strong> Remaining Days &le; 0 days.</li>
        </ul>
      </div>
      <div class="card-box">
        <strong style="color: #065f46; font-size: 7.8pt;">Customer Relationship Directory:</strong>
        <p style="font-size: 7.2pt; margin-top: 2px;">
          The customer model (<code>Customer.ts</code>) acts as a centralized directory indexed by 10-digit mobile number. Every POS bill, complaint ticket, and warranty registration automatically associates with the customer's master record.
        </p>
      </div>
    </div>

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p4_warranty}" class="screenshot-img-large" alt="Warranty Management Screen" />
      <div class="screenshot-caption">Figure 4.1: Admin Warranty Manager with Date Range Filtering & Excel/CSV Export Engine</div>
    </div>

    <table class="table-custom">
      <tr><th>Feature / Capability</th><th>Endpoint / Controller</th><th>Status</th><th>Technical Notes</th></tr>
      <tr><td>Public Warranty Check</td><td><code>GET /api/v1/warranty/check/:query</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Regex match on serial, bill #, customer mobile</td></tr>
      <tr><td>Customer Self-Registration</td><td><code>POST /api/v1/warranty/register</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Auto-links customer profile & computes expiry</td></tr>
      <tr><td>Admin Warranty Ledger</td><td><code>GET /api/v1/warranty/admin</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Date range filtering & UTF-8 BOM CSV export</td></tr>
      <tr><td>Customer 360 History</td><td><code>GET /api/v1/customers</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td><td>Aggregates linked bills, claims, complaints</td></tr>
    </table>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 4</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 5: ADMIN LOGIN AND DASHBOARD         -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 5 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 5 — ADMIN LOGIN AND DASHBOARD</h1>
    
    <div>
      <h2 class="section-heading">5.1 Administrative Authentication & Dashboard Topology</h2>
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

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p5_dashboard}" class="screenshot-img-large" alt="Admin Dashboard KPIs" />
      <div class="screenshot-caption">Figure 5.1: Real-Time Admin KPI Dashboard with Date Range Presets & Commercial Analytics</div>
    </div>

    <h2 class="section-heading">5.2 Dashboard Date Range Behavior Specification</h2>
    <table class="table-custom">
      <tr><th>Preset Filter</th><th>Date Scope / Calculation</th><th>Implementation Status</th></tr>
      <tr><td><strong>TODAY (Default)</strong></td><td><code>TODAY = default view</code> (00:00:00 to 23:59:59 local date)</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td><strong>Yesterday / 7 Days</strong></td><td>Past 24 hours / Past 7 rolling calendar days</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td><strong>30 Days / This Month</strong></td><td>Past 30 rolling days / First day of month to current timestamp</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td><strong>Custom Range / All</strong></td><td>User selected <code>startDate</code> to <code>endDate</code> / Complete history</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
    </table>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 5</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 6: ADMIN CMS / WEBSITE MANAGEMENT    -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 6 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 6 — ADMIN CMS & SOFT-CODED WEBSITE MANAGEMENT</h1>
    
    <div>
      <h2 class="section-heading">6.1 Soft-Coded Philosophy & Data Propagation</h2>
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

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p6_cms}" class="screenshot-img-large" alt="Admin CMS Studio" />
      <div class="screenshot-caption">Figure 6.1: Admin CMS Content Studio — Service Card Management, Ordering & Visibility Toggles</div>
    </div>

    <h2 class="section-heading">6.2 Configurable CMS Modules & Single Source of Truth</h2>
    <table class="table-custom">
      <tr><th>CMS Module</th><th>Configurable Properties</th><th>Database Storage / Schema</th></tr>
      <tr><td><strong>Hero & Branding</strong></td><td>Business Name, Tagline, Hero Title, Subtitle, CTA buttons</td><td><code>Content.companyProfile</code>, <code>Content.hero</code></td></tr>
      <tr><td><strong>Service Cards Grid</strong></td><td>Card Title, Description, Bullet Features, Icon, Order, Active</td><td><code>Content.serviceCards[]</code> (Single Source of Truth)</td></tr>
      <tr><td><strong>Contact & Support</strong></td><td>Head Office Address, Phone Numbers, Support Emails, Hours</td><td><code>Content.contact</code></td></tr>
      <tr><td><strong>Legal Policies</strong></td><td>Markdown text for Privacy Policy, Terms, and Refund Rules</td><td><code>Content.policies</code></td></tr>
    </table>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 6</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 7: DYNAMIC FORM BUILDER              -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 7 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 7 — DYNAMIC FORM BUILDER</h1>
    
    <div>
      <h2 class="section-heading">7.1 Dynamic Schema Architecture per Division</h2>
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
        <p style="font-size: 7.1pt; margin-top: 2px;">
          When a customer selects a division on <code>RegisterComplaint.tsx</code>, the component queries <code>GET /api/v1/forms/public/fields/:section</code>. Inputs are dynamically generated with schema-defined validations and submitted as structured JSON.
        </p>
      </div>
    </div>

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p7_form_builder}" class="screenshot-img-portrait" alt="Admin Dynamic Form Builder" />
      <div class="screenshot-caption">Figure 7.1: Admin Dynamic Form Builder Studio — Custom Field Editor, Validations & Order Manager</div>
    </div>

    <table class="table-custom">
      <tr><th>Property</th><th>Type</th><th>Description / Operational Role</th></tr>
      <tr><td><code>fieldName</code></td><td>String</td><td>Database key used in the complaint's <code>formData</code> JSON payload.</td></tr>
      <tr><td><code>fieldLabel</code></td><td>String</td><td>Human-readable label rendered in the user interface.</td></tr>
      <tr><td><code>fieldType</code></td><td>Enum</td><td><code>text</code>, <code>number</code>, <code>select</code>, <code>textarea</code>, <code>date</code>, <code>checkbox</code>, <code>file</code></td></tr>
      <tr><td><code>required</code></td><td>Boolean</td><td>Enforces mandatory validation on client and server before submission.</td></tr>
      <tr><td><code>order</code></td><td>Number</td><td>Defines the vertical display order on the customer form.</td></tr>
    </table>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 7</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 8: EMPLOYEE MANAGEMENT & PERMISSIONS -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 8 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 8 — ADMIN EMPLOYEE MANAGEMENT & PERMISSIONS</h1>
    
    <div>
      <h2 class="section-heading">8.1 Staff Onboarding & Profile Management</h2>
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

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p8_employees}" class="screenshot-img-large" alt="Employee Management Ledger" />
      <div class="screenshot-caption">Figure 8.1: Admin Employee Directory, Role Assignment, Search Ledger & Granular RBAC Permissions</div>
    </div>

    <h2 class="section-heading">8.2 Granular RBAC Permission Matrix</h2>
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
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 8</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 9: ID CARD, SALARY AND PAYROLL       -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 9 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 9 — ID CARD, SALARY AND PAYROLL</h1>
    
    <div>
      <h2 class="section-heading">9.1 Digital Employee ID Card & Remuneration Architecture</h2>
      <p>
        The payroll and ID card modules (<code>SalarySlipModal.tsx</code>, <code>IdCardModal.tsx</code> & <code>employee.controller.ts</code>) manage employee verification badges and monthly compensation packages. The engine records basic earnings, statutory deductions, computes net pay, and translates amounts into Indian Rupees in words.
      </p>
    </div>

    <div class="grid-2">
      <div class="card-box">
        <strong style="color: #065f46; font-size: 7.8pt;">Earnings & Allowances:</strong>
        <p style="font-size: 7.1pt; margin-top: 1px;">
          Basic Salary, HRA, Conveyance, Special/Tech Allowance, Overtime & Field Pay, Performance Bonus, Arrears.
        </p>
      </div>
      <div class="card-box">
        <strong style="color: #92400e; font-size: 7.8pt;">Statutory Deductions:</strong>
        <p style="font-size: 7.1pt; margin-top: 1px;">
          Provident Fund (EPF 12%), ESI Contribution, Professional Tax (PT), TDS / Income Tax, Advance & Loan Recovery.
        </p>
      </div>
    </div>

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p9_salary}" class="screenshot-img-large" alt="Salary Slip Modal" />
      <div class="screenshot-caption">Figure 9.1: Admin Monthly Salary Structure, Deduction Ledger & Payslip Generator Modal</div>
    </div>

    <h2 class="section-heading">9.2 Isolated Single-Page A4 Print Engine</h2>
    <p style="font-size: 7.3pt;">
      The application utilizes an isolated print engine (<code>utils/print.ts</code>). When clicking <strong>Print / Save PDF</strong>, a hidden iframe renders strictly the payslip card, preventing surrounding sidebars, navbars, and buttons from leaking into the printout or PDF.
    </p>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 9</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 10: BILLING AND INVOICE SYSTEM       -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 10 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 10 — BILLING AND INVOICE SYSTEM</h1>
    
    <div>
      <h2 class="section-heading">10.1 Showroom Point-of-Sale Billing Terminal</h2>
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

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p10_billing}" class="screenshot-img-large" alt="POS Billing Terminal" />
      <div class="screenshot-caption">Figure 10.1: Showroom Point-of-Sale Billing Terminal & Customer Tax Invoice Slip Modal</div>
    </div>

    <h2 class="section-heading">10.2 Soft-Coded Bill Template Designer</h2>
    <table class="table-custom">
      <tr><th>Template Element</th><th>Customizable Attributes</th><th>Implementation Status</th></tr>
      <tr><td><strong>Branding & Theme</strong></td><td>Primary highlight color, company logo, watermark text</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td><strong>Header Profile</strong></td><td>Business Name, Tagline, Central Plant Address, GSTIN, Phone</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td><strong>Footer Disclaimers</strong></td><td>Authorized signatory label, terms of return, dispute jurisdiction</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td><strong>Backend Invoicing API</strong></td><td><code>POST /api/v1/billing</code> & <code>GET /api/v1/billing</code></td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
    </table>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 10</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 11: EMPLOYEE PORTAL                  -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 11 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 11 — EMPLOYEE PORTAL</h1>
    
    <div>
      <h2 class="section-heading">11.1 Employee Workspace Architecture</h2>
      <p>
        The Employee Portal (<code>employee-portal/</code>) provides field engineers and showroom staff with a dedicated workstation. Authentication via <code>POST /api/v1/auth/login</code> verifies credentials, issues an <code>employee_token</code>, and evaluates RBAC permissions to dynamically configure the workspace.
      </p>
    </div>

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p11_emp_dash}" class="screenshot-img-large" alt="Employee Dashboard" />
      <div class="screenshot-caption">Figure 11.1: Employee Workspace Dashboard, Active Assigned Queue & Operational Metrics</div>
    </div>

    <h2 class="section-heading">11.2 Employee Portal Functional Module Directory</h2>
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
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 11</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 12: COMPLAINT, CUSTOMER & WARRANTY   -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 12 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 12 — EMPLOYEE COMPLAINT, CUSTOMER & WARRANTY WORKFLOW</h1>
    
    <div>
      <h2 class="section-heading">12.1 End-to-End Service Resolution Workflow</h2>
      <p>
        When an employee logs into the portal, tickets assigned to their division appear in their active queue. Staff open the technical problem dossier (<code>TicketDetailModal.tsx</code>) to inspect customer complaints, photos, and dynamic test metrics.
      </p>
    </div>

    <div class="flowchart">
[Assigned Ticket in Queue] --> [Inspect Customer Details & Photos] --> [Update Status to "IN PROGRESS"]
                                                                                |
[Ticket Moved to Permanent History Ledger] <-- [Resolve Ticket & Add Remarks] <--+
    </div>

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p12_dossier}" class="screenshot-img-large" alt="Complaint Dossier" />
      <div class="screenshot-caption">Figure 12.1: Service Complaint Inspection Dossier, Status Update & Resolution Workbench</div>
    </div>

    <h2 class="section-heading">12.2 Workload Isolation & Active Queue Rules</h2>
    <table class="table-custom">
      <tr><th>Operation / Rule</th><th>Technical Mechanism</th><th>Audit & Ledger Outcome</th></tr>
      <tr><td><strong>Assigned Queue Filter</strong></td><td>Matches <code>c.assignedTo</code> with <code>user.employeeId</code> and <code>user._id</code></td><td>Staff view only their assigned workload.</td></tr>
      <tr><td><strong>Diagnostic Progression</strong></td><td><code>PATCH /api/v1/complaints/:id/status</code></td><td>Updates status from <code>Pending</code> to <code>In Progress</code> to <code>Resolved</code>.</td></tr>
      <tr><td><strong>Active vs. History</strong></td><td>Resolved/Closed tickets clear from active list</td><td>Permanently archived in database for SLA reports.</td></tr>
      <tr><td><strong>Warranty Verification</strong></td><td>Serial lookup against purchase date</td><td>Confirms active coverage before processing free repairs.</td></tr>
    </table>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 12</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 13: STOCK, BILLING AND SCANNER       -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 13 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 13 — STOCK, BILLING AND SCANNER</h1>
    
    <div>
      <h2 class="section-heading">13.1 Warehouse Stock & Inventory Architecture</h2>
      <p>
        The inventory engine (<code>backend/src/models/Stock.ts</code>) tracks catalog products, serialized battery packs, and movement ledgers across warehouses and showrooms. Stock items maintain status flags (<code>In Stock</code>, <code>Sold</code>, <code>Reserved</code>, <code>Damaged</code>) and record comprehensive movement histories.
      </p>
    </div>

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p13_stock}" class="screenshot-img-large" alt="Warehouse Stock Inventory" />
      <div class="screenshot-caption">Figure 13.1: Warehouse Stock Inventory Management, Serialized Battery Packs & Barcode Lookup</div>
    </div>

    <h2 class="section-heading">13.2 HTML5 Camera Barcode & QR Scanner Integration</h2>
    <p>
      Integrated via <code>ScannerModal.tsx</code> using <code>@zxing/browser</code>, the scanner leverages device webcams or mobile cameras to read Code 128, Code 39, EAN-13, and QR barcodes on physical battery packs, instantly auto-populating line items in POS billing.
    </p>

    <h2 class="section-heading">13.3 Billing + Stock Synchronization Workflow</h2>
    <table class="table-custom">
      <tr><th>Step</th><th>Workflow Phase</th><th>System Action / Data Mutation</th></tr>
      <tr><td>1</td><td>Barcode Scan</td><td>Staff scans battery serial; system verifies <code>status === 'In Stock'</code>.</td></tr>
      <tr><td>2</td><td>POS Invoice Creation</td><td>Item added to bill; GST (18%) and grand total computed.</td></tr>
      <tr><td>3</td><td>Database Sync</td><td><code>Stock.quantity</code> decremented; <code>StockMovement</code> logged as 'Sold'.</td></tr>
      <tr><td>4</td><td>Warranty Auto-Creation</td><td>Warranty record generated linking serial number to customer bill.</td></tr>
    </table>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 13</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 14: REPORTS, FILTERS AND EXCEL       -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 14 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 14 — REPORTS, FILTERS AND EXCEL EXPORT</h1>
    
    <div>
      <h2 class="section-heading">14.1 Enterprise Reporting & Analytics Suite</h2>
      <p>
        The reporting engine (<code>admin-portal/src/pages/Reports.tsx</code> & <code>employee-portal/src/pages/Reports.tsx</code>) provides analytics across complaints, warranties, inventory, and revenue. It supports division filters (<em>Battery</em>, <em>Rental</em>, <em>Showroom</em>, <em>Spare Parts</em>) and date presets.
      </p>
    </div>

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p14_reports}" class="screenshot-img-large" alt="Admin Reports Suite" />
      <div class="screenshot-caption">Figure 14.1: Administrative Reports Suite with Date Presets, KPI Counters & Division CSV Export</div>
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
        <p style="font-size: 7.1pt; margin-top: 2px;">
          Employee Reports strictly filter tickets assigned to the logged-in staff member by matching <code>employeeId</code>, <code>_id</code>, <code>name</code>, and <code>email</code>, preventing data leakage across staff.
        </p>
      </div>
    </div>

    <h2 class="section-heading">14.2 Excel / CSV Export Specifications</h2>
    <p style="font-size: 7.3pt;">
      Export routines format data into RFC 4180 compliant CSV files with <code>\\uFEFF</code> UTF-8 Byte Order Marks (BOM), ensuring multilingual customer names and Indian Rupee (&8377;) currency symbols render cleanly in Microsoft Excel and Google Sheets.
    </p>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 14</span>
  </div>
</div>

<!-- ========================================== -->
<!-- PAGE 15: COMPLETE SYSTEM SUMMARY          -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 15 OF 15</span>
  </div>
  <div class="page-content">
    <h1 class="page-title">PAGE 15 — COMPLETE SYSTEM FLOW & TECHNICAL SUMMARY</h1>
    
    <div>
      <h2 class="section-heading">15.1 Master End-to-End Operational Flow</h2>
      <div class="flowchart" style="font-size: 6.5pt; line-height: 1.2;">
[CUSTOMER] --> Public Portal --> Dynamic Form Intake --> Express API --> MongoDB Atlas (Ticket Created)
[ADMIN]    --> Admin Portal  --> CMS / Form Designer / RBAC / Payroll --> MongoDB Atlas (Global Config)
[EMPLOYEE] --> Employee Portal --> Diagnostic Dossier / POS / Stock --> MongoDB Atlas (Task Completed)
      </div>
    </div>

    <!-- LARGE VISIBLE SCREENSHOT -->
    <div class="screenshot-card">
      <img src="{img_p15_summary}" class="screenshot-img-large" alt="Employee Workload Audit" />
      <div class="screenshot-caption">Figure 15.1: Staff Assigned Workload Live Audit, Date Filter Presets & Excel CSV Export Terminal</div>
    </div>

    <h2 class="section-heading">15.2 Comprehensive System Implementation Audit Matrix</h2>
    <table class="table-custom" style="font-size: 6.8pt;">
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
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Production System Documentation</span>
    <span>Page 15</span>
  </div>
</div>

</body>
</html>
"""

with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated HTML documentation: {HTML_FILE}")

# Execute Chrome headless to generate PDF
cmd = [
    CHROME_PATH,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={OUTPUT_PDF}",
    HTML_FILE
]

print("Rendering PDF via Google Chrome headless engine...")
res = subprocess.run(cmd, capture_output=True, text=True)
print(f"Chrome exit code: {res.returncode}")

if os.path.exists(OUTPUT_PDF):
    size_kb = os.path.getsize(OUTPUT_PDF) / 1024
    with open(OUTPUT_PDF, "rb") as f:
        pdf_bytes = f.read()
    page_count = len(re.findall(rb"/Type\s*/Page\b", pdf_bytes)) - len(re.findall(rb"/Type\s*/Pages\b", pdf_bytes))
    print(f"SUCCESS: Generated PDF at {OUTPUT_PDF}")
    print(f"Total Pages: {page_count}, File Size: {size_kb:.2f} KB")
else:
    print("ERROR: PDF file was not generated.")
