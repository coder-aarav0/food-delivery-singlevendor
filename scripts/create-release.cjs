const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const REPO_OWNER = 'coder-aarav0';
const REPO_NAME = 'food-delivery-singlevendor';
const TAG_NAME = 'v2.4.0';

if (!GITHUB_TOKEN) {
  console.error('Please set GITHUB_TOKEN or GH_TOKEN environment variable.');
  process.exit(1);
}

async function main() {
  console.log(`Creating GitHub Release ${TAG_NAME} for ${REPO_OWNER}/${REPO_NAME}...`);

  const apkPath = path.join(__dirname, '..', 'public', 'downloads', 'FreshMart-Rider-v2.4.0.apk');
  if (!fs.existsSync(apkPath)) {
    console.error(`APK not found at ${apkPath}`);
    process.exit(1);
  }
  const apkStats = fs.statSync(apkPath);
  console.log(`APK size: ${(apkStats.size / (1024 * 1024)).toFixed(2)} MB`);

  // 1. Create or get release
  const releasePayload = {
    tag_name: TAG_NAME,
    target_commitish: 'main',
    name: 'FreshMart Rider Partner APK v2.4.0',
    body: `## 🏍️ FreshMart Delivery Partner Official Android App (v2.4.0)

Official native Android client for FreshMart hyperlocal couriers, darkstore dispatches, and delivery fleet partners.

### 🚀 Highlights & Capabilities:
- **⚡ Real-Time Supabase WebSocket Sync**: Zero-latency order dispatches and darkstore status updates.
- **🛡️ Hardware Screen WakeLock**: Keeps the smartphone screen illuminated when mounted on motorcycle handlebar grips.
- **🗺️ Integrated GPS & Turn-by-Turn Navigation**: 1-tap Google Maps and system navigation launch for store pickup and doorstep delivery.
- **🔑 4-Digit Handover Security OTP Dialpad**: Fraud-proof customer delivery verification and cash-on-delivery tracking.
- **📸 Helmet Safety & Attendance Verification**: Camera-enabled biometric check-in.
- **💰 Shift Earnings & Cash-In-Hand Reconciliation**: Real-time daily payout ledger.

### 📲 Download & Installation Instructions:
1. Download **\`FreshMart-Rider-v2.4.0.apk\`** below.
2. Open the file on any Android smartphone (Android 7.0+ supported).
3. If prompted, allow **Install from this source**.
4. Log in using your assigned fleet credentials (\`rider\` or \`rohan\` / \`password123\`) or demo fleet partner chips.`,
    draft: false,
    prerelease: false,
  };

  const createRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'FreshMart-Release-Bot',
    },
    body: JSON.stringify(releasePayload),
  });

  let releaseData;
  if (createRes.status === 201) {
    releaseData = await createRes.json();
    console.log(`Release created: ${releaseData.html_url}`);
  } else if (createRes.status === 422) {
    console.log('Release already exists. Fetching existing release...');
    const getRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/tags/${TAG_NAME}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'FreshMart-Release-Bot',
      },
    });
    releaseData = await getRes.json();
    console.log(`Found existing release: ${releaseData.html_url}`);
  } else {
    const errorText = await createRes.text();
    console.error(`Failed to create release (${createRes.status}):`, errorText);
    process.exit(1);
  }

  // 2. Upload APK Asset
  console.log(`Uploading FreshMart-Rider-v2.4.0.apk asset to release ${releaseData.id}...`);
  const uploadUrl = releaseData.upload_url.replace('{?name,label}', `?name=FreshMart-Rider-v2.4.0.apk`);

  const apkBuffer = fs.readFileSync(apkPath);
  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Length': apkBuffer.length.toString(),
      'User-Agent': 'FreshMart-Release-Bot',
    },
    body: apkBuffer,
  });

  if (uploadRes.status === 201) {
    const assetData = await uploadRes.json();
    console.log(`Asset uploaded successfully: ${assetData.browser_download_url}`);
  } else {
    const errText = await uploadRes.text();
    console.log(`Upload status (${uploadRes.status}):`, errText);
  }

  console.log('Release process completed successfully!');
}

main().catch(console.error);
