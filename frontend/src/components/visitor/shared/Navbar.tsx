"use client";

import { useState, useEffect, useContext } from "react";
import {
  FaMoon,
  FaSun,
  FaInstagram,
  FaTiktok,
  FaPinterestP,
  FaSearch,
  FaPhone,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getImageSrc } from "@/utils/getImageSrc";

import {
  TopBar,
  SocialLinks,
  Phone,
  NavbarWrapper,
  CenterSection,
  LogoWrapper,
  LogoImage,
  LogoTextWrapper,
  LogoText,
  LogoText2,
  RightControls,
  LangSelect,
  ThemeToggle,
  Hamburger,
  DesktopMenu,
  MenuItem,
  MenuItem1,
  MenuLink,
  MenuBar,
  StickyMenu,
  MobileMenuLink,
  MobileMenu,
} from "./NavbarStyles";

import { ThemeContext } from "@/app/providers/ThemeProviderWrapper";
import { useAppSelector } from "@/store/hooks";

export default function Navbar() {
  const { profile: user } = useAppSelector((state) => state.account);
  const isAuthenticated = !!user;

  const [hasMounted, setHasMounted] = useState(false);
  const [showStickyMenu, setShowStickyMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const { toggle, isDark } = useContext(ThemeContext);

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => setShowStickyMenu(window.scrollY > 120);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!hasMounted) return null;

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const logoSrc = isDark ? "/navbar/logo-dark.png" : "/navbar/logo-light.png";

  const desktopMenuItems = (
    <>
      <MenuItem><MenuLink href="/">{t("navbar.home")}</MenuLink></MenuItem>
      <MenuItem><MenuLink href="/visitor/services">{t("navbar.services")}</MenuLink></MenuItem>
      <MenuItem><MenuLink href="/visitor/products">{t("navbar.products")}</MenuLink></MenuItem>
      <MenuItem><MenuLink href="/visitor/blogs">{t("navbar.blog")}</MenuLink></MenuItem>
      <MenuItem><MenuLink href="/visitor/appointment">{t("navbar.appointment")}</MenuLink></MenuItem>
      <MenuItem1><MenuLink href="/search"><FaSearch /></MenuLink></MenuItem1>
    </>
  );

  const mobileMenuItems = (
    <>
      <MobileMenuLink href="/" onClick={() => setMobileOpen(false)}>{t("navbar.home")}</MobileMenuLink>
      <MobileMenuLink href="/visitor/services" onClick={() => setMobileOpen(false)}>{t("navbar.services")}</MobileMenuLink>
      <MobileMenuLink href="/visitor/products" onClick={() => setMobileOpen(false)}>{t("navbar.products")}</MobileMenuLink>
      <MobileMenuLink href="/visitor/blogs" onClick={() => setMobileOpen(false)}>{t("navbar.blog")}</MobileMenuLink>
      <MobileMenuLink href="/visitor/appointment" onClick={() => setMobileOpen(false)}>{t("navbar.appointment")}</MobileMenuLink>
      {!isAuthenticated ? (
        <>
          <MobileMenuLink href="/login" onClick={() => setMobileOpen(false)}>Login</MobileMenuLink>
          <MobileMenuLink href="/register" onClick={() => setMobileOpen(false)}>Register</MobileMenuLink>
        </>
      ) : (
        <MobileMenuLink href="/account" onClick={() => setMobileOpen(false)}>Account</MobileMenuLink>
      )}
    </>
  );

  return (
    <>
      <AnimatePresence>
        {showStickyMenu && (
          <StickyMenu
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LogoWrapper href="/">
              <LogoImage src={logoSrc} alt="Logo" width={40} height={40} />
              <LogoTextWrapper>
                <LogoText>Königs Massage</LogoText>
                <LogoText2>Anastasia</LogoText2>
              </LogoTextWrapper>
            </LogoWrapper>
            <DesktopMenu>{desktopMenuItems}</DesktopMenu>
            <RightControls>
              <ThemeToggle onClick={toggle}>
                {isDark ? <FaSun /> : <FaMoon />}
              </ThemeToggle>
              <LangSelect value={i18n.language} onChange={handleLangChange}>
                <option value="tr">TR</option>
                <option value="en">EN</option>
                <option value="de">DE</option>
              </LangSelect>
             
              <Hamburger onClick={() => setMobileOpen((prev) => !prev)}>
                {mobileOpen ? <FaTimes /> : <FaBars />}
              </Hamburger>
            </RightControls>
          </StickyMenu>
        )}
      </AnimatePresence>

      <NavbarWrapper>
        <TopBar>
          <SocialLinks>
            <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer"><FaPinterestP /></a>
          </SocialLinks>
          <Phone><FaPhone /> 017641107158</Phone>
        </TopBar>

        <CenterSection>
          <LogoWrapper href="/">
            <LogoImage src={logoSrc} alt="Logo" width={60} height={60} />
            <LogoTextWrapper>
              <LogoText>Königs Massage</LogoText>
              <LogoText2>Anastasia</LogoText2>
            </LogoTextWrapper>
          </LogoWrapper>
          <RightControls>
            <ThemeToggle onClick={toggle}>
              {isDark ? <FaSun /> : <FaMoon />}
            </ThemeToggle>
            <LangSelect value={i18n.language} onChange={handleLangChange}>
              <option value="tr">TR</option>
              <option value="en">EN</option>
              <option value="de">DE</option>
            </LangSelect>
            {!isAuthenticated ? (
              <>
                <MenuLink href="/login">{t("navbar.login")}</MenuLink>
                <MenuLink href="/register">{t("navbar.register")}</MenuLink>
              </>
            ) : (
              <MenuLink href="/account">
                <Image
                  src={getImageSrc(user?.profileImage)}
                  alt="Profil"
                  width={32}
                  height={32}
                  priority
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              </MenuLink>
            )}
            <Hamburger onClick={() => setMobileOpen((prev) => !prev)}>
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </Hamburger>
          </RightControls>
        </CenterSection>

        <MenuBar>
          <DesktopMenu>{desktopMenuItems}</DesktopMenu>
        </MenuBar>

        <AnimatePresence>
          {mobileOpen && (
            <MobileMenu
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenuItems}
            </MobileMenu>
          )}
        </AnimatePresence>
      </NavbarWrapper>
    </>
  );
}
