"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleSwitch(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
    setAnchorEl(null);
  }

  return (
    <>
      <Button
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          minWidth: 36,
          px: 1,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: "0.75rem",
          color: "text.secondary",
        }}
      >
        {locale}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {routing.locales.map((l) => (
          <MenuItem
            key={l}
            selected={l === locale}
            onClick={() => handleSwitch(l)}
          >
            {l === "fr" ? "Français" : "English"}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
