# Sky Zone Platform — Monorepo

This repository contains the complete codebase and infrastructure configuration for the **Sky Zone International** platform:
1. **Frontend**: Next.js Standalone Application (Tailwind CSS, TypeScript).
2. **Backend**: Django REST Framework (DRF) JWT-authenticated API.
3. **Database**: PostgreSQL (Dockerized).
4. **Mail Server**: Self-hosted Poste.io Mail Server (SMTP, IMAP, Admin Web UI).
5. **Reverse Proxy**: Host-level Nginx with Let's Encrypt SSL.

---

## 📁 Repository Directory Structure

```text
├── backend/                       # Django REST API application
├── frontend/                      # Next.js frontend application
│   └── public/Certicate/          # PDF Compliance Certificates folder
├── nginx/                         # Host-level Nginx configurations for domains
├── docker-compose.yml             # Docker Compose orchestration config
├── infrastructure_deployment_guide.md # Step-by-step VPS deployment guide
└── README.md                      # General documentation & email setup guide
```

---

## 🚀 Quick Start: Local Development

### 1. Backend (Django)
Ensure you have Python 3.11 installed.
```bash
cd backend
python -m venv venv
source venv/bin/activate # Or: venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend (Next.js)
Ensure you have Node.js 20+ installed.
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Production Deployment
For deploying the entire stack to your production VPS alongside Poste.io and Nginx, follow the master guide:
* 📄 **[Infrastructure Deployment Guide (infrastructure_deployment_guide.md)](file:///opt/skyzone_platform/infrastructure_deployment_guide.md)**

---

## 📧 Email Client Configuration Guide (Outlook & Mobile)

To connect mail clients (Outlook, iPhone, Android, Thunderbird) to your custom email addresses (e.g. `info@skyzoneintl.com`), use the following connection settings:

### General Settings

| Setting Field | Value / Configuration |
| :--- | :--- |
| **Email Address** | Your full email (e.g. `info@skyzoneintl.com`) |
| **Username** | Your full email (e.g. `info@skyzoneintl.com`) |
| **Password** | The password configured inside the Poste.io Admin UI |
| **Incoming Mail Server (IMAP)** | `mail.skyzoneintl.com` |
| **Incoming Port (IMAP)** | **`993`** (Security: **SSL/TLS**) |
| **Outgoing Mail Server (SMTP)** | `mail.skyzoneintl.com` |
| **Outgoing Port (SMTP)** | **`587`** (Security: **STARTTLS** or **SSL**) |
| **SMTP Authentication** | **Enabled** (Use same credentials as IMAP) |

---

### Setup Steps

#### A. Setup on iPhone (iOS Mail)
1. Go to **Settings** ➡️ **Mail** ➡️ **Accounts** ➡️ **Add Account**.
2. Tap **Other** ➡️ **Add Mail Account**.
3. Fill in your Name, Email, Password, and a Description. Tap **Next**.
4. Select **IMAP** at the top.
5. Under **Incoming Mail Server** & **Outgoing Mail Server**, enter:
   - Host Name: `mail.skyzoneintl.com`
   - User Name: Your full email address.
   - Password: Your email password.
6. Tap **Save**. *(Accept the certificate prompt if you haven't linked SSL to the container yet)*.

#### B. Setup on Outlook (Desktop)
1. Open Outlook, select **File** ➡️ **Add Account**.
2. Enter your email address, select **Advanced options**, check **"Let me set up my account manually"**, and click **Connect**.
3. Select **IMAP**.
4. Set **Incoming Mail** to `mail.skyzoneintl.com` on port **`993`** (Encryption: `SSL/TLS`).
5. Set **Outgoing Mail** to `mail.skyzoneintl.com` on port **`587`** (Encryption: `STARTTLS`).
6. Click **Next**, enter your password, and click **Connect**.

---

## 🔒 Production Security Hardening

1. **SMTP SSL Certificates**: Mount Let's Encrypt certificates directly into the mailserver container to avoid client security warnings:
   ```yaml
   # docker-compose.yml (inside mailserver volumes)
   - /etc/letsencrypt/live/mail.skyzoneintl.com/fullchain.pem:/data/ssl/server.crt:ro
   - /etc/letsencrypt/live/mail.skyzoneintl.com/privkey.pem:/data/ssl/server.key:ro
   ```
2. **DKIM Record**: Log into the Poste.io admin panel (`https://mail.skyzoneintl.com`), generate a DKIM record under your domain settings, and publish the TXT record to your DNS records (Cloudflare).
3. **Django Settings**: Ensure `DEBUG=False` is set in production and the database port is kept closed to external traffic.
