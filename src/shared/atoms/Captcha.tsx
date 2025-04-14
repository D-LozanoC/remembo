"use client";

import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  onVerify: (token: string | null) => void;
}

export function Captcha({ onVerify }: CaptchaProps) {
  return (
    <div className="flex justify-center py-2">
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        onChange={onVerify}
      />
    </div>
  );
}
