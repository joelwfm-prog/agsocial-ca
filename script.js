// Sticky nav background on scroll.
// Pages without a dark hero at the top (e.g. contact, privacy) must start in the
// solid/light nav style so the links are legible on the cream background.
const nav = document.getElementById('nav');
const hasDarkHero = !!document.querySelector('.hero, .page-hero');
const onScroll = () => {
  if (!hasDarkHero || window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
  const closeMenu = () => {
    navToggle.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-label', 'Open menu');
  };
  const openMenu = () => {
    navToggle.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    navToggle.setAttribute('aria-label', 'Close menu');
  };
  navToggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('is-open')) closeMenu();
    else openMenu();
  });
  // Close when a menu link is clicked (so anchor navigation feels natural)
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
  });
  // Close if the viewport grows past the breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && mobileMenu.classList.contains('is-open')) closeMenu();
  });
}

// Scroll reveal — graceful: only enables if IntersectionObserver supports it,
// and falls back to immediate visibility if user prefers reduced motion.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets = document.querySelectorAll('.section-head, .product-card, .flow-step, .pillar, .result-card, .industry-card, .quote-card, .team-card, .advisor-card, .cta-inner, .overlay-banner-inner');

if (reduceMotion || !('IntersectionObserver' in window)) {
  targets.forEach(el => el.classList.add('in'));
} else {
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });
  targets.forEach(el => io.observe(el));

  // Safety: if anything's still hidden after 2.5s, show it (covers off-screen items on long screenshots)
  setTimeout(() => {
    targets.forEach(el => { if (!el.classList.contains('in')) el.classList.add('in'); });
  }, 2500);
}


