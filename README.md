# Kiran Neuro-Psychiatry Care — website redesign

A ground-up redesign of <https://kiranneuropsychiatrycare.com/> for Kiran Neuro-Psychiatry Care, Bhavnagar (Dr. Keyur Parmar, Dr. Vikram Zala). Static, dependency-free HTML/CSS/JS. Open `index.html` in a browser, or serve the folder with any static server.

```
cd kiran-neuropsychiatry-care && python3 -m http.server 8080
```

The site demonstrates the full product vision: public pages, a booking flow, self-check screening tools, the **Kiran Saathi** AI companion, a patient portal, and a doctor / staff console. Everything interactive runs in the browser with sample data so the experience can be reviewed end to end. Section 7 lists what a production build wires up behind each screen.

---

## 1. What the research found

### The clinic today
| Fact | Detail |
|---|---|
| Name | Kiran Neuro-Psychiatry Care, "Psychiatric Centre of Excellence" |
| Doctors | Dr. Keyur Parmar, MBBS, MD Psychiatry (B.J. Medical College, Ahmedabad, gold medallist), consultant at Sterling Hospital Bhavnagar 2012-15, private practice since 2012, runs the "Mission Deaddiction" school and college campaign (50+ programmes). Gujarat Medical Council G-19082, Indian Psychiatric Society member. Dr. Vikram Zala, MBBS (GMC Bhavnagar), DPM Neuro-Psychiatry (B.J. Medical College), practising since 2022. |
| Specialty clinics | Deaddiction centre, sexual health clinic, child psychiatry, EEG and epilepsy clinic; plus depression, bipolar, OCD, schizophrenia, panic and anxiety, headache and migraine, sleep, geriatric psychiatry |
| Address | 309/310 Samved Complex, Opp. A Division Police Station, Jail Road, Bhavnagar 364001 |
| Hours | Mon-Sat 10:00-13:00 and 16:00-19:00; emergency line 24x7 |
| Contact | +91 87582 99921, +91 278 2423513, kiran.neurocare@gmail.com |
| Languages | Gujarati, Hindi, English |

### Problems with the current site
- Generic WordPress template; the hero says nothing to a frightened first-time visitor.
- "E-Consultation" is a bare contact form with no process, fee, or expectation setting.
- No booking, no queue, no reminders: every action still goes through the reception phone.
- Nothing for families, who in Bhavnagar almost always accompany and manage the patient.
- Content is English-only on a site serving a Gujarati-speaking city.
- No measurement, no follow-up tooling, nothing for the doctors' own workflow.
- Broken `localhost` image links; no privacy or rights information.

### What the domain needs (sources in the footer of this file)
1. **Stigma is the first barrier.** People in a Tier-2 Indian city search privately, often late at night, often for a family member. The site must feel safe before it feels clinical: discreet booking, a quick-exit control, a neutral tab title, no "mental hospital" imagery.
2. **Families are co-patients.** Caregivers hold the medicines, watch for relapse, and bring the patient in. They need their own view, with the patient's consent, under the Mental Healthcare Act 2017.
3. **Follow-up is where psychiatry fails.** Drop-out after the first prescription is the norm. Reminders, refill requests, scale-based check-ins, and relapse early-warning are the highest-value features a clinic can add.
4. **Measurement-based care works.** PHQ-9, GAD-7, Y-BOCS, ISI, AUDIT and Fagerström trends change outcomes when they are in front of the doctor at every visit.
5. **Tobacco (gutka, mawa, bidi) and alcohol** are the regional addiction burden; a 90-day structured quit programme with craving support is more useful than a "deaddiction" page.
6. **Indian clinics run on tokens and WhatsApp.** A live queue and WhatsApp-first messaging reduce waiting-room crowding (itself a privacy problem) and reception phone load.
7. **Doctors' time is the scarce resource.** Pre-visit intake summaries, ambient scribing, and a one-screen pre-visit brief return 10-15 minutes per new patient.
8. **India's digital health rails exist.** ABHA (Ayushman Bharat Health Account) linking, Tele-MANAS 14416 as the national crisis line, and the DPDP Act 2023 for consent and data handling.
9. **Patients have legal rights almost no clinic explains.** The Mental Healthcare Act 2017 gives every person the right to an Advance Directive and a Nominated Representative. Offering a guided builder is unique in the domain.

