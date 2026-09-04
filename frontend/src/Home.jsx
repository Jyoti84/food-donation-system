import { useState } from "react";
import "./Home.css";

function StatIconDonations() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect x="4" y="10" width="20" height="14" rx="3" stroke="#166534" strokeWidth="1.75" />
            <path d="M4 14h20" stroke="#166534" strokeWidth="1.75" />
            <path d="M14 10V6" stroke="#166534" strokeWidth="1.75" strokeLinecap="round" />
            <path d="M10 6h8" stroke="#166534" strokeWidth="1.75" strokeLinecap="round" />
            <circle cx="10" cy="18" r="2" fill="#E9A23B" />
            <circle cx="18" cy="18" r="2" fill="#E9A23B" />
        </svg>
    );
}

function StatIconVolunteers() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="10" cy="9" r="3.5" stroke="#166534" strokeWidth="1.75" />
            <circle cx="18" cy="9" r="3.5" stroke="#166534" strokeWidth="1.75" />
            <path
                d="M4 22c0-3.5 2.7-6 6-6s6 2.5 6 6"
                stroke="#166534"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
            <path
                d="M14 22c0-3.5 2.7-6 6-6"
                stroke="#166534"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
        </svg>
    );
}

function StatIconPeopleHelped() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path
                d="M14 23s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 21 13c0 5.5-7 10-7 10z"
                stroke="#166534"
                strokeWidth="1.75"
                strokeLinejoin="round"
            />
            <path
                d="M11 13l2 2 4-4"
                stroke="#E9A23B"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function HeroIllustration() {
    return (
        <svg
            className="home-hero__illustration"
            viewBox="0 0 520 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <rect width="520" height="380" rx="24" fill="#EDF5EF" />

            <circle cx="460" cy="50" r="70" fill="rgba(22,101,52,0.07)" />
            <circle cx="50" cy="330" r="55" fill="rgba(233,162,59,0.1)" />

            {/* Flow arrows */}
            <path
                d="M158 195 H182 M176 189 L182 195 L176 201"
                stroke="#166534"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.55"
            />
            <path
                d="M318 195 H342 M336 189 L342 195 L336 201"
                stroke="#166534"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.55"
            />

            {/* Stage 1 — Surplus food / meal boxes */}
            <g transform="translate(28, 72)">
                <rect x="0" y="0" width="130" height="148" rx="14" fill="#ffffff" opacity="0.7" />
                <text x="65" y="28" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
                    Surplus Food
                </text>

                {/* Counter */}
                <rect x="16" y="108" width="98" height="10" rx="3" fill="#d4e8da" />

                {/* Stacked meal boxes */}
                <rect x="24" y="72" width="38" height="32" rx="5" fill="#166534" />
                <path d="M24 80h38" stroke="#14532d" strokeWidth="1.5" />
                <rect x="30" y="76" width="10" height="6" rx="1" fill="#E9A23B" opacity="0.85" />

                <rect x="66" y="80" width="38" height="28" rx="5" fill="#1a7a3f" />
                <path d="M66 88h38" stroke="#14532d" strokeWidth="1.5" />
                <circle cx="85" cy="94" r="4" fill="#E9A23B" />

                {/* Plate with food */}
                <ellipse cx="43" cy="62" rx="22" ry="7" fill="#e2ebe4" />
                <ellipse cx="43" cy="58" rx="16" ry="5" fill="#f5c76a" />
                <circle cx="38" cy="56" r="3" fill="#E9A23B" />
                <circle cx="48" cy="57" r="2.5" fill="#d4922f" />
            </g>

            {/* Stage 2 — Volunteer pickup / hand-off */}
            <g transform="translate(188, 72)">
                <rect x="0" y="0" width="130" height="148" rx="14" fill="#ffffff" opacity="0.7" />
                <text x="65" y="28" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
                    Pickup
                </text>

                {/* Volunteer figure */}
                <circle cx="65" cy="58" r="14" fill="#f5d5a8" />
                <circle cx="65" cy="52" r="10" fill="#166534" opacity="0.15" stroke="#166534" strokeWidth="1.5" />
                <path d="M48 98 Q65 82 82 98" fill="#166534" />

                {/* Meal box being carried */}
                <rect x="78" y="78" width="34" height="28" rx="5" fill="#E9A23B" />
                <path d="M78 86h34" stroke="#d4922f" strokeWidth="1.5" />
                <path d="M95 78v-6" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
                <path d="M88 72h14" stroke="#166534" strokeWidth="2" strokeLinecap="round" />

                {/* Hand reaching */}
                <path
                    d="M72 88 C76 84 80 86 82 90"
                    stroke="#f5d5a8"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                />
            </g>

            {/* Stage 3 — Community receiving */}
            <g transform="translate(348, 72)">
                <rect x="0" y="0" width="130" height="148" rx="14" fill="#ffffff" opacity="0.7" />
                <text x="65" y="28" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
                    Community
                </text>

                {/* Two people */}
                <circle cx="48" cy="58" r="11" fill="#f5d5a8" />
                <path d="M34 96 Q48 82 62 96" fill="#166534" />

                <circle cx="82" cy="62" r="11" fill="#f5d5a8" />
                <path d="M68 98 Q82 84 96 98" fill="#1a7a3f" />

                {/* Shared meal box */}
                <rect x="52" y="78" width="36" height="26" rx="5" fill="#166534" />
                <path d="M52 86h36" stroke="#14532d" strokeWidth="1.5" />
                <rect x="58" y="82" width="8" height="5" rx="1" fill="#E9A23B" />

                {/* Hands meeting over box */}
                <path d="M44 92 Q52 86 58 90" stroke="#f5d5a8" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M96 92 Q88 86 82 90" stroke="#f5d5a8" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>

            {/* Ground shadow */}
            <ellipse cx="260" cy="248" rx="200" ry="12" fill="rgba(23,33,27,0.05)" />

            {/* Labels */}
            <rect x="24" y="24" width="118" height="34" rx="17" fill="#ffffff" opacity="0.92" />
            <circle cx="42" cy="41" r="6" fill="rgba(22,101,52,0.12)" />
            <path d="M39 41h6M42 38v6" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
            <text x="54" y="45" fill="#166534" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">
                Zero Waste
            </text>

            <rect x="368" y="300" width="128" height="34" rx="17" fill="#ffffff" opacity="0.92" />
            <circle cx="386" cy="317" r="5" stroke="#166534" strokeWidth="1.5" fill="none" />
            <circle cx="402" cy="317" r="5" stroke="#166534" strokeWidth="1.5" fill="none" />
            <path
                d="M382 324c2-3 5-4 8-4s6 1 8 4"
                stroke="#166534"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
            />
            <text x="412" y="322" fill="#166534" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">
                Community
            </text>
        </svg>
    );
}

