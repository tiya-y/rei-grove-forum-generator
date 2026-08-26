export const BRAND_VOICE = `
REI Grove is Innago's real estate investor education, tools, and community platform (formerly Innago Insight). Tagline: "Grow together."

Voice for forum posts specifically: casual, first-person, peer-to-peer. Write like an everyday investor asking a quick question or sharing a quick take, not like a brand, a moderator, or an "official update." No corporate phrasing ("our community," "we'd love to hear," "here at REI Grove," "as always"). No exclamation-point enthusiasm. Plain, direct, a little informal, like a text from a friend who invests.

Accessibility: most REI Grove forum members are everyday landlords, not underwriters. Don't drop niche jargon or acronyms (DSCR, ARV, cap rate, the 70% rule, NOI, etc.) into a post and assume the reader already knows what it means or why it matters — that reads like it's written for the 5% who already know the answer, not the average member. Either explain a term in plain words the moment you use it, or make the whole post about someone asking what it means / how it actually works. A real mix of a forum includes plenty of people asking basic, humble "still figuring this out" questions, not just people trading precise ratios.

No engagement-bait phrasing. Never tack on a line like "drop your number below," "comment your thoughts," or "tell me in the comments" — a genuine question doesn't need a call-to-action bolted onto the end. If the question itself is clear, that's the whole post.

Core pillars (context only, not phrases to use verbatim): Community (investors grow better together), Resources and Tools (practical support for every stage of investing), Wealth Growth (building lasting financial wealth through real estate).

These posts are published through the REI Grove team's posting account, written in an everyday-member voice to fit the forum naturally — never presented as a fabricated first-person account of a specific real event (no invented "I just closed on..." claims stated as fact). Frame things as open questions or invitations for people to share their own numbers/experience, the way the real threads below do.
`.trim();

export const RESOURCE_LIBRARY = `
Checklists: Risk Management, Rental Property Tax, Winterization, Tenant Turnover, Tenant Screening, Seasonal Property Maintenance, Short-/Medium-Term Rental Furnishings, Mortgage Application, Home Sale, Rental Property Inspection, First-Time Landlord, Spring Cleaning, Home Buying Legal, House Flipping.

Spreadsheets: BRRRR Analysis, Tenant Scoring System, Real Estate Depreciation, Comparative Market Analysis, Rental Property Analysis, Pro Forma, Rental Income and Expenses, House Flipping Analysis, Replacement Reserve, Deal Analysis.

Flowcharts: Section 8 Approval Process, Fix & Flip, BRRRR Method.

Calculators: ROI, NOI, IRR, Cap Rate, Cash-on-Cash Return, Annual Net Cash Flow, Debt Service Coverage Ratio, Gross Rental Yield, Gross Rent Multiplier, Debt-to-Income Ratio, 70% Rule, ARV, 1% Rule, Mortgage Payment.

The Breakdown (news & analysis articles): Gen Z homeownership rates, short-term rental crackdowns, 2025 construction boom, tariffs and real estate, climate risk and real estate, the housing crisis, the 2025 market correction, falling interest rates, tax bill impacts on real estate, tax credits/abatements/opportunity zones, the ROAD to Housing Act.

Webinars: Modern marketing tactics to lease faster, what renters want (data-backed insights), DSCR loans 101, tax credits & opportunity zones, year-end tax prep, rent collection risks, hidden tax strategies, cost segregation basics, AI for landlords, pet & ESA policy.

The Rentish Podcast: tenant horror stories, BRRRR method deep dives, house hacking for beginners, DSCR loans, mid-term rentals, pet policies & fair housing, house flipping vs renting, tax strategies for investors, first-time investor stories.

eBooks: AI for Real Estate, Landlord Taxes, Evictions, How to Fill Units, Tenant Screening, Rent Collection, Increase Revenue.
`.trim();

// Real threads members have posted, one per forum category — for tone/format calibration only.
// Members write in first person about their own specific deal; REI Grove team posts should
// invite that same range of voices, not just the most fluent one. Deliberately mixed here:
// some are specific and numbers-driven, but just as many are plain-language, humble, or
// literally asking what a term means. Don't copy or lightly reword these; match the mix.
export const REAL_THREAD_EXAMPLES = `
[New Member Introductions] "New here and diving into buy-and-hold": Just closed on a first duplex, planning to hold long-term for cash flow, asks what to look for in a good tenant application.

[Multifamily] "Is a 7% cap rate actually good right now?": Looking at a 12-unit, the agent keeps saying the cap rate is strong, but honestly not sure what counts as good vs mediocre these days. Asks what range people are actually seeing on multifamily deals lately.

[Market Trends & Current Events] "Rising insurance premiums eating into cash flow": Landlord insurance renewal came in ~40% higher across three properties, asks if others are seeing the same and whether switching carriers or bundling has helped.

[Maintenance] "HVAC replacement or repair for an older duplex": 14-year-old AC unit, $900 repair quote vs $4,200 full replacement, asks whether it's worth replacing the whole system now given the age.

[House Flipping] "What actually goes into a flip budget besides the purchase price?": New to flipping, keeps seeing people talk about "rehab budget" and "holding costs" like it's obvious, asks what all actually needs to be accounted for before making an offer.

[General Advice] "LLC vs umbrella policy for asset protection": Four rentals held personally with a solid umbrella policy, asks what tipped others toward forming an LLC at a similar portfolio size.

[Self-storage] "Converting a barn into self-storage units": Old barn on five acres, zoning seems permissive but hasn't run real numbers, asks if anyone has done a conversion like this instead of new construction.

[Flipping/Rehabbing] "Kitchen finishes that actually move the needle on resale": Deciding between quartz and nice laminate on a mid-tier flip, asks what's actually worth the upgrade at that price point.

[Miscellaneous] "How do you actually know when it's time to hire a property manager?": Six rentals while working full time, feeling stretched thin, but not sure if that's normal or a sign to make a change. Asks how other people knew it was time.
`.trim();
