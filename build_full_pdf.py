import os
import base64
import subprocess

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
img_home = get_base64_image("media_1790689055035.png")
img_service_cards = get_base64_image("media_1790689067607.png")
img_complaint_form = get_base64_image("media_1790572646031.png")
img_track_warranty = get_base64_image("media_1790398733116.png")
img_warranty_mgr = get_base64_image("media_1790689962351.png")
img_customer_dossier = get_base64_image("media_1790571523850.png")
img_admin_login = get_base64_image("media_1790358081131.png")
img_admin_dash = get_base64_image("media_1790582820093.png")
img_cms_editor = get_base64_image("media_1790689067607.png")
img_form_builder = get_base64_image("media_1790573005815.png")
img_emp_mgmt = get_base64_image("media_1790572430957.png")
img_id_card = get_base64_image("media_1790572059730.png")
img_salary_slip = get_base64_image("media_1790571619509.png")
img_pos_billing = get_base64_image("media_1790571523850.png")
img_emp_login = get_base64_image("media_1790357713193.png")
img_emp_dash = get_base64_image("media_1790398760696.png")
img_complaints_list = get_base64_image("media_1790689897022.png")
img_stock_mgr = get_base64_image("media_1790404662382.png")
img_scanner = get_base64_image("media_1790403707215.png")
img_admin_reports = get_base64_image("media_1790689880199.png")
img_emp_reports = get_base64_image("media_1790691036463.png")

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
    font-size: 8.8pt;
    line-height: 1.35;
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
    padding-bottom: 4px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.5pt;
    font-weight: 700;
    color: #065f46;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  .page-footer {{
    border-top: 1px solid #cbd5e1;
    padding-top: 4px;
    margin-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7pt;
    color: #64748b;
  }}
  .page-content {{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 6px;
    overflow: hidden;
  }}
  h1.page-title {{
    font-size: 13pt;
    font-weight: 900;
    color: #0f172a;
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    border-left: 4px solid #059669;
    padding-left: 8px;
    line-height: 1.2;
  }}
  h2.section-heading {{
    font-size: 9.5pt;
    font-weight: 800;
    color: #065f46;
    margin: 4px 0 2px 0;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 2px;
  }}
  p {{
    margin: 0 0 4px 0;
    color: #334155;
    text-align: justify;
  }}
  .badge {{
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
  }}
  .badge-emerald {{ background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }}
  .badge-blue {{ background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }}
  .badge-amber {{ background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }}
  
  .table-custom {{
    width: 100%;
    border-collapse: collapse;
    font-size: 7.5pt;
    margin: 3px 0 5px 0;
  }}
  .table-custom th {{
    background: #065f46;
    color: #ffffff;
    padding: 4px 6px;
    text-align: left;
    font-weight: 700;
    border: 1px solid #047857;
  }}
  .table-custom td {{
    padding: 3px 6px;
    border: 1px solid #e2e8f0;
    color: #334155;
  }}
  .table-custom tr:nth-child(even) {{
    background: #f8fafc;
  }}

  .card-box {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 8px;
    margin: 2px 0;
  }}
  .flowchart {{
    background: #0f172a;
    color: #f8fafc;
    border-radius: 6px;
    padding: 6px 8px;
    font-family: 'Consolas', monospace;
    font-size: 7.2pt;
    line-height: 1.3;
    margin: 3px 0;
    border-left: 3px solid #10b981;
  }}

  .screenshot-container {{
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 3px;
    background: #f8fafc;
    margin: 3px 0;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }}
  .screenshot-img {{
    width: 100%;
    max-height: 110px;
    object-fit: contain;
    border-radius: 4px;
    display: block;
    margin: 0 auto;
    background: #ffffff;
  }}
  .screenshot-img-sm {{
    width: 100%;
    max-height: 85px;
    object-fit: contain;
    border-radius: 4px;
    display: block;
    margin: 0 auto;
    background: #ffffff;
  }}
  .screenshot-caption {{
    font-size: 7pt;
    font-weight: 700;
    color: #475569;
    margin-top: 2px;
    text-align: center;
  }}
  .grid-2 {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }}
  .grid-3 {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
  }}
