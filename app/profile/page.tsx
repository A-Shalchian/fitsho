"use client";

import { useState } from "react";
import type { JSX } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppShell } from "../components/app-shell";
import Image from "next/image";

const WEIGHT_UNITS = ["kg", "lbs"] as const;
type WeightUnit = (typeof WEIGHT_UNITS)[number];

type TabId = "profile" | "preferences" | "account";

interface Tab {
  id: TabId;
  label: string;
  icon: JSX.Element;
}

const TABS: Tab[] = [
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function ProfilePage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const dbUser = useQuery(
    api.users.getByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const updateWeightUnit = useMutation(api.users.updateWeightUnit);

  if (!user) return null;

  const initials =
    user.firstName?.[0] || user.primaryEmailAddress?.emailAddress?.[0] || "?";
  const displayName = user.fullName || user.firstName || "User";
  const email = user.primaryEmailAddress?.emailAddress;
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  function handleWeightUnitChange(unit: WeightUnit): void {
    if (user?.id) {
      updateWeightUnit({ clerkId: user.id, weightUnit: unit });
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          {/* User Card */}
          <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl mb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center flex-shrink-0">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {initials.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold truncate">{displayName}</h2>
                <p className="text-xs text-[var(--foreground-muted)] truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Sign Out - Desktop */}
          <div className="hidden lg:block mt-6 pt-6 border-t border-[var(--border)]">
            <SignOutButton>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-400 hover:bg-red-500/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Sign Out</span>
              </button>
            </SignOutButton>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <ProfileTab
              user={user}
              displayName={displayName}
              email={email}
              initials={initials}
            />
          )}
          {activeTab === "preferences" && (
            <PreferencesTab
              weightUnit={dbUser?.weightUnit}
              onWeightUnitChange={handleWeightUnitChange}
            />
          )}
          {activeTab === "account" && (
            <AccountTab email={email} memberSince={memberSince} />
          )}
        </main>
      </div>
    </AppShell>
  );
}

function ProfileTab({
  user,
  displayName,
  email,
  initials,
}: {
  user: ReturnType<typeof useUser>["user"];
  displayName: string;
  email?: string;
  initials: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        {/* Avatar Section */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {initials.toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{displayName}</h3>
              <p className="text-sm text-[var(--foreground-muted)]">{email}</p>
            </div>
          </div>
        </div>

        {/* Info Rows */}
        <div className="divide-y divide-[var(--border)]">
          <SettingRow label="Full Name" value={displayName} />
          <SettingRow label="Email" value={email || "—"} />
          <SettingRow
            label="Provider"
            value={
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}

function PreferencesTab({
  weightUnit,
  onWeightUnitChange,
}: {
  weightUnit?: WeightUnit;
  onWeightUnitChange: (unit: WeightUnit) => void;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Preferences</h1>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Weight Unit</h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              Choose your preferred unit for logging weights
            </p>
          </div>
          <WeightUnitToggle
            selectedUnit={weightUnit}
            onSelect={onWeightUnitChange}
          />
        </div>
      </div>

      {/* Future preferences can go here */}
      <div className="mt-4 p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl opacity-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Theme</h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              Coming soon
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-medium bg-[var(--accent)]/20 text-[var(--accent)] rounded-full">
            Soon
          </span>
        </div>
      </div>
    </div>
  );
}

function AccountTab({
  email,
  memberSince,
}: {
  email?: string;
  memberSince: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account</h1>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden divide-y divide-[var(--border)]">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Email Address</h3>
            <p className="text-sm text-[var(--foreground-muted)]">{email}</p>
          </div>
          <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
            Verified
          </span>
        </div>
        <div className="p-6">
          <h3 className="font-semibold mb-1">Member Since</h3>
          <p className="text-sm text-[var(--foreground-muted)]">{memberSince}</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-3">
          Danger Zone
        </h2>
        <div className="bg-[var(--surface)] border border-red-500/20 rounded-2xl overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Delete Account</h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              disabled
              className="px-4 py-2 text-sm font-medium bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 opacity-50 cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sign Out */}
      <div className="lg:hidden mt-6">
        <SignOutButton>
          <button className="w-full py-4 text-red-400 font-medium bg-red-500/10 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-colors">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="p-4 flex items-center justify-between">
      <span className="text-sm text-[var(--foreground-muted)]">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function WeightUnitToggle({
  selectedUnit,
  onSelect,
}: {
  selectedUnit?: WeightUnit;
  onSelect: (unit: WeightUnit) => void;
}) {
  return (
    <div className="flex bg-[var(--background)] rounded-xl p-1 border border-[var(--border)]">
      {WEIGHT_UNITS.map((unit) => {
        const isSelected = selectedUnit === unit;
        return (
          <button
            key={unit}
            onClick={() => onSelect(unit)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              isSelected
                ? "bg-white text-black"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {unit.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
