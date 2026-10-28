# ملف المشروع | Project Profile

## العربية

### الغرض
هذا المستودع يقدّم موقعًا تعريفيًا/ترويجيًا عربيًا لتطبيق ZMRT للأندرويد، الموصوف في الصفحة الرئيسية بأنه تطبيق تواصل ومكالمات صوتية ومرئية. الدليل: العنوان والبيانات الوصفية والبيانات المنظمة في `index.html`، وكذلك وصف `metadata.json`. ما يظهر في هذا المستودع هو الموقع وخادم صغير وواجهات بيانات مساندة؛ لا يتضمن مصدر تطبيق Android نفسه.

### المكوّنات والتدفقات الأساسية
- `index.html` صفحة واحدة عربية باتجاه RTL، وتضم التنسيق والسلوك التفاعلي ضمن الصفحة، بما في ذلك أقسام التعريف والخدمات وطريقة العمل والإحصاءات والخصوصية والتنزيل، ونوافذ للمعلومات. تُحمّل ملفات GSAP وScrollTrigger وcanvas-confetti من مسارات `/vendor/...` التي يوفّرها الخادم.
- `server.js` خادم Express ثابت المحتوى على `0.0.0.0`؛ يقدّم ملفات الجذر والصفحتين القانونيتين، ويوفّر واجهات التعليقات والتقييمات/الإعجابات والحذف وعداد التنزيلات وقراءة إعداد Firebase. يخزّن التعليقات والعداد محليًا في `data/comments.json`، ويقرأ إعداد Firebase من `firebase-applet-config.json`.
- `privacy.html` و`terms.html` صفحتا سياسة الخصوصية وشروط الاستخدام، وتوجد كذلك نسخ قانونية ضمن قوالب في `index.html`.
- `firestore.rules` و`firebase-blueprint.json` يعرّفان قواعد/مخطط بيانات Firestore لمجموعتي `stats` و`reviews`. وجود هذه الملفات وحده لا يثبت أن تشغيل الموقع يعتمد على Firestore؛ مسار التخزين الصريح في الخادم محلي.

### شجرة مختصرة
```text
.
├── index.html                    # الواجهة الرئيسية ومحتوى/تنسيق/تفاعلات مضمّنة
├── server.js                     # خادم Express وواجهات API وتقديم الملفات
├── package.json                  # بيانات الحزمة والبرامج النصية والتبعيات
├── bun.lock                      # قفل تبعيات Bun
├── data/comments.json            # بيانات التعليقات وعداد التنزيلات المحلية
├── firebase-applet-config.json   # إعداد Firebase (لا تُدرج قيمه في هذا الملف)
├── firebase-blueprint.json       # مخطط كيانات/مجموعات Firebase الموصوفة
├── firestore.rules               # قواعد وصول Firestore
├── privacy.html                  # سياسة الخصوصية
├── terms.html                    # شروط الاستخدام
├── public/                       # أيقونات وصورة المشاركة الاجتماعية
├── metadata.json                 # وصف المشروع وبياناته الوصفية
├── robots.txt                    # تعليمات الزحف
└── sitemap.xml                   # خريطة الموقع
```

### الملفات المحورية والواجهات
- مسارات API في `server.js`: `GET /api/comments`, `POST /api/comments`, `POST /api/comments/:id/like`, `DELETE /api/comments/:id`, `GET /api/firebase-config`, `GET /api/downloads`, و`POST /api/downloads/increment`.
- مسارات الصفحات في `server.js`: `/`, `/privacy` ومرادفاتها، `/terms` ومرادفاتها، وتحويلات للمسارات العربية و`/ZMRT.html`.
- ملف `index.html` يحتوي HTML وCSS وسكربتات الصفحة ضمن ملف واحد؛ لا توجد شجرة مصدر منفصلة أو مدخل React ظاهر رغم وجود حزم React ضمن manifest.

### التقنية والإصدارات والتبعيات
- `package.json`: حزمة خاصة باسم `zmrt-web` وإصدار `1.0.0`، بنمط ES modules.
- الاعتماديات المعلنة بإصدارات نطاقية: Express `^4.21.2`، Firebase `^12.19.0`، React/React DOM `^19.3.0`، React Router DOM `^7.18.4`، GSAP `^3.15.0`، Framer Motion `^13.5.0`، canvas-confetti `^1.9.4` وlucide-react `^1.49.0`.
- اعتماديات التطوير المعلنة: Vite `^8.3.2`، TypeScript `^7.0.2`، Tailwind CSS وملحق Vite `^4.3.3`، إضافة React لـVite `^6.1.1` وأنواع React وcanvas-confetti؛ راجع `package.json` و`bun.lock` للتفاصيل المثبتة.

### الإعداد والتشغيل والاختبار والبناء
- المتغير البيئي الوحيد الذي يقرأه المصدر صراحةً هو `PORT`؛ الافتراضي في `server.js` هو 3000. اسم المضيف مضبوط داخل المصدر إلى `0.0.0.0`.
- البرامج النصية المعلنة في `package.json`: `dev` و`start` يشغّلان `node server.js`، و`build` يشغّل `vite build`، و`lint` يشغّل `tsc --noEmit`. هذه تعريفات manifest وليست تأكيدًا على نجاح التنفيذ.
- لا يعرّف `package.json` برنامج اختبار، ولم يظهر في الشجرة README أو ملفات إعداد Vite/TypeScript أو اختبارات أو ملفات CI أو وصف موثوق لخطوات تثبيت التبعيات. لذلك لا نفترض أمر تثبيت أو اختبار إضافيًا.

