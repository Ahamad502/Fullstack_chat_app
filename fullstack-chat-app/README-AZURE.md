# 🚀 Azure Storage Setup Guide

This guide will help you set up Azure Storage Blob for image uploads in your chat application.

---

## 📋 Table of Contents

- [Why Azure Storage?](#-why-azure-storage)
- [Prerequisites](#-prerequisites)
- [Step 1: Create Azure Account](#-step-1-create-azure-account)
- [Step 2: Create Storage Account](#-step-2-create-storage-account)
- [Step 3: Create Blob Container](#-step-3-create-blob-container)
- [Step 4: Get Connection String](#-step-4-get-connection-string)
- [Step 5: Configure Environment Variables](#-step-5-configure-environment-variables)
- [Step 6: Install Dependencies](#-step-6-install-dependencies)
- [Step 7: Test Upload](#-step-7-test-upload)

---

## 🌟 Why Azure Storage?

| Feature | Azure Storage | Cloudinary | GCP |
|---------|---------------|-----------|-----|
| **Setup Time** | 5-10 minutes | 5 minutes | 15+ minutes |
| **Free Tier** | 5GB | Limited | 5GB |
| **Scalability** | Excellent | Good | Excellent |
| **Pricing** | Pay-as-you-go | Based on transformations | Pay-as-you-go |
| **Integration** | Azure ecosystem | Standalone | Google ecosystem |
| **Control** | Full control | Some limitations | Full control |

---

## ✅ Prerequisites

- ✅ **Azure Account** - [Sign up here](https://azure.microsoft.com/free/)
- ✅ **Node.js 16+** - [Download here](https://nodejs.org)
- ✅ **Basic understanding** of Azure Portal

---

## 🎯 Step 1: Create Azure Account

### 1.1 Sign Up

1. Go to [Azure Free Account](https://azure.microsoft.com/free/)
2. Click **Start Free**
3. Sign in with Microsoft account (or create one)
4. Complete the registration with:
   - Phone verification
   - Credit card verification (free tier won't be charged)
5. Accept terms and create your Azure account

### 1.2 Access Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your credentials
3. You should see the Dashboard

---

## 🎯 Step 2: Create Storage Account

### 2.1 Navigate to Storage Accounts

1. In Azure Portal, click **Create a resource**
2. Search for **Storage account**
3. Click **Storage account** (by Microsoft)
4. Click **Create**

### 2.2 Configure Storage Account

Fill in the following details:

**Basics Tab:**
- **Subscription** - Select your subscription
- **Resource group** - Create new: `chat-app-resources`
- **Storage account name** - `chatappfiles123` (must be unique, lowercase, 3-24 chars)
- **Region** - Select closest to your location
- **Performance** - Standard
- **Redundancy** - Locally-redundant storage (LRS)

### 2.3 Complete Creation

1. Click **Review + create**
2. Verify all settings
3. Click **Create**
4. Wait for deployment to complete (2-3 minutes)
5. Click **Go to resource**

---

## 🎯 Step 3: Create Blob Container

### 3.1 Navigate to Containers

1. In your Storage Account, go to **Data storage** → **Containers**
2. Click **+ Container**

### 3.2 Create Container

Fill in the details:
- **Name** - `profile-pictures`
- **Public access level** - Blob (anonymous read access for blobs only)
- Click **Create**

### 3.3 Create Upload Directory (Optional)

You can create a subdirectory structure if needed:
1. Click on the `profile-pictures` container
2. Click **Upload**
3. For organized uploads, you can specify paths like:
   - `uploads/2024/profile-pic.jpg`

---

## 🎯 Step 4: Get Connection String

### 4.1 Access Keys

1. In your Storage Account, go to **Security + networking** → **Access keys**
2. You'll see:
   - **Storage account name**
   - **Key 1** and **Key 2**
   - **Connection string** (under each key)

### 4.2 Copy Connection String

1. Click **Show** under the Connection string for **Key 1**
2. Click the **Copy** button
3. Save this securely (you'll need it in the `.env` file)

Example format:
```
DefaultEndpointsProtocol=https;AccountName=chatappfiles123;AccountKey=YOUR_KEY_HERE;EndpointSuffix=core.windows.net
```

---

## 🎯 Step 5: Configure Environment Variables

### 5.1 Create .env File

In your `backend` folder, create a `.env` file:

```env
# ===== DATABASE =====
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app

# ===== SERVER =====
PORT=5001
NODE_ENV=development

# ===== JWT AUTHENTICATION =====
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# ===== AZURE STORAGE =====
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=YOUR_ACCOUNT;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net
AZURE_CONTAINER_NAME=profile-pictures
```

### 5.2 Update .env

Replace the placeholders:
- `YOUR_ACCOUNT` - Your storage account name
- `YOUR_KEY` - Your access key from Step 4.2
- Keep the `AZURE_CONTAINER_NAME` as `profile-pictures`

---

## 🎯 Step 6: Install Dependencies

### 6.1 Install Azure SDK

In your `backend` folder:

```bash
npm install @azure/storage-blob
```

This is already configured in the updated `package.json`.

### 6.2 Verify Installation

```bash
npm list @azure/storage-blob
```

You should see the package listed with its version.

---

## 🎯 Step 7: Test Upload

### 7.1 Run the Application

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### 7.2 Test Profile Picture Upload

1. Go to http://localhost:5173
2. Sign up or login
3. Go to Profile page
4. Upload a profile picture
5. Image should upload to Azure Storage

### 7.3 Verify Upload

1. Go back to Azure Portal
2. Click on your Storage Account
3. Go to **Containers** → **profile-pictures**
4. You should see your uploaded image

---

## 🔒 Security Best Practices

1. **Never commit .env file** - Add to `.gitignore`
2. **Use Key Rotation** - Periodically rotate access keys
3. **Restrict Access** - Don't share connection strings
4. **Use Managed Identity** - For production, use Azure Managed Identity
5. **Enable Firewall** - Restrict access to your IP in Azure Portal

---

## 📊 Monitoring & Costs

### Monitor Usage

1. In Storage Account, go to **Monitoring** → **Metrics**
2. Track:
   - Total Egress (downloads)
   - Total Ingress (uploads)
   - Data at Rest (storage)

### Estimate Costs

Azure Storage is very affordable:
- **Storage**: ~$0.0184 per GB/month
- **Transactions**: ~$0.0004 per 10K read operations
- **First 5GB**: Free (Free Tier)

---

## 🐛 Troubleshooting

### Connection String Error

**Error**: `AuthorizationPermissionMismatch: This request is not authorized to perform this operation`

**Solution**:
- Verify connection string is correct
- Check Container access level is "Blob"
- Ensure account name matches in .env

### Container Not Found

**Error**: `ContainerNotFound: The specified container does not exist`

**Solution**:
- Verify container name is `profile-pictures` (case-sensitive)
- Create container if it doesn't exist
- Check spelling in `.env`

### Upload Size Error

**Error**: `RequestBodyTooLarge`

**Solution**:
- Azure Blob Storage max size is 4.75GB per blob
- Compress images before upload
- Limit file size in frontend

### Network Timeout

**Error**: `Connection timeout`

**Solution**:
- Check internet connection
- Verify firewall allows Azure connections
- Ensure connection string is valid
- Check if Storage Account is running

---

## 📝 Integration with Chat App

The `cloudinary.js` file (now `azure.js` in configuration) has been updated to:

```javascript
import { BlobServiceClient } from "@azure/storage-blob";
import { config } from "dotenv";

config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_CONTAINER_NAME || "profile-pictures"
);

export { blobServiceClient, containerClient };
```

The `auth.controller.js` upload function now:
1. Converts base64 image to buffer
2. Generates unique blob name
3. Uploads to Azure Storage
4. Returns secure URL
5. Saves URL to database

---

## 🎉 Next Steps

1. ✅ Set up Azure Storage
2. ✅ Configure environment variables
3. ✅ Test uploads
4. ✅ Deploy to production (using Azure App Service)

---

## 📧 Support

For issues:
1. Check Azure Portal for error details
2. Review error messages in console
3. Verify credentials in `.env`
4. Check Azure Storage documentation

---

**Last Updated**: April 2026
**Compatible With**: Node.js 16+, React 18+, Azure Storage Blob v12.x
