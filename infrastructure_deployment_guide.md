# Complete VPS Infrastructure Deployment Guide

This document is the master guide for deploying the Sky Zone platform (Next.js, Django, PostgreSQL) alongside the self-hosted **Poste.io Mail Server** to a fresh Linux VPS.

---

## 1. DNS Records Setup
Before doing anything on the server, configure these records in your Domain Registrar (e.g., Cloudflare, Namecheap):

| Type | Name | Value (Points To) | Purpose |
|------|------|-------------------|---------|
| `A` | `@` | `<VPS_IP_ADDRESS>` | Main Website (`skyzoneintl.com`) |
| `A` | `www` | `<VPS_IP_ADDRESS>` | Main Website (www) |
| `A` | `api` | `<VPS_IP_ADDRESS>` | Backend API (`api.skyzoneintl.com`) |
| `A` | `mail` | `<VPS_IP_ADDRESS>` | Mail Server UI & IMAP/SMTP |
| `MX` | `@` | `mail.skyzoneintl.com` (Priority: 10) | Tells the world where to send emails |
| `TXT` | `@` | `v=spf1 mx ~all` | **SPF Record:** Authorizes the mail server |
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:admin@skyzoneintl.com` | **DMARC Record:** Security policy |

*(Note: The **DKIM** TXT record will be generated later inside the Poste.io Admin UI).*

---

## 2. Initial VPS Setup & Firewall
Log into your VPS via SSH as `root` or a `sudo` user.

### Install Docker & Compose
```bash
# Update and install Docker
sudo apt update && sudo apt install -y docker.io docker-compose
sudo systemctl enable docker && sudo systemctl start docker
```

### Configure UFW Firewall (Crucial for Mail)
We must open HTTP/HTTPS for the Nginx proxy, and specific ports directly for the Mail Server.

```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP (Nginx Web)
sudo ufw allow 443/tcp     # HTTPS (Nginx Web)
sudo ufw allow 25/tcp      # SMTP (Incoming Emails)
sudo ufw allow 143/tcp     # IMAP (Fetch Emails)
sudo ufw allow 587/tcp     # Submission (Send Emails)
sudo ufw allow 993/tcp     # IMAPS (Secure Fetch Emails)
sudo ufw enable
```

---

## 3. Clone Project & Configure Environment

```bash
git clone <repository_url> /opt/skyzone_platform
cd /opt/skyzone_platform

# Create environment file
cp .env.example .env
nano .env 
```
Set your `DB_PASSWORD` and `SECRET_KEY`.

---

## 4. Spin Up Docker Containers

We use `docker-compose` to start the entire architecture:
- Next.js (port `3000` internal)
- Django (port `8000` internal)
- Poste.io (port `8080` internal for UI, and ports `25,143,587,993` external for Mail)

```bash
sudo docker-compose up -d --build
```
*It will take a few minutes to build the Next.js Standalone image and download Poste.io.*

---

## 5. Root Nginx Setup
Copy the generated Nginx configurations to proxy the internal Docker ports.

```bash
sudo apt install -y nginx

sudo cp nginx/skyzoneintl.com.conf /etc/nginx/sites-available/
sudo cp nginx/api.skyzoneintl.com.conf /etc/nginx/sites-available/
sudo cp nginx/mail.skyzoneintl.com.conf /etc/nginx/sites-available/

sudo ln -s /etc/nginx/sites-available/skyzoneintl.com.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.skyzoneintl.com.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/mail.skyzoneintl.com.conf /etc/nginx/sites-enabled/

# Remove default nginx config
sudo rm /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl restart nginx
```

---

## 6. Install SSL Certificates
Use Certbot to secure all subdomains.

```bash
sudo apt install certbot python3-certbot-nginx

# Run for all domains
sudo certbot --nginx -d skyzoneintl.com -d www.skyzoneintl.com
sudo certbot --nginx -d api.skyzoneintl.com
sudo certbot --nginx -d mail.skyzoneintl.com
```

---

## 7. Mailbox Management (Poste.io Admin)

1. Open **`https://mail.skyzoneintl.com`** in your browser.
2. The first time you visit, it will prompt you to create the master Admin Account.
3. Once logged in:
   - Go to **Virtual Domains** and add `skyzoneintl.com`.
   - Go to **Email Accounts** and create `info@skyzoneintl.com` and `support@skyzoneintl.com`.
   - Go to **Virtual Domains -> DKIM Key**, click **Generate**, and copy the resulting TXT record to your Cloudflare/DNS provider.

---

## 8. Backup Recommendations

The most critical data is stored in Docker volumes. To back up your entire database and mail server, you simply need to compress these volumes:

```bash
# Backup PostgreSQL Database
docker exec -t skyzone_db pg_dumpall -c -U skyzone_user > db_backup.sql

# Backup Emails and Mail settings
tar -czvf mail_backup.tar.gz /var/lib/docker/volumes/skyzone_platform_mail_data/_data
```