---

## 2. Positioning

**Kiran** means "ray of light". The brand line is **"A ray of light for the mind."** (Gujarati: "મન માટે આશાનું કિરણ"). The whole visual language derives from first light: a cool, pale dawn ground, a deep night-sea ink, and a single warm gold accent that marks the way forward (primary actions, progress, the live "now" marker in charts).

Tone of voice: plain, warm, specific. Never "mental hospital", never "patient" on public pages when "you" will do. Gujarati and Hindi are first-class, not a translation afterthought.

---

## 3. People we design for

| Persona | Situation | What the site must do in 30 seconds |
|---|---|---|
| **Meera, 24, Bhavnagar** | Panic attacks, searching at 1 am on a phone, terrified someone will find out | Reassure, show it is private, let her book without calling, offer Saathi to talk now |
| **Rameshbhai, 58** | Son with schizophrenia stopped medicines, getting agitated | Emergency path, what to do tonight, then a caregiver account with the medicine schedule |
| **Kinjal & Hitesh, parents** | Teacher says their 8-year-old "does not sit still" | Child clinic explainer, Vanderbilt-style screening, what the first visit looks like |
| **Jignesh, 34, Mahuva** | Chewing gutka 15 years, wants to quit, 2 hours away | Quit programme, video follow-ups, craving SOS on his phone |
| **A man who will not give his name** | Erectile dysfunction, premature ejaculation | Private consult mode: alias plus phone, discreet slots, no reception questions |
| **Dr. Parmar** | 60 patients a day, dictates notes, chases follow-ups by phone | Pre-visit brief, risk inbox, ambient scribe, outcomes dashboard |
| **Reception staff** | Phone never stops, token slips, EEG scheduling | Queue board, WhatsApp templates, EEG and report uploads |
| **Referring physician** | Wants to send a patient and get a summary back | Referral form and reply-to-referrer summaries |

---

## 4. Information architecture

```
Home ─ index.html
├─ Conditions & clinics ─ conditions.html  (10 specialty clinics with anchors)
├─ Doctors ─ doctors.html
├─ Book a visit ─ book.html  (wizard + live queue + private consult mode)
├─ Self-check ─ self-check.html  (PHQ-9, GAD-7, ISI, Fagerström, AUDIT-C, child attention check)
├─ Kiran Saathi ─ saathi.html  (AI companion: what it does, guardrails, demo)
├─ Quit with Kiran ─ deaddiction.html  (Mission Deaddiction, 90-day programme, craving SOS)
├─ Emergency ─ emergency.html  (clinic 24x7 line, Tele-MANAS 14416, 112, seizure first aid, safety plan)
├─ Resources ─ resources.html  (blog, myths & facts, FAQ, downloads)
├─ Your rights & privacy ─ rights.html  (MHCA 2017, DPDP, Advance Directive builder)
├─ Contact ─ contact.html
├─ My Care (patient portal demo) ─ portal.html
└─ Clinic console (doctor & staff demo) ─ clinic.html
```

Global: trilingual switch (EN / ગુજરાતી / हिन्दी), light and dark theme, **Quick exit** (replaces the page with a neutral site and renames the tab), emergency strip, WhatsApp button, low-motion support.

---

## 5. Feature catalogue

