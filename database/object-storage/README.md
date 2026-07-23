# Object Storage Configuration

## Provider
S3-compatible storage (AWS S3, MinIO, or Cloudflare R2)

## Purpose
- Product images and media
- Merchant documents (KYC, invoices)
- Delivery partner documents
- User profile pictures
- Blog and CMS media assets

## Buckets

| Bucket | Access | Description |
|--------|--------|-------------|
| `kartezy-products` | Public | Product images |
| `kartezy-documents` | Private | KYC, invoices, contracts |
| `kartezy-cms` | Public | Blog, banner, page assets |
| `kartezy-temp` | Private | Temporary upload processing |

## Environment Variables
- `STORAGE_ENDPOINT` - S3-compatible endpoint URL
- `STORAGE_REGION` - AWS region or equivalent
- `STORAGE_ACCESS_KEY` - Access key ID
- `STORAGE_SECRET_KEY` - Secret access key
- `STORAGE_BUCKET_PREFIX` - Optional prefix for buckets
