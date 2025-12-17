# Production Deployment Guide (Amazon Linux / EC2)

This guide covers deploying the app to an **Amazon Linux 2023** (or Amazon Linux 2) EC2 instance using **PM2**, **Nginx**, and **SSL**.

## 0. DNS Setup (GoDaddy)
1.  Log in to GoDaddy and go to your **DNS Management** page for `ritampal.com`.
2.  Click **Add New Record**.
3.  Enter exactly these details:
    *   **Type**: `A`
    *   **Name**: `manage`
    *   **Value**: `3.82.197.229`
    *   **TTL**: `1/2 Hour` or `600 seconds` (Default is fine)
4.  Click **Save**.
*(Wait ~5 minutes for this to propagate).*

## 1. Server Prerequisites
> [!IMPORTANT]
> **AWS Security Groups**: You must go to your AWS Console -> EC2 -> Security Groups and **Open Ports 80 (HTTP) and 443 (HTTPS)**.
> If you don't do this, your site will be unreachable, especially after enabling SSL.

SSH into your server and run the following commands.

```bash
# Update packages
sudo yum update -y

# Install Git and Nginx
sudo yum install git nginx -y

# Enable Nginx (start on boot)
sudo systemctl enable nginx
sudo systemctl start nginx

# Install Node.js (v20) for Amazon Linux
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 and Yarn globally
sudo npm install -g pm2 yarn
```

## 2. Backend Setup
We will clone the repo and start the backend using the `ecosystem.config.cjs`.

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git manage-app

# Navigate to backend
cd manage-app/backend

# Install dependencies
npm install

# Setup Environment Variables
nano .env 

# Rename config on server (fix for "module not defined" error)
mv ecosystem.config.js ecosystem.config.cjs

# Start with PM2
pm2 start ecosystem.config.cjs --env production

# Save PM2 list so it restarts on reboot
pm2 save
pm2 startup
# (Run the command output by pm2 startup)
```

## 3. Frontend Setup
We need to build the React app and place it where Nginx can read it.

### Option A: Build Locally & Upload (Recommended for t2.nano)
**Pros**: Faster, keeps server clean.
**Cons**: Manual upload step.

1. Run `npm run build` on your computer.
2. SCP the `dist` folder to the server:
```bash
scp -r ./dist/* ec2-user@3.82.197.229:/tmp/dist/
```

3. On the server, move it to the Nginx folder:
```bash
# Create directory
sudo mkdir -p /usr/share/nginx/html/manage-app

# Move files
sudo cp -r /tmp/dist/* /usr/share/nginx/html/manage-app/

# Set Permissions
sudo chown -R nginx:nginx /usr/share/nginx/html/manage-app
sudo chmod -R 755 /usr/share/nginx/html/manage-app
```

### Option B: Build on Server
> [!CAUTION]
> **DO NOT USE THIS ON T2.NANO**. (0.5GB RAM). It will crash.

```bash
# Navigate to frontend (on the server)
cd ../frontend
npm install
npm run build
sudo mkdir -p /usr/share/nginx/html/manage-app
sudo cp -r dist/* /usr/share/nginx/html/manage-app/
sudo chown -R nginx:nginx /usr/share/nginx/html/manage-app
```


## 4. Nginx Configuration
Update Nginx to recognize your new domain.

```bash
sudo nano /etc/nginx/conf.d/manage-app.conf
```

**Paste the following configuration:**
```nginx
server {
    listen 80;
    server_name manage.ritampal.com; 

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Frontend (Static Files)
    location / {
        root /usr/share/nginx/html/manage-app;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend (API Proxy)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Hide backend info
        proxy_hide_header X-Powered-By;
    }
}
```

**Restart Nginx:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 5. SSL with Certbot (Enable HTTPS)
```bash
# Install Certbot (if not installed)
sudo yum install python3-pip -y
sudo pip3 install certbot certbot-nginx

# Run Certbot to get SSL
sudo /usr/local/bin/certbot --nginx -d manage.ritampal.com
```
*   Select "2" (Redirect) if asked.

## 6. Update Google Cloud Console
1.  Go to Google Cloud Credentials.
2.  Edit your Client ID.
3.  **Authorized JavaScript Origins**: Add `https://manage.ritampal.com`
4.  Save.
