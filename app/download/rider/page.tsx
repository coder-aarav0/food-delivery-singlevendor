import React from 'react';
import Link from 'next/link';
import {
  Bike,
  Download,
  Share2,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  QrCode,
  ExternalLink,
  MessageCircle,
  Zap,
  MapPin,
  Lock,
  Camera,
} from 'lucide-react';

export const metadata = {
  title: 'Download FreshMart Delivery Partner App (Official APK v2.4.0)',
  description:
    'Download the official FreshMart Rider APK v2.4.0 for Android smartphones with live darkstore dispatch and GPS navigation.',
};

export default function RiderDownloadPage() {
  const directApkUrl = '/api/download/rider';
  const githubReleaseUrl =
    'https://github.com/coder-aarav0/food-delivery-singlevendor/releases/tag/v2.4.0';
  const githubDirectApkUrl =
    'https://github.com/coder-aarav0/food-delivery-singlevendor/releases/download/v2.4.0/FreshMart-Rider-v2.4.0.apk';

  const downloadPageUrl = 'https://food-delivery-singlevendor-nu.vercel.app/download/rider';
  const whatsappShareText = encodeURIComponent(
    `Namaste! FreshMart Delivery Partner App (APK v2.4.0) download karein aur daily orders deliver karke earnings shuru karein:\n\n📱 Direct Download:\n${downloadPageUrl}\n\n📌 App install karne ke baad apne Store Manager se Login ID prapt karein.`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappShareText}`;

  // QR Code URL using high-reliability QR server for live smartphone camera scanning
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    downloadPageUrl
  )}&color=121C28&bgcolor=FFFFFF&margin=6`;

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#121C28] antialiased">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black shadow-xs">
              <Bike className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#121C28] block leading-tight">
                FreshMart
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                Rider Partner Hub
              </span>
            </div>
          </div>

          <Link
            href="/rider"
            className="text-xs font-bold text-[#121C28] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
          >
            <span>Web App</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-5">
        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-4 relative overflow-hidden">
          {/* Top subtle brand pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Official Android Release v2.4.0</span>
          </div>

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#F7D02C] to-[#ffe259] text-[#121C28] flex items-center justify-center mx-auto shadow-md">
            <Smartphone className="w-10 h-10 stroke-[2]" />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#121C28]">
              FreshMart Rider App
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
              Ultra-fast darkstore dispatch, live turn-by-turn routing, hardware wake-lock, and instant daily payout settlement.
            </p>
          </div>

          {/* Action Download Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Direct APK Download Button */}
            <a
              href={directApkUrl}
              className="w-full py-4 rounded-2xl bg-[#F7D02C] hover:bg-[#ebd228] active:scale-[0.98] text-[#121C28] font-black text-sm flex items-center justify-center gap-2.5 shadow-md transition"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>Download Official APK (1.87 MB)</span>
            </a>

            {/* GitHub Releases Button */}
            <a
              href={githubReleaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-[#121C28] hover:bg-black active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>View GitHub Release & Checksums</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* Share on WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share APK Link on WhatsApp</span>
            </a>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-slate-500 font-semibold">
            <span>• Android 7.0 to 14+</span>
            <span>• Hardware WakeLock</span>
            <span>• Verified Safe</span>
          </div>
        </div>

        {/* Scan to Install on Android Mobile Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200/80 shrink-0 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeImageUrl}
              alt="Scan to download FreshMart Rider APK"
              className="w-24 h-24 rounded-xl"
            />
          </div>
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
              Scan with Phone
            </span>
            <h3 className="font-extrabold text-sm text-[#121C28]">
              Scan QR to Install on Mobile
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Open your Android camera app and point at the QR code to download directly onto your smartphone.
            </p>
          </div>
        </div>

        {/* Technical Architecture Specs Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F7D02C] bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-600/30">
              Native Android Specs
            </span>
            <span className="text-[11px] text-slate-400 font-mono">v2.4.0 (Build 240)</span>
          </div>

          <h3 className="font-extrabold text-sm text-white">
            World-Class Courier Architecture
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                <Zap className="w-3.5 h-3.5" />
                <span>Screen WakeLock</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Keeps screen awake on bike mounts.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>GPS Radar</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Continuous store & doorstep navigation.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px]">
                <Camera className="w-3.5 h-3.5" />
                <span>Helmet Selfie</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Camera-verified attendance safety.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[11px]">
                <Lock className="w-3.5 h-3.5" />
                <span>4-Digit OTP</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Customer handover verification dialpad.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Fleet Login Credentials */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              Demo Access
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">Ready to Dispatch</span>
          </div>

          <h3 className="font-extrabold text-sm text-[#121C28]">
            Delivery Partner Login Credentials
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Use the registered demo fleet accounts or tap the fleet partner chip toggle in the app:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block">Rider 1 (EV Scooter)</span>
              <span className="font-bold text-[#121C28] block mt-0.5">Rohan Verma</span>
              <span className="font-mono text-emerald-700 font-bold text-[11px]">Online</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block">Rider 2 (Motorcycle)</span>
              <span className="font-bold text-[#121C28] block mt-0.5">Vikram Rider</span>
              <span className="font-mono text-emerald-700 font-bold text-[11px]">Online</span>
            </div>
          </div>
        </div>

        {/* Instant Web PWA Option */}
        <div className="bg-[#FFFDF5] rounded-3xl p-5 border border-amber-200/80 shadow-xs flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
              Instant Web Demo
            </span>
            <h3 className="font-extrabold text-sm text-[#121C28]">
              Test Directly in Mobile Browser
            </h3>
            <p className="text-xs text-slate-600">
              Open the web app directly and test full dispatch functionality.
            </p>
          </div>

          <Link
            href="/rider"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-[#121C28] text-white hover:bg-black font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <span>Launch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Step Installation Guide */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-extrabold text-[#121C28] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>How to Install APK on Android</span>
          </h2>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
              <span className="w-6 h-6 rounded-lg bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black text-xs shrink-0">
                1
              </span>
              <div>
                <p className="font-bold text-[#121C28]">Download APK</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tap &quot;Download Official APK&quot; above. If prompted by Chrome, tap &quot;Download anyway&quot;.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
              <span className="w-6 h-6 rounded-lg bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black text-xs shrink-0">
                2
              </span>
              <div>
                <p className="font-bold text-[#121C28]">Allow Install from Source</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  When Android asks to install, toggle <strong>Allow from this source</strong> in Settings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
              <span className="w-6 h-6 rounded-lg bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black text-xs shrink-0">
                3
              </span>
              <div>
                <p className="font-bold text-[#121C28]">Go On Duty & Deliver</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Toggle On Duty to start receiving live darkstore orders assigned from the Admin panel!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Manager Support Box */}
        <div className="p-4 rounded-2xl bg-slate-100 text-center space-y-1 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            Need help onboarding or testing demo orders?
          </p>
          <p>Contact FreshMart Store Dispatch Desk: <strong>+91 98765 43210</strong></p>
        </div>
      </main>
    </div>
  );
}