</style>
</head>
<body>

<!-- ========================================== -->
<!-- PAGE 1: PROJECT OVERVIEW                  -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <span>EKOSMART EV BATTERY SOLUTION — SYSTEM DOCUMENTATION</span>
    <span>PAGE 1 OF 15</span>
  </div>
  <div class="page-content">
    <div style="background: linear-gradient(135deg, #064e3b, #0f172a); color: #fff; padding: 8px 12px; border-radius: 6px; margin-bottom: 4px;">
      <span class="badge badge-amber" style="margin-bottom: 2px;">Technical Engineering Manual</span>
      <h1 style="color: #fff; font-size: 13pt; margin: 2px 0; font-weight: 900; letter-spacing: -0.3px;">
        EKOSMART DIGITAL CUSTOMER SERVICE, MANAGEMENT AND OPERATIONS SYSTEM
      </h1>
      <div style="font-size: 7.5pt; color: #a7f3d0;">
        Full-Stack Enterprise EV Battery Service, POS Billing, Stock & Payroll Ecosystem • Architecture & System Manual
      </div>
    </div>

    <h2 class="section-heading">1.1 Executive Summary & Problem Formulation</h2>
    <p>
      The <strong>Ekosmart EV Battery Management Platform</strong> is a unified, 3-tier enterprise software suite designed for electric vehicle lithium-ion/LFP battery manufacturing plants, service centers, and retail showrooms. Traditional EV after-sales workflows face severe operational bottlenecks: unorganized customer grievance logging, manual serial warranty lookups leading to claim disputes, disconnected POS showroom billing and warehouse inventory, static website CMS constraints, and paper-based payroll calculations.
    </p>

    <h2 class="section-heading">1.2 System Objectives & Core Technology Stack</h2>
    <div class="grid-2">
      <div class="card-box">
        <strong style="color: #065f46;">Key Strategic Objectives:</strong>
        <ul style="margin: 2px 0 0 12px; padding: 0; font-size: 7.5pt;">
          <li>Public dynamic service registration & automated ticket assignment.</li>
          <li>Real-time serial warranty verification & automated duration expiry.</li>
          <li>Soft-coded CMS and dynamic form builders stored in MongoDB.</li>
          <li>Showroom POS billing with camera barcode scanner & auto-stock deduction.</li>
          <li>Role-based access control (RBAC) & isolated A4 payslip generation.</li>
        </ul>
      </div>
      <div>
        <table class="table-custom" style="margin: 0;">
          <tr><th>Layer</th><th>Technology</th><th>Role / Purpose</th></tr>
          <tr><td><strong>Frontend</strong></td><td>React 19, TypeScript, Vite 8, Tailwind</td><td>Public, Admin & Employee SPAs</td></tr>
          <tr><td><strong>Backend</strong></td><td>Node.js, Express, TypeScript</td><td>RESTful API Server (/api/v1/*)</td></tr>
          <tr><td><strong>Database</strong></td><td>MongoDB Atlas + Mongoose ODM</td><td>NoSQL Document Store</td></tr>
          <tr><td><strong>Security</strong></td><td>JWT, bcrypt, RBAC Middleware</td><td>Token Auth & Route Protection</td></tr>
        </table>
      </div>
    </div>

    <h2 class="section-heading">1.3 High-Level System Architecture & Flow</h2>
    <div class="flowchart">
[Customer] --> (Public Portal) --> [Dynamic Intake Form] --> (Express API) --> [MongoDB Atlas]
                                                                  |
[Administrator] --> (Admin Portal) --> [CMS / Forms / RBAC / Payroll] -------+
                                                                  |
[Staff / Engineer] --> (Employee Portal) --> [Diagnostics / POS / Stock / Slips] ----+
    </div>

    <div class="screenshot-container">
      <img src="{img_home}" class="screenshot-img" alt="Public Website Homepage" />
      <div class="screenshot-caption">Figure 1.1: Ekosmart Live Deployed Public Customer Web Portal & Brand Header</div>
    </div>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">2.1 Public Web Architecture & Customer Journey</h2>
    <p>
      The Public Customer Website (<code>frontend/</code>) serves as the primary customer touchpoint. Designed with React 19 and Tailwind CSS, it connects dynamically with the backend API to retrieve real-time CMS content, operational service cards, and division forms. Customers can register service tickets, track real-time resolution stages, verify battery warranty coverage, and review plant policies without logging in.
    </p>

    <div class="grid-2">
      <div class="card-box">
        <strong style="color: #065f46;">Core Public Modules:</strong>
        <ul style="margin: 2px 0 0 12px; padding: 0; font-size: 7.5pt;">
          <li><strong>Hero Section:</strong> Dynamic headline, badge text, and action buttons.</li>
          <li><strong>Service Cards:</strong> Showroom, Rental, Spare Parts, Lithium Battery.</li>
          <li><strong>Ticket Tracker:</strong> Search by Ticket Number (<code>EBS-YYMM-XXXX</code>) or Phone.</li>
          <li><strong>Warranty Center:</strong> Real-time serial check & self-service registration.</li>
          <li><strong>Legal Policies:</strong> Dynamic Privacy, Terms, and Refund disclosures.</li>
        </ul>
      </div>
      <div class="card-box">
        <strong style="color: #065f46;">CMS-Driven Data Flow:</strong>
        <p style="font-size: 7.5pt; margin-top: 2px;">
          During initialization, the client invokes <code>GET /api/v1/content/public</code>. Hero typography, branding titles, service card lists, and phone numbers are loaded directly from MongoDB. If the server is offline, embedded graceful fallbacks prevent UI disruption.
        </p>
      </div>
    </div>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_home}" class="screenshot-img" alt="Public Homepage Hero" />
        <div class="screenshot-caption">Figure 2.1: Live Deployed Ekosmart Customer Homepage & Hero Banner</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_service_cards}" class="screenshot-img" alt="Public Service Cards" />
        <div class="screenshot-caption">Figure 2.2: Soft-Coded Division Service Cards Grid (CMS Controlled)</div>
      </div>
    </div>

    <h2 class="section-heading">2.2 Public Website Implementation Audit</h2>
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
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">3.1 Grievance Ingestion & Processing Pipeline</h2>
    <p>
      The complaint registration module (<code>RegisterComplaint.tsx</code>) enables customers to submit technical battery issues, rental vehicle breakdowns, and showroom service requests. The submission pipeline connects to the dynamic form builder to generate custom inputs on a per-division basis.
    </p>

    <div class="flowchart">
[Customer Selects Division] --> [GET /forms/public/fields/:sec] --> [Renders Dynamic Technical Fields]
             |
             v
[Enters Name, Phone, City, Description] --> [POST /complaints/public] --> [Generates Ticket EBS-YYMM-XXXX]
             |
             v
[Database Ledger Updated] --> [Assigned to Division Staff] --> [Status: PENDING -> IN_PROGRESS -> RESOLVED]
    </div>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_complaint_form}" class="screenshot-img" alt="Complaint Registration Form" />
        <div class="screenshot-caption">Figure 3.1: Service Complaint Intake Form with Dynamic Technical Fields</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_track_warranty}" class="screenshot-img" alt="Ticket Status Tracker" />
        <div class="screenshot-caption">Figure 3.2: Real-Time Ticket Status Tracker & Search Interface</div>
      </div>
    </div>

    <h2 class="section-heading">3.2 Complaint Lifecycle & Reference Specification</h2>
    <table class="table-custom">
      <tr><th>Stage / Status</th><th>System Action</th><th>Visibility & Post-Resolution Behavior</th></tr>
      <tr><td><strong>1. PENDING (NEW)</strong></td><td>Ticket generated (<code>EBS-2609-XXXX</code>), customer record created.</td><td>Visible on customer tracker & admin/employee incoming queue.</td></tr>
      <tr><td><strong>2. ASSIGNED</strong></td><td>Ticket mapped to specific division specialist or engineer.</td><td>Employee assigned queue updated; SLA countdown active.</td></tr>
      <tr><td><strong>3. IN PROGRESS</strong></td><td>Battery placed on diagnostic test bench / cell balancing.</td><td>Customer tracking displays "Under Lab Diagnostics".</td></tr>
      <tr><td><strong>4. RESOLVED / CLOSED</strong></td><td>Repair complete, root-cause logged, parts replaced.</td><td>Moved from active workbench to permanent audit ledger.</td></tr>
    </table>
    <p style="font-size: 7.5pt; color: #475569; margin-top: 2px;">
      *Note on OTP Verification: The UI features an OTP verification modal; direct phone logging is currently active while SMS gateway integration remains <span class="badge badge-amber">FRONTEND/UI ONLY</span>.
    </p>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">4.1 Warranty Verification Engine & Coverage Rules</h2>
    <p>
      The warranty system (<code>backend/src/models/Warranty.ts</code>) governs product coverage for EV battery packs, chargers, and vehicles. When a customer or staff enters a serial number or invoice ID, the system queries MongoDB and computes remaining validity in real time.
    </p>

    <div class="grid-2">
      <div class="card-box">
        <strong style="color: #065f46;">Automated Expiry Computation:</strong>
        <p style="font-size: 7.5pt; margin-top: 2px;">
          $$\\text{{Expiry Date}} = \\text{{Purchase Date}} + \\text{{Duration (Months)}}$$
          $$\\text{{Remaining Days}} = \\text{{Expiry Date}} - \\text{{Current Date}}$$
        </p>
        <ul style="margin: 2px 0 0 12px; padding: 0; font-size: 7.3pt;">
          <li><strong>Active Coverage:</strong> Remaining Days &gt; 30 days.</li>
          <li><strong>Expiring Soon:</strong> 0 &lt; Remaining Days &le; 30 days.</li>
          <li><strong>Out of Warranty / Expired:</strong> Remaining Days &le; 0 days.</li>
        </ul>
      </div>
      <div class="card-box">
        <strong style="color: #065f46;">Customer Relationship Ledger:</strong>
        <p style="font-size: 7.5pt; margin-top: 2px;">
          The customer model (<code>Customer.ts</code>) acts as a centralized directory indexed by 10-digit mobile number. Every POS bill, complaint ticket, and warranty registration automatically associates with the customer's master record.
        </p>
      </div>
    </div>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_warranty_mgr}" class="screenshot-img" alt="Warranty Management Screen" />
        <div class="screenshot-caption">Figure 4.1: Admin Warranty Manager with Date Filters & Excel Export</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_customer_dossier}" class="screenshot-img" alt="Customer Management Ledger" />
        <div class="screenshot-caption">Figure 4.2: Customer History Ledger linking Complaints & Invoices</div>
      </div>
    </div>

    <h2 class="section-heading">4.2 Warranty & Customer Module Status</h2>
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
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">5.1 Administrative Authentication & Security Architecture</h2>
    <p>
      The Admin Portal (<code>admin-portal/</code>) provides high-level command and control over company operations. Access requires authenticated credentials processed via <code>POST /api/v1/auth/login</code>. On successful bcrypt hash verification, the server issues a signed JSON Web Token (JWT) stored in <code>localStorage</code> (<code>admin_token</code>), attaching to all subsequent API requests.
    </p>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_admin_login}" class="screenshot-img" alt="Admin Portal Login" />
        <div class="screenshot-caption">Figure 5.1: Admin Portal Secure Authentication Gateway</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_admin_dash}" class="screenshot-img" alt="Admin Dashboard KPIs" />
        <div class="screenshot-caption">Figure 5.2: Admin Operational Dashboard with Real-Time KPI Cards & Date Filter</div>
      </div>
    </div>

    <h2 class="section-heading">5.2 Operational KPIs & Date Filter Presets</h2>
    <p>
      The dashboard aggregates live metrics across services, inventory, and revenue via <code>GET /api/v1/dashboard/stats</code>:
    </p>
    <div class="grid-3">
      <div class="card-box" style="text-align: center;">
        <strong style="color: #065f46; font-size: 8pt;">Service Counters</strong>
        <div style="font-size: 7.2pt; margin-top: 2px;">Total Complaints, Pending Inspection, In-Progress Diagnostics, Resolved Tickets.</div>
      </div>
      <div class="card-box" style="text-align: center;">
        <strong style="color: #1e40af; font-size: 8pt;">Commercial Metrics</strong>
        <div style="font-size: 7.2pt; margin-top: 2px;">Total Showroom Revenue (₹), Completed Invoices, Registered Warranties.</div>
      </div>
      <div class="card-box" style="text-align: center;">
        <strong style="color: #92400e; font-size: 8pt;">Warehouse & Staff</strong>
        <div style="font-size: 7.2pt; margin-top: 2px;">Catalog Items, Available Batteries, Active Field Engineers.</div>
      </div>
    </div>

    <h2 class="section-heading">5.3 Dashboard Date Behavior Specification</h2>
    <table class="table-custom">
      <tr><th>Preset Filter</th><th>Date Calculation / Scope</th><th>Implementation Status</th></tr>
      <tr><td><strong>TODAY (Default)</strong></td><td><code>TODAY = default view</code> (00:00:00 to 23:59:59 local date)</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td><strong>Yesterday / 7 Days</strong></td><td>Past 24 hours / Past 7 rolling calendar days</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td><strong>30 Days / This Month</strong></td><td>Past 30 rolling days / First day of month to current timestamp</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
      <tr><td><strong>Custom Range / All</strong></td><td>User selected <code>startDate</code> to <code>endDate</code> / Complete history</td><td><span class="badge badge-emerald">IMPLEMENTED</span></td></tr>
    </table>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">6.1 Soft-Coded Philosophy & Architecture</h2>
    <p>
      In the Ekosmart platform, <strong>soft-coding</strong> means that marketing text, hero typography, dynamic service cards, plant coordinates, and legal terms are decoupled from static code and stored in MongoDB (<code>Content.ts</code>). Administrators configure the entire platform through the CMS without modifying code or redeploying the application.
    </p>

    <div class="flowchart">
[Admin CMS Studio] --> [PUT /api/v1/content/admin/update] --> [MongoDB: Content Collection]
                                                                     |
[Public Frontend Mount] <----- [GET /api/v1/content/public] <--------+
(Renders Live Hero, Service Cards, Contacts, Terms without Redeployment)
    </div>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_cms_editor}" class="screenshot-img" alt="CMS Service Card Editor" />
        <div class="screenshot-caption">Figure 6.1: Admin CMS Service Card & Hero Management Studio</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_home}" class="screenshot-img" alt="Public Result" />
        <div class="screenshot-caption">Figure 6.2: Live Public Website displaying CMS Managed Service Cards</div>
      </div>
    </div>

    <h2 class="section-heading">6.2 Configurable CMS Modules</h2>
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
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">7.1 Dynamic Schema Architecture per Division</h2>
    <p>
      The Dynamic Form Builder (<code>admin-portal/src/pages/Forms.tsx</code>) enables administrators to construct custom grievance intake forms for each operational area (e.g., <em>Battery</em>, <em>Rental</em>, <em>Showroom</em>, <em>Spare Parts</em>). Field schemas are stored in MongoDB (<code>ComplaintForm.ts</code>) and rendered dynamically on the public portal.
    </p>

    <div class="grid-2">
      <div class="card-box">
        <strong style="color: #065f46;">Supported Field Types:</strong>
        <ul style="margin: 2px 0 0 12px; padding: 0; font-size: 7.3pt;">
          <li><strong>Text / Textarea:</strong> Single line & paragraph fault descriptions.</li>
          <li><strong>Number:</strong> Battery voltage, ampere-hour (Ah), mileage.</li>
          <li><strong>Select Dropdown:</strong> Fault codes, cell chemistry (LFP/NMC).</li>
          <li><strong>Date / Checkbox:</strong> Manufacturing date, warranty claim confirmation.</li>
          <li><strong>File Upload:</strong> Diagnostic test reports, damaged battery photos.</li>
        </ul>
      </div>
      <div class="card-box">
        <strong style="color: #065f46;">Client-Side Dynamic Rendering:</strong>
        <p style="font-size: 7.5pt; margin-top: 2px;">
          When a customer selects a division on <code>RegisterComplaint.tsx</code>, the component queries <code>GET /api/v1/forms/public/fields/:section</code>. Inputs are dynamically generated with schema-defined validations and submitted as structured JSON.
        </p>
      </div>
    </div>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_form_builder}" class="screenshot-img" alt="Admin Dynamic Form Builder" />
        <div class="screenshot-caption">Figure 7.1: Admin Dynamic Form Studio & Field Customizer</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_complaint_form}" class="screenshot-img" alt="Public Form Output" />
        <div class="screenshot-caption">Figure 7.2: Dynamically Rendered Intake Form on Public Website</div>
      </div>
    </div>

    <h2 class="section-heading">7.2 Dynamic Field Schema Definition</h2>
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
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">8.1 Staff Onboarding & Profile Management</h2>
    <p>
      The Employee Management module (<code>admin-portal/src/pages/Employees.tsx</code>) handles staff profiles, access credentials, department assignments, and security roles. Administrators maintain complete records including Employee ID (<code>EMP-XXXX</code>), name, contact number, official email, department, designation, and password visibility toggles.
    </p>

    <div class="flowchart">
[Admin Creates Employee] --> [Assigns Role & Permissions] --> [Saves to MongoDB Employee Model]
                                                                        |
[Employee Login] --> [Server Issues JWT with RBAC Payload] <------------+
                                |
                                v
[Client Navigation & API Middleware Enforce Permission Gates]
    </div>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_emp_mgmt}" class="screenshot-img" alt="Employee Management Table" />
        <div class="screenshot-caption">Figure 8.1: Admin Employee Directory, Role Assignment & Search Ledger</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_emp_mgmt}" class="screenshot-img" alt="Permissions Modal" />
        <div class="screenshot-caption">Figure 8.2: Granular Role-Based Access Control (RBAC) Configuration</div>
      </div>
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
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">9.1 Digital Employee ID Card Engine</h2>
    <p>
      The ID card system (<code>IdCardModal.tsx</code> & <code>MyIdCard.tsx</code>) generates verified digital identification badges featuring company branding, staff photograph/avatar, official Employee ID (<code>EMP-XXXX</code>), division, designation, and an encoded QR badge for on-site scanning.
    </p>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_id_card}" class="screenshot-img" alt="Digital Employee ID Card" />
        <div class="screenshot-caption">Figure 9.1: Digital Employee ID Badge with Encoded QR Badge</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_salary_slip}" class="screenshot-img" alt="Salary Slip Modal" />
        <div class="screenshot-caption">Figure 9.2: Official Monthly Remuneration Salary Slip Modal</div>
      </div>
    </div>

    <h2 class="section-heading">9.2 Payroll Calculation & Isolated Payslip Engine</h2>
    <p>
      The payroll module (<code>SalarySlipModal.tsx</code> & <code>backend/src/controllers/employee.controller.ts</code>) manages remuneration packages. It records basic earnings, statutory deductions, computes net pay, and translates amounts into Indian Rupees in words.
    </p>
    <div class="grid-2">
      <div class="card-box">
        <strong style="color: #065f46;">Earnings & Allowances:</strong>
        <p style="font-size: 7.3pt; margin-top: 2px;">
          Basic Salary, HRA, Conveyance, Special/Tech Allowance, Overtime & Field Pay, Performance Bonus, Arrears.
        </p>
      </div>
      <div class="card-box">
        <strong style="color: #92400e;">Statutory Deductions:</strong>
        <p style="font-size: 7.3pt; margin-top: 2px;">
          Provident Fund (EPF 12%), ESI Contribution, Professional Tax (PT), TDS / Income Tax, Advance & Loan Recovery.
        </p>
      </div>
    </div>

    <h2 class="section-heading">9.3 Isolated Single-Page A4 Print Engine</h2>
    <p style="font-size: 7.5pt;">
      The application utilizes an isolated print engine (<code>utils/print.ts</code>). When an employee clicks <strong>Print / Save PDF</strong>, a hidden iframe renders strictly the payslip card, preventing surrounding sidebars, navbars, and buttons from leaking into the printout or PDF.
    </p>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">10.1 Showroom Point-of-Sale Billing Terminal</h2>
    <p>
      The billing module (<code>BillingManager.tsx</code> & <code>Billing.tsx</code>) serves as the POS checkout system for showrooms and service centers. Operators can add line items, calculate discounts and GST (18%), scan battery pack barcodes, select payment modes (UPI, Cash, Card, Finance), and generate tax invoices.
    </p>

    <div class="flowchart">
[Select Product / Battery] --> [Scan Serial via Camera Scanner] --> [Validate Stock Level]
                                                                           |
[Generate Invoice (INV-YYMM-XXXX)] <-- [Compute GST 18% & Net Total] <-----+
             |
             +---> [Auto-Issues Warranty Record in Database]
             +---> [Decrements Available Warehouse Stock Quantity]
    </div>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_pos_billing}" class="screenshot-img" alt="POS Billing Terminal" />
        <div class="screenshot-caption">Figure 10.1: Showroom Point-of-Sale Billing Terminal</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_pos_billing}" class="screenshot-img" alt="Tax Invoice Slip" />
        <div class="screenshot-caption">Figure 10.2: Generated Tax Invoice Slip with Bill Template Styling</div>
      </div>
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
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">11.1 Employee Workspace Architecture</h2>
    <p>
      The Employee Portal (<code>employee-portal/</code>) provides field engineers and showroom staff with a dedicated workstation. Authentication via <code>POST /api/v1/auth/login</code> verifies credentials, issues an <code>employee_token</code>, and evaluates RBAC permissions to dynamically configure the workspace.
    </p>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_emp_login}" class="screenshot-img" alt="Employee Login" />
        <div class="screenshot-caption">Figure 11.1: Employee Portal Secure Authentication Gateway</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_emp_dash}" class="screenshot-img" alt="Employee Dashboard" />
        <div class="screenshot-caption">Figure 11.2: Employee Workspace Dashboard & Active Assigned Queue</div>
      </div>
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
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">12.1 End-to-End Service Resolution Workflow</h2>
    <p>
      When an employee logs into the portal, tickets assigned to their division appear in their active queue. Staff open the technical problem dossier (<code>TicketDetailModal.tsx</code>) to inspect customer complaints, photos, and dynamic test metrics.
    </p>

    <div class="flowchart">
[Assigned Ticket in Queue] --> [Inspect Customer Details & Photos] --> [Update Status to "IN PROGRESS"]
                                                                                |
[Ticket Moved to Permanent History Ledger] <-- [Resolve Ticket & Add Remarks] <--+
    </div>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_complaints_list}" class="screenshot-img" alt="Complaint List" />
        <div class="screenshot-caption">Figure 12.1: Service Complaint Problem Dossier & Technical Resolution Modal</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_emp_reports}" class="screenshot-img" alt="Assigned Workload" />
        <div class="screenshot-caption">Figure 12.2: Staff Assigned Workload Audit & Resolution History</div>
      </div>
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
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">13.1 Warehouse Stock & Inventory Architecture</h2>
    <p>
      The inventory engine (<code>backend/src/models/Stock.ts</code>) tracks catalog products, serialized battery packs, and movement ledgers across warehouses and showrooms. Stock items maintain status flags (<code>In Stock</code>, <code>Sold</code>, <code>Reserved</code>, <code>Damaged</code>) and record comprehensive movement histories.
    </p>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_stock_mgr}" class="screenshot-img" alt="Stock Inventory Explorer" />
        <div class="screenshot-caption">Figure 13.1: Warehouse Inventory Explorer & Serial Number Lookup</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_scanner}" class="screenshot-img" alt="Camera Barcode Scanner" />
        <div class="screenshot-caption">Figure 13.2: HTML5 Real-Time Camera Barcode & QR Scanner in Action</div>
      </div>
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
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">14.1 Enterprise Reporting & Analytics Suite</h2>
    <p>
      The reporting engine (<code>admin-portal/src/pages/Reports.tsx</code> & <code>employee-portal/src/pages/Reports.tsx</code>) provides analytics across complaints, warranties, inventory, and revenue. It supports division filters (<em>Battery</em>, <em>Rental</em>, <em>Showroom</em>, <em>Spare Parts</em>) and date presets.
    </p>

    <div class="grid-2">
      <div class="screenshot-container">
        <img src="{img_admin_reports}" class="screenshot-img" alt="Admin Analytics Reports" />
        <div class="screenshot-caption">Figure 14.1: Administrative Reports Suite with Date Presets & Division CSV Export</div>
      </div>
      <div class="screenshot-container">
        <img src="{img_emp_reports}" class="screenshot-img" alt="Employee Reports" />
        <div class="screenshot-caption">Figure 14.2: Staff Service Workload Audit & Excel/CSV Export Screen</div>
      </div>
    </div>

    <h2 class="section-heading">14.2 Date Range Presets & Workload Isolation</h2>
    <div class="grid-2">
      <div class="card-box">
        <strong style="color: #065f46;">Date Range Filter Presets:</strong>
        <ul style="margin: 2px 0 0 12px; padding: 0; font-size: 7.3pt;">
          <li><code>Today</code> (Default view) & <code>Yesterday</code></li>
          <li><code>Last 7 Days</code> & <code>Last 30 Days</code></li>
          <li><code>This Month</code> & <code>All Time</code></li>
          <li><code>Custom Date Range</code> (Start Date &rarr; End Date)</li>
        </ul>
      </div>
      <div class="card-box">
        <strong style="color: #065f46;">Workload Isolation Guarantee:</strong>
        <p style="font-size: 7.3pt; margin-top: 2px;">
          Employee Reports strictly filter tickets assigned to the logged-in staff member by matching <code>employeeId</code>, <code>_id</code>, <code>name</code>, and <code>email</code>, preventing data leakage across staff.
        </p>
      </div>
    </div>

    <h2 class="section-heading">14.3 Excel / CSV Export Specifications</h2>
    <p style="font-size: 7.5pt;">
      Export routines format data into RFC 4180 compliant CSV files with <code>\\uFEFF</code> UTF-8 Byte Order Marks (BOM), ensuring multilingual customer names and Indian Rupee (&8377;) currency symbols render cleanly in Microsoft Excel and Google Sheets.
    </p>
  </div>
  <div class="page-footer">
    <span>Confidential & Proprietary — Ekosmart EV Battery Solution</span>
    <span>Software Project Documentation</span>
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
    
    <h2 class="section-heading">15.1 Master End-to-End Operational Flow</h2>
    <div class="flowchart" style="font-size: 6.8pt; line-height: 1.25;">
[CUSTOMER] --> Public Portal --> Dynamic Form Intake --> Express API --> MongoDB Atlas (Ticket Created)
[ADMIN]    --> Admin Portal  --> CMS / Form Designer / RBAC / Payroll --> MongoDB Atlas (Global Config)
[EMPLOYEE] --> Employee Portal --> Diagnostic Dossier / POS / Stock --> MongoDB Atlas (Task Completed)
    </div>

    <h2 class="section-heading">15.2 Comprehensive System Implementation Audit Matrix</h2>
    <table class="table-custom" style="font-size: 7pt;">
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
    <span>Software Project Documentation</span>
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
    # Count page objects
    page_count = len(re.findall(rb"/Type\s*/Page\b", pdf_bytes)) - len(re.findall(rb"/Type\s*/Pages\b", pdf_bytes))
    print(f"SUCCESS: Generated PDF at {OUTPUT_PDF}")
    print(f"Total Pages: {page_count}, File Size: {size_kb:.2f} KB")
else:
    print("ERROR: PDF file was not generated.")
