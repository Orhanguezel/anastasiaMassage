"use client";

import Link from "next/link";
import styled from "styled-components";
import { useState, useContext, useEffect } from "react";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/app/providers/ThemeProviderWrapper";
import Image from "next/image";

const NavbarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  height: 120px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LogoWrapper = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
`;

const LogoImage = styled(Image)`
  height: 120px;
  width: auto;
  object-fit: contain;
`;

const LogoColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const LogoText = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: rebeccapurple;
`;

const LogoText2 = styled.span`
  font-size: 0.85rem;
  font-style: italic;
  color: #888;
  margin-top: -0.3rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DesktopMenu = styled.ul`
  display: flex;
  list-style: none;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled.li`
  font-size: 1rem;
  font-weight: 500;
  color: inherit;
  cursor: pointer;
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  font-weight: 500;

  &:hover {
    color: rebeccapurple;
  }
`;

const MobileIcon = styled.div`
  display: none;
  font-size: 1.5rem;
  color: rebeccapurple;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.ul<{ open: boolean }>`
  display: ${({ open }) => (open ? "flex" : "none")};
  flex-direction: column;
  gap: 1.2rem;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 2rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  @media (min-width: 769px) {
    display: none;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: rebeccapurple;
`;

const LangSelect = styled.select`
  background: none;
  border: 1px solid rebeccapurple;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: rebeccapurple;
  cursor: pointer;

  option {
    color: black;
  }
`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { t, i18n } = useTranslation();
  const { toggle, isDark } = useContext(ThemeContext);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const logoSrc = isDark ? "/logo-dark.png" : "/logo-light.png";

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <NavbarWrapper>
      <LogoWrapper href="/">
        <LogoImage
          src={logoSrc}
          alt="Anastasia Logo"
          width={60}
          height={60}
          priority
        />
        <LogoColumn>
          <LogoText>Anastasia</LogoText>
          <LogoText2>König Massage</LogoText2>
        </LogoColumn>
      </LogoWrapper>

      <DesktopMenu>
        <MenuItem>
          <MenuLink href="/">{t("navbar.home")}</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/visitor/services">{t("navbar.services")}</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/visitor/products">{t("navbar.products")}</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/visitor/blogs">{t("navbar.blog")}</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/visitor/appointment">{t("navbar.appointment")}</MenuLink>
        </MenuItem>
      </DesktopMenu>

      <RightSection>
        <ThemeToggle onClick={toggle}>
          {isDark ? <FaSun /> : <FaMoon />}
        </ThemeToggle>

        <LangSelect value={i18n.language} onChange={handleLangChange}>
          <option value="tr">TR</option>
          <option value="en">EN</option>
          <option value="de">DE</option>
        </LangSelect>

        <MobileIcon onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </MobileIcon>
      </RightSection>

      <MobileMenu open={menuOpen}>
        <MenuItem>
          <MenuLink href="/" onClick={closeMenu}>
            {t("navbar.home")}
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/visitor/services" onClick={closeMenu}>
            {t("navbar.services")}
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/visitor/products" onClick={closeMenu}>
            {t("navbar.products")}
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/visitor/blogs" onClick={closeMenu}>
            {t("navbar.blog")}
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/visitor/appointment" onClick={closeMenu}>
            {t("navbar.appointment")}
          </MenuLink>
        </MenuItem>
      </MobileMenu>
    </NavbarWrapper>
  );
}
