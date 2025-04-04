"use client";

import { useState, useContext, useEffect } from "react";
import {
  FaMoon,
  FaSun,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaPhone,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/app/providers/ThemeProviderWrapper";
import { AnimatePresence } from "framer-motion";
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
  MenuLink,
  MenuBar,
  StickyMenu,
  MobileMenuLink,
  MobileMenu,
} from "./NavbarStyles";

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false);
  const [showStickyMenu, setShowStickyMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { toggle, isDark } = useContext(ThemeContext);

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => {
      setShowStickyMenu(window.scrollY > 120);
    };
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
      <MenuItem><MenuLink href="/login">Login</MenuLink></MenuItem>
      <MenuItem><MenuLink href="/register">Register</MenuLink></MenuItem>
    </>
  );

  const mobileMenuItems = (
    <>
      <MobileMenuLink href="/" onClick={() => setMobileOpen(false)}>{t("navbar.home")}</MobileMenuLink>
      <MobileMenuLink href="/visitor/services" onClick={() => setMobileOpen(false)}>{t("navbar.services")}</MobileMenuLink>
      <MobileMenuLink href="/visitor/products" onClick={() => setMobileOpen(false)}>{t("navbar.products")}</MobileMenuLink>
      <MobileMenuLink href="/visitor/blogs" onClick={() => setMobileOpen(false)}>{t("navbar.blog")}</MobileMenuLink>
      <MobileMenuLink href="/visitor/appointment" onClick={() => setMobileOpen(false)}>{t("navbar.appointment")}</MobileMenuLink>
      <MobileMenuLink href="/login" onClick={() => setMobileOpen(false)}>Login</MobileMenuLink>
      <MobileMenuLink href="/register" onClick={() => setMobileOpen(false)}>Register</MobileMenuLink>
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
                <LogoText>Anastasia</LogoText>
                <LogoText2>König Massagesalon</LogoText2>
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
          </StickyMenu>
        )}
      </AnimatePresence>

      <NavbarWrapper>
        <TopBar>
          <SocialLinks>
            <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank"><FaFacebook /></a>
            <a href="https://wa.me/905321234567" target="_blank"><FaWhatsapp /></a>
          </SocialLinks>
          <Phone><FaPhone /> 0531 311 92 95</Phone>
        </TopBar>

        <CenterSection>
          <LogoWrapper href="/">
            <LogoImage src={logoSrc} alt="Logo" width={60} height={60} />
            <LogoTextWrapper>
              <LogoText>Anastasia</LogoText>
              <LogoText2>König Massagesalon</LogoText2>
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
