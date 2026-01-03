'use client';

import { logout } from '@/lib/auth';

export function LogoutButton() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <button onClick={handleLogout} className="admin__logout-btn">
      Logout
    </button>
  );
}
