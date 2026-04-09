import { BlobServiceClient, BlobSASPermissions } from "@azure/storage-blob";
import { config } from "dotenv";

config();

let blobServiceClient;
let containerClient;
let isContainerReady = false;
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || "profile-pictures";

// Promise that resolves when Azure is ready — callers can await this before uploading
let resolveReady;
const waitForReady = new Promise((resolve) => {
  resolveReady = resolve;
});

const initializeAzure = async () => {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

    // Check if container exists, create if it doesn't
    const exists = await containerClient.exists();
    if (!exists) {
      console.log("Container does not exist. Creating...");
      await containerClient.create();
      console.log("Container created successfully");
    }

    isContainerReady = true;
    resolveReady(); // Signal that Azure is ready
    console.log("Azure Blob Storage initialized successfully");
  } catch (error) {
    console.error("Error initializing Azure Blob Storage:", error.message);
    setTimeout(initializeAzure, 5000); // Retry after 5 seconds
  }
};

/**
 * Generate a fresh SAS URL using the SDK's built-in method.
 * This avoids manual key parsing/signing which caused 403 errors.
 */
const generateSASUrl = async (blobName) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const sasUrl = await blockBlobClient.generateSasUrl({
      permissions: BlobSASPermissions.parse("r"), // read-only
      expiresOn: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    });

    console.log(`Generated SAS URL: ${sasUrl.substring(0, 100)}...`);
    return sasUrl;
  } catch (error) {
    console.error("Error generating SAS URL:", error.message);
    return null;
  }
};

/**
 * Given a stored value (blob name or URL), return a usable image URL:
 * - Azure blob name → fresh SAS URL
 * - Azure full SAS URL (legacy) → re-extract blob name → fresh SAS URL
 * - External URL (e.g., Tenor GIF) → return as-is, no signing needed
 */
const getBlobUrl = async (blobNameOrUrl) => {
  if (!blobNameOrUrl) return null;

  // External URL that's NOT our Azure storage → return as-is (e.g. Tenor GIFs)
  if (blobNameOrUrl.startsWith("http") && !blobNameOrUrl.includes("blob.core.windows.net")) {
    return blobNameOrUrl;
  }

  let blobName = blobNameOrUrl;

  // Legacy: full Azure SAS URL stored in DB — extract blob name
  if (blobNameOrUrl.startsWith("https://") && blobNameOrUrl.includes("blob.core.windows.net")) {
    try {
      const url = new URL(blobNameOrUrl);
      // pathname is /<container>/<blobName>
      const parts = url.pathname.split("/");
      blobName = parts.slice(2).join("/"); // everything after /<container>/
    } catch {
      return blobNameOrUrl; // Can't parse — return as-is
    }
  }

  return generateSASUrl(blobName);
};

// Detect image format from base64 magic bytes
const detectImageFormat = (base64String) => {
  const header = base64String.substring(0, 20);

  if (header.includes("/9j")) return { ext: "jpg", mime: "image/jpeg" };
  if (header.includes("iVBO")) return { ext: "png", mime: "image/png" };
  if (header.includes("R0lG")) return { ext: "gif", mime: "image/gif" };
  if (header.includes("Qk0")) return { ext: "bmp", mime: "image/bmp" };
  if (header.includes("UklG")) return { ext: "webp", mime: "image/webp" };

  // Default to JPG
  return { ext: "jpg", mime: "image/jpeg" };
};

// Initialize on startup
initializeAzure();

export { blobServiceClient, containerClient, isContainerReady, generateSASUrl, getBlobUrl, waitForReady, detectImageFormat };
