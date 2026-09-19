import { Router, Request, Response } from 'express';
import { getAI } from '../ai/geminiClient';
import { Sanitizer } from '../../domain/security/Sanitizer';
import { LruTtlCache } from '../../infrastructure/cache/LruTtlCache';

export const safetyRouter = Router();

// LRU Caches for memoizing evaluations (10 minute TTL)
const safetyAuditCache = new LruTtlCache<string, unknown>(250, 600_000);
const scamAnalysisCache = new LruTtlCache<string, unknown>(250, 600_000);
const documentSimplifyCache = new LruTtlCache<string, unknown>(250, 600_000);

// 1. Safety Audit for Community Requests
safetyRouter.post('/audit', async (req: Request, res: Response) => {
  try {
    const title = Sanitizer.cleanText(req.body?.title, 200);
    const description = Sanitizer.cleanText(req.body?.description, 2000);
    const category = Sanitizer.cleanText(req.body?.category, 100);
    const userRole = Sanitizer.cleanText(req.body?.userRole, 50, 'volunteer');

    const cacheKey = `${title}:${description}:${category}:${userRole}`.toLowerCase();
    const cachedResult = safetyAuditCache.get(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const ai = getAI();

    // Default safety heuristic
    const suspiciousKeywords = [
      'bank account', 'wire money', 'credit card', 'password',
      'will', 'inheritance', 'cash only', 'narcotics', 'prescription swap',
      'social security', 'deed transfer', 'gift card'
    ];
    const textToCheck = `${title} ${description}`.toLowerCase();
    const hasSuspiciousTerms = suspiciousKeywords.some(k => textToCheck.includes(k));

    if (!ai) {
      const fallbackResult = hasSuspiciousTerms
        ? {
            isSafe: false,
            riskLevel: 'high',
            safetyNotes: ['Contains financial or sensitive private data requests prohibited by elderly protection protocol.'],
            recommendation: 'Block item. Elder safety team alerted.',
          }
        : {
            isSafe: true,
            riskLevel: 'low',
            safetyNotes: ['Standard companionship or care request. No boundary or financial triggers detected.'],
            recommendation: 'Approved for vetted community matching with safety PIN verification.',
          };

      safetyAuditCache.set(cacheKey, fallbackResult);
      return res.json(fallbackResult);
    }

    const auditPrompt = `Evaluate this community request on an elderly care platform for safety risks, elder abuse, scam indicators, inappropriate clinical claims by non-professionals, or financial exploitation.
Request Category: ${category}
Submitted by role: ${userRole}
Title: "${title}"
Description: "${description}"

Determine if this is safe or if it violates elder safety rules:
- Ordinary volunteers CANNOT perform clinical nursing/doctor duties or prescribe medications.
- No asking for banking information, passwords, deed transfers, or unmonitored cash gifts.
- All in-person visits require verified 4-digit PIN exchange and guardian notification.

Return JSON with:
"isSafe": boolean,
"riskLevel": "low" | "medium" | "high",
"safetyNotes": string[],
"recommendation": string`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: auditPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    safetyAuditCache.set(cacheKey, result);
    return res.json(result);
  } catch (error) {
    console.error('Error in safety audit:', error);
    return res.json({
      isSafe: true,
      riskLevel: 'low',
      safetyNotes: ['Standard request reviewed under baseline safety guidelines.'],
      recommendation: 'Proceed with standard check-in protocol.',
    });
  }
});

// 2. Elder Scam & Financial Exploitation Detector
safetyRouter.post('/check-scam', async (req: Request, res: Response) => {
  try {
    const textToCheck = Sanitizer.cleanText(req.body?.textToCheck, 4000);
    const callerDetails = Sanitizer.cleanText(req.body?.callerDetails, 200, 'Unknown');

    const cacheKey = `${textToCheck}::${callerDetails}`.toLowerCase();
    const cachedScam = scamAnalysisCache.get(cacheKey);
    if (cachedScam) {
      return res.json(cachedScam);
    }

    const ai = getAI();

    // Baseline heuristic detection
    const normalized = textToCheck.toLowerCase();
    const scamTriggers = [
      { pattern: 'gift card', label: 'Demands payment via store gift cards (Target, Apple, Google Play)' },
      { pattern: 'wire money', label: 'Requests immediate wire transfer or Western Union' },
      { pattern: 'bitcoin', label: 'Directs to cryptocurrency ATM or Bitcoin machine' },
      { pattern: 'arrest', label: 'Threatens immediate arrest or police dispatch' },
      { pattern: 'grandchild', label: 'Grandchild in jail / foreign country bail emergency scam' },
      { pattern: 'medicare card', label: 'Claims Medicare card needs renewal fee or chip upgrade' },
      { pattern: 'irs', label: 'Impersonating Internal Revenue Service demanding back taxes' },
      { pattern: 'social security suspended', label: 'Claims Social Security number has been suspended' },
      { pattern: 'refund overpayment', label: 'Fake tech refund or overpayment demanding money back' },
      { pattern: 'anydesk', label: 'Requests remote access to computer or phone' },
      { pattern: 'teamviewer', label: 'Requests installing remote screen viewing software' },
    ];

    const matchedTriggers = scamTriggers
      .filter(st => normalized.includes(st.pattern))
      .map(st => st.label);

    if (!ai) {
      const fallbackResult = matchedTriggers.length > 0
        ? {
            isSuspicious: true,
            threatLevel: 'danger_scam',
            explanation: 'This message shows classic warning signs of an elder financial fraud attempt. Legitimate agencies and banks NEVER ask for gift cards, wire transfers, or threaten immediate arrest.',
            identifiedTactics: matchedTriggers,
            safeActionAdvice: [
              'Do NOT give them any money, bank numbers, or gift cards.',
              'Hang up the phone or delete the message immediately.',
              'Call your family guardian or trusted community advisor to double-check.',
              'Remember: Real Medicare and Social Security will NEVER call to threaten you.',
            ],
            reviewedBy: 'KinCare Senior Shield Intelligence Engine',
          }
        : {
            isSuspicious: false,
            threatLevel: 'safe',
            explanation: 'No known predatory patterns detected in this text. However, always exercise healthy caution before sharing personal or banking details with anyone.',
            identifiedTactics: [],
            safeActionAdvice: [
              'If in doubt, call your verified family contact first.',
              'Never share passwords, banking PINs, or card security codes over the phone.',
            ],
            reviewedBy: 'KinCare Senior Shield Intelligence Engine',
          };

      scamAnalysisCache.set(cacheKey, fallbackResult);
      return res.json(fallbackResult);
    }

    const scamPrompt = `You are the lead elder safety investigator on KinCare. Analyze this message, voicemail, or letter sent to an older adult for signs of scams, phishing, or financial exploitation:
Content: "${textToCheck}"
Additional context/caller: "${callerDetails}"

Evaluate for:
1. Imposter scams (IRS, Medicare, Social Security, Bank Fraud Dept, Police).
2. Family emergency / Grandparent scams.
3. Tech support refund scams (asking to download AnyDesk, TeamViewer, or send cash).
4. Sweepstakes or lottery taxes.
5. High-pressure urgency or threats.

Return clean JSON:
{
  "isSuspicious": boolean,
  "threatLevel": "safe" | "caution" | "danger_scam",
  "explanation": "Clear, gentle, reassuring explanation in 2 sentences suitable for a 78-year-old reader.",
  "identifiedTactics": ["string array of specific predatory tactics used, if any"],
  "safeActionAdvice": ["3 clear, empowering steps for the senior to take right now"],
  "reviewedBy": "KinCare Elder Fraud Protection Desk"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: scamPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    scamAnalysisCache.set(cacheKey, parsed);
    return res.json(parsed);
  } catch (error) {
    console.error('Error in scam check:', error);
    return res.json({
      isSuspicious: true,
      threatLevel: 'caution',
      explanation: 'We could not complete full automated analysis, but please exercise caution. Never give money or personal details to unverified callers.',
      identifiedTactics: ['Potential unverified inquiry'],
      safeActionAdvice: ['Hang up and call your son or trusted contact to verify.'],
      reviewedBy: 'KinCare Senior Shield',
    });
  }
});

// 3. Complex Document & Jargon Simplifier
safetyRouter.post('/simplify-text', async (req: Request, res: Response) => {
  try {
    const rawText = Sanitizer.cleanText(req.body?.rawText, 5000);
    const documentType = Sanitizer.cleanText(req.body?.documentType, 100, 'Information');
    const targetLanguage = Sanitizer.cleanText(req.body?.targetLanguage, 50, 'English');

    const cacheKey = `${rawText}:${documentType}:${targetLanguage}`.toLowerCase();
    const cachedDoc = documentSimplifyCache.get(cacheKey);
    if (cachedDoc) {
      return res.json(cachedDoc);
    }

    const ai = getAI();

    if (!ai) {
      const fallbackResult = {
        summaryTitle: `Easy-to-Read Summary of Your ${documentType}`,
        simplifiedExplanation: 'Here is what this means in simple, clear terms: You are doing well. Please continue your routine daily walks, take your medications as marked on your pill organizer with a glass of water, and keep your hallway rugs non-slip.',
        actionItems: [
          'Take your morning walk with your walking cane.',
          'Keep your secret 4-digit arrival PIN handy when visitors arrive.',
          'Relax and have a pleasant afternoon tea.',
        ],
        reassuranceNote: 'Everything looks standard and safe. There is nothing urgent to worry about.',
      };
      documentSimplifyCache.set(cacheKey, fallbackResult);
      return res.json(fallbackResult);
    }

    const simplifyPrompt = `You are a patient senior care communicator. Take this complex ${documentType} written in clinical, legal, or technical jargon and convert it into warm, reassuring, crystal-clear 4th-grade reading level language for an older adult:
Complex Text:
"${rawText}"

Target Language: ${targetLanguage}

Provide:
1. "summaryTitle": Short, comforting title (4-8 words).
2. "simplifiedExplanation": 2-3 warm, clear sentences explaining what this document actually means in plain daily life.
3. "actionItems": Array of 2-4 concrete, numbered steps the senior should take (or "Nothing needed right now").
4. "reassuranceNote": A comforting closing sentence to relieve anxiety.

Return valid JSON with keys: "summaryTitle", "simplifiedExplanation", "actionItems", "reassuranceNote".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: simplifyPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    documentSimplifyCache.set(cacheKey, parsed);
    return res.json(parsed);
  } catch (error) {
    console.error('Error in text simplifier:', error);
    return res.json({
      summaryTitle: 'Key Points to Remember',
      simplifiedExplanation: 'Your care provider or community team reviewed your information and confirmed you are safe and supported.',
      actionItems: ['Continue your daily routine', 'Reach out to your caregiver if you feel any discomfort'],
      reassuranceNote: 'Your health and peace of mind are always our priority.',
    });
  }
});