### ملاحظات عملية ونقاط غير محسومة
- ابدأ بمراجعة `package.json` و`server.js` ثم `index.html`؛ البيانات المحلية في `data/comments.json` قابلة للتغيير من واجهات API، لذا تجنّب إتلافها عند التجربة.
- لا توجد ملفات مصدر Android أو تعليمات نشر في الشجرة التي فُحصت. كما أن وجود Firebase dependencies/config/schema لا يوضح وحده أي مسار نشر فعلي؛ يلزم الرجوع إلى إعدادات خارج هذا المستودع لتحديد ذلك.
- لا توجد README أو اختبارات آلية أو CI ظاهرة. لم تُسجّل قيم إعداد Firebase أو أي أسرار في هذا الملف؛ أسماء حقول الإعداد ليست متغيرات بيئية.

### مسارات الأدلة
`index.html`، `server.js`، `package.json`، `bun.lock`، `data/comments.json`، `firebase-applet-config.json` (وجود الملف وأسماء مفاتيحه فقط)، `firebase-blueprint.json`، `firestore.rules`، `privacy.html`، `terms.html`، `metadata.json`، `robots.txt`، `sitemap.xml`، `public/`.

## English

### Purpose
This repository provides an Arabic informational/promotional website for the ZMRT Android app, described on its home page as a communications app with voice and video calls. Evidence: the title, metadata, and structured data in `index.html`, and the description in `metadata.json`. What is present here is the website, a small server, and supporting data endpoints; the Android application source itself is not included.

### Main components and flows
- `index.html` is a single Arabic, right-to-left page with styling and interactive behavior embedded in the page. It includes introduction, services, workflow, statistics, privacy, and download sections plus information dialogs. It loads GSAP, ScrollTrigger, and canvas-confetti assets from `/vendor/...` paths served by the server.
- `server.js` is an Express server bound to `0.0.0.0`. It serves root files and the legal pages, and exposes comment, rating/like, deletion, download-counter, and Firebase-configuration endpoints. It stores comments and the counter locally in `data/comments.json` and reads Firebase configuration from `firebase-applet-config.json`.
- `privacy.html` and `terms.html` are the privacy policy and terms pages; legal content templates also appear in `index.html`.
- `firestore.rules` and `firebase-blueprint.json` define Firestore access rules/data shapes for `stats` and `reviews`. Their presence alone does not establish that the website runtime depends on Firestore; the server's explicit persistence path is local.

### Short tree
```text
.
├── index.html                    # Main page; embedded markup, styles, interactions
├── server.js                     # Express server, API endpoints, static-file serving
├── package.json                  # Package metadata, scripts, dependencies
├── bun.lock                      # Bun dependency lockfile
├── data/comments.json            # Local comments and download-count data
├── firebase-applet-config.json   # Firebase configuration (values omitted here)
├── firebase-blueprint.json       # Described Firebase entity/collection schema
├── firestore.rules               # Firestore access rules
├── privacy.html                  # Privacy policy
├── terms.html                    # Terms of use
├── public/                       # Icons and social-sharing image
├── metadata.json                 # Project description and metadata
├── robots.txt                    # Crawler directives
└── sitemap.xml                   # Sitemap
```

### Key files and interfaces
- API routes in `server.js`: `GET /api/comments`, `POST /api/comments`, `POST /api/comments/:id/like`, `DELETE /api/comments/:id`, `GET /api/firebase-config`, `GET /api/downloads`, and `POST /api/downloads/increment`.
- Page routes in `server.js`: `/`, `/privacy` and aliases, `/terms` and aliases, plus redirects for Arabic paths and `/ZMRT.html`.
- `index.html` contains the page HTML, CSS, and scripts in one file; no separate source tree or visible React entry point exists, despite React packages in the manifest.

### Technology, versions, and dependencies
- `package.json`: private package named `zmrt-web`, version `1.0.0`, using ES modules.
- Declared runtime dependencies and version ranges: Express `^4.21.2`, Firebase `^12.19.0`, React/React DOM `^19.3.0`, React Router DOM `^7.18.4`, GSAP `^3.15.0`, Framer Motion `^13.5.0`, canvas-confetti `^1.9.4`, and lucide-react `^1.49.0`.
- Declared development dependencies: Vite `^8.3.2`, TypeScript `^7.0.2`, Tailwind CSS and its Vite plugin `^4.3.3`, the Vite React plugin `^6.1.1`, and React/canvas-confetti type packages; consult `package.json` and `bun.lock` for details of the locked dependency set.

### Setup, run, test, and build
- The only environment variable explicitly read by the source is `PORT`; `server.js` defaults it to 3000. The host is hard-coded as `0.0.0.0`.
- Scripts declared in `package.json`: `dev` and `start` run `node server.js`, `build` runs `vite build`, and `lint` runs `tsc --noEmit`. These are manifest declarations, not claims that the commands were executed successfully.
- `package.json` defines no test script. No README, Vite/TypeScript configuration, test files, CI files, or authoritative dependency-install instructions appeared in the inspected tree. No additional install or test command is assumed.

### Practical notes and open questions
- Start by reviewing `package.json` and `server.js`, then `index.html`; `data/comments.json` is mutable through API routes, so avoid overwriting it during experiments.
- The inspected tree contains no Android source or deployment instructions. The Firebase dependencies/config/schema do not by themselves establish the live deployment path; external configuration would be needed to determine that.
- No README, automated tests, or visible CI are present. Firebase configuration values and other secrets are intentionally not reproduced here; configuration field names are not environment variables.

### Evidence paths
`index.html`, `server.js`, `package.json`, `bun.lock`, `data/comments.json`, `firebase-applet-config.json` (file presence and key names only), `firebase-blueprint.json`, `firestore.rules`, `privacy.html`, `terms.html`, `metadata.json`, `robots.txt`, `sitemap.xml`, `public/`.