### For people seeking help
- **Start where you are.** Five entry paths on the home page: for myself, for someone I love, for my child, addiction, emergency. Each leads to a tailored first screen, not a generic services list.
- **Book without calling.** Choose clinic or video, doctor, slot. Shows the live token queue and an "arrive by" time so nobody waits in a crowded room.
- **Private consult mode.** For sexual health and addiction: book with an alias plus phone number, choose a discreet slot (first or last of a session), reception asks nothing further.
- **Self-check tools.** Validated screening scales, scored instantly in the browser, nothing stored unless you choose to attach the result to a booking. Clear "what this means" and "what next" copy.
- **Your first visit, step by step.** An illustrated walk-through that removes the fear of the unknown.
- **Kiran Saathi** (AI companion): intake conversation in Gujarati, Hindi or English; medicine explainer; craving SOS; report explainer; visit preparation. Hard limits: never diagnoses, never changes a dose, always escalates risk to a human.
- **My Care portal.** Next visit, medicine schedule with WhatsApp reminders, 2-minute mood and sleep check-ins, scale trends, prescriptions, reports, secure messages, refill requests.
- **Family Circle.** Patient-controlled caregiver access to the medicine schedule, appointments, red-flag guide and emergency contacts, never to therapy notes.
- **Advance Directive & Nominated Representative builder** under the Mental Healthcare Act 2017.
- **Quit with Kiran.** 90-day structured programme for tobacco and alcohol: quit-day plan, daily check-in, craving SOS (3-minute urge surfing), family pledge, milestone badges, relapse logging without shame.
- **Seizure diary and EEG preparation** for the epilepsy clinic.
- **Emergency page** that works on a bad connection: big numbers, what to do tonight, seizure first aid, how to help someone who is psychotic or suicidal.
- **Trilingual UI** and Gujarati-first content for families.

### For doctors
- **Pre-visit brief.** One screen per patient: last plan, adherence, scale trend with the delta since last visit, journal highlights, flagged events, open questions.
- **Ambient scribe** (with recorded consent). Drafts a structured note (history, MSE, assessment, plan) and the prescription from the consultation; the doctor edits and signs.
- **Risk inbox.** Patient messages, journal entries and intake answers scored for risk language; suicidal ideation, abuse and psychosis red flags surface first.
- **Relapse watch-list.** Missed doses + sleep drop + mood drop + missed follow-up produce a nudge to reception and the doctor.
- **Smart follow-ups.** No-show risk prediction and Gujarati WhatsApp nudges; refill requests pre-filled from the last prescription.
- **Outcomes dashboard.** Share of patients improving on PHQ-9 / GAD-7, 90-day abstinence in the quit programme, average time to first follow-up.
- **Content studio.** Turn a voice note into a trilingual blog post or myth-buster card.
- **Referral loop.** Referring physicians submit a referral and receive a summary back.

### For reception and staff
- Queue board with token calling, arrival check-in by QR, walk-in insertion.
- WhatsApp template library (reminders, reports ready, refill approved) in three languages.
- EEG scheduling with preparation instructions sent automatically.
- Report upload with AI plain-language summary queued for the doctor's sign-off.
- Certificate and fitness-report requests tracked to completion.

---

## 6. Kiran Saathi: AI architecture and guardrails

```
Patient / family / staff ──▶ Channel (web, WhatsApp, in-clinic tablet)
                                   │
                        ┌──────────▼──────────┐
                        │  Safety gate (first)│  risk classifier on every inbound message:
                        │                     │  self-harm, harm to others, abuse, psychosis,
                        │                     │  intoxication, medical emergency
                        └──────────┬──────────┘
                 risk ◀────────────┼────────────▶ no risk
                 │                 │
   crisis card + clinic alert      │   Saathi assistant (LLM with tools, system prompt in 3 languages)
   + Tele-MANAS 14416 + 112        │   tools: appointment slots, patient's own med schedule,
                                   │   clinic FAQ, scale scoring, report summariser
                                   │
                        ┌──────────▼──────────┐
                        │ Clinician review    │  everything that touches care (intake summary,
                        │ queue               │  note draft, Rx draft, report summary) is a draft
                        └─────────────────────┘  until a doctor signs it
```

