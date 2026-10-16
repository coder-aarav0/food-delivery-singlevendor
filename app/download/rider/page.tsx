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
} from 'lucide-react';

export const metadata = {
  title: 'Download Keshri Mart Delivery Partner App (APK)',
  description: 'Download the official Keshri Mart Rider APK v2.4 for Android smartphones.',
};

export default function RiderDownloadPage() {
  const apkDownloadUrl = '/api/download/rider';
  const whatsappShareText = encodeURIComponent(
    `Namaste! Keshri Mart Delivery Partner App (APK v2.4) download karein aur orders deliver karke daily earnings shuru karein:\n\n📱 Direct Download Link:\nhttps://keshrimart.com/download/rider\n\n📌 App install karne ke baad apne Store Manager se Login ID prapt karein.`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappShareText}`;

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#121C28] antialiased">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black shadow-xs">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#121C28] block leading-tight">
                Keshri Mart
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                Rider Partner Hub
              </span>
            </div>
          </div>

          <Link
            href="/rider"
            className="text-xs font-bold text-[#121C28] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
          >
            Open Web App
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-5">
        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center space-y-4 relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-[#F7D02C] text-[#121C28] flex items-center justify-center mx-auto shadow-md">
            <Smartphone className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Latest Android Build v2.4.0</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#121C28]">
              Keshri Mart Rider App
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
              Ultra-fast order dispatch, live turn-by-turn darkstore routing, and instant daily payout settlement.
            </p>
          </div>

          {/* Primary Download Button */}
          <div className="space-y-2 pt-2">
            <a
              href={apkDownloadUrl}
              className="w-full py-4 rounded-2xl bg-[#F7D02C] hover:bg-[#ebd228] active:scale-[0.98] text-[#121C28] font-black text-sm flex items-center justify-center gap-2.5 shadow-md transition"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>Download Rider APK (18.4 MB)</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share APK on WhatsApp</span>
            </a>
          </div>

          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
            <span>• Android 8.0+</span>
            <span>• Verified Clean</span>
            <span>• Fast 10-sec install</span>
          </div>
        </div>

        {/* Instant Web PWA Option */}
        <div className="bg-[#FFFDF5] rounded-3xl p-5 border border-amber-200/80 shadow-xs flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
              Instant Access
            </span>
            <h3 className="font-extrabold text-sm text-[#121C28]">
              Prefer not downloading APK?
            </h3>
            <p className="text-xs text-slate-600">
              Open the web app directly and tap &quot;Add to Home Screen&quot;.
            </p>
          </div>

          <Link
            href="/rider"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-[#121C28] text-white hover:bg-black font-bold text-xs flex items-center gap-1.5 transition"
          >
            <span>Launch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Step Installation Guide */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-extrabold text-[#121C28] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>How to Install on Android</span>
          </h2>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
              <span className="w-6 h-6 rounded-full bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black text-xs shrink-0">
                1
              </span>
              <div>
                <p className="font-bold text-[#121C28]">Download APK</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tap &quot;Download Rider APK&quot; above. When prompted by Chrome, tap &quot;Download anyway&quot;.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
              <span className="w-6 h-6 rounded-full bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black text-xs shrink-0">
                2
              </span>
              <div>
                <p className="font-bold text-[#121C28]">Allow Install</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  If Android asks to &quot;Install unknown apps&quot;, toggle <strong>Allow from this source</strong> in Settings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
              <span className="w-6 h-6 rounded-full bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black text-xs shrink-0">
                3
              </span>
              <div>
                <p className="font-bold text-[#121C28]">Login & Go On Duty</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Open the app, take your safety helmet selfie, and toggle On Duty to start receiving deliveries.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Manager Support Box */}
        <div className="p-4 rounded-2xl bg-slate-100 text-center space-y-1 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            Need help onboarding or forgot your Rider ID?
          </p>
          <p>Contact Keshri Mart Store Dispatch Desk: <strong>+91 98765 43210</strong></p>
        </div>
      </main>
    </div>
  );
}
