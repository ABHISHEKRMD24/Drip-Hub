import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [stepTransition, setStepTransition] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const styleRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);

    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

      *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: 'Space Grotesk', sans-serif;
        overflow: hidden;
      }

      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(40px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-50px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-10px); }
      }

      @keyframes gradientShift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes shimmerMove {
        0%   { background-position: -300% center; }
        100% { background-position:  300% center; }
      }

      @keyframes badgePulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,106,0.5); }
        50%       { box-shadow: 0 0 0 8px rgba(201,168,106,0); }
      }

      @keyframes dotBlink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.3; }
      }

      @keyframes slideInTag {
        from { opacity: 0; transform: translateX(-16px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.85); }
        to   { opacity: 1; transform: scale(1); }
      }

      @keyframes stepSlideIn {
        from { opacity: 0; transform: translateX(30px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      @keyframes stepSlideOut {
        from { opacity: 1; transform: translateX(0); }
        to   { opacity: 0; transform: translateX(-30px); }
      }

      @keyframes progressGrow {
        from { width: 0%; }
      }

      /* ─── Root ─── */
      .driphub-signup-root {
        width: 100%;
        height: 100vh;
        height: 100dvh;
        display: flex;
        font-family: 'Space Grotesk', sans-serif;
        background: #0d0d0d;
        overflow: hidden;
      }

      /* ══════════════════════════════
         LEFT PANEL
      ══════════════════════════════ */
      .left-panel {
        flex: 1.15;
        position: relative;
        overflow: hidden;
      }

      .left-panel-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
        filter: brightness(0.88) contrast(1.05) saturate(1.1);
        transform: scale(1.03);
        transition: transform 12s ease;
      }

      .left-panel-image:hover {
        transform: scale(1);
      }

      .gradient-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          160deg,
          rgba(5,5,15,0.72) 0%,
          rgba(15,10,5,0.38) 38%,
          rgba(30,20,5,0.22) 60%,
          rgba(5,5,15,0.80) 100%
        );
        background-size: 300% 300%;
        animation: gradientShift 10s ease infinite;
      }

      .left-noise {
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        opacity: 0.35;
        pointer-events: none;
      }

      .left-content {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 52px 48px;
        animation: fadeInLeft 1s ease 0.3s both;
      }

      /* Logo */
      .logo-area { display: flex; flex-direction: column; gap: 0; }

      .logo-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 14px;
      }

      .logo-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #C9A86A;
        animation: badgePulse 2.5s ease infinite;
      }

      .logo-label {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 10px;
        font-weight: 600;
        color: rgba(201,168,106,0.9);
        letter-spacing: 3px;
        text-transform: uppercase;
      }

      .logo-wordmark {
        font-family: 'Playfair Display', serif;
        font-size: 52px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: -1px;
        line-height: 1;
        text-shadow: 0 4px 24px rgba(0,0,0,0.4);
      }

      .logo-wordmark span {
        color: #C9A86A;
        font-style: italic;
      }

      .logo-separator {
        width: 56px;
        height: 1.5px;
        margin-top: 18px;
        background: linear-gradient(90deg, #C9A86A 0%, rgba(201,168,106,0.2) 100%);
      }

      /* Benefits list */
      .benefits-list {
        display: flex;
        flex-direction: column;
        gap: 18px;
        margin-top: 32px;
        animation: slideInTag 0.9s ease 0.8s both;
      }

      .benefit-item {
        display: flex;
        align-items: flex-start;
        gap: 14px;
      }

      .benefit-icon {
        width: 40px;
        height: 40px;
        background: rgba(201,168,106,0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(201,168,106,0.3);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #C9A86A;
        flex-shrink: 0;
      }

      .benefit-content {
        flex: 1;
        padding-top: 2px;
      }

      .benefit-title {
        font-size: 15px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 4px;
        letter-spacing: 0.2px;
      }

      .benefit-desc {
        font-size: 12px;
        color: rgba(255,255,255,0.6);
        line-height: 1.5;
        letter-spacing: 0.3px;
      }

      /* Bottom block */
      .bottom-block { display: flex; flex-direction: column; gap: 20px; }

      .bottom-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        animation: slideInTag 0.8s ease 0.5s both;
      }

      .tag-pill {
        padding: 5px 14px;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 100px;
        font-size: 10.5px;
        font-weight: 500;
        color: rgba(255,255,255,0.7);
        letter-spacing: 1px;
        text-transform: uppercase;
        backdrop-filter: blur(6px);
        background: rgba(255,255,255,0.06);
        transition: all 0.3s ease;
        cursor: default;
      }

      .tag-pill:hover {
        background: rgba(201,168,106,0.2);
        border-color: rgba(201,168,106,0.5);
        color: #C9A86A;
      }

      .tagline {
        font-family: 'Playfair Display', serif;
        font-size: 30px;
        font-weight: 500;
        font-style: italic;
        color: #ffffff;
        line-height: 1.4;
        letter-spacing: 0.2px;
        max-width: 380px;
        text-shadow: 0 2px 16px rgba(0,0,0,0.5);
      }

      .sub-tagline {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 11px;
        font-weight: 400;
        color: rgba(255,255,255,0.5);
        letter-spacing: 2.5px;
        text-transform: uppercase;
      }

      /* Floating stats card */
      .floating-stats {
        position: absolute;
        bottom: 80px;
        right: -18px;
        width: 170px;
        background: rgba(255,255,255,0.07);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 16px;
        padding: 16px;
        animation: float 5s ease-in-out infinite, scaleIn 0.7s ease 1s both;
      }

      .fs-label {
        font-size: 9px;
        color: rgba(255,255,255,0.45);
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 12px;
      }

      .fs-stat {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .fs-stat-label {
        font-size: 11px;
        color: rgba(255,255,255,0.65);
        font-weight: 400;
      }

      .fs-stat-value {
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: -0.3px;
      }

      .fs-stat-value.gold {
        color: #C9A86A;
      }

      .fs-divider {
        height: 1px;
        background: rgba(255,255,255,0.1);
        margin: 10px 0;
      }

      .fs-stars {
        display: flex;
        gap: 2px;
        color: #C9A86A;
      }

      .fs-rating-text {
        font-size: 10px;
        color: rgba(255,255,255,0.5);
      }

      .fs-rating {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
      }

      /* ══════════════════════════════
         RIGHT PANEL  — EXACT LOGIN SIZING
      ══════════════════════════════ */
      .right-panel {
        flex: 0.85;
        display: flex;
        flex-direction: column;
        padding: 24px 36px;
        background: linear-gradient(160deg, #faf9f7 0%, #f3f1ed 50%, #ede9e2 100%);
        position: relative;
        overflow: hidden;
      }

      .orb {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        filter: blur(50px);
      }

      .orb-1 {
        width: 280px; height: 280px;
        background: radial-gradient(circle, rgba(201,168,106,0.18) 0%, transparent 70%);
        top: -60px; right: -60px;
      }

      .orb-2 {
        width: 220px; height: 220px;
        background: radial-gradient(circle, rgba(150,180,255,0.12) 0%, transparent 70%);
        bottom: -40px; left: -40px;
      }

      .orb-3 {
        width: 150px; height: 150px;
        background: radial-gradient(circle, rgba(201,168,106,0.1) 0%, transparent 70%);
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
      }

      .right-grid {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px);
        background-size: 32px 32px;
        pointer-events: none;
      }

      /* ─── Card — same max-width as login ─── */
      .signup-card {
        width: 100%;
        max-width: 430px;
        margin: auto;
        position: relative;
        z-index: 2;
        animation: fadeInUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both;
      }

      /* ─── Glass Body — same padding / radius as login ─── */
      .glass-body {
        background: rgba(255,255,255,0.82);
        backdrop-filter: blur(28px);
        -webkit-backdrop-filter: blur(28px);
        border: 1px solid rgba(255,255,255,0.95);
        border-radius: 28px;
        padding: 32px 36px 28px;
        box-shadow:
          0 1px 0 rgba(255,255,255,1) inset,
          0 -1px 0 rgba(0,0,0,0.04) inset,
          0 8px 32px rgba(0,0,0,0.06),
          0 24px 64px rgba(0,0,0,0.08),
          0 48px 96px rgba(0,0,0,0.04);
        position: relative;
        overflow: hidden;
      }

      .glass-body::before {
        content: '';
        position: absolute;
        top: 0; left: -100%; right: -100%;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255,255,255,0) 20%,
          rgba(201,168,106,0.6) 50%,
          rgba(255,255,255,0) 80%,
          transparent 100%
        );
        background-size: 200% 100%;
        animation: shimmerMove 4s ease infinite;
      }

      .glass-body::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 80px;
        background: linear-gradient(180deg, rgba(201,168,106,0.04) 0%, transparent 100%);
        pointer-events: none;
        border-radius: 28px 28px 0 0;
      }

      /* ─── Card brand ─── */
      .card-brand {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center;
        margin-bottom: 24px;
      }

      .card-brand-dot {
        width: 26px;
        height: 26px;
        background: linear-gradient(135deg, #C9A86A 0%, #b8924f 100%);
        border-radius: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .card-brand-dot span {
        font-family: 'Playfair Display', serif;
        font-size: 13px;
        font-weight: 700;
        color: #ffffff;
        line-height: 1;
      }

      .card-brand-name {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: #111111;
        letter-spacing: 0.5px;
      }

      /* ─── Step Progress ─── */
      .step-progress {
        margin-bottom: 24px;
      }

      .step-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .step-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .step-counter {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #C9A86A;
        color: #ffffff;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Space Grotesk', sans-serif;
        transition: all 0.4s ease;
      }

      .step-counter.inactive {
        background: #e5e0d8;
        color: #aaa8a4;
      }

      .step-label-text {
        font-size: 12px;
        font-weight: 600;
        color: #5a5550;
        letter-spacing: 0.3px;
      }

      .step-dots {
        display: flex;
        gap: 4px;
      }

      .step-dot {
        font-size: 14px;
        color: #C9A86A;
        font-weight: 700;
        opacity: 1;
        transition: opacity 0.3s ease;
      }

      .step-dot.inactive {
        color: #d5cfc5;
      }

      /* Progress Bar */
      .progress-bar-wrap {
        height: 5px;
        background: #ede9e2;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
      }

      .progress-bar-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 10px;
        background: linear-gradient(90deg, #C9A86A, #d4b070, #C9A86A);
        background-size: 200% 100%;
        transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
        box-shadow: 0 0 8px rgba(201,168,106,0.3);
      }

      .progress-bar-fill.animated {
        animation: shimmerMove 2s ease infinite;
      }

      /* Step indicators below bar */
      .step-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
      }

      .step-label {
        font-size: 10px;
        font-weight: 600;
        color: #aaa8a4;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        transition: color 0.3s ease;
      }

      .step-label.active {
        color: #C9A86A;
      }

      .step-label.completed {
        color: #5a5550;
      }

      /* ─── Form Header ─── */
      .form-header { margin-bottom: 18px; }

      .header-eyebrow {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
      }

      .eyebrow-line {
        width: 20px;
        height: 1.5px;
        background: #C9A86A;
      }

      .eyebrow-text {
        font-size: 10px;
        font-weight: 700;
        color: #C9A86A;
        letter-spacing: 2.5px;
        text-transform: uppercase;
      }

      .form-title {
        font-family: 'Playfair Display', serif;
        font-size: 28px;
        font-weight: 700;
        color: #0d0d0d;
        letter-spacing: -0.3px;
        line-height: 1.18;
        margin-bottom: 8px;
      }

      .form-subtitle {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 13.5px;
        color: #9a9490;
        font-weight: 400;
        line-height: 1.55;
        letter-spacing: 0.1px;
      }

      /* ─── Form Content ─── */
      .form-content { display: flex; flex-direction: column; gap: 14px; }

      .field-group { display: flex; flex-direction: column; gap: 8px; }

      .field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .field-label {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 11px;
        font-weight: 700;
        color: #5a5550;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .label-required {
        color: #C9A86A;
        font-size: 14px;
        line-height: 1;
      }

      .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .input-icon {
        position: absolute;
        left: 15px;
        color: #c0bbb5;
        display: flex;
        align-items: center;
        pointer-events: none;
        transition: color 0.25s ease;
        z-index: 1;
      }

      .form-input {
        width: 100%;
        padding: 12px 14px 12px 40px;
        border: 1.5px solid #e5e0d8;
        border-radius: 12px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        font-weight: 400;
        color: #111111;
        background: rgba(252,250,248,0.9);
        outline: none;
        transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
        -webkit-appearance: none;
        letter-spacing: 0.1px;
      }

      .form-input::placeholder {
        color: #c8c3bc;
        font-weight: 300;
        letter-spacing: 0.2px;
      }

      .form-input:hover {
        border-color: #cfc9bf;
        background: rgba(255,255,255,0.95);
      }

      .form-input:focus,
      .form-input.focused {
        border-color: #C9A86A;
        background: #ffffff;
        box-shadow:
          0 0 0 3.5px rgba(201,168,106,0.12),
          0 2px 8px rgba(201,168,106,0.08);
      }

      .input-wrapper:focus-within .input-icon {
        color: #C9A86A;
      }

      .password-toggle {
        position: absolute;
        right: 14px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #c0bbb5;
        transition: all 0.25s ease;
        border-radius: 8px;
        outline: none;
        z-index: 1;
      }

      .password-toggle:hover {
        color: #555;
        background: rgba(0,0,0,0.05);
      }

      .password-toggle svg {
        transition: transform 0.25s ease;
      }

      .password-toggle:hover svg { transform: scale(1.12); }

      /* Password strength */
      .strength-indicator {
        display: flex;
        gap: 4px;
        margin-top: -2px;
      }

      .strength-seg {
        flex: 1;
        height: 2.5px;
        border-radius: 10px;
        background: #e8e2d8;
        transition: background 0.4s ease;
      }

      .strength-seg.weak { background: #ff6b6b; }
      .strength-seg.medium { background: #ffd93d; }
      .strength-seg.strong { background: #C9A86A; }

      .strength-text {
        font-size: 10px;
        color: #9a9490;
        margin-top: 2px;
        font-weight: 500;
        letter-spacing: 0.3px;
      }

      /* Extras row */
      .form-extras {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 2px;
      }

      .terms-label {
        display: flex;
        align-items: flex-start;
        gap: 9px;
        cursor: pointer;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 12.5px;
        color: #6e6860;
        font-weight: 400;
        user-select: none;
        line-height: 1.5;
      }

      .custom-checkbox {
        width: 18px; height: 18px;
        min-width: 18px;
        border: 1.5px solid #d5cfc5;
        border-radius: 5px;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.22s ease;
        flex-shrink: 0;
        margin-top: 1px;
      }

      .custom-checkbox.checked {
        background: linear-gradient(135deg, #C9A86A 0%, #b8924f 100%);
        border-color: #C9A86A;
        box-shadow: 0 2px 8px rgba(201,168,106,0.35);
      }

      .terms-link {
        color: #C9A86A;
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
        transition: color 0.2s ease;
      }

      .terms-link:hover {
        color: #b8924f;
        text-decoration: underline;
      }

      /* Buttons row */
      .btn-row {
        display: flex;
        gap: 10px;
        margin-top: 4px;
      }

      /* Back Button */
      .back-btn {
        padding: 14px 20px;
        border: 1.5px solid #e5e0d8;
        border-radius: 12px;
        background: #ffffff;
        color: #5a5550;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
        cursor: pointer;
        outline: none;
        transition: all 0.28s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
      }

      .back-btn:hover {
        border-color: #C9A86A;
        color: #C9A86A;
        background: rgba(201,168,106,0.04);
      }

      /* Submit / Next Button */
      .submit-btn {
        flex: 1;
        padding: 14px 20px;
        border: none;
        border-radius: 12px;
        background: #0d0d0d;
        color: #ffffff;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        outline: none;
        transition: transform 0.28s ease, box-shadow 0.28s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .submit-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }

      .submit-btn::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, #C9A86A 0%, #d4b070 50%, #b8924f 100%);
        opacity: 0;
        transition: opacity 0.35s ease;
      }

      .submit-btn::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255,255,255,0.12) 50%,
          transparent 100%
        );
        background-size: 200% 100%;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .submit-btn:not(:disabled):hover::before { opacity: 1; }
      .submit-btn:not(:disabled):hover::after  { opacity: 1; animation: shimmerMove 1.2s ease; }

      .submit-btn:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow:
          0 12px 32px rgba(201,168,106,0.38),
          0 4px 12px rgba(0,0,0,0.18);
      }

      .submit-btn:active { transform: translateY(0); }

      .btn-text, .btn-arrow {
        position: relative;
        z-index: 1;
      }

      .btn-arrow {
        display: flex;
        align-items: center;
        transition: transform 0.25s ease;
      }

      .submit-btn:not(:disabled):hover .btn-arrow { transform: translateX(4px); }

      /* Divider */
      .divider {
        display: flex;
        align-items: center;
        gap: 14px;
        margin: 4px 0;
      }

      .divider-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, #e0dbd2, transparent);
      }

      .divider-text {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 10.5px;
        color: #c0bbb5;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        font-weight: 500;
      }

      /* Social */
      .social-strip {
        display: flex;
        gap: 10px;
      }

      .social-btn {
        flex: 1;
        padding: 11px 12px;
        background: #f5f3ef;
        border: 1.5px solid #e8e2d8;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 12px;
        font-weight: 600;
        color: #3d3830;
        letter-spacing: 0.2px;
        transition: all 0.25s ease;
        outline: none;
      }

      .social-btn:hover {
        background: #ffffff;
        border-color: #C9A86A;
        color: #C9A86A;
        box-shadow: 0 4px 16px rgba(201,168,106,0.15);
        transform: translateY(-1px);
      }

      /* Footer */
      .card-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid rgba(0,0,0,0.06);
      }

      .footer-text {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 12.5px;
        color: #aaa8a4;
        line-height: 1.5;
        text-align: center;
      }

      .footer-link {
        color: #C9A86A;
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
        transition: color 0.2s ease;
        background: none;
        border: none;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 12.5px;
        outline: none;
        padding: 0;
      }

      .footer-link:hover { color: #b8924f; }

      /* Trust badges */
      .trust-badges {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
        margin-top: 20px;
      }

      .trust-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 10px;
        color: #bbb7b2;
        letter-spacing: 0.5px;
        font-weight: 500;
      }

      .trust-icon { color: #C9A86A; display: flex; }

      /* Step content transition */
      .step-content {
        animation: stepSlideIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
      }

      /* ══════════════════
         RESPONSIVE
      ══════════════════ */
      @media (max-width: 960px) {
        .driphub-signup-root {
          flex-direction: column;
          height: auto;
          min-height: 100vh;
          min-height: 100dvh;
          overflow-y: auto;
        }
        body { overflow: auto; }

        .left-panel {
          flex: none;
          height: 280px;
          width: 100%;
        }

        .right-panel {
          flex: none;
          width: 100%;
          padding: 32px 20px 48px;
        }

        .glass-body { padding: 34px 26px; }

        .left-content { padding: 28px 32px; }

        .logo-wordmark { font-size: 38px; }

        .tagline { font-size: 20px; }

        .benefits-list, .floating-stats { display: none; }

        .bottom-block { gap: 12px; }

        .field-row { grid-template-columns: 1fr; }
      }

      @media (max-width: 480px) {
        .left-panel { height: 220px; }

        .glass-body {
          padding: 28px 20px;
          border-radius: 20px;
        }

        .form-title { font-size: 23px; }

        .logo-wordmark { font-size: 30px; letter-spacing: -0.5px; }

        .social-strip { flex-direction: column; }

        .btn-row { flex-direction: column-reverse; }
      }

      @media (max-width: 1200px) and (min-width: 961px) {
        .left-panel { flex: 1.05; }
        .right-panel { flex: 0.95; padding: 32px 24px; }
        .glass-body { padding: 38px 34px; }
        .floating-stats { display: none; }
      }
    `;

    if (!styleRef.current) {
      const styleEl = document.createElement("style");
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
      styleRef.current = styleEl;
    }

    return () => {
      clearTimeout(timer);
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) return;
    setStepTransition(true);
    setTimeout(() => {
      setCurrentStep(2);
      setStepTransition(false);
    }, 100);
  };

  const handlePrevStep = () => {
    setStepTransition(true);
    setTimeout(() => {
      setCurrentStep(1);
      setStepTransition(false);
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) return;
    if (formData.password !== formData.confirmPassword) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: new Date().toISOString()
      });
      
      console.log("Account created successfully!");
      navigate('/login'); // Redirect to login on success
    } catch (err) {
      console.error("Error signing up:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (pw) => {
    if (!pw) return { level: 0, text: "" };
    if (pw.length < 6) return { level: 1, text: "Weak" };
    if (pw.length < 10) return { level: 2, text: "Medium" };
    return { level: 3, text: "Strong" };
  };

  const strength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const step1Valid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim();

  const step2Valid =
    formData.password &&
    formData.confirmPassword &&
    passwordsMatch &&
    agreeTerms;

  const progressWidth = currentStep === 1 ? "50%" : "100%";

  /* ── Icons ── */
  const EyeOpenIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeClosedIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 6 5 9 10 3"/>
    </svg>
  );

  const MailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/>
    </svg>
  );

  const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const ArrowIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  );

  const GoogleIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  const AppleIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );

  const ShieldCheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );

  const SparklesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.545 4.635L18.18 9.18l-4.635 1.545L12 15.36l-1.545-4.635L5.82 9.18l4.635-1.545L12 3z"/>
      <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5L5 3z"/>
      <path d="M19 17l.5 1.5L21 19l-1.5.5L19 21l-.5-1.5L17 19l1.5-.5L19 17z"/>
    </svg>
  );

  const TruckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );

  const LockTrustIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );

  const ShieldTrustIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );

  return (
    <div
      className="driphub-signup-root"
      style={{ opacity: pageLoaded ? 1 : 0, transition: "opacity 0.7s ease" }}
    >
      {/* ── LEFT PANEL ── */}
      <div className="left-panel">
        <img
          className="left-panel-image"
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=90&auto=format&fit=crop"
          alt="DripHub Fashion"
          loading="eager"
        />
        <div className="gradient-overlay" />
        <div className="left-noise" />

        <div className="left-content">
          <div className="logo-area">
            <div className="logo-wordmark">
              Drip<span>Hub</span>
            </div>
            <div className="logo-separator" />

            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon"><ShieldCheckIcon /></div>
                <div className="benefit-content">
                  <div className="benefit-title">Secure & Private</div>
                  <div className="benefit-desc">Your data is encrypted and protected with industry-leading security</div>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon"><SparklesIcon /></div>
                <div className="benefit-content">
                  <div className="benefit-title">Exclusive Access</div>
                  <div className="benefit-desc">Get early access to new collections and member-only deals</div>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon"><TruckIcon /></div>
                <div className="benefit-content">
                  <div className="benefit-title">Free Shipping</div>
                  <div className="benefit-desc">Enjoy complimentary shipping on all orders over $50</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-block">
            <div className="bottom-tags">
              {["Exclusive Drops", "Premium Quality", "Curated Collections", "24/7 Support"].map((t) => (
                <span className="tag-pill" key={t}>{t}</span>
              ))}
            </div>
            <div className="tagline">"Join our community of style enthusiasts."</div>
            <div className="sub-tagline">Your Fashion Journey Starts Here</div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="right-panel">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="right-grid" />

        <div className="signup-card">
          <div className="glass-body">
            {/* Brand */}
            <div className="card-brand">
              <div className="card-brand-dot"><span>D</span></div>
              <span className="card-brand-name">DripHub</span>
            </div>

            {/* ─── Step Progress ─── */}
            <div className="step-progress">
              <div className="step-header">
                <div className="step-info">
                  <div className={`step-counter ${currentStep === 2 ? 'inactive' : ''}`}>1</div>
                  <span className="step-label-text">
                    {currentStep === 1 ? "Personal Details" : "Account Security"}
                  </span>
                </div>
                <div className="step-dots">
                  <span className={`step-dot ${currentStep >= 1 ? '' : 'inactive'}`}>•</span>
                  <span className={`step-dot ${currentStep >= 2 ? '' : 'inactive'}`}>•</span>
                </div>
              </div>
              <div className="progress-bar-wrap">
                <div
                  className="progress-bar-fill animated"
                  style={{ width: progressWidth }}
                />
              </div>
              <div className="step-labels">
                <span className={`step-label ${currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'active') : ''}`}>
                  Personal Info
                </span>
                <span className={`step-label ${currentStep >= 2 ? 'active' : ''}`}>
                  Security
                </span>
              </div>
            </div>

            {/* ─── Form Header ─── */}
            <div className="form-header" key={`hdr-${currentStep}`}>
              <div className="header-eyebrow">
                <div className="eyebrow-line" />
                <span className="eyebrow-text">Customer Portal</span>
              </div>
              <div className="form-title">
                {currentStep === 1 ? "Create Your Account" : "Secure Your Account"}
              </div>
              <div className="form-subtitle">
                {currentStep === 1
                  ? "Let's start with your basic details to get you set up."
                  : "Set up your details and create a strong password."}
              </div>
            </div>

            {/* ─── STEP 1 ─── */}
            {currentStep === 1 && (
              <form onSubmit={handleNextStep} className="step-content" key="step1">
                <div className="form-content">
                  {/* First Name + Last Name */}
                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">
                        First Name <span className="label-required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <span className="input-icon"><UserIcon /></span>
                        <input
                          className={`form-input ${focusedField === "firstName" ? "focused" : ""}`}
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField("firstName")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="John"
                          autoComplete="given-name"
                          required
                        />
                      </div>
                    </div>
                    <div className="field-group">
                      <label className="field-label">
                        Last Name <span className="label-required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <span className="input-icon"><UserIcon /></span>
                        <input
                          className={`form-input ${focusedField === "lastName" ? "focused" : ""}`}
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField("lastName")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Doe"
                          autoComplete="family-name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="field-group">
                    <label className="field-label">
                      Email Address <span className="label-required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon"><MailIcon /></span>
                      <input
                        className={`form-input ${focusedField === "email" ? "focused" : ""}`}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="your@email.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={!step1Valid}
                    style={{ marginTop: '6px' }}
                  >
                    <span className="btn-text">Continue</span>
                    <span className="btn-arrow"><ArrowIcon /></span>
                  </button>
                </div>
              </form>
            )}

            {/* ─── STEP 2 ─── */}
            {currentStep === 2 && (
              <form onSubmit={handleSubmit} className="step-content" key="step2">
                <div className="form-content">
                  {/* Password */}
                  <div className="field-group">
                    <label className="field-label">
                      Password <span className="label-required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon"><LockIcon /></span>
                      <input
                        className={`form-input ${focusedField === "password" ? "focused" : ""}`}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        style={{ paddingRight: "48px" }}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((p) => !p)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </button>
                    </div>
                    {formData.password && (
                      <>
                        <div className="strength-indicator">
                          <div className={`strength-seg ${strength.level >= 1 ? 'weak' : ''}`} />
                          <div className={`strength-seg ${strength.level >= 2 ? 'medium' : ''}`} />
                          <div className={`strength-seg ${strength.level >= 3 ? 'strong' : ''}`} />
                        </div>
                        <div className="strength-text">Password strength: {strength.text}</div>
                      </>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="field-group">
                    <label className="field-label">
                      Confirm Password <span className="label-required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon"><LockIcon /></span>
                      <input
                        className={`form-input ${focusedField === "confirmPassword" ? "focused" : ""}`}
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        style={{
                          paddingRight: "48px",
                          borderColor:
                            formData.confirmPassword && !passwordsMatch
                              ? "#ff6b6b"
                              : undefined,
                        }}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </button>
                    </div>
                    {formData.confirmPassword && !passwordsMatch && (
                      <div className="strength-text" style={{ color: "#ff6b6b" }}>
                        Passwords do not match
                      </div>
                    )}
                  </div>

                  {/* Terms */}
                  <div style={{ marginTop: '2px' }}>
                    <label
                      className="terms-label"
                      onClick={() => setAgreeTerms((p) => !p)}
                    >
                      <div className={`custom-checkbox ${agreeTerms ? "checked" : ""}`}>
                        {agreeTerms && <CheckIcon />}
                      </div>
                      <span>
                        I agree to DripHub's{" "}
                        <a href="#" className="terms-link" onClick={(e) => e.stopPropagation()}>
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="terms-link" onClick={(e) => e.stopPropagation()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  {/* Back + Submit */}
                  <div className="btn-row">
                    <button
                      type="button"
                      className="back-btn"
                      onClick={handlePrevStep}
                    >
                      <ArrowLeftIcon />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={!step2Valid || isLoading}
                    >
                      <span className="btn-text">{isLoading ? "Creating..." : "Create Account"}</span>
                      <span className="btn-arrow"><ArrowIcon /></span>
                    </button>
                  </div>
                  {error && (
                    <div style={{ color: "#ff6b6b", fontSize: "12px", marginTop: "12px", textAlign: "center" }}>
                      {error}
                    </div>
                  )}
                </div>
              </form>
            )}


            {/* Footer */}
            <div className="card-footer">
              <div className="footer-text">
                Already have an account?{" "}
                <button type="button" className="footer-link" onClick={() => navigate('/login')}>Sign in</button>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-item">
              <span className="trust-icon"><LockTrustIcon /></span>
              256-bit SSL Secure
            </div>
            <div className="trust-item">
              <span className="trust-icon"><ShieldTrustIcon /></span>
              GDPR Compliant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;