/* ============ Advisor Bio Modal ============ */
const advisors = {
  steve: {
    name: 'Steve Larocque',
    role: 'Advisory Board · Beyond Agronomy',
    location: 'Morrin, AB',
    image: 'assets/advisors/steve-larocque.png',
    bio: [
      "Steve is a Professional Agrologist, Certified Crop Advisor and has been providing agronomic support to farmers for over 25 years. He graduated from Olds College with a diploma in Crop Advisory and holds a Bachelor of Science degree in Agriculture Studies from the University of Lethbridge. He is also a Canadian Nuffield Scholar and a first-generation grain farmer.",
      "Steve is the owner of Beyond Agronomy, an independent crop consulting company that he began in 2006. The company provides agronomic services and innovative strategies to farms in Alberta and beyond. His client base is primarily Alberta and Saskatchewan, but he also advises farms in Slovakia, Ukraine, France, Kenya, and Australia. Steve began farming in 2007 and runs a no-till, controlled traffic research farm near Morrin, AB and uses the farm as a testing ground for new ideas, technology, and farming systems. He continues to share his knowledge and experiences to local and international audiences.",
      "In addition to his professional commitments, Steve is actively involved in his community and family. He spends his off time making ice on his outdoor rink, coaching hockey, and enjoying winter activities with his family. With his passion for agriculture and dedication to improving farming practices, Steve is always game for a white board session, a spreadsheet convention, or a discussion about how to plan something from A to Z."
    ]
  },
  sheldon: {
    name: 'Sheldon Kyle',
    role: 'Advisory Board · Kenray Ranch',
    location: 'Redvers, SK',
    image: 'assets/advisors/sheldon-kyle.png',
    bio: [
      "Sheldon Kyle is co-owner of Kenray Ranch located near Redvers, Saskatchewan. Kenray Ranch is a 4th generation purebred Red Angus operation where Sheldon and his father, Ray, run 200 Red Angus females and host an annual online bull sale the first week of April. Sheldon grew up on the ranch with his family and developed a deep passion for agriculture and particularly, the livestock sector.",
      "After graduating from high school, Sheldon attended the University of Saskatchewan where he obtained his bachelor's degree in agriculture. He began his professional career working in sales roles in the animal nutrition, animal health and livestock handling industries, and then he gained experience in ag finance by working as an ag lender for TD Canada Trust. In 2006, Sheldon moved back to Redvers to be closer to the ranch while working as the local Watershed Coordinator where he delivered ag extension and land management research projects and programs. Many of the sustainability programs and projects that Sheldon delivered while at the Watershed Authority have been implemented on their own ranch.",
      "Sheldon started Kyle Ranch and Farm Supply in 2015, and he has enjoyed seeing that business grow. Sheldon is the 4th generation to operate Kenray Ranch, and in 2002, the Kyle Family was honoured by being presented with a Century Family Farm award by the Saskatchewan government. More recently, in 2021, Kenray Ranch was recognized as the Saskatchewan Angus Purebred Breeder of the Year."
    ]
  },
  blake: {
    name: 'Blake Bergen',
    role: 'Advisory Board · Bergen Farms',
    location: 'Drake, SK',
    image: 'assets/advisors/blake-bergen.png',
    bio: [
      "Blake Bergen farms with his family near Drake, Saskatchewan. The farm consists of commercial grain production including canola, cereals and pulse crops. Prior to farming full-time, Blake worked in the ag retail industry for over 20 years in sales, operations, supporting IT, and in a finance leadership role. Blake obtained his Commerce degree from the University of Saskatchewan and enjoys putting his finance education to good use on the farm as he also really enjoys the business side of farming.",
      "Being involved in the ag industry is important to Blake, and he currently serves as Chairman of the Board of Directors for Pound-Maker Ag Ventures, one of Canada's leading integrated feedlot and ethanol operations located at Lanigan, Saskatchewan. Spending time with his family is a priority, and with his wife, Lindsay, they are raising two young daughters — Addison and Emmersyn. In his spare time, Blake enjoys time at the lake, community events, traveling, reading biographies and current events, and learning about the latest and greatest ag technology that is available."
    ]
  },
  cheryl: {
    name: 'Cheryl Norleen',
    role: 'Advisory Board · Norleen Farms',
    location: 'Raymore, SK',
    image: 'assets/advisors/cheryl-norleen.png',
    bio: [
      "Cheryl and her husband, Marc, farm south of Raymore, Saskatchewan with their five children. Cheryl was born and raised in the agriculture industry and participated in 4-H Beef for many years, this involvement in 4-H sparked a dream to pursue a career in the agricultural industry and raise a family in the \u201cAG\u201d way.",
      "Cheryl began her career in agriculture working at Raymore New Holland in 2007 and in 2010, she married her farmer husband, Marc, and together they began building their farm. Throughout the next five years they grew their farm (both land and livestock) and their family by welcoming 5 future farmers. In 2018, Cheryl and Marc expanded into the poultry sector which has been a whole new learning experience for them in addition to providing a great diversification opportunity for their farming business. Cheryl and her family love the opportunities and challenges that present themselves everyday on their diversified farming operation, and they look forward to continuing to grow their farming business.",
      "Cheryl is an entrepreneur at heart, she is committed to diversification of income, this includes her commitment to health and well-being for her family and community. This has brought her to operating a very successful home-based Plexus business.",
      "Cheryl is excited to be part of the AG Social Advisory Board of Directors."
    ]
  },
  jill: {
    name: 'Jill Harvie',
    role: 'Advisory Board · Harvie Ranching',
    location: 'Olds, AB',
    image: 'assets/advisors/jill-harvie.png',
    bio: [
      "Jill Harvie is co-owner of Harvie Ranching located near Olds, Alberta. She ranches with her husband, Cole, and their daughters, Tinley & Lyla. The ranch is comprised of 250 purebred Polled Herefords and Charolais cattle. Each year Harvie Ranching hosts very successful bull and female sales with genetics selling across North America and to buyers globally. Harvie Ranching is known for their high-quality, cutting-edge genetics whose performance traits excel in diverse production conditions in Canada and around the world.",
      "Jill is well-known in the purebred and commercial cattle sectors of the livestock industry having served in various leadership roles at the Canadian Cattle Association. During this time, she developed relationships with many stakeholders in the production, supply chain and consumer sectors. These relationships have resulted in Jill, and Harvie Ranching, hosting numerous guests and dignitaries to the ranch to view their sustainable production practices and their focus on animal and environmental stewardship. Sharing their story of sustainable beef production has given Harvie Ranching the opportunity to host the federal Minister of Agriculture and consumer stakeholders such as McDonald's Canada. Other highlights while at the Canadian Cattle Association included being a founding committee member of the Canadian Beef Industry Conference and leading the development of the popular youth mentorship program known as the Canadian Cattle Young Leaders' Program.",
      "Jill and her husband, Cole, travel across Canada and around the globe as official beef cattle judges. International highlights include judging national breed shows in the USA, Mexico, Denmark, Sweden, France & the UK."
    ]
  },
  charlie: {
    name: 'Charlie Elke',
    role: 'Advisory Board',
    location: 'Jansen, SK',
    image: 'assets/advisors/charlie-elke.png',
    bio: [
      "Charlie was born and raised on her family's grain farm just northwest of Jansen, Saskatchewan and continues to assist with seasonal operations when her work schedule permits. She graduated from SIAST in 2016 with her Instrumentation Engineering Technician diploma, and after graduation, she began her career in the ag retail industry where she worked as a Quality Assurance Specialist. In this role, Charlie primarily focused on NH3 compliance, training and certifications and led the safety committees.",
      "In addition to the core functions of her quality assurance role, Charlie has always had a keen interest in communications and marketing, resulting in her taking on the challenge of leading the company's social media team. During this time, Charlie gained an understanding and knowledge of what farmers and ranchers truly found educational, informative, and engaging when it came to social media marketing. This gave her insights and the added perspective of how to present quality content to farmers and ranchers.",
      "Charlie currently works at the Jansen mine site for BHP as a Camp and Logistics Superintendent. In her spare time, she enjoys coaching her niece's hockey teams, chasing her nephew around the province with hockey, and playing as much golf as possible throughout the summer."
    ]
  },
  allison: {
    name: 'Allison Fisher',
    role: 'Advisory Board · Fisher Seed Farm',
    location: 'Dauphin, MB',
    image: 'assets/advisors/allison-fisher.png',
    bio: [
      "Allison Fisher operates a pedigree seed farm and seed cleaning plant with her family near Dauphin, Manitoba. They grow a wide variety of crops including wheat, oats, peas, soybeans, ryegrass, canola, faba beans, buckwheat and hemp. Allison also works as a pedigree seed crop inspector in the summer.",
      "Prior to returning to the farm, Allison obtained her Bachelor of Science in Agriculture from the University of Manitoba. Allison is quite involved in the seed industry, sitting on the Manitoba Seed Growers Association board and the Parkland Industrial Hemp Growers board.",
      "In her spare time Allison enjoys horseback riding, cutting horse competitions, curling, hiking, and is working towards getting her private pilot's license. Allison is looking forward to bringing her seed and farming background to the AG Social advisory board."
    ]
  }
};