Rules Saathi follows, written into the product:
1. Never diagnoses, never names a probable disorder to a patient.
2. Never advises starting, stopping or changing a dose; it reads the prescription back and explains it.
3. Any risk language returns the crisis card first and alerts the clinic; the conversation is not left to the model.
4. Speaks the user's language; mirrors Gujarati script or transliteration as the user wrote it.
5. Tells people it is an AI companion from the clinic, not a doctor, at the start of every new session.
6. Stores nothing from anonymous sessions; stores consented data under the DPDP Act with a visible audit trail.
7. Every clinical artefact is a draft with provenance until a doctor signs it.

Recommended stack for production: Claude (claude-fable-5-1 for reasoning-heavy drafts such as intake summaries and scribe notes, claude-haiku-4-5 for the safety gate and quick replies) behind a thin server; WhatsApp Business API for reminders; ABDM/ABHA for record linking; Razorpay for UPI; a scheduling store with FHIR-style resources.

---

## 7. What this static build demonstrates vs. what production adds

| Screen | Demonstrated here | Production wires up |
|---|---|---|
| Booking | Full wizard, privacy options, live queue simulation, confirmation | Calendar backend, WhatsApp confirmation, UPI payment, ABHA link |
| Self-check | Real scoring for 6 scales, interpretation, next steps | Optional save to record, trend over time |
| Saathi | Scripted demo with safety gate, intake summary, medicine explainer, craving SOS | Model calls, tools, clinician review queue |
| My Care | Sample patient with trends, meds, journal, caregiver, reports | Auth, data, reminders |
| Clinic console | Queue, pre-visit brief, risk inbox, scribe draft, Rx composer, outcomes | EHR, audio capture, signing, notifications |

---

## 8. Design system

- **Palette tokens** (see `assets/site.css`): dawn ground, night-sea ink, first-light gold accent; sage / amber / crimson reserved for status; sky for information.
- **Type**: Bricolage Grotesque (display), Instrument Sans (body/UI), Mukta Vaani (Gujarati), Mukta (Devanagari). Loaded from Google Fonts with system fallbacks.
- **Layout**: 12-column editorial grid, 1180px max, generous section rhythm; light always enters from the top-right (hero glow, band horizon line).
- **Motif**: a ray. Progress indicators, chart "now" markers, and the logo mark are all built from it. Dark bands carry a faint bandhani dot texture, a nod to Gujarat's textile tradition.
- **Accessibility**: WCAG AA contrast in both themes, visible focus, reduced-motion support, every icon paired with text, forms labelled, keyboard operable wizards.
- **Performance**: no framework, no images beyond inline SVG, fonts swapped; the emergency page is deliberately the lightest page on the site.

---

## 9. Roadmap after launch

1. Connect booking to the clinic calendar and WhatsApp Business.
2. Launch My Care for follow-up patients first (the drop-out problem), caregivers second.
3. Pilot the ambient scribe with Dr. Parmar on new-patient visits; measure minutes saved.
4. Publish quarterly outcomes on the site.
5. Add Tele-MANAS referral integration and ABHA linking.
6. Extend Quit with Kiran to schools via the Mission Deaddiction programme sign-up.

---

### Sources consulted
- Current site: kiranneuropsychiatrycare.com (home, about, e-consultation, FAQ, downloads, contact)
- Drlogy profile of Dr. Keyur Parmar (qualifications, registration, languages)
- American Psychiatric Association, "Applications of AI in psychiatry"
- Springer, Current Treatment Options in Psychiatry (2025): ambient scribes in psychiatric care
- Meadows Mental Health Policy Institute (2026): AI use cases for intake and measurement
- NCBI PMC11769776: Responsible design and use of generative AI in mental health
- Tele-MANAS (NIMHANS / MoHFW): 14416 national tele-mental-health helpline, ABDM integration
- Mental Healthcare Act 2017, sections 5 (advance directive) and 14 (nominated representative)
- Digital Personal Data Protection Act 2023
- Doctors App / RevisitMD: feature baselines for psychiatric clinic software in India
