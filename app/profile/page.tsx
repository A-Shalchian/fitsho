"use client";

import type { JSX } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppShell } from "../components/app-shell";

const WEIGHT_UNITS = ["kg", "lbs"] as const;
type WeightUnit = (typeof WEIGHT_UNITS)[number];

const SECTION_HEADER_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-3";
const CARD_CLASS =
  "bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden";
const CARD_ROW_CLASS = "p-5 flex items-center justify-between";

export default function ProfilePage() {
  const { user } = useUser();
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
      <div className="max-w-2xl">
        <header className="flex items-center gap-5 mb-10">
          <Avatar imageUrl={user.imageUrl} initials={initials} name={displayName} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
            <p className="text-[var(--foreground-muted)]">{email}</p>
          </div>
        </header>

        <div className="space-y-6">
          <section>
            <h2 className={SECTION_HEADER_CLASS}>Preferences</h2>
            <div className={CARD_CLASS}>
              <div className={CARD_ROW_CLASS}>
                <SettingLabel
                  title="Weight Unit"
                  description="Choose your preferred unit for logging weights"
                />
                <WeightUnitToggle
                  selectedUnit={dbUser?.weightUnit}
                  onSelect={handleWeightUnitChange}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className={SECTION_HEADER_CLASS}>Account</h2>
            <div className={`${CARD_CLASS} divide-y divide-[var(--border)]`}>
              <div className={CARD_ROW_CLASS}>
                <SettingLabel title="Email Address" description={email} />
                <span className="px-2.5 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded-full">
                  Verified
                </span>
              </div>
              <div className={CARD_ROW_CLASS}>
                <SettingLabel title="Member Since" description={memberSince} />
              </div>
            </div>
          </section>

          <section>
            <h2 className={SECTION_HEADER_CLASS}>Danger Zone</h2>
            <div className="bg-[var(--surface)] border border-red-500/20 rounded-xl overflow-hidden">
              <div className={CARD_ROW_CLASS}>
                <SettingLabel
                  title="Sign Out"
                  description="Sign out of your account on this device"
                />
                <SignOutButton>
                  <button className="px-4 py-2 text-sm font-medium bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

interface AvatarProps {
  imageUrl?: string;
  initials: string;
  name: string;
}

function Avatar({ imageUrl, initials, name }: AvatarProps): JSX.Element {
  const containerClass =
    "w-20 h-20 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[var(--border)] flex items-center justify-center";

  if (imageUrl) {
    return (
      <div className={containerClass}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <span className="text-2xl font-semibold text-[var(--foreground-muted)]">
        {initials.toUpperCase()}
      </span>
    </div>
  );
}

interface SettingLabelProps {
  title: string;
  description?: string;
}

function SettingLabel({ title, description }: SettingLabelProps): JSX.Element {
  return (
    <div>
      <h3 className="font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--foreground-muted)]">{description}</p>
      )}
    </div>
  );
}

interface WeightUnitToggleProps {
  selectedUnit?: WeightUnit;
  onSelect: (unit: WeightUnit) => void;
}

function WeightUnitToggle({
  selectedUnit,
  onSelect,
}: WeightUnitToggleProps): JSX.Element {
  return (
    <div className="flex bg-[var(--background)] rounded-lg p-1 border border-[var(--border)]">
      {WEIGHT_UNITS.map((unit) => {
        const isSelected = selectedUnit === unit;
        const buttonClass = isSelected
          ? "bg-gradient-to-b from-[#ffffff] to-[#e5e5e5] text-[#0a0a0a] shadow-sm"
          : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]";

        return (
          <button
            key={unit}
            onClick={() => onSelect(unit)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${buttonClass}`}
          >
            {unit.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