const advisorModal = document.getElementById('advisorModal');
const advisorImg = document.getElementById('advisorModalImg');
const advisorName = document.getElementById('advisorModalName');
const advisorRole = document.getElementById('advisorModalRole');
const advisorLoc = document.getElementById('advisorModalLocation');
const advisorBio = document.getElementById('advisorModalBio');
let advisorLastFocused = null;

function openAdvisor(key) {
  const data = advisors[key];
  if (!data || !advisorModal) return;
  advisorLastFocused = document.activeElement;
  advisorImg.src = data.image;
  advisorImg.alt = data.name;
  advisorName.textContent = data.name;
  advisorRole.textContent = data.role;
  advisorLoc.textContent = data.location;
  advisorBio.innerHTML = data.bio.map(p => `<p>${p}</p>`).join('');
  advisorModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const close = advisorModal.querySelector('.advisor-modal-close');
  if (close) close.focus();
}
function closeAdvisor() {
  if (!advisorModal) return;
  advisorModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (advisorLastFocused && advisorLastFocused.focus) advisorLastFocused.focus();
}
document.querySelectorAll('.advisor-card[data-advisor]').forEach(card => {
  card.addEventListener('click', () => openAdvisor(card.dataset.advisor));
});
if (advisorModal) {
  advisorModal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeAdvisor));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && advisorModal.getAttribute('aria-hidden') === 'false') closeAdvisor();
  });
}