function Home({ onLogin, onRegister }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const scrollTo = (id) => {
        setMenuOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleLogin = () => {
        setMenuOpen(false);
        onLogin();
    };

    const handleRegister = () => {
        setMenuOpen(false);
        onRegister();
    };

    return (
        <div className="home">
            <nav className="home-nav" aria-label="Main navigation">
                <div className="home-nav__inner">
                    <button
                        type="button"
                        className="home-nav__brand"
                        onClick={() => scrollTo("home-hero")}
                    >
                        <span className="home-nav__brand-icon" aria-hidden="true">
                            🍲
                        </span>
                        FoodShare
                    </button>

                    <button
                        type="button"
                        className={`home-nav__toggle ${menuOpen ? "home-nav__toggle--open" : ""}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                    >
                        <span />
                        <span />
                        <span />
                    </button>

                    <div
                        className={`home-nav__desktop-links ${menuOpen ? "home-nav__desktop-links--open" : ""}`}
                    >
                        <ul className="home-nav__links">
                            <li>
                                <button type="button" onClick={() => scrollTo("home-hero")}>
                                    Home
                                </button>
                            </li>
                            <li>
                                <button type="button" onClick={() => scrollTo("how-it-works")}>
                                    About / How It Works
                                </button>
                            </li>
                        </ul>

                        <div className="home-nav__actions">
                            <button
                                type="button"
                                className="home-btn home-btn--ghost"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                className="home-btn home-btn--primary"
                                onClick={handleRegister}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="home-hero" id="home-hero">
                <div className="home-hero__content">
                    <span className="home-hero__badge">
                        Fighting hunger, reducing waste
                    </span>

                    <h1 className="home-hero__title">
                        Donate surplus food.{" "}
                        <em>Feed communities.</em>
                    </h1>

                    <p className="home-hero__desc">
                        FoodShare connects generous donors with dedicated volunteers
                        to pick up surplus food and deliver it to people who need it
                        most — safely, transparently, and with real impact.
                    </p>

                    <div className="home-hero__ctas">
                        <button
                            type="button"
                            className="home-btn home-btn--primary home-btn--lg"
                            onClick={handleRegister}
                        >
                            Donate Food
                        </button>
                        <button
                            type="button"
                            className="home-btn home-btn--ghost home-btn--lg"
                            onClick={handleRegister}
                        >
                            Volunteer
                        </button>
                    </div>
                </div>

                <div className="home-hero__visual">
                    <HeroIllustration />
                </div>
            </section>

            <section className="home-section home-section--impact" id="impact">
                <div className="home-section__inner">
                    <div className="home-section__header--center">
                        <span className="home-section__label">Our Impact</span>
                        <h2 className="home-section__title">Making a difference together</h2>
                        <p className="home-section__subtitle home-section__subtitle--center">
                            Every donation and every volunteer hour helps reduce waste
                            and nourish communities in need.
                        </p>
                    </div>

                    <div className="home-stats">
                        <div className="home-stat-card">
                            <div className="home-stat-card__icon" aria-hidden="true">
                                <StatIconDonations />
                            </div>
                            <div className="home-stat-card__number">2,500+</div>
                            <div className="home-stat-card__label">Food Donations</div>
                        </div>

                        <div className="home-stat-card">
                            <div className="home-stat-card__icon" aria-hidden="true">
                                <StatIconVolunteers />
                            </div>
                            <div className="home-stat-card__number">800+</div>
                            <div className="home-stat-card__label">Volunteers</div>
                        </div>

                        <div className="home-stat-card">
                            <div className="home-stat-card__icon" aria-hidden="true">
                                <StatIconPeopleHelped />
                            </div>
                            <div className="home-stat-card__number">10,000+</div>
                            <div className="home-stat-card__label">People Helped</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-section home-section--alt" id="how-it-works">
                <div className="home-section__inner">
                    <div className="home-section__header--center">
                        <span className="home-section__label">How It Works</span>
                        <h2 className="home-section__title">Three simple steps to share food</h2>
                        <p className="home-section__subtitle home-section__subtitle--center">
                            From your kitchen to someone&apos;s table — our platform
                            makes the entire journey simple and transparent.
                        </p>
                    </div>

                    <div className="home-steps">
                        <div className="home-step-card">
                            <div className="home-step-card__num">1</div>
                            <div className="home-step-card__icon" aria-hidden="true">
                                🍱
                            </div>
                            <h3 className="home-step-card__title">Donate Food</h3>
                            <p className="home-step-card__desc">
                                List your surplus food with details, pickup address, and
                                a proof photo. Donors stay in control every step of the way.
                            </p>
                        </div>

                        <div className="home-step-card">
                            <div className="home-step-card__num">2</div>
                            <div className="home-step-card__icon" aria-hidden="true">
                                🚚
                            </div>
                            <h3 className="home-step-card__title">Volunteer to Pick Up</h3>
                            <p className="home-step-card__desc">
                                Volunteers browse available donations, claim a pickup, and
                                verify collection with a secure OTP from the donor.
                            </p>
                        </div>

                        <div className="home-step-card">
                            <div className="home-step-card__num">3</div>
                            <div className="home-step-card__icon" aria-hidden="true">
                                🎉
                            </div>
                            <h3 className="home-step-card__title">Deliver &amp; Make an Impact</h3>
                            <p className="home-step-card__desc">
                                Volunteers deliver food to communities in need and upload
                                proof of distribution — completing a transparent journey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-section" id="why-foodshare">
                <div className="home-section__inner">
                    <div className="home-section__header--center">
                        <span className="home-section__label">Why FoodShare</span>
                        <h2 className="home-section__title">Built for trust and impact</h2>
                        <p className="home-section__subtitle home-section__subtitle--center">
                            A platform designed for NGOs, communities, and everyday
                            people who want to make a real difference.
                        </p>
                    </div>

                    <div className="home-features">
                        <div className="home-feature-card">
                            <div className="home-feature-card__icon" aria-hidden="true">
                                ♻️
                            </div>
                            <div>
                                <h3 className="home-feature-card__title">Reduce Food Waste</h3>
                                <p className="home-feature-card__desc">
                                    Surplus food that would go to waste finds a new
                                    purpose — nourishing people instead of filling landfills.
                                </p>
                            </div>
                        </div>

                        <div className="home-feature-card">
                            <div className="home-feature-card__icon" aria-hidden="true">
                                🏘️
                            </div>
                            <div>
                                <h3 className="home-feature-card__title">Help Communities</h3>
                                <p className="home-feature-card__desc">
                                    Connect surplus food directly with local communities
                                    and organizations serving people facing food insecurity.
                                </p>
                            </div>
                        </div>

                        <div className="home-feature-card">
                            <div className="home-feature-card__icon" aria-hidden="true">
                                📋
                            </div>
                            <div>
                                <h3 className="home-feature-card__title">Easy Coordination</h3>
                                <p className="home-feature-card__desc">
                                    Simple dashboards for donors and volunteers make
                                    listing, claiming, and tracking donations effortless.
                                </p>
                            </div>
                        </div>

                        <div className="home-feature-card">
                            <div className="home-feature-card__icon" aria-hidden="true">
                                🔍
                            </div>
                            <div>
                                <h3 className="home-feature-card__title">Transparent Donation Journey</h3>
                                <p className="home-feature-card__desc">
                                    OTP verification and photo proof at every stage ensure
                                    donors and volunteers can trust the entire process.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-cta" id="get-started">
                <div className="home-cta__inner">
                    <h2 className="home-cta__title">
                        Ready to make a difference?
                    </h2>
                    <p className="home-cta__desc">
                        Join FoodShare today — whether you have food to donate or
                        time to volunteer, every action creates real impact.
                    </p>
                    <div className="home-cta__buttons">
                        <button
                            type="button"
                            className="home-btn home-btn--accent home-btn--lg"
                            onClick={handleRegister}
                        >
                            Donate Food
                        </button>
                        <button
                            type="button"
                            className="home-btn home-btn--outline-light home-btn--lg"
                            onClick={handleRegister}
                        >
                            Become a Volunteer
                        </button>
                    </div>
                </div>
            </section>

            <footer className="home-footer">
                <div className="home-footer__inner">
                    <div>
                        <div className="home-footer__brand">
                            <span aria-hidden="true">🍲</span>
                            FoodShare
                        </div>
                        <p className="home-footer__desc">
                            A social-impact platform connecting food donors with
                            volunteers to reduce waste and fight hunger in communities.
                        </p>
                    </div>

                    <div>
                        <h4 className="home-footer__heading">Navigate</h4>
                        <ul className="home-footer__links">
                            <li>
                                <button type="button" onClick={() => scrollTo("home-hero")}>
                                    Home
                                </button>
                            </li>
                            <li>
                                <button type="button" onClick={() => scrollTo("how-it-works")}>
                                    How It Works
                                </button>
                            </li>
                            <li>
                                <button type="button" onClick={() => scrollTo("why-foodshare")}>
                                    Why FoodShare
                                </button>
                            </li>
                            <li>
                                <button type="button" onClick={() => scrollTo("impact")}>
                                    Our Impact
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="home-footer__heading">Get Started</h4>
                        <ul className="home-footer__links">
                            <li>
                                <button type="button" onClick={handleLogin}>
                                    Login
                                </button>
                            </li>
                            <li>
                                <button type="button" onClick={handleRegister}>
                                    Register
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="home-footer__bottom">
                    &copy; {new Date().getFullYear()} FoodShare. Share food. Spread kindness.
                </div>
            </footer>
        </div>
    );
}

export default Home;
